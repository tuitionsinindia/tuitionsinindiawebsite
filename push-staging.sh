#!/bin/bash
# Push current changes to the staging branch on GitHub.
# GitHub Actions will automatically deploy to tuitionsinindia.in.
#
# Usage:
#   ./push-staging.sh                        — auto-generates commit message
#   ./push-staging.sh "Describe your change" — uses your message

set -e

MSG="${1:-}"
if [ -z "$MSG" ]; then
    MSG="Update: $(date '+%d %b %Y, %H:%M')"
fi

cd "$(dirname "$0")"

echo ""
echo "🔀 Pushing to STAGING (tuitionsinindia.in)"
echo "   Message: $MSG"
echo ""

# Stage all changes
git add -A

# Check if there's anything to commit
if git diff --cached --quiet; then
    echo "⚠️  No changes to commit. Already up to date."
else
    git commit -m "$MSG"
    echo "✅ Committed: $MSG"
fi

# Push to staging branch
git push origin HEAD:staging
echo ""
echo "✅ Pushed to GitHub staging branch."
echo ""
echo "Next steps:"
echo "  1. Go to the admin panel → Deployments tab"
echo "  2. Click 'Deploy to Staging'"
echo "  3. Wait ~3 minutes, then test at https://tuitionsinindia.in"
echo ""
