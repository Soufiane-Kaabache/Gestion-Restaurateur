#!/usr/bin/env bash
set -euo pipefail
# ============================================
# Vérification post-déploiement des index
# Usage: ./verify_indexes.sh <DATABASE_URL>
# ============================================

DB_URL=${1:-}
if [ -z "$DB_URL" ]; then
  echo "Usage: $0 <DATABASE_URL>"
  exit 1
fi

echo "🔎 Indexes (public schema)"
psql "$DB_URL" -c "SELECT tablename, indexname, indexdef FROM pg_indexes WHERE schemaname='public' AND indexname LIKE 'idx_%' ORDER BY tablename, indexname;"

echo "\n📈 Index usage statistics (pg_stat_user_indexes)"
psql "$DB_URL" -c "SELECT schemaname, relname AS table_name, indexrelname AS index_name, idx_scan FROM pg_stat_user_indexes WHERE schemaname='public' ORDER BY idx_scan DESC LIMIT 50;"

echo "\n📦 Table sizes (top 20 by size)"
psql "$DB_URL" -c "SELECT tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size FROM pg_tables WHERE schemaname='public' ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC LIMIT 20;"

echo "\n✅ Vérification terminée"
