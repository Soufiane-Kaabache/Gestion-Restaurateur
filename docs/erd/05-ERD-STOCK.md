# 05 - ERD Ingredients & Stock

## Vue d'ensemble

Ingrédients de référence, stock par site, mouvements et fournisseurs.

```mermaid
erDiagram
    INGREDIENTS_REFERENCE ||--o{ STOCK_RESTAURANT : utilisé_dans
    STOCK_RESTAURANT ||--o{ MOUVEMENTS_STOCK : enregistre
    FOURNISSEURS ||--o{ COMMANDES_FOURNISSEURS : fourni

    INGREDIENTS_REFERENCE {
      String id PK
      String name
      String unit
      Json allergens
    }

    STOCK_RESTAURANT {
      String id PK
      String site_id FK
      String ingredient_id FK
      Float qty
      Float threshold
      DateTime updated_at
    }

    MOUVEMENTS_STOCK {
      String id PK
      String stock_id FK
      String type
      Float qty
      String reason
      DateTime created_at
    }

    FOURNISSEURS {
      String id PK
      String name
      Json contact
    }

    COMMANDES_FOURNISSEURS {
      String id PK
      String fournisseur_id FK
      String site_id FK
      String status
      DateTime expected_delivery
    }
```

### Points d'attention

- Index composite (site_id, ingredient_id). Partition Mouvements_Stock by year for scale.
