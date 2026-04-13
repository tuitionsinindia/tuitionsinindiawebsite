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

echo "⏰ Step 4: Setting up daily email drip cron job..."
CRON_LINE="0 9 * * * curl -s 'https://tuitionsinindia.com/api/cron/email-drip?secret=aa389dfe348c4c1979b8b0366b1601a1715c161500df5f8ef675f01463afedcd' > /dev/null 2>&1"
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "(crontab -l 2>/dev/null | grep -qF 'email-drip') && echo 'Cron job already set.' || (crontab -l 2>/dev/null; echo \"$CRON_LINE\") | crontab -"
echo "✅ Cron job configured (runs daily at 9:00 AM server time)."

echo "✅ Deployment complete! Monitoring logs..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "docker logs --tail 50 tuitionsinindia-web"
