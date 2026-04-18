#!/bin/bash
# Called by deploy-webhook.js to deploy production.
# Pulls latest main branch from GitHub and rebuilds.
set -e
cd /root/tuitionsinindia

echo "=== Production deploy started: $(date) ==="

git fetch origin
git reset --hard origin/main

GIT_SHA=$(git rev-parse --short HEAD)
GIT_MSG=$(git log -1 --pretty=%s)
GIT_AUTHOR=$(git log -1 --pretty=%an)
DEPLOY_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ)

rm -rf .next

docker compose build \
    --no-cache \
    --build-arg CACHE_BUST=$(date +%s) \
    --build-arg GIT_SHA="${GIT_SHA}"

docker compose up -d

docker exec tuitionsinindia-web prisma db push \
    --accept-data-loss --skip-generate 2>&1 | grep -v "Can't write to" || true

mkdir -p /root/deploy-history
echo "{\"sha\":\"${GIT_SHA}\",\"branch\":\"main\",\"message\":\"${GIT_MSG}\",\"author\":\"${GIT_AUTHOR}\",\"deployedAt\":\"${DEPLOY_TIME}\",\"env\":\"production\",\"status\":\"success\"}" \
    >> /root/deploy-history/production.log

echo "{\"sha\":\"${GIT_SHA}\",\"shortSha\":\"${GIT_SHA}\",\"branch\":\"main\",\"message\":\"${GIT_MSG}\",\"author\":\"${GIT_AUTHOR}\",\"deployedAt\":\"${DEPLOY_TIME}\",\"env\":\"production\"}" \
    > /root/tuitionsinindia/version.json

docker image prune -f 2>/dev/null || true

echo "=== Production deploy done: $(date) ==="
