# 07 - ERD Staff & Roles

## Vue d'ensemble

Utilisateurs internes (serveurs, cuisiniers, managers), rôles et accès aux terminaux.

```mermaid
erDiagram
    STAFF ||--o{ STAFF_ROLES : has
    STAFF ||--o{ SHIFT_ASSIGNMENTS : assigned
    TERMINALS ||--o{ SHIFT_ASSIGNMENTS : uses

    STAFF {
      String id PK
      String user_id FK
      String display_name
      String role_default
    }

    STAFF_ROLES {
      String id PK
      String name
      Json permissions
    }

    SHIFT_ASSIGNMENTS {
      String id PK
      String staff_id FK
      String terminal_id FK
      DateTime start_at
      DateTime end_at
    }

    TERMINALS {
      String id PK
      String name
      String location
    }
```

### Points d'attention

- Permissions stockées en JSON -> mapper à un modèle RBAC si complexité augmente.
