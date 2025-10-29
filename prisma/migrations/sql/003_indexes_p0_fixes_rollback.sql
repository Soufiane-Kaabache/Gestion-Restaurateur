-- ============================================
-- ROLLBACK MIGRATION 003
-- Reverse changes from 003_indexes_p0_fixes.sql
-- ============================================

-- Drop search index
DROP INDEX CONCURRENTLY IF EXISTS idx_dishes_search;

-- Drop trigger if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_trigger t JOIN pg_class c ON t.tgrelid = c.oid
    WHERE t.tgname = 'dishes_search_vector_trigger' AND c.relname = 'dishes'
  ) THEN
    EXECUTE 'DROP TRIGGER dishes_search_vector_trigger ON dishes';
  END IF;
END$$;

-- Drop trigger function
DROP FUNCTION IF EXISTS public.dishes_search_vector_trigger();

-- Optionally drop column (commented - destructive)
-- ALTER TABLE dishes DROP COLUMN IF EXISTS search_vector;

-- Drop conditional indexes (if present)
DROP INDEX CONCURRENTLY IF EXISTS idx_orders_customer_date;
DROP INDEX CONCURRENTLY IF EXISTS idx_dishes_cuisine_origin;
