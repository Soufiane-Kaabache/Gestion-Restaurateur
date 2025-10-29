# Indexing strategy (Postgres)

This document contains recommended indexes, partitioning candidates and monitoring queries for the main high-traffic tables in the project. It's a living document; apply P0 indexes first, observe performance, then deploy P1/P2.

## 1. Goals & conventions

- Focus on read-heavy endpoints (dashboards, order lookups, product listings).
- Use B-Tree for equality/range, GIN for full-text search.
- Naming: idx*<table>*<cols> (composite cols joined by \_).
- Test every index in staging with representative data and pg_stat_statements.

## 2. P0 — Immediate high-impact indexes

1. Orders dashboard / live queue

```sql
CREATE INDEX idx_orders_restaurant_status_created
ON orders (restaurant_id, status, created_at DESC);
```

Why: Most queries filter by restaurant and status and sort by created_at.

2. Order items join

```sql
CREATE INDEX idx_order_items_order_id
ON order_items (order_id);
```

3. Product listing by category

```sql
CREATE INDEX idx_products_restaurant_category
ON products (restaurant_id, category_id);
```

## 3. P1 — Secondary indexes

- Index for stock analytics:

```sql
CREATE INDEX idx_stockmov_ingredient_created
ON stock_movements (inventory_item_id, created_at DESC);
```

- Full-text search on products (French):

```sql
CREATE INDEX idx_products_search
ON products USING GIN (to_tsvector('french', coalesce(name,'') || ' ' || coalesce(description,'')));
```

## 4. Partitioning recommendations

- Orders: RANGE by month on `created_at` for hot table. Use native Postgres partitioning (PARTITION BY RANGE).
- OrderItems: if >100M rows, partition by parent's order created_at via trigger or reference table.

## 5. Monitoring & maintenance

Run these periodically to find unused indexes or bloat:

```sql
-- unused indexes
SELECT schemaname, relname, indexrelname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- bloat estimation
SELECT * FROM pg_stat_user_tables ORDER BY n_live_tup DESC LIMIT 20;
```

## 6. Rollout plan

- Stage: apply indexes concurrently in staging (CONCURRENTLY), run load tests.
- Prod: apply P0 during low traffic windows; use `CREATE INDEX CONCURRENTLY`.
- Partitioning: create new partitioned table, backfill with batched jobs, flip via trigger/swap.

---

Notes: This is an initial draft; I have added ready-to-run SQL migrations and helper scripts in the repository under `prisma/migrations/sql/` and `scripts/`.

## Migrations & scripts added

- `prisma/migrations/sql/002_indexes_p0.sql` — P0 index migration (CREATE INDEX CONCURRENTLY ...). Apply this in staging first.
- `prisma/migrations/sql/002_indexes_p0_rollback.sql` — rollback script to drop the indexes created by P0.
- `scripts/deploy_indexes.sh` — safe deploy wrapper (backup for production, runs the migration, produces a log).
- `scripts/verify_indexes.sh` — post-deploy verification (lists indexes, usage statistics, table sizes).

See the repository branch `db/indexes-p0-implementation` for the committed migration files and scripts.
