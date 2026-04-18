#!/bin/bash
# Deploy to STAGING (tuitionsinindia.in) on the same VPS
# Usage: ./deploy-staging.sh
#
# First-time setup on VPS:
#   1. Create /root/tuitionsinindia-staging/.env.staging (copy from .env.staging.example)
#   2. Configure Nginx for tuitionsinindia.in → localhost:3007
#   3. Run: ./deploy-staging.sh

VPS_HOST="187.77.188.36"
VPS_USER="root"
STAGING_DIR="/root/tuitionsinindia-staging"

echo "🚧 Deploying to STAGING (tuitionsinindia.in)..."
echo ""

GIT_SHA=$(git rev-parse --short HEAD)
GIT_MSG=$(git log -1 --pretty=%s)
GIT_AUTHOR=$(git log -1 --pretty=%an)
DEPLOY_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "📦 Step 1: Syncing code to VPS staging directory..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude 'mobile-app' \
  --exclude '.DS_Store' \
  --exclude '.env*' \
  -e "ssh -o StrictHostKeyChecking=no" \
  ./ ${VPS_USER}@${VPS_HOST}:${STAGING_DIR}/

echo ""
echo "🐳 Step 2: Rebuilding staging containers..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "
  cd ${STAGING_DIR} && \
  rm -rf .next && \
  cp .env.staging .env.production && \
  docker compose -f docker-compose.staging.yml build --no-cache --build-arg CACHE_BUST=$(date +%s) --build-arg GIT_SHA=${GIT_SHA} && \
  docker compose -f docker-compose.staging.yml up -d
"

echo ""
echo "🗄️  Step 3: Syncing staging DB schema..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "
  cd ${STAGING_DIR} && \
  DB_PASS=\$(grep '^POSTGRES_PASSWORD=' .env.staging | cut -d= -f2 | tr -d '\"') && \
  DB_USER=\$(grep '^POSTGRES_USER=' .env.staging | cut -d= -f2 | tr -d '\"') && \
  DB_NAME=\$(grep '^POSTGRES_DB=' .env.staging | cut -d= -f2 | tr -d '\"') && \
  docker exec tuitionsinindia-staging-db psql -U \$DB_USER -d \$DB_NAME -c \"ALTER USER \$DB_USER WITH PASSWORD '\$DB_PASS';\" 2>/dev/null || true && \
  docker exec tuitionsinindia-staging-web prisma db push --accept-data-loss --skip-generate 2>&1 | grep -v 'Can.t write to'
"

echo ""
echo "📋 Writing version info..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "
  mkdir -p /root/deploy-history
  echo \"{\\\"sha\\\":\\\"${GIT_SHA}\\\",\\\"shortSha\\\":\\\"${GIT_SHA}\\\",\\\"branch\\\":\\\"staging\\\",\\\"message\\\":\\\"${GIT_MSG}\\\",\\\"author\\\":\\\"${GIT_AUTHOR}\\\",\\\"deployedAt\\\":\\\"${DEPLOY_TIME}\\\",\\\"env\\\":\\\"staging\\\"}\" > ${STAGING_DIR}/version.json
  echo \"{\\\"sha\\\":\\\"${GIT_SHA}\\\",\\\"branch\\\":\\\"staging\\\",\\\"message\\\":\\\"${GIT_MSG}\\\",\\\"author\\\":\\\"${GIT_AUTHOR}\\\",\\\"deployedAt\\\":\\\"${DEPLOY_TIME}\\\",\\\"env\\\":\\\"staging\\\",\\\"status\\\":\\\"success\\\"}\" >> /root/deploy-history/staging.log
  echo 'Version info written.'
"

echo ""
echo "🧹 Pruning old images..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "docker image prune -f"

echo ""
echo "🔍 Step 4: Checking staging env vars..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "
  ENV_FILE=${STAGING_DIR}/.env.staging
  MISSING=()
  for VAR in DATABASE_URL NEXT_PUBLIC_BASE_URL SESSION_SECRET; do
    if ! grep -q \"^\${VAR}=\" \"\$ENV_FILE\" 2>/dev/null; then
      MISSING+=(\"\$VAR\")
    fi
  done
  if [ \${#MISSING[@]} -gt 0 ]; then
    echo '⚠️  Missing env vars in .env.staging:'
    for V in \"\${MISSING[@]}\"; do echo \"   - \$V\"; done
  else
    echo '✅ Staging env vars OK.'
  fi
"

echo ""
echo "✅ Staging deployment complete!"
echo "   → https://tuitionsinindia.in (via Nginx) or http://${VPS_HOST}:3007 (direct)"
echo ""
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "docker logs --tail 30 tuitionsinindia-staging-web"
