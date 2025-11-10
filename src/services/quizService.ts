import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Quiz, Round, Question } from '../types';

// Quiz CRUD
export const createQuiz = async (quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, 'quizzes'), {
    ...quizData,
    createdAt: now,
    updatedAt: now,
  });
  return docRef.id;
};

export const getQuiz = async (quizId: string): Promise<Quiz | null> => {
  const docRef = doc(db, 'quizzes', quizId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Quiz;
  }
  return null;
};

export const getAllQuizzes = async (): Promise<Quiz[]> => {
  const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
    } as Quiz;
  });
};

export const updateQuiz = async (quizId: string, quizData: Partial<Quiz>) => {
  const docRef = doc(db, 'quizzes', quizId);
  await updateDoc(docRef, {
    ...quizData,
    updatedAt: Timestamp.now(),
  });
};

export const deleteQuiz = async (quizId: string) => {
  // Delete all rounds and questions first
  const rounds = await getRounds(quizId);
  for (const round of rounds) {
    await deleteRound(quizId, round.id);
  }
  
  // Delete the quiz
  const docRef = doc(db, 'quizzes', quizId);
  await deleteDoc(docRef);
};

// Round CRUD
export const createRound = async (quizId: string, roundData: Omit<Round, 'id' | 'quizId'>) => {
  const docRef = await addDoc(collection(db, 'quizzes', quizId, 'rounds'), {
    ...roundData,
    quizId,
  });
  return docRef.id;
};

export const getRound = async (quizId: string, roundId: string): Promise<Round | null> => {
  const docRef = doc(db, 'quizzes', quizId, 'rounds', roundId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Round;
  }
  return null;
};

export const getRounds = async (quizId: string): Promise<Round[]> => {
  const q = query(
    collection(db, 'quizzes', quizId, 'rounds'),
    orderBy('order', 'asc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Round));
};

export const updateRound = async (quizId: string, roundId: string, roundData: Partial<Round>) => {
  const docRef = doc(db, 'quizzes', quizId, 'rounds', roundId);
  await updateDoc(docRef, roundData);
};

export const deleteRound = async (quizId: string, roundId: string) => {
  // Delete all questions first
  const questions = await getQuestions(quizId, roundId);
  const batch = writeBatch(db);
  
  questions.forEach(question => {
    const questionRef = doc(db, 'quizzes', quizId, 'rounds', roundId, 'questions', question.id);
    batch.delete(questionRef);
  });
  
  await batch.commit();
  
  // Delete the round
  const docRef = doc(db, 'quizzes', quizId, 'rounds', roundId);
  await deleteDoc(docRef);
};

// Question CRUD
export const createQuestion = async (
  quizId: string,
  roundId: string,
  questionData: Omit<Question, 'id' | 'quizId' | 'roundId'>
) => {
  const docRef = await addDoc(
    collection(db, 'quizzes', quizId, 'rounds', roundId, 'questions'),
    {
      ...questionData,
      quizId,
      roundId,
    }
  );
  return docRef.id;
};

export const getQuestion = async (
  quizId: string,
  roundId: string,
  questionId: string
): Promise<Question | null> => {
  const docRef = doc(db, 'quizzes', quizId, 'rounds', roundId, 'questions', questionId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Question;
  }
  return null;
};

export const getQuestions = async (quizId: string, roundId: string): Promise<Question[]> => {
  const q = query(
    collection(db, 'quizzes', quizId, 'rounds', roundId, 'questions'),
    orderBy('order', 'asc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Question));
};

export const updateQuestion = async (
  quizId: string,
  roundId: string,
  questionId: string,
  questionData: Partial<Question>
) => {
  const docRef = doc(db, 'quizzes', quizId, 'rounds', roundId, 'questions', questionId);
  await updateDoc(docRef, questionData);
};

export const deleteQuestion = async (quizId: string, roundId: string, questionId: string) => {
  const docRef = doc(db, 'quizzes', quizId, 'rounds', roundId, 'questions', questionId);
  await deleteDoc(docRef);
};

// Batch operations for creating full quiz structure
export const createFullQuiz = async (
  quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>,
  rounds: Omit<Round, 'id' | 'quizId'>[],
  questionsByRound: Record<number, Omit<Question, 'id' | 'quizId' | 'roundId'>[]>
) => {
  const quizId = await createQuiz(quiz);
  
  for (let i = 0; i < rounds.length; i++) {
    const roundId = await createRound(quizId, rounds[i]);
    const questions = questionsByRound[i] || [];
    
    for (const question of questions) {
      await createQuestion(quizId, roundId, question);
    }
  }
  
  return quizId;
};

