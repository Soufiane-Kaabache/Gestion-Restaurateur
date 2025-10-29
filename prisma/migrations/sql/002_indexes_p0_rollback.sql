-- ============================================
-- ROLLBACK MIGRATION 002
-- ATTENTION: Vérifier l'impact avant suppression
-- ============================================

DROP INDEX CONCURRENTLY IF EXISTS idx_orders_restaurant_status;
DROP INDEX CONCURRENTLY IF EXISTS idx_order_items_order_id;
DROP INDEX CONCURRENTLY IF EXISTS idx_orders_customer_date;
DROP INDEX CONCURRENTLY IF EXISTS idx_staff_restaurant_role;
DROP INDEX CONCURRENTLY IF EXISTS idx_dishes_restaurant_category;
DROP INDEX CONCURRENTLY IF EXISTS idx_dishes_cuisine_origin;
DROP INDEX CONCURRENTLY IF EXISTS idx_stock_restaurant_alert;
DROP INDEX CONCURRENTLY IF EXISTS idx_metrics_restaurant_type_period;
DROP INDEX CONCURRENTLY IF EXISTS idx_dishes_search;

-- Supprimer la colonne search_vector (optionnel, data loss)
-- ALTER TABLE dishes DROP COLUMN IF EXISTS search_vector;

-- Vérification
SELECT indexname FROM pg_indexes 
WHERE indexname LIKE 'idx_%' 
  AND schemaname = 'public';
