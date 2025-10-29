-- ============================================
-- MIGRATION 002: Index Prioritaires (P0)
-- Date: 2025-10-29
-- Auteur: Architecture Team
-- Objectif: Optimiser les requêtes critiques
-- Durée estimée: 15-30 min (dépend volumétrie)
-- ============================================

-- IMPORTANT: Exécuter UNIQUEMENT en dehors des heures de pointe
-- Vérifier avant: SELECT COUNT(*) FROM orders; (si > 1M rows, prévoir fenêtre maintenance)

SET statement_timeout = '60min'; -- Protection contre blocages infinis

-- ============================================
-- MODULE: COMMANDES (Impact dashboard temps réel)
-- ============================================

-- Index composite pour filtre restaurant + statut
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_restaurant_status
ON orders (restaurant_id, status, created_at DESC)
WHERE deleted_at IS NULL;

-- Index pour jointures order_items
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_order_id
ON order_items (order_id)
WHERE deleted_at IS NULL;

-- Index pour recherche par client
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_orders_customer_date
ON orders (customer_id, created_at DESC)
WHERE deleted_at IS NULL;

-- ============================================
-- MODULE: STAFF (Gestion permissions)
-- ============================================

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_staff_restaurant_role
ON staff (restaurant_id, role, is_active)
WHERE deleted_at IS NULL;

-- ============================================
-- MODULE: CATALOGUE (Filtres menu)
-- ============================================

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dishes_restaurant_category
ON dishes (restaurant_id, category_id, is_available)
WHERE deleted_at IS NULL;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dishes_cuisine_origin
ON dishes (cuisine_id, origin_region_id)
WHERE deleted_at IS NULL AND is_available = true;

-- ============================================
-- MODULE: STOCK (Alertes rupture)
-- ============================================

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_stock_restaurant_alert
ON restaurant_stock (restaurant_id, current_quantity, alert_threshold)
WHERE deleted_at IS NULL AND current_quantity <= alert_threshold;

-- ============================================
-- MODULE: ANALYTICS (Métriques temps réel)
-- ============================================

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_metrics_restaurant_type_period
ON restaurant_metrics (restaurant_id, metric_type, period DESC)
WHERE deleted_at IS NULL;

-- ============================================
-- RECHERCHE FULL-TEXT (Plats)
-- ============================================

-- Ajout colonne tsvector si absente
ALTER TABLE dishes 
ADD COLUMN IF NOT EXISTS search_vector tsvector 
GENERATED ALWAYS AS (
    setweight(to_tsvector('french', coalesce(name, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(CAST(tags AS TEXT), '')), 'C')
) STORED;

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_dishes_search
ON dishes USING GIN (search_vector);

-- ============================================
-- VÉRIFICATION POST-MIGRATION
-- ============================================

-- Afficher les index créés
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE indexname LIKE 'idx_%'
  AND schemaname = 'public'
ORDER BY tablename, indexname;

-- Statistiques de taille
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_indexes_size(schemaname||'.'||tablename)) as indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================
-- FIN MIGRATION 002
-- ============================================
