# Plan de migration vers Next.js 15.5.6

Ce document décrit une checklist pratique, les commandes, les vérifications et le plan de rollback pour migrer le projet `Gestion-Restaurateur` de la version actuelle de Next.js vers `15.5.6`.

## Contexte et objectifs

- Objectif : mettre à jour Next.js vers `15.5.6` pour corriger des vulnérabilités et bénéficier d'améliorations de performance.
- Contraintes : minimiser les régressions, valider via CI (build + tests + tsc) et effectuer une validation manuelle des pages critiques.

## Risques connus

- Breaking changes possibles sur : server actions, image optimization (`next/image`), caching et comportements internes du routeur.
- Plugins / dépendances (ex: `next-auth`, `sharp`, `esbuild`, eslint-config-next) peuvent nécessiter upgrades.

## Pré-requis

- Brancher sur une branche dédiée : `upgrade/next-15-5-6`.
- S'assurer que `pnpm-lock.yaml` est commité et que CI utilise pnpm.
- Sauvegarder/mettre à jour les secrets CI si besoin (DATABASE_URL pour Prisma).

## Checklist technique (étapes à exécuter)

1.  Créer une branche et snapshot

```bash
git checkout -b upgrade/next-15-5-6
git push -u origin upgrade/next-15-5-6
```

2.  Mettre à jour Next

```bash
pnpm add next@15.5.6
pnpm install --frozen-lockfile
```

3.  Mettre à jour packages liés (si nécessaire)

- `eslint-config-next` vers la version correspondante
- `@types/node`, `@types/react` si besoin
- `sharp`, `esbuild` (rebuild native binaries)

4.  Régénérer le client Prisma (si utilisé)

```bash
pnpm exec prisma generate
```

5.  Lancer les vérifications locales

```bash
pnpm exec tsc --noEmit
pnpm build
pnpm exec vitest run
pnpm dev
```

Vérifier manuellement :

- /tables (Select, formulaires)
- pages critiques : /orders, /reservations, /payment
- fonctionnalités serveur : sockets (server.ts), middleware, API routes

6.  Tests E2E (optionnel mais recommandé)

- Lancer Playwright/Cypress contre l'environnement dev built

7.  Ouvrir PR et lancer CI

- Créer PR `upgrade/next-15-5-6` → `main` et laisser CI exécuter build/tests/tsc

8.  Smoke tests en staging (si dispo)

- Déployer sur une URL staging (Vercel ou autre) et valider flows métiers.

## Rollback

- Si régression critique : revert le merge (git revert) ou re-déployer `main` avant la PR.
- Si problème mineur : corriger sur la branche et pousser un nouveau commit.

## Points d'attention détaillés

- next/image : vérifier les usages de `unoptimized` et l'impact sur les CDN; tester le rendu des images et le comportement SSR/SSG.
- Server actions : vérifier les API internes qui utilisaient les anciens patterns; lancer tests unitaires et manuels.
- SWC et native binaries : vérifier que `pnpm install` rebuild les binaires (sharp) et que `pnpm exec prisma generate` fonctionne.
- Vérifier les polyfills et le `next.config.ts` : options de cache, rewrite et experimental features.

## Estimations

- Durée de l'opération (local + tests) : 30–90 minutes selon taille des tests et reconstruction des binaires.
- Risque de régression : moyen — nécessite validation manuelle et CI.

## Checklist rapide à coller dans la PR

- [ ] Branchée depuis `main`
- [ ] `pnpm add next@15.5.6` effectué
- [ ] `pnpm exec prisma generate` effectué
- [ ] `pnpm exec tsc --noEmit` OK
- [ ] `pnpm build` OK
- [ ] `pnpm exec vitest run` OK
- [ ] Tests E2E (si configurés) OK
- [ ] Staging smoke tests OK

---

Si tu veux, j'exécute ces étapes automatiquement (en local ici dans le dépôt) :

- je peux créer la branche `upgrade/next-15-5-6`, mettre à jour Next, lancer `pnpm install`, `prisma generate`, `tsc`, `build` et `vitest`, puis ouvrir une PR.
- Dis‑moi si tu veux que je fasse l'automatisation complète (je ferai un commit sur `upgrade/next-15-6` et j'ouvrirai la PR).
