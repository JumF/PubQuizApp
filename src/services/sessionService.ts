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
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Session } from '../types';

// Generate a random 4-digit join code
const generateJoinCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Check if join code is unique
const isJoinCodeUnique = async (joinCode: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'sessions'),
      where('joinCode', '==', joinCode),
      where('status', 'in', ['waiting', 'active'])  // Changed from != to 'in' for better compatibility
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error('Error checking join code uniqueness:', error);
    // If query fails, assume it's unique (for testing)
    return true;
  }
};

// Generate unique join code
const generateUniqueJoinCode = async (): Promise<string> => {
  let joinCode = generateJoinCode();
  let attempts = 0;
  
  while (!await isJoinCodeUnique(joinCode) && attempts < 10) {
    joinCode = generateJoinCode();
    attempts++;
  }
  
  return joinCode;
};

// Session CRUD
export const createSession = async (
  quizId: string,
  timerDuration: number = 30,
  autoCloseOnTimerEnd: boolean = true
): Promise<string> => {
  try {
    const joinCode = await generateUniqueJoinCode();
    const now = Timestamp.now();
    
    const docRef = await addDoc(collection(db, 'sessions'), {
      quizId,
      status: 'waiting',
      joinCode,
      currentRound: 0,
      currentQuestion: 0,
      questionStartTime: null,
      isQuestionClosed: false,
      timerDuration,
      autoCloseOnTimerEnd,
      createdAt: now,
    });
    
    return docRef.id;
  } catch (error: any) {
    console.error('Error creating session:', error);
    throw new Error(`Failed to create session: ${error.message || error.code || 'Unknown error'}`);
  }
};

export const getSession = async (sessionId: string): Promise<Session | null> => {
  const docRef = doc(db, 'sessions', sessionId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      startedAt: data.startedAt?.toDate(),
      endedAt: data.endedAt?.toDate(),
      questionStartTime: data.questionStartTime?.toDate() || null,
    } as Session;
  }
  return null;
};

export const getSessionByJoinCode = async (joinCode: string): Promise<Session | null> => {
  try {
    // Query for sessions with matching join code and active status
    const q = query(
      collection(db, 'sessions'),
      where('joinCode', '==', joinCode),
      where('status', 'in', ['waiting', 'active'])  // Use 'in' instead of '!='
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        startedAt: data.startedAt?.toDate(),
        endedAt: data.endedAt?.toDate(),
        questionStartTime: data.questionStartTime?.toDate() || null,
      } as Session;
    }
    return null;
  } catch (error: any) {
    console.error('Error getting session by join code:', error);
    // If query fails (e.g., missing index), try without status filter
    try {
      const q = query(
        collection(db, 'sessions'),
        where('joinCode', '==', joinCode)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        // Filter out ended sessions manually
        if (data.status === 'ended') {
          return null;
        }
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          startedAt: data.startedAt?.toDate(),
          endedAt: data.endedAt?.toDate(),
          questionStartTime: data.questionStartTime?.toDate() || null,
        } as Session;
      }
    } catch (fallbackError) {
      console.error('Fallback query also failed:', fallbackError);
    }
    return null;
  }
};

export const updateSession = async (sessionId: string, sessionData: Partial<Session>) => {
  const docRef = doc(db, 'sessions', sessionId);
  const updateData: any = { ...sessionData };
  
  // Convert Date objects to Timestamp
  if (updateData.questionStartTime instanceof Date) {
    updateData.questionStartTime = Timestamp.fromDate(updateData.questionStartTime);
  }
  if (updateData.startedAt instanceof Date) {
    updateData.startedAt = Timestamp.fromDate(updateData.startedAt);
  }
  if (updateData.endedAt instanceof Date) {
    updateData.endedAt = Timestamp.fromDate(updateData.endedAt);
  }
  
  await updateDoc(docRef, updateData);
};

export const deleteSession = async (sessionId: string) => {
  const docRef = doc(db, 'sessions', sessionId);
  await deleteDoc(docRef);
};

// Session control functions
export const startSession = async (sessionId: string) => {
  await updateSession(sessionId, {
    status: 'active',
    startedAt: new Date(),
  });
};

export const endSession = async (sessionId: string) => {
  await updateSession(sessionId, {
    status: 'ended',
    endedAt: new Date(),
  });
};

export const startQuestion = async (sessionId: string) => {
  await updateSession(sessionId, {
    questionStartTime: new Date(),
    isQuestionClosed: false,
  });
};

export const closeQuestion = async (sessionId: string) => {
  await updateSession(sessionId, {
    isQuestionClosed: true,
  });
};

export const nextQuestion = async (
  sessionId: string,
  _currentRound: number,
  currentQuestion: number,
  _totalQuestions: number
) => {
  await updateSession(sessionId, {
    currentQuestion: currentQuestion + 1,
    questionStartTime: null,
    isQuestionClosed: false,
  });
};

export const nextRound = async (
  sessionId: string,
  currentRound: number
) => {
  await updateSession(sessionId, {
    currentRound: currentRound + 1,
    currentQuestion: 0,
    questionStartTime: null,
    isQuestionClosed: false,
  });
};

// Realtime listeners
export const subscribeToSession = (
  sessionId: string,
  callback: (session: Session | null) => void
) => {
  const docRef = doc(db, 'sessions', sessionId);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback({
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        startedAt: data.startedAt?.toDate(),
        endedAt: data.endedAt?.toDate(),
        questionStartTime: data.questionStartTime?.toDate() || null,
      } as Session);
    } else {
      callback(null);
    }
  });
};

