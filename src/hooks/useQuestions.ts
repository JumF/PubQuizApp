import { useEffect, useState } from 'react';
import type { Question } from '../types';
import { getQuestions } from '../services/quizService';

export const useQuestions = (quizId: string | null, roundId: string | null) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!quizId || !roundId) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    const loadQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        const qs = await getQuestions(quizId, roundId);
        setQuestions(qs);
      } catch (err) {
        setError('Failed to load questions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [quizId, roundId]);

  return { questions, loading, error };
};

