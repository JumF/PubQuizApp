# ⚡ Quick Start Guide

Kom snel aan de slag met de AI PubQuiz app!

## 🎯 5 Minuten Setup

### 1. Installeer Dependencies

```bash
npm install
```

### 2. Firebase Project Setup

1. Ga naar [console.firebase.google.com](https://console.firebase.google.com)
2. Maak een nieuw project
3. Enable **Firestore Database** (production mode)
4. Enable **Authentication** > **Anonymous**
5. Kopieer je config (Project Settings > Your apps > Web app)

### 3. Environment Setup

Maak `.env.local` aan (zie `.env.local.example`):

```env
VITE_FIREBASE_API_KEY=jouw_api_key
VITE_FIREBASE_AUTH_DOMAIN=jouw_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=jouw_project_id
VITE_FIREBASE_STORAGE_BUCKET=jouw_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=jouw_sender_id
VITE_FIREBASE_APP_ID=jouw_app_id
```

### 4. Deploy Firestore Rules

```bash
# Installeer Firebase CLI als je dat nog niet hebt
npm install -g firebase-tools

# Login
firebase login

# Init project (selecteer je Firebase project)
firebase init

# Deploy rules
firebase deploy --only firestore:rules
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🎮 Eerste Quiz Maken

### Stap 1: Admin Toegang

Je hebt admin rechten nodig. Er zijn twee opties:

**Optie A: Lokaal testen zonder admin**
- Je kunt de app gebruiken zonder admin
- Ga direct naar "Quizmaster" om een sessie te starten
- ⚠️ Je kunt geen quizzen bewerken zonder admin rechten

**Optie B: Admin rechten toevoegen**
1. Open de app in je browser
2. Open DevTools Console (F12)
3. Type: `localStorage` en vind je user ID (of login eerst met anonymous auth)
4. Ga naar Firebase Console > Firestore
5. Maak collection `admins`
6. Add document met jouw User ID als document ID
7. Refresh de app

### Stap 2: Maak een Quiz

1. Klik op **"Admin Panel"**
2. Klik op **"+ Nieuwe Quiz"**
3. Vul een naam in (bijv. "Test Quiz")
4. Klik **"Quiz Aanmaken"**
5. Er worden automatisch 5 rondes aangemaakt

### Stap 3: Voeg Vragen Toe

1. Klik op de quiz om te bewerken
2. Selecteer **"Ronde 1"**
3. Klik **"+ Vraag Toevoegen"**
4. Voor elke vraag:
   - Vul de vraag in
   - Voeg 4 antwoorden toe
   - Selecteer het juiste antwoord (radio button)
   - Klik **"Opslaan"**
5. Herhaal voor minimaal 3-5 vragen

### Stap 4: Start een Sessie

1. Ga terug naar home
2. Klik **"Quizmaster - Start Nieuwe Quiz"**
3. Selecteer je quiz
4. Stel timer in (bijv. 30 seconden)
5. Klik **"Start Sessie"**
6. Je krijgt een **4-cijferige join code**

### Stap 5: Join als Speler

**Op je telefoon of andere device:**

1. Open [http://localhost:5173](http://localhost:5173) (of je deployed URL)
2. Klik **"Speler - Join Quiz"**
3. Vul de join code in
4. Vul je naam in
5. Klik **"Join Quiz"**

**Of test lokaal:**
1. Open een nieuwe browser tab (incognito mode werkt goed)
2. Volg dezelfde stappen

### Stap 6: Speel de Quiz!

**Als Quizmaster:**
1. Wacht tot spelers joinen
2. Klik **"Start Quiz"**
3. Voor elke vraag:
   - Klik **"▶️ Start Timer"**
   - Wacht of klik **"⏹️ Sluit Vraag"**
   - Klik **"Volgende Vraag →"**
4. Zie live scores rechts

**Als Speler:**
1. Wacht tot vraag start
2. Selecteer je antwoord
3. Klik **"Indienen"**
4. Zie je score updaten
5. Wacht op volgende vraag

### Stap 7: Bekijk Resultaten

Na de laatste vraag:
1. Quizmaster klikt **"Beëindig Quiz"**
2. Iedereen ziet de **resultaten pagina**
3. Top 3 podium met scores
4. Volledige ranking met statistieken

## 📱 Testen op Mobiel

### Optie 1: Zelfde Netwerk

1. Start dev server: `npm run dev`
2. Vind je lokale IP (bijv. 192.168.1.100)
3. Op je telefoon ga naar: `http://192.168.1.100:5173`

### Optie 2: Ngrok (Externe toegang)

```bash
# Installeer ngrok
npm install -g ngrok

# Start tunnel
ngrok http 5173
```

Gebruik de ngrok URL op je telefoon.

### Optie 3: Deploy naar Firebase

Zie [DEPLOYMENT.md](./DEPLOYMENT.md) voor instructies.

## 🐛 Troubleshooting

### "No Firebase project found"

```bash
firebase use --add
# Selecteer je project
```

### "Permission denied" errors

Check Firestore rules:
```bash
firebase deploy --only firestore:rules
```

### Vragen laden niet

1. Check Firebase Console > Firestore
2. Verify data structure:
   - `quizzes/{quizId}/rounds/{roundId}/questions/{questionId}`
3. Check browser console voor errors

### Timer werkt niet

- Refresh de pagina
- Check dat `questionStartTime` is set in Firestore

### Spelers kunnen niet joinen

- Verify session status is niet "ended"
- Check join code (hoofdlettergevoelig... nee, het is numbers only)
- Check Firestore rules deployment

## 💡 Tips

- **Test met meerdere tabs**: Gebruik incognito mode om multiple players te simuleren
- **Quick reload**: Vite heeft HMR, changes zijn instant
- **Firebase emulator**: Gebruik Firebase emulators voor offline development
- **Console logging**: Open DevTools om debug info te zien

## 📚 Meer Hulp

- [README.md](./README.md) - Volledige documentatie
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- Firebase docs: [firebase.google.com/docs](https://firebase.google.com/docs)

## 🎉 Klaar!

Je bent nu klaar om je eerste pubquiz te hosten!

Veel plezier! 🎯

