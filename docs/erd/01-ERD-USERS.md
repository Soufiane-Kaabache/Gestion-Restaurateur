# 01 - ERD Users & Security

## Vue d'ensemble

Gestion des utilisateurs, rôles, sessions et historique connexions.

```mermaid
erDiagram
    UTILISATEURS ||--o{ ROLES_PERMISSIONS : has
    UTILISATEURS ||--o{ SESSIONS_ACTIVES : active_sessions
    UTILISATEURS ||--o{ HISTORIQUE_CONNEXIONS : logs

    UTILISATEURS {
      String id PK
      String email UK
      String password_hash
      String role_id FK
      Boolean is_active
      DateTime created_at
    }

    ROLES_PERMISSIONS {
      String id PK
      String name
      Json permissions
    }

    SESSIONS_ACTIVES {
      String id PK
      String user_id FK
      String token
      String ip
      DateTime last_seen
    }

    HISTORIQUE_CONNEXIONS {
      String id PK
      String user_id FK
      DateTime timestamp
      String ip
      String status
    }
```

### Points d'attention

- Index sur `email` (unique).
- TTL pour sessions (via Redis recommended).
