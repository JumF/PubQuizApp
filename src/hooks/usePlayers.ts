import { useEffect, useState } from 'react';
import type { Player } from '../types';
import { subscribeToPlayers } from '../services/playerService';

export const usePlayersListener = (sessionId: string | null) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setPlayers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log('Setting up players listener for session:', sessionId);
    
    const unsubscribe = subscribeToPlayers(sessionId, (players) => {
      console.log('Players updated:', players.length, 'players');
      setPlayers(players);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up players listener');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [sessionId]);

  return { players, loading };
};

