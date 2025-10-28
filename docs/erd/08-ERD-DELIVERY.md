# 08 - ERD Delivery & Runner

## Vue d'ensemble

Gestion des livraisons, coureurs (runners) et statuts de livraison.

```mermaid
erDiagram
    ORDERS ||--o{ DELIVERY_TASKS : has
    RUNNERS ||--o{ DELIVERY_TASKS : assigned
    DELIVERY_TASKS ||--o{ DELIVERY_EVENTS : events

    RUNNERS {
      String id PK
      String staff_id FK
      String vehicle
      String phone
    }

    DELIVERY_TASKS {
      String id PK
      String order_id FK
      String runner_id FK
      String status
      DateTime pickup_at
      DateTime delivered_at
    }

    DELIVERY_EVENTS {
      String id PK
      String task_id FK
      String type
      String note
      DateTime created_at
    }
```

### Points d'attention

- Suivi temps réel: prévoir websocket/redis pour l'état des tâches.
