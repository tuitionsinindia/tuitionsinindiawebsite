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

echo "🗄️ Step 3: Syncing Database Schema..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "cd ${APP_DIR} && docker exec tuitionsinindia-web npx prisma db push"

echo "🧹 Pruning old images..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "docker image prune -f"

echo "✅ Deployment complete! Monitoring logs..."
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "docker logs --tail 50 tuitionsinindia-web"
