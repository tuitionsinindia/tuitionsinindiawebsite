#!/bin/bash
# Promote the current staging branch to production (main).
# GitHub Actions will deploy to tuitionsinindia.com after manual approval.
#
# Usage: ./promote-production.sh

set -e

cd "$(dirname "$0")"

echo ""
echo "🚀 Promoting STAGING → PRODUCTION"
echo ""

# Make sure staging is up to date
echo "📥 Fetching latest from GitHub..."
git fetch origin

STAGING_SHA=$(git rev-parse origin/staging 2>/dev/null || echo "")
MAIN_SHA=$(git rev-parse origin/main 2>/dev/null || echo "")

if [ "$STAGING_SHA" = "$MAIN_SHA" ]; then
    echo "⚠️  Staging and production are already on the same commit."
    echo "   Nothing to promote."
    echo ""
    exit 0
fi

echo "Staging is ahead of production. Commits to be promoted:"
git log --oneline origin/main..origin/staging 2>/dev/null || echo "(could not diff)"
echo ""

read -p "Are you sure you want to promote these changes to production? (yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo "Aborted."
    exit 0
fi

# Merge staging into main and push
git checkout main
git pull origin main
git merge origin/staging --no-edit -m "Promote staging → production ($(date '+%d %b %Y'))"
git push origin main

echo ""
echo "✅ Pushed to GitHub main branch."
echo ""
echo "Next steps:"
echo "  1. Go to the admin panel → Deployments tab"
echo "  2. Click 'Promote to Production'"
echo "  3. Or go to: https://github.com/tuitionsinindia/tuitionsinindiawebsite/actions"
echo "  4. Approve the production deployment workflow"
echo "  5. Production will be live in ~3 minutes after approval"
echo ""
