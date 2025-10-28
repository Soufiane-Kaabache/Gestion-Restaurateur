# 02 - ERD Restaurants & Sites

## Vue d'ensemble

Chaines, sites, abonnements et configurations par restaurant.

```mermaid
erDiagram
    RESTAURANTS ||--o{ SITES_RESTAURANTS : possède
    RESTAURANTS ||--o{ ABONNEMENTS_RESTAURANTS : a
    RESTAURANTS ||--o{ CONFIGURATIONS_RESTAURANT : configure

    RESTAURANTS {
      String id PK
      String name
      String siret UK
      String country
      Json cuisines
      DateTime created_at
    }

    SITES_RESTAURANTS {
      String id PK
      String restaurant_id FK
      String address
      String hours
      Int capacity
    }

    ABONNEMENTS_RESTAURANTS {
      String id PK
      String restaurant_id FK
      String plan
      Date date_start
      Date date_end
    }

    CONFIGURATIONS_RESTAURANT {
      String id PK
      String restaurant_id FK
      Json settings
    }
```

### Points d'attention

- `cuisines` could be a relation to CUISINES table (denormalized as JSON for quick lookup).
