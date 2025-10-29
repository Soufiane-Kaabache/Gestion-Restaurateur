# Migration & Deployment Plan — Indexes P0

This document describes the safe rollout for the P0 index migration (small, fast indexes) and includes verification and rollback steps.

1. Pre-requisites

- Ensure you have a staging environment with representative data.
- Make a schema-only backup before running on production.
- Ensure pg_stat_statements is enabled on your DB for post-deploy validation (recommended).

2. Files included

- `prisma/migrations/sql/002_indexes_p0.sql` — P0 indexes (CREATE INDEX CONCURRENTLY ...)
- `prisma/migrations/sql/002_indexes_p0_rollback.sql` — rollback to drop those indexes
- `prisma/migrations/sql/003_indexes_p0_fixes.sql` — conditional fixes and tsvector trigger
- `prisma/migrations/sql/003_indexes_p0_fixes_rollback.sql` — rollback for fixes
- `scripts/deploy_indexes.sh` — safe wrapper to run migrations (accepts optional DB URL)
- `scripts/verify_indexes.sh` — post-deploy verification

3. Staging run (recommended)

1) Start or select a staging DB and set environment:

```bash
export STAGING_DATABASE_URL="postgresql://user:pass@host:5432/dbname"
```

2. Verify current indexes:

```bash
./scripts/verify_indexes.sh "$STAGING_DATABASE_URL"
```

3. Run migration in staging:

```bash
./scripts/deploy_indexes.sh staging "$STAGING_DATABASE_URL"
```

4. Run the fixes migration (003):

```bash
psql "$STAGING_DATABASE_URL" -f prisma/migrations/sql/003_indexes_p0_fixes.sql
```

5. Re-run verification and smoke tests for critical endpoints (orders listing, product search, staff auth).

4) Production roll-out

- Schedule during low traffic window if tables are large.
- Run with `CREATE INDEX CONCURRENTLY` already in the SQL — no table locks.
- Recommended steps:

```bash
# 1) create a schema-only backup
pg_dump "$PRODUCTION_DATABASE_URL" --schema-only > backup_pre_002_$(date +%Y%m%d_%H%M%S).sql

# 2) apply P0
./scripts/deploy_indexes.sh production "$PRODUCTION_DATABASE_URL"

# 3) apply fixes (003)
psql "$PRODUCTION_DATABASE_URL" -f prisma/migrations/sql/003_indexes_p0_fixes.sql

# 4) verify
./scripts/verify_indexes.sh "$PRODUCTION_DATABASE_URL"
```

5. Rollback

- If you need to rollback P0 (drop the indexes), apply the rollback SQL:

```bash
psql "$PRODUCTION_DATABASE_URL" -f prisma/migrations/sql/002_indexes_p0_rollback.sql
psql "$PRODUCTION_DATABASE_URL" -f prisma/migrations/sql/003_indexes_p0_fixes_rollback.sql
```

Note: dropping indexes is fast, but recreating them can take time — plan accordingly.

6. Post-deploy checks

- Check `pg_stat_user_indexes` for idx_scan and ensure the new indexes are used (non-zero scans).
- Monitor slow queries and query plans (EXPLAIN ANALYZE on heavy endpoints).
- Check disk usage and index bloat.

7. Troubleshooting

- If a column referenced by an index doesn't exist, the conditional migration 003 will avoid failing the migration.
- If the tsvector trigger causes performance problems on heavy writes, consider batching updates or creating the index during low traffic windows.

---

Prepared and committed on branch `db/indexes-p0-implementation`.
