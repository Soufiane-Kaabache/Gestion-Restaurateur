#!/usr/bin/env bash
set -euo pipefail
# ============================================
# Déploiement sécurisé des index P0
# Usage:
#   ./deploy_indexes.sh <environment> [DATABASE_URL]
# Examples:
#   ./deploy_indexes.sh staging
#   ./deploy_indexes.sh staging postgresql://user:pass@localhost:55432/dbname
# ============================================

ENVIRONMENT=${1:-staging}
MIGRATION_FILE="prisma/migrations/sql/002_indexes_p0.sql"
OVERRIDE_DB_URL=${2:-}

if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo "❌ Environnement invalide. Usage: ./deploy_indexes.sh [staging|production] [DATABASE_URL]"
    exit 1
fi

if [ -n "$OVERRIDE_DB_URL" ]; then
    DB_URL="$OVERRIDE_DB_URL"
elif [ "$ENVIRONMENT" == "staging" ]; then
    DB_URL="${STAGING_DATABASE_URL:-}"
else
    DB_URL="${PRODUCTION_DATABASE_URL:-}"
fi

if [ -z "$DB_URL" ]; then
    echo "❌ Variable de connexion DB non définie for $ENVIRONMENT. Provide it as 2nd arg or set STAGING_DATABASE_URL/PRODUCTION_DATABASE_URL."
    exit 1
fi

echo "🚀 Déploiement sur: $ENVIRONMENT"
echo "📄 Migration: $MIGRATION_FILE"

if [ "$ENVIRONMENT" == "production" ]; then
    read -r -p "⚠️  ATTENTION: Déploiement en PRODUCTION. Confirmer (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "❌ Déploiement annulé"
        exit 1
    fi
    echo "📦 Création backup (schema-only)..."
    BACKUP_FILE="backup_pre_002_$(date +%Y%m%d_%H%M%S).sql"
    pg_dump "$DB_URL" --schema-only > "$BACKUP_FILE"
    echo "✅ Backup sauvegardé: $BACKUP_FILE"
fi

echo "🔌 Test connexion base de données..."
psql "$DB_URL" -c "SELECT version();"

echo "⚙️  Application de la migration..."
START_TIME=$(date +%s)

# Run the SQL file. We capture output to a log for later inspection.
psql "$DB_URL" -f "$MIGRATION_FILE" 2>&1 | tee migration_002_output.log

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "✅ Migration terminée en ${DURATION}s"
echo "📊 Log complet: migration_002_output.log"

echo "🔍 Vérification des index créés..."
psql "$DB_URL" -c "SELECT tablename, indexname, pg_size_pretty(pg_relation_size(indexname::regclass)) as size FROM pg_indexes WHERE indexname LIKE 'idx_%' AND schemaname = 'public' ORDER BY tablename;"

echo "✅ Déploiement terminé sur $ENVIRONMENT"
