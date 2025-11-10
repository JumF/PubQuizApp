import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { Button } from '../components/shared/Button';
import { Loading } from '../components/shared/Loading';
import type { Quiz } from '../types';
import { getAllQuizzes } from '../services/quizService';
import { createSession } from '../services/sessionService';

export const SessionStarter: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [timerDuration, setTimerDuration] = useState(30);
  const [autoClose, setAutoClose] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const data = await getAllQuizzes();
      setQuizzes(data);
      if (data.length > 0) {
        setSelectedQuizId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    if (!selectedQuizId) {
      alert('Selecteer een quiz');
      return;
    }

    setCreating(true);
    try {
      const sessionId = await createSession(selectedQuizId, timerDuration, autoClose);
      navigate(`/quizmaster/${sessionId}`);
    } catch (error: any) {
      console.error('Error creating session:', error);
      const errorMessage = error?.message || 'Onbekende fout';
      alert(`Fout bij aanmaken van sessie: ${errorMessage}`);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <LoadingScreen text="Quizzen laden..." />;
  }

  return (
    <Layout title="Nieuwe Quiz Sessie Starten" maxWidth="md">
      <div className="mb-6">
        <Button variant="secondary" onClick={() => navigate('/')}>← Terug</Button>
      </div>

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-200">
          <p className="text-gray-700 font-medium mb-4">
            Er zijn nog geen quizzen beschikbaar.
          </p>
          <Button variant="blue" onClick={() => navigate('/admin')}>
            Naar Admin Panel
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
          {/* Quiz Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Selecteer Quiz
            </label>
            <select
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 font-medium transition-all duration-200"
            >
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.name} ({quiz.roundCount} rondes, {quiz.questionsPerRound} vragen/ronde)
                </option>
              ))}
            </select>
          </div>

          {/* Timer Duration */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Timer Duur (seconden)
            </label>
            <input
              type="number"
              min="5"
              max="300"
              value={timerDuration}
              onChange={(e) => setTimerDuration(parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 font-medium transition-all duration-200"
            />
          </div>

          {/* Auto Close */}
          <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <input
              type="checkbox"
              id="autoClose"
              checked={autoClose}
              onChange={(e) => setAutoClose(e.target.checked)}
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 border-2 border-gray-300"
            />
            <label htmlFor="autoClose" className="text-sm font-medium text-gray-700">
              Sluit vraag automatisch na afloop timer
            </label>
          </div>

          {/* Create Button */}
          <div className="pt-4">
            <Button
              variant="blue"
              onClick={handleCreateSession}
              disabled={creating}
              fullWidth
              size="lg"
            >
              {creating ? 'Sessie Aanmaken...' : '🎮 Start Sessie'}
            </Button>
          </div>
        </div>
      )}
    </Layout>
  );
};

const LoadingScreen: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loading text={text} size="lg" />
    </div>
  );
};

