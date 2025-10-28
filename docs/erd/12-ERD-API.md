# 12 - ERD API / Routes Mapping

## Vue d'ensemble

Mapping des routes API critiques et ressources exposées.

```mermaid
flowchart LR
  subgraph API
    A[/GET /api/health\nGET /api/orders\nPOST /api/orders/] --> B[Orders Service]
    C[/GET /api/tables\nPOST /api/tables/] --> D[Tables Service]
  end

  B --> E[(DB Orders)]
  D --> F[(DB Tables)]

  style A fill:#f9f,stroke:#333,stroke-width:1px
```

### Points d'attention

- Securiser endpoints critiques et ajouter rate limiting pour webhooks publics.
