import { useEffect, useState } from 'react';
import type { Session } from '../types';
import { subscribeToSession } from '../services/sessionService';

export const useSessionListener = (sessionId: string | null) => {
  const [session, setSession] = useState<Session | null>(null);
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

  return { session, loading };
};

