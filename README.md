# Service de Notification

Un service simple pour gérer les notifications des utilisateurs, écrit en TypeScript.

## Installation

```bash
npm install
```

## Scripts disponibles

- `npm run dev` : Démarre le serveur en mode développement avec hot reload
- `npm run build` : Compile le code TypeScript
- `npm start` : Démarre le serveur en mode production (nécessite d'avoir fait un build)
- `npm run watch` : Compile le code TypeScript en mode watch

## Démarrage en développement

```bash
npm run dev
```

## Démarrage en production

```bash
npm run build
npm start
```

Le service démarre sur le port 3000 par défaut.

## API Endpoints

### GET /health

Vérifie l'état du service.

### GET /api/notifications

Récupère toutes les notifications.

### POST /api/notifications

Crée une nouvelle notification.

Exemple de body :

```json
{
  "title": "Nouveau message",
  "message": "Vous avez reçu un nouveau message",
  "userId": "123"
}
```

### PATCH /api/notifications/:id/read

Marque une notification comme lue.

### GET /api/notifications/user/:userId

Récupère toutes les notifications d'un utilisateur spécifique.

## Types

### Notification

```typescript
interface Notification {
  id: string;
  title: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: Date;
}
```

### CreateNotificationDto

```typescript
interface CreateNotificationDto {
  title: string;
  message: string;
  userId: string;
}
```

## Structure des Notifications

Chaque notification a la structure suivante :

```json
{
  "id": "1234567890",
  "title": "Titre de la notification",
  "message": "Contenu de la notification",
  "userId": "123",
  "read": false,
  "createdAt": "2024-03-04T12:00:00.000Z"
}
```
