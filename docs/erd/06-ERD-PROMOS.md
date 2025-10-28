# 06 - ERD Promotions & Pricing

## Vue d'ensemble

Promotions, règles de prix, historiques et application par produit / catégorie.

```mermaid
erDiagram
    PROMOTIONS ||--o{ PROMO_RULES : contient
    PROMO_RULES ||--o{ PROMO_APPLIES : applique
    PRODUCTS ||--o{ PROMO_APPLIES : cible

    PROMOTIONS {
      String id PK
      String name
      DateTime start_at
      DateTime end_at
      String status
    }

    PROMO_RULES {
      String id PK
      String promotion_id FK
      String type
      Json parameters
    }

    PROMO_APPLIES {
      String id PK
      String rule_id FK
      String product_id FK
      String category_id FK
    }

    PRODUCTS {
      String id PK
      String name
      Float base_price
    }
```

### Points d'attention

- Évaluer la priorité d'exécution (stackable promotions). Tester conflit de règles.
