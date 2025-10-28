---
**Type**: feat
**Statut**: ✅ Build/Tests/TypeCheck OK | ⏳ Awaiting Review
**Lien vers le plan**: [NEXTJS_UPGRADE_PLAN.md](../../docs/NEXTJS_UPGRADE_PLAN.md)
**Reviewers suggérés**: @Soufiane-Kaabache, @ton-autre-collaborateur
**Labels**: `upgrade`, `nextjs`, `needs-testing`
---

## 🚀 Migration Next.js 14 → 15.5.6

**Branche**: `upgrade/next-15-5-6` → `main`
**Commit**: [2f283ec](https://github.com/Soufiane-Kaabache/Gestion-Restaurateur/commit/2f283ec)

---

### ✅ Vérifications Automatiques (CI en cours)

| Étape               | Statut Local | Statut CI | Détails                                                    |
| ------------------- | ------------ | --------- | ---------------------------------------------------------- |
| **Install (pnpm)**  | ✅           | ⏳        | `pnpm install --frozen-lockfile` (cache activé).           |
| **Prisma Generate** | ✅           | ⏳        | Client régénéré sans erreur.                               |
| **TypeScript**      | ✅           | ⏳        | `tsc --noEmit` → 0 erreurs.                                |
| **Build Next.js**   | ✅           | ⏳        | 19 pages statiques générées (incl. `/tables`).             |
| **Tests Vitest**    | ✅ (9/9)     | ⏳        | Tous les tests unitaires passent.                          |
| **Coverage**        | ✅           | ⏳        | Rapport disponible dans `coverage/lcov-report/index.html`. |

_🔗 [Voir les logs CI](#) (lien généré après merge de la PR)._

---

### 🔍 Checklist pour Reviewers

#### 1. Vérifications Techniques

- [ ] **Server Actions**:
  - Vérifier que les actions dans `app/actions.ts` utilisent la nouvelle syntaxe (ex: `useServerAction`).
  - Tester le formulaire de réservation (`/tables`) en soumettant une donnée.
- [ ] **Optimisation des Images**:
  - Ouvrir `/tables` et vérifier que les images s’affichent correctement (pas de `404` ou de placeholder).
  - Vérifier `next.config.js` pour `images.unoptimized` (doit être `false`).
- [ ] **Cache HTTP**:
  - Dans le navigateur (onglet Network), vérifier que les requêtes `fetch` ont bien `cache: 'force-cache'` si applicable.

#### 2. Tests Manuels Critiques

| Page/Route      | Action à Tester                         | Résultat Attendu                         |
| --------------- | --------------------------------------- | ---------------------------------------- |
| `/tables`       | Charger la page                         | Affichage des tables + formulaire.       |
| `/tables`       | Soumettre une réservation               | Succès + redirection/notification.       |
| `/reservations` | Filtrer les réservations                | Mise à jour dynamique sans rechargement. |
| `/api/health`   | `curl http://localhost:3000/api/health` | Réponse `{"status":"ok"}`.               |

#### 3. Dépendances

- [ ] Vérifier les warnings de version avec:

```bash
pnpm why next react react-dom
```

_Attendu_:

```
next@15.5.6
react@18.2.0
react-dom@18.2.0
```

---

### 🛑 Points de Vigilance

1. **Server Actions**:
   - Next.js 15.5.6 a introduit des changements dans la gestion des actions côté serveur.
   - **Solution**: Si une action échoue, vérifier la [doc officielle](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions).

2. **Images Optimisées**:
   - Si une image ne s’affiche pas, ajouter temporairement `unoptimized` au composant `Image`:
     ```jsx
     <Image src="/path.jpg" unoptimized />
     ```

3. **Cache**:
   - Les stratégies de cache (`fetch`) peuvent avoir changé. Utiliser:
     ```js
     fetch('https://api.example.com', { cache: 'force-cache' });
     ```

---

### 🔄 Rollback (si nécessaire)

```bash
# Revenir à la version précédente
git checkout main
git branch -D upgrade/next-15-5-6
pnpm add next@14.1.0 react@18.2.0 react-dom@18.2.0
pnpm install --frozen-lockfile
```

**Artifacts de sauvegarde**:

- Le commit actuel (`2f283ec`) est tagué comme `pre-upgrade-next15`.
- Le `pnpm-lock.yaml` précédent est sauvegardé dans `docs/backup/pnpm-lock-pre-upgrade.yaml`.

---

### 📌 Instructions pour Merger

1. **Attendre que la CI soit verte** (tous les checks ✅).
2. **Tester manuellement** les routes critiques (voir tableau ci-dessus).
3. **Merger avec un "Squash Merge"** pour garder l’historique propre:

```bash
git checkout main
git merge --squash upgrade/next-15-5-6
git commit -m "feat: upgrade Next.js to 15.5.6"
git push
```

---

### 🚀 Après Merge

- [ ] **Déployer en staging** pour validation utilisateur.
- [ ] **Mettre à jour le `README.md`**:

```markdown
## Tech Stack

- Next.js **15.5.6** (upgraded from 14.1.0)
- React 18.2.0
```

- [ ] **Annonce à l’équipe** (ex: Slack):
  > "Next.js 15.5.6 est déployé en staging. Vérifiez les Server Actions et les images. Rollback possible avec `git checkout main && pnpm add next@14`."
