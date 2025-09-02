# Service d'Email avec Resend

Ce service permet d'envoyer des emails de notification via l'API Resend.

## Configuration

1. **Obtenir une clé API Resend** :
   - Créez un compte sur [resend.com](https://resend.com)
   - Générez une clé API dans votre dashboard
   - Copiez le fichier `env.example` vers `.env` et ajoutez votre clé API

2. **Variables d'environnement** :
   ```bash
   RESEND_API_KEY=your_resend_api_key_here
   FRONTEND_URL=http://localhost:3000
   ```

## Utilisation

### 1. Créer une notification avec email automatique

```http
POST /notifications
Content-Type: application/json

{
  "title": "Nouvelle réservation",
  "message": "Votre réservation pour la salle A a été confirmée",
  "userId": "user123",
  "userEmail": "user@example.com",
  "userName": "John Doe",
  "sendEmail": true
}
```

### 2. Envoyer un email pour une notification existante

```http
POST /notifications/{notificationId}/send-email
```

### 3. Utiliser le service d'email directement

```typescript
import EmailService from './services/email.service';

const emailService = EmailService.getInstance();

// Envoyer un email simple
const result = await emailService.sendEmail({
  to: 'user@example.com',
  subject: 'Test Email',
  html: '<h1>Hello World</h1>'
});

// Envoyer un email de notification formaté
const result = await emailService.sendNotificationEmail(
  'user@example.com',
  'Nouvelle notification',
  'Contenu de la notification',
  'John Doe'
);
```

## Fonctionnalités

- **Email HTML formaté** : Templates d'email professionnels avec CSS inline
- **Gestion d'erreurs** : Retour détaillé des erreurs d'envoi
- **Pattern Singleton** : Une seule instance du service d'email
- **Logs** : Traçabilité des envois d'emails
- **Configuration flexible** : Variables d'environnement pour la personnalisation

## Structure des emails

Les emails de notification incluent :
- En-tête avec logo/icône
- Salutation personnalisée
- Contenu de la notification
- Bouton d'action vers l'application
- Pied de page avec informations légales

## Sécurité

- Les clés API sont stockées dans les variables d'environnement
- Validation des adresses email
- Gestion des erreurs sans exposition de données sensibles 