# 11 - ERD External Integrations

## Vue d'ensemble

Intégrations externes (paiement, compta, tickets) et mappings vers entités internes.

```mermaid
erDiagram
    PAYMENT_PROVIDERS ||--o{ PAYMENT_TRANSACTIONS : processes
    EXTERNAL_ORDERS ||--o{ ORDER_MAPPINGS : maps

    PAYMENT_PROVIDERS {
      String id PK
      String name
      Json config
    }

    PAYMENT_TRANSACTIONS {
      String id PK
      String order_id FK
      String provider_id FK
      String provider_tx_id
      String status
      Float amount
    }

    EXTERNAL_ORDERS {
      String id PK
      String external_system
      Json payload
      DateTime received_at
    }

    ORDER_MAPPINGS {
      String id PK
      String external_order_id FK
      String internal_order_id FK
    }
```

### Points d'attention

- Garder logs immuables pour réconciliation comptable.
