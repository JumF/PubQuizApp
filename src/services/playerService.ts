import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  increment,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Player, Answer, QuestionStatistics } from '../types';

// Player CRUD
export const createPlayer = async (
  sessionId: string,
  name: string
): Promise<string> => {
  const docRef = await addDoc(collection(db, 'players'), {
    sessionId,
    name,
    totalScore: 0,
    joinedAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getPlayer = async (playerId: string): Promise<Player | null> => {
  const docRef = doc(db, 'players', playerId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      joinedAt: data.joinedAt.toDate(),
    } as Player;
  }
  return null;
};

export const getPlayersBySession = async (sessionId: string): Promise<Player[]> => {
  const q = query(
    collection(db, 'players'),
    where('sessionId', '==', sessionId),
    orderBy('totalScore', 'desc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      joinedAt: data.joinedAt.toDate(),
    } as Player;
  });
};

export const updatePlayer = async (playerId: string, playerData: Partial<Player>) => {
  const docRef = doc(db, 'players', playerId);
  await updateDoc(docRef, playerData);
};

export const updatePlayerScore = async (playerId: string, points: number) => {
  const docRef = doc(db, 'players', playerId);
  await updateDoc(docRef, {
    totalScore: increment(points),
  });
};

export const deletePlayer = async (playerId: string) => {
  const docRef = doc(db, 'players', playerId);
  await deleteDoc(docRef);
};

// Answer submission
export const submitAnswer = async (
  sessionId: string,
  playerId: string,
  playerName: string,
  questionId: string,
  roundId: string,
  answerIndex: number,
  isCorrect: boolean,
  timeSpent: number,
  pointsEarned: number
): Promise<string> => {
  // Check if player already answered this question
  const existingAnswer = await getPlayerAnswer(sessionId, playerId, questionId);
  if (existingAnswer) {
    throw new Error('Player has already answered this question');
  }
  
  const docRef = await addDoc(collection(db, 'answers'), {
    sessionId,
    playerId,
    playerName,
    questionId,
    roundId,
    answerIndex,
    isCorrect,
    timestamp: Timestamp.now(),
    timeSpent,
    pointsEarned,
  });
  
  // Update player score
  if (pointsEarned > 0) {
    await updatePlayerScore(playerId, pointsEarned);
  }
  
  // Update statistics
  await updateQuestionStatistics(questionId, isCorrect, timeSpent);
  
  return docRef.id;
};

export const getPlayerAnswer = async (
  sessionId: string,
  playerId: string,
  questionId: string
): Promise<Answer | null> => {
  const q = query(
    collection(db, 'answers'),
    where('sessionId', '==', sessionId),
    where('playerId', '==', playerId),
    where('questionId', '==', questionId)
  );
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      timestamp: data.timestamp.toDate(),
    } as Answer;
  }
  return null;
};

export const getAnswersByQuestion = async (
  sessionId: string,
  questionId: string
): Promise<Answer[]> => {
  const q = query(
    collection(db, 'answers'),
    where('sessionId', '==', sessionId),
    where('questionId', '==', questionId),
    orderBy('timestamp', 'asc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp.toDate(),
    } as Answer;
  });
};

export const getAnswersByPlayer = async (
  sessionId: string,
  playerId: string
): Promise<Answer[]> => {
  const q = query(
    collection(db, 'answers'),
    where('sessionId', '==', sessionId),
    where('playerId', '==', playerId),
    orderBy('timestamp', 'asc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      timestamp: data.timestamp.toDate(),
    } as Answer;
  });
};

// Statistics
export const updateQuestionStatistics = async (
  questionId: string,
  isCorrect: boolean,
  timeSpent: number
) => {
  const docRef = doc(db, 'statistics', questionId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    const timesAsked = data.timesAsked + 1;
    const totalTime = data.averageTimeSpent * data.timesAsked + timeSpent;
    
    await updateDoc(docRef, {
      timesAsked: increment(1),
      correctAnswers: increment(isCorrect ? 1 : 0),
      wrongAnswers: increment(isCorrect ? 0 : 1),
      averageTimeSpent: totalTime / timesAsked,
    });
  } else {
    await setDoc(docRef, {
      questionId,
      timesAsked: 1,
      correctAnswers: isCorrect ? 1 : 0,
      wrongAnswers: isCorrect ? 0 : 1,
      averageTimeSpent: timeSpent,
    });
  }
};

export const getQuestionStatistics = async (
  questionId: string
): Promise<QuestionStatistics | null> => {
  const docRef = doc(db, 'statistics', questionId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      questionId: data.questionId,
      timesAsked: data.timesAsked,
      correctAnswers: data.correctAnswers,
      wrongAnswers: data.wrongAnswers,
      averageTimeSpent: data.averageTimeSpent,
    } as QuestionStatistics;
  }
  return null;
};

// Realtime listeners
export const subscribeToPlayers = (
  sessionId: string,
  callback: (players: Player[]) => void
) => {
  // Use query without orderBy to avoid index requirement
  // We'll sort manually instead
  const q = query(
    collection(db, 'players'),
    where('sessionId', '==', sessionId)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const players = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        joinedAt: data.joinedAt.toDate(),
      } as Player;
    });
    // Sort by score descending
    players.sort((a, b) => b.totalScore - a.totalScore);
    console.log('Players listener fired:', players.length, 'players for session', sessionId);
    callback(players);
  }, (error) => {
    console.error('Error in players listener:', error);
    // Return empty array on error
    callback([]);
  });
};

export const subscribeToAnswers = (
  sessionId: string,
  questionId: string,
  callback: (answers: Answer[]) => void
) => {
  // Query without orderBy to avoid index requirement
  const q = query(
    collection(db, 'answers'),
    where('sessionId', '==', sessionId),
    where('questionId', '==', questionId)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const answers = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp.toDate(),
      } as Answer;
    });
    // Sort by timestamp manually
    answers.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    console.log('Answers listener fired:', answers.length, 'answers for question', questionId);
    callback(answers);
  }, (error) => {
    console.error('Error in answers listener:', error);
    callback([]);
  });
};

