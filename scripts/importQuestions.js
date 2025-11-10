// Script om vragen te importeren naar Firestore
// Gebruik: node scripts/importQuestions.js "Quiz Naam"

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables from .env.local
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
    console.error('❌ Kan .env.local niet lezen. Zorg dat het bestand bestaat.');
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

// Parse questions from text format
function parseQuestions(text) {
  const questions = [];
  const rounds = [];
  let currentRound = null;
  let currentRoundIndex = -1;
  
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for new round
    if (line.match(/^RONDE\s+\d+/i) || line.match(/^Ronde\s+\d+/i)) {
      const roundMatch = line.match(/(\d+):\s*(.+)/i);
      if (roundMatch) {
        const roundNum = parseInt(roundMatch[1]) - 1;
        const roundName = roundMatch[2].trim() || `Ronde ${roundNum + 1}`;
        currentRound = { name: roundName, order: roundNum };
        currentRoundIndex = rounds.length;
        rounds.push(currentRound);
        questions.push([]);
      }
      continue;
    }
    
    // Check for question
    if (line.match(/^Vraag\s+\d+:/i) || line.match(/^\d+\./)) {
      const questionMatch = line.match(/:\s*(.+)/i) || line.match(/^\d+\.\s*(.+)/i);
      if (questionMatch) {
        const questionText = questionMatch[1].trim();
        const answers = [];
        let correctIndex = -1;
        
        // Read next 4-5 lines for answers
        for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
          const answerLine = lines[j];
          
          // Check for answer option (A), B), C), D))
          if (answerLine.match(/^[A-D]\)\s*(.+)/i)) {
            const answerMatch = answerLine.match(/^[A-D]\)\s*(.+)/i);
            const letter = answerLine[0].toUpperCase();
            const answerText = answerMatch[1].trim();
            answers.push(answerText);
            
            // Check if this is the correct answer
            if (j + 1 < lines.length && lines[j + 1].match(/^Correct:\s*[A-D]/i)) {
              const correctMatch = lines[j + 1].match(/^Correct:\s*([A-D])/i);
              if (correctMatch && correctMatch[1].toUpperCase() === letter) {
                correctIndex = answers.length - 1;
                j++; // Skip the "Correct:" line
              }
            }
          }
        }
        
        if (answers.length === 4 && correctIndex >= 0) {
          if (currentRoundIndex < 0) {
            // Create default round if none exists
            currentRound = { name: `Ronde ${rounds.length + 1}`, order: rounds.length };
            currentRoundIndex = rounds.length;
            rounds.push(currentRound);
            questions.push([]);
          }
          
          questions[currentRoundIndex].push({
            text: questionText,
            answers: answers,
            correctIndex: correctIndex,
            order: questions[currentRoundIndex].length
          });
        }
      }
    }
  }
  
  return { rounds, questions };
}

// Import questions to Firestore
async function importQuestions(quizName, questionsText) {
  try {
    console.log('📝 Parsing vragen...');
    const { rounds, questions } = parseQuestions(questionsText);
    
    if (rounds.length === 0) {
      console.error('❌ Geen rondes gevonden!');
      return;
    }
    
    console.log(`✅ ${rounds.length} rondes gevonden`);
    console.log(`✅ ${questions.flat().length} vragen gevonden`);
    
    // Create quiz
    console.log(`\n📦 Quiz aanmaken: "${quizName}"...`);
    const quizRef = await addDoc(collection(db, 'quizzes'), {
      name: quizName,
      roundCount: rounds.length,
      questionsPerRound: Math.max(...questions.map(r => r.length)),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    const quizId = quizRef.id;
    console.log(`✅ Quiz aangemaakt met ID: ${quizId}`);
    
    // Create rounds and questions
    for (let i = 0; i < rounds.length; i++) {
      const round = rounds[i];
      console.log(`\n📂 Ronde ${i + 1} aanmaken: "${round.name}"...`);
      
      const roundRef = await addDoc(collection(db, 'quizzes', quizId, 'rounds'), {
        name: round.name,
        order: round.order,
        quizId: quizId,
      });
      const roundId = roundRef.id;
      console.log(`✅ Ronde aangemaakt`);
      
      // Add questions
      const roundQuestions = questions[i] || [];
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
      console.log(`✅ ${roundQuestions.length} vragen toegevoegd`);
    }
    
    console.log(`\n🎉 Klaar! Quiz "${quizName}" is aangemaakt met alle vragen.`);
    console.log(`\nJe kunt nu een sessie starten in de app!`);
    
  } catch (error) {
    console.error('❌ Fout bij importeren:', error);
    process.exit(1);
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Gebruik: node scripts/importQuestions.js "Quiz Naam" "vragen tekst"');
    console.log('\nOf gebruik een bestand:');
    console.log('node scripts/importQuestions.js "Quiz Naam" < vragen.txt\n');
    console.log('Formaat voor vragen:');
    console.log(`
RONDE 1: Naam van Ronde

Vraag 1: Je vraag hier?
A) Antwoord 1
B) Antwoord 2
C) Antwoord 3
D) Antwoord 4
Correct: A

Vraag 2: Volgende vraag...
A) Antwoord 1
B) Antwoord 2
C) Antwoord 3
D) Antwoord 4
Correct: B
    `);
    process.exit(1);
  }
  
  const quizName = args[0];
  const questionsText = args.slice(1).join(' ');
  
  await importQuestions(quizName, questionsText);
}

main();

