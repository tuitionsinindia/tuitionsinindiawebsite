#!/bin/bash
# Deploy to Hostinger VPS (Dockerized)
# Usage: ./deploy.sh

VPS_HOST="187.77.188.36"
VPS_USER="root"
APP_DIR="/root/tuitionsinindia"

echo "🚀 Step 1: Syncing code to VPS..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude 'mobile-app' \
  --exclude '.DS_Store' \
--exclude '.env*' \
  -e "ssh -o StrictHostKeyChecking=no" \
  ./ ${VPS_USER}@${VPS_HOST}:${APP_DIR}/

echo "📦 Step 2: Rebuilding Containers on VPS..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "cd ${APP_DIR} && \
    rm -rf .next && \
    docker compose build --no-cache --build-arg CACHE_BUST=$(date +%s) && \
    docker compose up -d"

echo "🗄️ Step 3: Synchronizing Database Schema..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "cd ${APP_DIR} && docker exec tuitionsinindia-web prisma db push --accept-data-loss"

echo "🧹 Pruning old images..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "docker image prune -f"

echo "⏰ Step 4: Setting up cron jobs..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "
  # Daily email drip — 9:00 AM server time
  DRIP_JOB='0 9 * * * curl -s \"http://localhost:3000/api/cron/email-drip?secret=\${CRON_SECRET}\" >> /var/log/drip.log 2>&1'
  # Monthly credit reset — 1st of each month at 6:00 AM
  CREDITS_JOB='0 6 1 * * curl -s -X POST -H \"x-cron-key: \${AUDIT_SEED_KEY}\" \"http://localhost:3000/api/cron/reset-credits\" >> /var/log/credits.log 2>&1'

  (crontab -l 2>/dev/null | grep -v 'email-drip\|reset-credits'; echo \"\$DRIP_JOB\"; echo \"\$CREDITS_JOB\") | crontab -
  echo 'Cron jobs configured.'
  crontab -l | grep -E 'drip|credits'
"

echo "🔍 Step 5: Checking required env vars on VPS..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "
  ENV_FILE=${APP_DIR}/.env.production
  MISSING=()
  for VAR in GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET NEXT_PUBLIC_BASE_URL CRON_SECRET AUDIT_SEED_KEY RESEND_API_KEY SESSION_SECRET; do
    if ! grep -q \"^\${VAR}=\" \"\$ENV_FILE\" 2>/dev/null || grep -q \"^\${VAR}=$\" \"\$ENV_FILE\" 2>/dev/null; then
      MISSING+=(\"\$VAR\")
    fi
  done
  if [ \${#MISSING[@]} -gt 0 ]; then
    echo '⚠️  Missing or empty env vars in .env.production:'
    for V in \"\${MISSING[@]}\"; do echo \"   - \$V\"; done
    echo '   Add these to ${APP_DIR}/.env.production on the VPS.'
  else
    echo '✅ All required env vars are set.'
  fi
"

echo "✅ Deployment complete! Monitoring logs..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "docker logs --tail 50 tuitionsinindia-web"
