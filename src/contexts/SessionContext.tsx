import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '../types';
import { subscribeToSession } from '../services/sessionService';

interface SessionContextType {
  session: Session | null;
  setSessionId: (sessionId: string | null) => void;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setSession(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToSession(sessionId, (session) => {
      setSession(session);
      setLoading(false);
    });

    return unsubscribe;
  }, [sessionId]);

  return (
    <SessionContext.Provider value={{ session, setSessionId, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

