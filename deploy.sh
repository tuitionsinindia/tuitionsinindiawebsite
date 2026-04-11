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
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_HOST} "bash -s" << 'EOF'
cd /root/tuitionsinindia
echo "🐳 Rebuilding Containers with NO-CACHE (Force Clean Build)..."
docker compose build --no-cache --build-arg CACHE_BUST=$(date +%s)
docker compose up -d

echo "🗄️ Step 3: Synchronizing Database Schema..."
docker exec tuitionsinindia-web prisma db push --accept-data-loss

echo "🧹 Pruning old images..."
docker image prune -f

echo "✅ Deployment complete! Monitoring logs..."
docker logs --tail 50 tuitionsinindia-web
EOF
