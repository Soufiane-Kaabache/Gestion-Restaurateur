# 00 - ERD GLOBAL

Description: Vue d'ensemble des 12 modules principaux. Relations inter-modules visibles.

```mermaid
erDiagram
    %% Modules principaux (simplifiés)
    RESTAURANTS ||--o{ SITES_RESTAURANTS : possede
    RESTAURANTS ||--o{ PLATS_RESTAURANT : propose
    PLATS_Restaurant }o--o{ RECETTES : utilise

    RESTAURANTS ||--o{ COMMANDES : recoit
    COMMANDES ||--o{ LIGNES_COMMANDES : contient
    LIGNES_COMMANDES }o--|| PLATS_RESTAURANT : reference

    RESTAURANTS ||--o{ STOCK_RESTAURANT : stocke
    STOCK_RESTAURANT ||--o{ MOUVEMENTS_STOCK : enregistre
    MOUVEMENTS_STOCK }o--|| FOURNISSEURS : fourni_par

    CLIENTS ||--o{ COMMANDES : passe
    CLIENTS ||--o{ PROGRAMME_FIDELITE : a

    EMPLOYES ||--o{ PLANNINGS : a
    EMPLOYES ||--o{ POINTAGES : pointage

    METRIQUES_RESTAURANT ||--o{ PREDICTIONS_IA : alimente
    ASSOCIATIONS_IA }o--o{ ASSOCIATIONS_PLATS : associe

    API_KEYS ||--o{ WEBHOOKS : autorise
    WEBHOOKS ||--o{ LOGS_API : trace

    %% Legend
    %% classDef users fill:#e1f5ff
    %% classDef business fill:#fff4e1
    %% classDef catalog fill:#e8f5e9
    %% classDef ai fill:#f3e5f5
```

Notes:

- Ce diagramme est volontairement synthétique. Pour détails voir les fichiers 01-12.
