# 📧 Configuration Mailtrap

## 🎯 Pourquoi Mailtrap ?

Mailtrap permet de **tester l'envoi d'emails en développement** sans envoyer de vrais emails aux clients.

---

## 🔧 Configuration (5 minutes)

### **Étape 1 : Récupérer les identifiants SMTP**

1. Va sur [Mailtrap.io](https://mailtrap.io)
2. Connecte-toi avec ton compte
3. Menu gauche → **Email Testing**
4. Sélectionne ton **Inbox** (ou crée-en un)
5. Clique sur **SMTP Settings**
6. Copie **Username** et **Password**

---

### **Étape 2 : Ajouter dans `.env`**

Crée/édite le fichier `.env` à la racine du projet :

```bash
# Colle tes identifiants Mailtrap
MAILTRAP_USER=a1b2c3d4e5f6g7  # Remplace par ton Username
MAILTRAP_PASS=1a2b3c4d5e6f7g  # Remplace par ton Password

# Personnalisation des emails
MAIL_FROM_ADDRESS=noreply@restaurant.local
MAIL_FROM_NAME=Restaurant Local
```

> ⚠️ Ne commite jamais ton `.env` avec des identifiants réels.

---

### **Étape 3 : Redémarrer le serveur**

```bash
npm run dev
```

---

### **Étape 4 : Tester l'envoi d'email**

```bash
curl -X POST http://localhost:3000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jean Dupont",
    "customerEmail": "test@example.com",
    "customerPhone": "0612345678",
    "date": "2025-11-01T19:00:00.000Z",
    "partySize": 4
  }'
```

---

### **Étape 5 : Vérifier dans Mailtrap**

1. Retourne sur Mailtrap.io
2. Va dans ton **Inbox**
3. Tu dois voir l'email de confirmation de réservation ! 🎉

---

## 🐛 Dépannage

### Erreur : "Variables MAILTRAP non trouvées"

```bash
# Vérifie que .env existe et contient MAILTRAP_USER et MAILTRAP_PASS
cat .env | grep MAILTRAP
```

### Erreur : "Connection refused (port 2525)"

- Ton pare-feu bloque le port 2525
- **Solution** : Modifie `src/lib/mailer.ts` pour utiliser le port **587** (TLS) ou ouvre le port

### Erreur : "tableId required"

- Aucune table n'existe dans la base de données
- **Solution** : Crée une table avec Prisma Studio :

```bash
npx prisma studio
# → Ajoute une table : number=1, capacity=4, status=LIBRE
```

### Les emails n'apparaissent pas dans Mailtrap

- Vérifie que tu es dans le bon **Inbox**
- Vérifie les **logs du serveur** pour voir si l'envoi a réussi
- Teste avec un email différent

---

## 📚 Ressources

- [Documentation Mailtrap](https://help.mailtrap.io/)
- Code du mailer : `src/lib/mailer.ts`

---

## 🔒 Sécurité

⚠️ **IMPORTANT** : Ne commite JAMAIS le fichier `.env` dans Git !

Le fichier `.gitignore` du projet contient déjà `.env`.
