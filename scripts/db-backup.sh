#!/bin/bash
# Database backup script — runs daily via cron on the VPS
# Backs up both production and staging databases
# Keeps 14 days of backups
# Cron: 0 2 * * * /root/scripts/db-backup.sh >> /var/log/db-backup.log 2>&1

BACKUP_DIR="/root/db-backups"
PROD_CONTAINER="tuitionsinindia-db"
STAGING_CONTAINER="tuitionsinindia-staging-db"
PROD_DB="tuitionsinindia"
STAGING_DB="tuitionsinindia_staging"
DB_USER="tuitions_admin"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
KEEP_DAYS=14

mkdir -p "$BACKUP_DIR/production" "$BACKUP_DIR/staging"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🗄️  DB Backup — $DATE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── Production backup ──
echo "📦 Backing up production DB..."
if docker exec "$PROD_CONTAINER" pg_dump -U "$DB_USER" "$PROD_DB" \
    | gzip > "$BACKUP_DIR/production/prod_${DATE}.sql.gz"; then
    SIZE=$(du -sh "$BACKUP_DIR/production/prod_${DATE}.sql.gz" | cut -f1)
    echo "✅ Production backup complete: prod_${DATE}.sql.gz ($SIZE)"
else
    echo "❌ Production backup FAILED"
fi

# ── Staging backup ──
echo "📦 Backing up staging DB..."
if docker exec "$STAGING_CONTAINER" pg_dump -U "$DB_USER" "$STAGING_DB" \
    | gzip > "$BACKUP_DIR/staging/staging_${DATE}.sql.gz"; then
    SIZE=$(du -sh "$BACKUP_DIR/staging/staging_${DATE}.sql.gz" | cut -f1)
    echo "✅ Staging backup complete: staging_${DATE}.sql.gz ($SIZE)"
else
    echo "❌ Staging backup FAILED (staging may not be running)"
fi

# ── Cleanup old backups ──
echo "🧹 Removing backups older than ${KEEP_DAYS} days..."
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +${KEEP_DAYS} -delete
REMAINING=$(find "$BACKUP_DIR" -name "*.sql.gz" | wc -l)
echo "📁 ${REMAINING} backup files retained."

# ── List current backups ──
echo ""
echo "Current backups:"
ls -lh "$BACKUP_DIR/production/" 2>/dev/null | tail -5
ls -lh "$BACKUP_DIR/staging/" 2>/dev/null | tail -3
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
