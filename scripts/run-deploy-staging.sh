#!/bin/bash
# Called by deploy-webhook.js to deploy staging.
# Pulls latest staging branch from GitHub and rebuilds.
set -e
cd /root/tuitionsinindia-staging

echo "=== Staging deploy started: $(date) ==="

git fetch origin
git reset --hard origin/staging

cp .env.staging .env.production

DB_PASS=$(grep '^POSTGRES_PASSWORD=' .env.staging | cut -d= -f2 | tr -d '"')
DB_USER=$(grep '^POSTGRES_USER=' .env.staging | cut -d= -f2 | tr -d '"')
DB_NAME=$(grep '^POSTGRES_DB=' .env.staging | cut -d= -f2 | tr -d '"')
GIT_SHA=$(git rev-parse --short HEAD)
GIT_MSG=$(git log -1 --pretty=%s)
GIT_AUTHOR=$(git log -1 --pretty=%an)
DEPLOY_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)

docker compose -f docker-compose.staging.yml build \
    --no-cache \
    --build-arg CACHE_BUST=$(date +%s) \
    --build-arg GIT_SHA="${GIT_SHA}"

docker compose -f docker-compose.staging.yml up -d

docker exec tuitionsinindia-staging-db psql -U "$DB_USER" -d "$DB_NAME" \
    -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || true

docker exec tuitionsinindia-staging-web prisma db push \
    --accept-data-loss --skip-generate 2>&1 | grep -v "Can't write to" || true

mkdir -p /root/deploy-history
echo "{\"sha\":\"${GIT_SHA}\",\"branch\":\"staging\",\"message\":\"${GIT_MSG}\",\"author\":\"${GIT_AUTHOR}\",\"deployedAt\":\"${DEPLOY_TIME}\",\"env\":\"staging\",\"status\":\"success\"}" \
    >> /root/deploy-history/staging.log

echo "{\"sha\":\"${GIT_SHA}\",\"shortSha\":\"${GIT_SHA}\",\"branch\":\"staging\",\"message\":\"${GIT_MSG}\",\"author\":\"${GIT_AUTHOR}\",\"deployedAt\":\"${DEPLOY_TIME}\",\"env\":\"staging\"}" \
    > /root/tuitionsinindia-staging/version.json

docker image prune -f 2>/dev/null || true

echo "=== Staging deploy done: $(date) ==="
