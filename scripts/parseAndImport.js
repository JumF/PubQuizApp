// Script om vragen te parsen en importeren
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnv() {
  try {
    const envFile = readFileSync(join(__dirname, '../.env.local'), 'utf8');
    const env = {};
    envFile.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        env[match[1].trim()] = match[2].trim();
      }
    });
    return env;
  } catch (error) {
    console.error('❌ Kan .env.local niet lezen.');
    process.exit(1);
  }
}

const env = loadEnv();
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function parseQuestions(text) {
  const questions = [];
  const rounds = [];
  let currentRound = null;
  let currentRoundIndex = -1;
  
  const lines = text.split('\n').map(l => l.trim()).filter(l => l && !l.match(/^https?:\/\//));
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for new round
    if (line.match(/^RONDE\s+\d+/i)) {
      const roundMatch = line.match(/RONDE\s+(\d+)\s*[-–]\s*(.+)/i);
      if (roundMatch) {
        const roundNum = parseInt(roundMatch[1]) - 1;
        const roundName = roundMatch[2].trim();
        
        // Skip lightning round (different format)
        if (roundName.toUpperCase().includes('LIGHTNING')) {
          console.log(`⏭️  Overslaan: ${roundName} (ander formaat)`);
          currentRound = null;
          currentRoundIndex = -1;
          continue;
        }
        
        currentRound = { name: roundName, order: roundNum };
        currentRoundIndex = rounds.length;
        rounds.push(currentRound);
        questions.push([]);
        console.log(`📂 Ronde gevonden: ${roundName}`);
      }
      continue;
    }
    
    // Skip if no current round
    if (currentRoundIndex < 0) continue;
    
    // Check for question (starts with capital, ends with ? or is a question word)
    if (line.match(/^[A-Z]/) && (
      line.includes('?') || 
      line.match(/^\d+\./) ||
      line.match(/^(WAAR|WAT|WIE|HOE|WAAROM|WAARVOOR|WAARUIT)/i)
    )) {
      // Skip incomplete questions (only title, no answers)
      if (i + 1 < lines.length && 
          (lines[i + 1].match(/^\+\+/) || 
           lines[i + 1].match(/^WIE IS/) ||
           lines[i + 1].match(/^WAAROM/) ||
           lines[i + 1].match(/^WAT/) ||
           lines[i + 1].match(/^WAARVOOR/))) {
        console.log(`⏭️  Overslaan incomplete vraag: ${line.substring(0, 50)}...`);
        continue;
      }
      
      let questionText = line.replace(/^\d+\.\s*/, '').trim();
      // Add ? if missing
      if (!questionText.includes('?') && questionText.match(/^(WAAR|WAT|WIE|HOE|WAAROM|WAARVOOR|WAARUIT)/i)) {
        questionText += '?';
      }
      const answers = [];
      let correctIndex = -1;
      
      // Read next lines for answers
      for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
        const answerLine = lines[j];
        
        // Stop if we hit a new question or round
        if (answerLine.match(/^RONDE/) || 
            (answerLine.match(/^[A-Z]/) && answerLine.includes('?'))) {
          break;
        }
        
        // Check for answer option (1. 2. 3. 4. or numbered)
        if (answerLine.match(/^[1-4]\./)) {
          const answerMatch = answerLine.match(/^[1-4]\.\s*(.+)/);
          if (answerMatch) {
            const answerText = answerMatch[1].replace(/\s*\*$/, '').trim();
            const answerNum = parseInt(answerLine[0]) - 1; // 0-based index
            answers[answerNum] = answerText;
            
            // Check if this is marked as correct with *
            if (answerLine.includes('*') && correctIndex === -1) {
              correctIndex = answerNum;
            }
          }
        }
      }
      
      // Only add if we have 4 answers and a correct one
      if (answers.length === 4 && answers.every(a => a) && correctIndex >= 0) {
        questions[currentRoundIndex].push({
          text: questionText,
          answers: answers,
          correctIndex: correctIndex,
          order: questions[currentRoundIndex].length
        });
        console.log(`✅ Vraag toegevoegd: ${questionText.substring(0, 40)}...`);
      } else if (answers.length > 0) {
        console.log(`⚠️  Vraag overgeslagen (niet compleet): ${questionText.substring(0, 40)}...`);
      }
    }
  }
  
  return { rounds, questions };
}

async function importQuestions(quizName, questionsText) {
  try {
    console.log('📝 Parsing vragen...\n');
    const { rounds, questions } = parseQuestions(questionsText);
    
    if (rounds.length === 0) {
      console.error('❌ Geen rondes gevonden!');
      return;
    }
    
    console.log(`\n📊 Samenvatting:`);
    console.log(`   ${rounds.length} rondes gevonden`);
    rounds.forEach((r, i) => {
      console.log(`   - ${r.name}: ${questions[i]?.length || 0} vragen`);
    });
    const totalQuestions = questions.flat().length;
    console.log(`   Totaal: ${totalQuestions} vragen\n`);
    
    if (totalQuestions === 0) {
      console.error('❌ Geen complete vragen gevonden!');
      return;
    }
    
    // Create quiz
    console.log(`📦 Quiz aanmaken: "${quizName}"...`);
    const quizRef = await addDoc(collection(db, 'quizzes'), {
      name: quizName,
      roundCount: rounds.length,
      questionsPerRound: Math.max(...questions.map(r => r.length)),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    const quizId = quizRef.id;
    console.log(`✅ Quiz aangemaakt met ID: ${quizId}\n`);
    
    // Create rounds and questions
    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];
      const roundQuestions = questions[i] || [];
      
      if (roundQuestions.length === 0) {
        console.log(`⏭️  Ronde ${i + 1} overgeslagen (geen vragen): "${round.name}"`);
        continue;
      }
      
      console.log(`📂 Ronde ${i + 1} aanmaken: "${round.name}"...`);
      
      const roundRef = await addDoc(collection(db, 'quizzes', quizId, 'rounds'), {
        name: round.name,
        order: round.order,
        quizId: quizId,
      });
      const roundId = roundRef.id;
      
      // Add questions
      for (let j = 0; j < roundQuestions.length; j++) {
        const q = roundQuestions[j];
        await addDoc(
          collection(db, 'quizzes', quizId, 'rounds', roundId, 'questions'),
          {
            text: q.text,
            answers: q.answers,
            correctIndex: q.correctIndex,
            order: q.order,
            quizId: quizId,
            roundId: roundId,
          }
        );
      }
      console.log(`   ✅ ${roundQuestions.length} vragen toegevoegd\n`);
    }
    
    console.log(`\n🎉 Klaar! Quiz "${quizName}" is aangemaakt.`);
    console.log(`\nJe kunt nu een sessie starten in de app op http://localhost:5173`);
    
  } catch (error) {
    console.error('❌ Fout bij importeren:', error);
    process.exit(1);
  }
}

// Main
const quizName = "AI PubQuiz";
const questionsText = `RONDE 1 - ALGEMEEN

WAAR STAAT DE AFKORTING AI VOOR?

1. Apneu-index

2. Adequaat niveau van inneming

3. Amnesty International

4. Artificiële Intelligente *

 

HOE OUD IS AI?

1. 5 jaar

2. 8 jaar

3. 27 jaar 

4. 69 jaar *

 

WAAROM IS CHATGPT GRAPPIG IN FRANKRIJK?

 1. Fransen hebben rare humor

2. Als je het omkeert staat er iets smerigs

3. het betekent: Kat, ik heb een scheet gelaten. *

4. Het is de afkorting van een politieke partij

 

WAT DOEN ZELFRIJDENDE AUTO'S IN HUN VRIJE TIJD?

1.     Ze drinken samen buiten de deur

2.     Ze gaan bij elkaar hangen en maken ruzie *

3.     Ze gamen op een PS5

4.     Ze kijken samen een film

 

WAT IS VIBE CODING

1.     Coderen zonder kennis *

2.     Lekker in het moment zitten als je aan het coderen bent

3.     Door AI je code laten checken op foutjes

4.     Het gevoel dat je krijgt als je de goede code typt

 

WAT IS EEN AI GRANNY

1.     Oude vrouw met computerkennis

2.     Een digitale versie van je oma

3.     Een ai oma om scammers aan de lijn te houden *

4.     Een appje waarbij iemand zich voordoet als je oma

 

WAARUIT BESTAAT EEN GOEDE PROMPT?

1. Wie, wat, hoe, specifiek en documenten *

2. Wie, wat, waar ,wanneer, waarom en hoe

3. De kernwoorden van je vraag op een rij, geplaatst tussen: []

4. Koffie, frustratie en maar blijven herhalen: dat bedoel ik niet!

 

WAT IS EEN BIAS IN AI?

1. Een vooroordeel dat door mensen in AI geprogrammeerd wordt. *

2. Een neiging Amerika betere antwoorden te geven dan China.

3. Een vooroordeel dat door mensen in AI geprogrammeerd wordt.

4. Een foutje in het algoritme waardoor je op foto's nooit helemaal jezelf lijkt.

 

WAAR STAAT DE AFKORTING LLM VOOR

1. Leuk, leerzaam en Mindblowing

2. Local Learning Module

3. Large Language model *

4. Logical Linguistic Mapper



WAT IS DEEP IMPACT

1. De schaakcomputer die Ai mogelijk maakte

2. De structuur van een Artificiële neutaal netwerk

3. De trainingsdata als alle sets klaar zijn

4. Een verhaal over een rotsblok *



RONDE 3 – Hoe werkt AI



WELKE DRIE DINGEN HEB JE NODIG VOOR AI

1. Data, data en nog eens data

2. Koffie, Wifi en iemand die Ai kan spellen

3. Algoritmes - Computerkracht - data *

4. Stroom - datacenters en locatie



WAT HAD IN HET BEGIN ELK A.I. PLAATJE VAN EEN BAARS?

1. Te veel vinnen

2. Drie ogen

3. Vingers *

4. Freek Vonk op de achtergrond

 

WAAROM HEEFT AI VOORLIEFDE VOOR 10 OVER 10?

1. Omdat reclames dat vaak zo laten zien *

2. Omdat Ai van uitslapen houdt

3. Omdat 10 over 10 er blij uitziet

4. Omdat 10 over 10 het enige moment is waarop AI én mensen synchroon lopen.



 WAT DOET A.I. ALS HET ONZINNIGE DINGEN VERZINT?

 1. Iedereen voor de gek houden

2. Voorsorteren op wereldheerschappij

3. Hallucineren *

4. Hij doet ons zo goed mogelijk na

 

WAT HEEFT IEMAND GEBOUWD IN MINECRAFT

1.     Een data center op ware groote

2.     Elon Musk

3.     ChatGPT *

4.     Het logo van Nvidia van 300 meter 

 

WAAROM HERKEND AI JUM OP EEN FOTO

1. Omdat AI getraind is op Jum.

2. Omdat AI evenveel vertakkingen heeft als hersenen.

3. Omdat AI denkt: "Hé, dat is die gast van de smaakpolitie!"

4. Jum is gewoon een binair patroon. *`;

importQuestions(quizName, questionsText);

