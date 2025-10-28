# 10 - ERD Analytics & Events

## Vue d'ensemble

Événements et tables agrégées pour rapports/BI.

```mermaid
erDiagram
    EVENTS ||--o{ EVENT_PROPERTIES : has
    EVENTS ||--o{ AGGREGATES : contributes

    EVENTS {
      String id PK
      String event_type
      Json payload
      DateTime created_at
    }

    EVENT_PROPERTIES {
      String id PK
      String event_id FK
      String key
      String value
    }

    AGGREGATES {
      String id PK
      String name
      DateTime period_start
      DateTime period_end
      Json data
    }
```

### Points d'attention

- Garder retention policy pour EVENTS et indexer par event_type + created_at.
