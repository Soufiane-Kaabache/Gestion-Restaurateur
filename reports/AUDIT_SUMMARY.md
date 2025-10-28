# 📊 AUDIT RAPIDE - Projet Gestion Restaurateur

Date: 2025-10-28

Ce document résume l'audit rapide réalisé (recherches, fichiers volumineux, paquets suspects) et propose un plan d'action concret.

## ✅ Résumé rapide

- Fichiers TS/TSX listés : `reports/all-files.txt` (104 fichiers)
- TODOs / FIXMEs : aucun trouvé (`reports/audit-todos.txt`)
- Fichiers > 300 lignes : voir `reports/audit-bigfiles.txt`
- Recherche paquets suspects : `reports/package-usage/all.txt`

## 🔴 Problèmes critiques identifiés

1. Fichiers très volumineux (priorité haute — à splitter)

   Les fichiers les plus gros (taille en lignes) :
   - 695 lignes → `src/components/ui/sidebar.tsx`
   - 662 lignes → `src/components/bar/BarView.tsx`
   - 603 lignes → `src/components/analytics/AnalyticsDashboard.tsx`
   - 553 lignes → `src/app/runner/page.tsx`
   - 537 lignes → `src/components/server/ServerView.tsx`
   - 528 lignes → `src/app/bar/page.tsx`
   - 513 lignes → `src/app/orders/page.tsx`
   - 495 lignes → `src/components/menu/MenuManager.tsx`
   - (liste complète : `reports/audit-bigfiles.txt`)

   Pourquoi c'est critique : ces fichiers sont difficiles à maintenir, tester et réutiliser. Ils augmentent les risques de bugs et ralentissent les relectures.

2. Paquets potentiellement inutilisés ("zombies")

Résultats des recherches (grep dans le repo) :

- `@mdxeditor/editor` — présent uniquement dans `package.json` / `package-lock.json` (aucun import dans le code source) → CANDIDAT À SUPPRIMER
- `@reactuses/core` — présent uniquement dans les manifests, pas d'import détecté → CANDIDAT À SUPPRIMER

Les autres paquets suspects inspectés sont utilisés (ex. `vaul`, `sonner`, `cmdk`, `recharts`, `embla-carousel-react`, `input-otp`). Voir `reports/package-usage/all.txt`.

## 🟢 Actions recommandées (plan en 3 phases)

PHASE 1 — Sécurité & ménage léger (immédiat)

- Supprimer les paquets confirmés inutilisés. Commandes proposées :

```bash
# supprimer des dépendances depuis la racine du projet
npm uninstall @mdxeditor/editor @reactuses/core

# mettre à jour le lockfile
npm install

# vérifier depcheck rapidement
npx depcheck --skip-missing > reports/audit-deps.json || true
```

- Commit & push :

```bash
git add package.json package-lock.json
git commit -m "chore: remove unused deps @mdxeditor, @reactuses"
git push origin main
```

PHASE 2 — Refactor des fichiers volumineux (next 1–2 jours selon priorité)

- Priorité immédiate (split asap):
  1. `src/components/ui/sidebar.tsx`
  2. `src/components/bar/BarView.tsx`
  3. `src/components/analytics/AnalyticsDashboard.tsx`
  4. `src/app/runner/page.tsx`

- Règles de découpage conseillées :
  - Extraire la logique métier (hooks) dans `src/hooks/*`.
  - Extraire les sous-composants dans `src/components/<area>/subcomponents/*`.
  - Ajouter tests unitaires pour les nouveaux petits composants.

PHASE 3 — Vérifications automatisées et QA

- Lancer `depcheck` et `ts-prune` pour confirmer les exports/dépendances inutilisées :

```bash
npx depcheck --json > reports/audit-deps.json || true
npx ts-prune --error > reports/audit-exports.txt 2>&1 || true
```

- Lancer `npm audit --json > reports/audit-security.json` et corriger vulnérabilités critiques.
- Exécuter la suite Vitest et ajouter coverage pour les composants refactorés.

## 📌 Fichiers générés par l'audit rapide

- `reports/all-files.txt` — liste des fichiers TS/TSX
- `reports/audit-todos.txt` — TODO/FIXME (vide)
- `reports/audit-bigfiles.txt` — fichiers > 300 lignes (à traiter en priorité)
- `reports/package-usage/all.txt` — résultats grep pour packages suspects
- `reports/mdxeditor-search.txt`, `reports/reactuses-search.txt` — recherches détaillées pour paquets zombies

## Prochaine action souhaitée ?

Choisis une option :

- `apply-cleanup` : j'applique la suppression des 3 paquets (npm uninstall + commit) et je mets à jour `reports/audit-deps.json` par un `depcheck` rapide.
- `run-full-audit` : je lance `depcheck`, `ts-prune` et `npm audit` et je t'envoie les résultats (1–3 minutes).
- `start-refactor` : je crée des tickets/PRs de découpage pour les 4 fichiers prioritaires (ou j'essaie de découper `sidebar.tsx` en un patch si tu veux).

---

Récapitulatif: j'ai validé que les trois paquets cités sont référencés seulement dans les manifests (lockfile + package.json) et non importés. Les fichiers volumineux sont listés et priorisés. Dis‑moi l'action suivante (`apply-cleanup` | `run-full-audit` | `start-refactor`).
