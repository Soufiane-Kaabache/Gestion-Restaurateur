# 📧 Système de Notifications par Email

## 🎯 Vue d'ensemble

Ce système envoie des emails automatiques à :

- **Clients** → Confirmations de réservation
- **Personnel** → Alertes opérationnelles (gérant, barman, serveurs, cuisine)

---

## 👥 Rôles et Notifications

| Rôle        | Variable d'environnement | Reçoit                              |
| ----------- | -----------------------: | ----------------------------------- |
| **Gérant**  |          `MANAGER_EMAIL` | Nouvelles réservations, annulations |
| **Barman**  |        `BARTENDER_EMAIL` | Commandes de boissons               |
| **Serveur** |           `WAITER_EMAIL` | Nouvelles réservations, commandes   |
| **Cuisine** |          `KITCHEN_EMAIL` | Commandes de plats                  |

---

## ⚙️ Configuration

Ajoute les emails du personnel dans ton fichier `.env` (ou utilise `.env.*` locaux) :

```bash
MANAGER_EMAIL=gerant@restaurant.local
BARTENDER_EMAIL=barman@restaurant.local
WAITER_EMAIL=serveur@restaurant.local
KITCHEN_EMAIL=cuisine@restaurant.local
```

> Les emails sont capturés par Mailtrap en environnement de développement.

---

## 🔧 Utilisation dans le Code

### Nouvelle réservation :

```ts
import { notifyNewReservation } from '@/lib/mailer';

await notifyNewReservation({
  customerName: 'Jean Dupont',
  customerEmail: 'jean@example.com',
  customerPhone: '0612345678',
  date: new Date('2025-11-01T19:00:00'),
  partySize: 4,
});
```

### Nouvelle commande :

```ts
import { notifyNewOrder } from '@/lib/mailer';

await notifyNewOrder({
  orderNumber: 'CMD-001',
  tableNumber: 5,
  items: [
    { name: 'Steak frites', quantity: 2 },
    { name: 'Salade César', quantity: 1 },
  ],
});
```

### Commande de boissons :

```ts
import { notifyDrinksOrder } from '@/lib/mailer';

await notifyDrinksOrder({
  orderNumber: 'CMD-001',
  tableNumber: 5,
  drinks: [
    { name: 'Coca-Cola', quantity: 2 },
    { name: 'Eau pétillante', quantity: 1 },
  ],
});
```

---

## 🧪 Tests rapides

1. Ajoute Mailtrap creds + staff emails dans `.env`
2. Démarre l'app : `npm run dev`
3. Crée une réservation via l'API (exemple `curl`):

```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "customerPhone": "0612345678",
    "date": "2025-11-01T19:00:00.000Z",
    "partySize": 4
  }'
```

Vérifie dans Mailtrap : tu dois voir la confirmation client et la notification au personnel (BCC).

---

## ⚠️ Notes

- Les emails au personnel sont envoyés en BCC (destinataires invisibles entre eux).
- Si un email de rôle manque, un warning s'affiche et le mail n'est pas envoyé à ce rôle.
- En production, remplace Mailtrap par un fournisseur SMTP réel (SendGrid, Postmark...).
