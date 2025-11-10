# 🎯 AI PubQuiz

Een realtime multiplayer pubquiz webapp gebouwd met React, TypeScript, en Firebase.

## ✨ Features

- **Multiplayer Support**: Meerdere spelers kunnen tegelijkertijd deelnemen
- **Realtime Synchronisatie**: Live updates via Firebase Firestore
- **Admin Panel**: Beheer quizzen, rondes en vragen
- **Quizmaster Controls**: Start timer, sluit vragen, zie live scores
- **Player Interface**: Join met code, beantwoord vragen, zie je score
- **Scoring Systeem**: Punten gebaseerd op snelheid en correctheid
- **Statistieken**: Zie resultaten en accuratesse van alle spelers
- **Responsive Design**: Werkt op alle devices (mobiel, tablet, desktop)

## 🚀 Setup

### Vereisten

- Node.js (v18 of hoger)
- npm of yarn
- Firebase account

### Installatie

1. Clone de repository:
```bash
git clone <repository-url>
cd AIPubQuiz
```

2. Installeer dependencies:
```bash
npm install
```

3. Maak een Firebase project aan op [Firebase Console](https://console.firebase.google.com/)

4. Enable Firestore Database en Authentication (Anonymous)

5. Kopieer je Firebase configuratie en maak een `.env.local` bestand:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

6. Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

7. (Optioneel) Voeg admin users toe in Firestore Console:
   - Ga naar Firestore Database
   - Maak een collectie `admins` aan
   - Voeg een document toe met je Firebase Auth UID als document ID

### Development

Start de development server:
```bash
npm run dev
```

De app is beschikbaar op `http://localhost:5173`

### Production Build

Build de app:
```bash
npm run build
```

## 🎮 Gebruik

### 1. Admin: Maak een Quiz

1. Ga naar de homepage
2. Klik op "Admin Panel"
3. Klik op "+ Nieuwe Quiz"
4. Vul een naam in (er worden automatisch 5 rondes aangemaakt)
5. Klik op een ronde en voeg vragen toe
6. Voor elke vraag:
   - Vul de vraagtekst in
   - Voeg 4 antwoorden toe
   - Selecteer het juiste antwoord

### 2. Quizmaster: Start een Sessie

1. Ga naar de homepage
2. Klik op "Quizmaster - Start Nieuwe Quiz"
3. Selecteer een quiz
4. Stel timer duur in (bijv. 30 seconden)
5. Klik op "Start Sessie"
6. Deel de 4-cijferige join code met spelers
7. Wacht tot spelers joinen en klik op "Start Quiz"
8. Voor elke vraag:
   - Klik op "Start Timer"
   - Wacht tot de tijd voorbij is of klik op "Sluit Vraag"
   - Klik op "Volgende Vraag"

### 3. Speler: Join en Speel

1. Ga naar de homepage op je telefoon
2. Klik op "Speler - Join Quiz"
3. Vul de join code in (van quizmaster)
4. Vul je naam in
5. Wacht tot de quiz start
6. Beantwoord elke vraag zo snel mogelijk
7. Zie je score na elke vraag
8. Bekijk de eindresultaten

## 📁 Project Structuur

```
AIPubQuiz/
├── src/
│   ├── components/          # React componenten
│   │   ├── admin/           # Admin panel componenten
│   │   ├── quizmaster/      # Quizmaster control componenten
│   │   ├── player/          # Speler interface componenten
│   │   └── shared/          # Gedeelde componenten
│   ├── contexts/            # React Context providers
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page componenten
│   ├── services/            # Firebase services
│   ├── types/               # TypeScript types
│   └── utils/               # Helper functies
├── public/                  # Static assets
├── firebase.json            # Firebase configuratie
├── firestore.rules          # Firestore security rules
└── package.json
```

## 🗃️ Database Schema

### Collections

- **quizzes**: Quiz configuratie
  - **rounds**: Rondes binnen een quiz
    - **questions**: Vragen binnen een ronde
- **sessions**: Actieve quiz sessies
- **players**: Spelers per sessie
- **answers**: Gegeven antwoorden
- **statistics**: Per-vraag statistieken

## 🔐 Security

- Firestore security rules beschermen de data
- Alleen admins kunnen quizzen wijzigen
- Spelers kunnen alleen hun eigen antwoorden indienen
- Rate limiting voorkomt spam

## 🚀 Deployment

### Firebase Hosting

1. Installeer Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login bij Firebase:
```bash
firebase login
```

3. Initialiseer Firebase:
```bash
firebase init
```
   - Selecteer "Hosting"
   - Kies je project
   - Public directory: `dist`
   - Single-page app: Yes
   - GitHub auto-deploys: Optional

4. Build en deploy:
```bash
npm run build
firebase deploy
```

Je app is nu live op `https://your-project.web.app`

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **Hosting**: Firebase Hosting
- **Build Tool**: Vite
- **Routing**: React Router v6

## 📝 TODO / Toekomstige Features

- [ ] Image support voor vragen
- [ ] Drag-and-drop voor vraag volgorde
- [ ] Bulk import van vragen (CSV/JSON)
- [ ] Quiz templates
- [ ] Team mode (spelers in teams)
- [ ] Power-ups en bonussen
- [ ] Quiz replay functie
- [ ] Uitgebreidere statistieken dashboard
- [ ] Social sharing van resultaten

## 🤝 Contributing

Contributions zijn welkom! Open een issue of submit een pull request.

## 📄 License

MIT License - Zie LICENSE bestand voor details.

## 👥 Contact

Voor vragen of support, open een issue op GitHub.

---

Gemaakt met ❤️ voor de beste pubquiz ervaring!
