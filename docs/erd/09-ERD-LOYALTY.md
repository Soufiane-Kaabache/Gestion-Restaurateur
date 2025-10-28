# 09 - ERD Loyalty & Customers

## Vue d'ensemble

Programme de fidélité, points, niveaux et récompenses.

```mermaid
erDiagram
    CUSTOMERS ||--o{ LOYALTY_ACCOUNTS : has
    LOYALTY_ACCOUNTS ||--o{ LOYALTY_TRANSACTIONS : records
    REWARDS ||--o{ LOYALTY_REDEMPTIONS : redeemed

    LOYALTY_ACCOUNTS {
      String id PK
      String customer_id FK
      Int points
      String tier
      DateTime updated_at
    }

    LOYALTY_TRANSACTIONS {
      String id PK
      String account_id FK
      Int points_delta
      String reason
      DateTime created_at
    }

    REWARDS {
      String id PK
      String name
      Int points_cost
    }

    LOYALTY_REDEMPTIONS {
      String id PK
      String reward_id FK
      String account_id FK
      DateTime redeemed_at
    }
```

### Points d'attention

- Consistance forte sur les points: transactions atomiques ou CQRS.
