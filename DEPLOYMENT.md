# 🚀 Deployment Guide

Deze guide helpt je om de AI PubQuiz app te deployen naar Firebase Hosting.

## Voorbereiding

### 1. Firebase Project Setup

1. Ga naar [Firebase Console](https://console.firebase.google.com/)
2. Klik op "Add project" of "Create a project"
3. Vul een project naam in (bijv. "ai-pubquiz")
4. Volg de setup wizard
5. Enable Google Analytics (optioneel)

### 2. Enable Firebase Services

#### Firestore Database

1. In Firebase Console, ga naar "Firestore Database"
2. Klik op "Create database"
3. Selecteer "Start in production mode"
4. Kies een locatie (bijv. europe-west1 voor Europa)

#### Authentication

1. Ga naar "Authentication" in Firebase Console
2. Klik op "Get started"
3. Enable "Anonymous" authentication
   - Ga naar "Sign-in method" tab
   - Klik op "Anonymous"
   - Toggle enable aan
   - Save

#### Hosting

1. Ga naar "Hosting" in Firebase Console
2. Klik op "Get started"
3. Volg de instructies (we doen dit straks via CLI)

### 3. Firebase CLI Installatie

Installeer Firebase CLI globally:

```bash
npm install -g firebase-tools
```

Login bij Firebase:

```bash
firebase login
```

## Project Configuratie

### 1. Firebase Initialisatie

In de project directory:

```bash
firebase init
```

Selecteer de volgende opties:
- Services: **Firestore** en **Hosting**
- Existing project: **Selecteer je project**
- Firestore rules file: `firestore.rules` (gebruik bestaande)
- Firestore indexes file: Press Enter (default)
- Public directory: **dist** (belangrijk!)
- Configure as single-page app: **Yes**
- Set up automatic builds with GitHub: **No** (optioneel)
- Overwrite index.html: **No**

### 2. Environment Variables Setup

1. Ga naar Firebase Console > Project Settings > Your apps
2. Klik op "Web" icon om een web app toe te voegen
3. Geef een nickname (bijv. "PubQuiz Web")
4. Kopieer de Firebase config values

5. Update `.env.local` met je waarden:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

⚠️ **BELANGRIJK**: Voeg `.env.local` toe aan `.gitignore` (is al gedaan)

### 3. Firestore Rules Deployment

Deploy de security rules:

```bash
firebase deploy --only firestore:rules
```

Verify in Firebase Console dat de rules zijn geüpdatet.

## Build en Deploy

### 1. Build de App

```bash
npm run build
```

Dit maakt een `dist/` folder met de production build.

### 2. Test Lokaal (Optioneel)

Test de production build lokaal:

```bash
firebase serve
```

Of met Vite:

```bash
npm run preview
```

### 3. Deploy naar Firebase

Deploy naar production:

```bash
firebase deploy
```

Of alleen hosting:

```bash
firebase deploy --only hosting
```

### 4. Verify Deployment

Na deployment krijg je URLs zoals:
- **Hosting URL**: https://your-project.web.app
- **Console URL**: https://console.firebase.google.com/project/your-project

Bezoek je Hosting URL om te verifiëren dat alles werkt!

## Admin Setup

Om admin toegang te krijgen:

1. Open je app en probeer in te loggen
2. Kopieer je User ID:
   - Open Browser DevTools (F12)
   - Console tab
   - Type: `firebase.auth().currentUser.uid`
   - Kopieer de output

3. Ga naar Firebase Console > Firestore Database
4. Maak een nieuwe collection `admins`
5. Add document met ID = je User ID
6. Vul dummy data in (bijv. `role: "admin"`)
7. Save

Nu heb je admin rechten!

## Continue Deployment

### Met Firebase CLI

Voor elke update:

```bash
# 1. Build
npm run build

# 2. Deploy
firebase deploy
```

### Met GitHub Actions (Optioneel)

1. Maak `.github/workflows/firebase-hosting.yml`:

```yaml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

2. Setup GitHub secrets voor FIREBASE_SERVICE_ACCOUNT

## Troubleshooting

### Build Errors

```bash
# Clear node_modules en opnieuw installeren
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Firebase Permission Errors

```bash
# Re-login
firebase logout
firebase login
```

### Firestore Rules Errors

Check de rules in Firebase Console:
- Ga naar Firestore Database > Rules
- Verify dat ze correct zijn gedeployed
- Test rules met de Rules Playground

### Environment Variables niet geladen

- Verify dat `.env.local` bestaat
- Verify dat alle vars beginnen met `VITE_`
- Restart dev server na env changes

## Custom Domain (Optioneel)

1. Ga naar Firebase Console > Hosting
2. Klik op "Add custom domain"
3. Vul je domain in (bijv. quiz.yourdomain.com)
4. Volg instructies om DNS records toe te voegen
5. Wacht op SSL provisioning (kan tot 24u duren)

## Monitoring

### Performance

Firebase Console > Performance Monitoring

### Errors

Firebase Console > Crashlytics (moet apart worden ingesteld)

### Analytics

Firebase Console > Analytics

## Kosten

Firebase heeft een **gratis tier** met:
- 50,000 document reads/dag
- 20,000 document writes/dag
- 10 GB hosting transfer/maand

Voor kleine tot middelgrote quizzes is dit meer dan voldoende!

## Support

Bij problemen:
- Check Firebase Console voor errors
- Check browser console (F12)
- Review Firestore rules
- Verify environment variables

---

Succes met je deployment! 🚀

