# Déploiement Multi-Instances

## Développement Local

### Lancer une seule instance

```bash
npm run dev:gerant     # Port 3000
npm run dev:serveur    # Port 3001
npm run dev:bar        # Port 3002
npm run dev:cuisine    # Port 3003
```

### Lancer toutes les instances (production style)

```bash
npm run build
npm run start:all
```

## Production avec Docker

### Build et démarrage

```bash
docker-compose up -d --build
```

### Vérifier les logs

```bash
docker-compose logs -f gerant
docker-compose logs -f serveur
```

### Arrêter

```bash
docker-compose down
```

## URLs d'accès

- Gérant: http://localhost:3000
- Serveur: http://localhost:3001
- Bar: http://localhost:3002
- Cuisine: http://localhost:3003

## Notes Socket.IO

Chaque instance expose Socket.IO au chemin `/api/socketio`. Les clients doivent se connecter au port correspondant à leur rôle (utiliser `src/lib/socket-client.ts`).
