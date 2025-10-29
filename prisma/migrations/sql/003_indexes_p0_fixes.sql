-- ============================================
-- MIGRATION 003: Fixes for 002_indexes_p0 (conditional indexes + tsvector trigger)
-- Date: 2025-10-29
-- Auteur: Architecture Team
-- Objectif: rendre la migration 002 idempotente et compatible (vérifications d'existence de colonnes,
-- remplacement du GENERATED tsvector par une colonne + trigger pour compatibilité d'immuabilité)
-- ============================================

SET statement_timeout = '60min';

-- 1) Conditional index on orders.customer_id if column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='orders' AND column_name='customer_id'
  ) THEN
    EXECUTE 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_customer_date ON orders (customer_id, created_at DESC) WHERE deleted_at IS NULL';
  END IF;
END$$;

-- 2) Conditional index on dishes.cuisine_id if column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='dishes' AND column_name='cuisine_id'
  ) THEN
    EXECUTE 'CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dishes_cuisine_origin ON dishes (cuisine_id, origin_region_id) WHERE deleted_at IS NULL AND is_available = true';
  END IF;
END$$;

-- 3) Create a non-generated tsvector column + trigger (safer across PG versions)
-- Add column if missing
ALTER TABLE dishes ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Populate existing rows
UPDATE dishes SET search_vector =
    setweight(to_tsvector('french', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(array_to_string(tags, ' '), '')), 'C')
WHERE search_vector IS NULL;

-- Create or replace trigger function to keep search_vector up-to-date
CREATE OR REPLACE FUNCTION public.dishes_search_vector_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('french', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

-- Create trigger if not exists (Postgres doesn't have CREATE TRIGGER IF NOT EXISTS, so check first)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'dishes_search_vector_trigger' AND c.relname = 'dishes'
  ) THEN
    EXECUTE 'CREATE TRIGGER dishes_search_vector_trigger BEFORE INSERT OR UPDATE ON dishes FOR EACH ROW EXECUTE FUNCTION public.dishes_search_vector_trigger();';
  END IF;
END$$;

-- Create GIN index on search_vector
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dishes_search ON dishes USING GIN (search_vector);

-- End migration 003
