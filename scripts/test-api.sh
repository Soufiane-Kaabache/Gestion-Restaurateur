#!/bin/bash
# ============================================
# PHASE 3 : TESTS API COMPLETS
# ============================================

set -euo pipefail

echo "🧪 PHASE 3 : Tests API Complets"
echo "================================"
echo ""

BASE_URL="http://127.0.0.1:3001"
OK=0
FAIL=0
TOTAL=0
RESULTS_FILE="/tmp/api_test_results.json"

# Fonction de test avec logging JSON
test_endpoint() {
  local name="$1"
  local method="$2"
  local path="$3"
  local expected_code="$4"
  local body_data="${5:-}"
  
  TOTAL=$((TOTAL + 1))
  echo "→ Test $TOTAL: $name"
  echo "  Endpoint: $method $path"
  
  # Exécuter la requête
  if [ "$method" = "GET" ]; then
    response=$(curl -s -w "\n%{http_code}" "$BASE_URL$path" 2>&1)
  else
    response=$(curl -s -w "\n%{http_code}" \
      -X "$method" \
      -H "Content-Type: application/json" \
      -d "$body_data" \
      "$BASE_URL$path" 2>&1)
  fi
  
  # Extraire code HTTP et body
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | sed '$d')
  
  # Valider le résultat
  if [ "$http_code" = "$expected_code" ]; then
    echo "  ✅ PASS - HTTP $http_code"
    OK=$((OK + 1))
    
    # Afficher aperçu JSON
    if command -v jq &> /dev/null; then
      echo "$body" | jq -C '.' 2>/dev/null | head -n 3 || echo "  Response: ${body:0:100}..."
    else
      echo "  Response: ${body:0:100}..."
    fi
  else
    echo "  ❌ FAIL - Expected $expected_code, got $http_code"
    FAIL=$((FAIL + 1))
    echo "  Error: $body"
  fi
  echo ""
}

# Récupérer les IDs depuis la base
echo "📡 Récupération des IDs depuis la base de données..."
RESTAURANT_ID=$(docker exec -i gr-temp-db psql -U postgres -d gestion -t -c \
  'SELECT id FROM "Restaurant" LIMIT 1' 2>/dev/null | xargs || echo "")
TABLE_ID=$(docker exec -i gr-temp-db psql -U postgres -d gestion -t -c \
  'SELECT id FROM "Table" LIMIT 1' 2>/dev/null | xargs || echo "")

if [ -z "$RESTAURANT_ID" ]; then
  echo "❌ Erreur: Impossible de récupérer l'ID du restaurant"
  exit 1
fi

echo "  Restaurant ID: $RESTAURANT_ID"
echo "  Table ID: $TABLE_ID"
echo ""

# ============================================
# TESTS CRUD - LECTURE (GET)
# ============================================

test_endpoint "Health Check" \
  "GET" "/api/health" "200"

test_endpoint "Liste des restaurants" \
  "GET" "/api/restaurants" "200"

test_endpoint "Détail d'un restaurant" \
  "GET" "/api/restaurants/$RESTAURANT_ID" "200"

test_endpoint "Liste des catégories" \
  "GET" "/api/categories" "200"

test_endpoint "Liste des produits" \
  "GET" "/api/products" "200"

test_endpoint "Liste des tables" \
  "GET" "/api/tables" "200"

test_endpoint "Liste des réservations" \
  "GET" "/api/reservations" "200"

test_endpoint "Liste des commandes" \
  "GET" "/api/orders" "200"

# ============================================
# TESTS AVEC FILTRES & PAGINATION
# ============================================

test_endpoint "Pagination (produits)" \
  "GET" "/api/products?page=1&limit=3" "200"

test_endpoint "Filtrage (catégories)" \
  "GET" "/api/categories?restaurantId=$RESTAURANT_ID" "200"

# ============================================
# TESTS NÉGATIFS
# ============================================

test_endpoint "Auth - Échec attendu (401)" \
  "POST" "/api/auth/login" "401" \
  '{"email":"fake@test.com","password":"wrong"}'

# ============================================
# TESTS CRÉATION (POST)
# ============================================

if [ -n "$TABLE_ID" ]; then
  test_endpoint "Création réservation" \
    "POST" "/api/reservations" "201" \
    "{
      \"customerName\": \"Test API Automatique\",
      \"customerEmail\": \"api-test@example.com\",
      \"customerPhone\": \"+33700000000\",
      \"partySize\": 4,
      \"date\": \"2025-01-20T19:00:00.000Z\",
      \"restaurantId\": \"$RESTAURANT_ID\",
      \"tableId\": \"$TABLE_ID\"
    }"
else
  echo "⚠️  Skip test création (TABLE_ID manquant)"
  TOTAL=$((TOTAL + 1))
  FAIL=$((FAIL + 1))
fi

# ============================================
# RAPPORT FINAL
# ============================================

echo ""
echo "===================================="
echo "📊 RÉSUMÉ DES TESTS API"
echo "===================================="
echo "Total tests    : $TOTAL"
echo "✅ Réussis     : $OK"
echo "❌ Échoués     : $FAIL"
if [ $TOTAL -gt 0 ]; then
  SUCCESS_RATE=$((OK * 100 / TOTAL))
  echo "📈 Taux succès : $SUCCESS_RATE%"
else
  echo "📈 Taux succès : N/A"
fi
echo "===================================="
echo ""

# Générer rapport JSON
cat > "$RESULTS_FILE" <<EOF
{
  "phase": "3-api-tests-complete",
  "timestamp": "$(date -Iseconds)",
  "summary": {
    "total": $TOTAL,
    "passed": $OK,
    "failed": $FAIL,
    "success_rate": $((OK * 100 / (TOTAL == 0 ? 1 : TOTAL)))
  },
  "environment": {
    "server": "$BASE_URL",
    "database": "postgresql://127.0.0.1:55432/gestion",
    "restaurant_id": "$RESTAURANT_ID"
  }
}
