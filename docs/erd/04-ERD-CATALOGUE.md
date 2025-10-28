# 04 - ERD Catalogue Plats & Menus

## Vue d'ensemble

Categories, plats de référence, variantes et menus spéciaux.

```mermaid
erDiagram
    CATEGORIES_PLATS ||--o{ PLATS_REFERENCE : contient
    PLATS_REFERENCE ||--o{ PLATS_RESTAURANT : inspire
    PLATS_RESTAURANT ||--o{ MENUS_SPECIAUX : compose
    ASSOCIATIONS_PLATS }o--o{ PLATS_RESTAURANT : associe

    CATEGORIES_PLATS {
      String id PK
      String name
      Int display_order
    }

    PLATS_REFERENCE {
      String id PK
      String name
      String cuisine_id FK
      Int prep_time
    }

    PLATS_RESTAURANT {
      String id PK
      String restaurant_id FK
      String reference_id FK
      Float price
      Boolean available
    }

    MENUS_SPECIAUX {
      String id PK
      String restaurant_id FK
      String name
      Json composition
    }

    ASSOCIATIONS_PLATS {
      String id PK
      String plat_a_id FK
      String plat_b_id FK
      Float score
    }
```

### Points d'attention

- Partial index on `available` for quick queries of available items.
