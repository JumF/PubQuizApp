import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { Button } from '../components/shared/Button';
import { Loading } from '../components/shared/Loading';
import { getAllQuizzes } from '../services/quizService'; // Corrected import
import { createSession } from '../services/sessionService';
import type { Quiz } from '../types'; // Assuming Quiz type has roundCount and questionsPerRound

export const SessionStarter: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [timerDuration, setTimerDuration] = useState(30);
  const [autoClose, setAutoClose] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [startingSession, setStartingSession] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const fetchedQuizzes = await getAllQuizzes(); // Corrected function call
      setQuizzes(fetchedQuizzes);
      if (fetchedQuizzes.length > 0) {
        setSelectedQuizId(fetchedQuizzes[0].id);
      }
    } catch (error) {
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    if (!selectedQuizId) {
      alert('Selecteer een quiz');
      return;
    }

    setStartingSession(true);
    try {
      const sessionId = await createSession(selectedQuizId, timerDuration, autoClose);
      setSession(sessionId);
      navigate(`/quizmaster/${sessionId}`); // Navigate after session is set
    } catch (error: any) {
      console.error('Error starting session:', error);
      const errorMessage = error?.message || 'Onbekende fout';
      alert(`Fout bij starten van sessie: ${errorMessage}`);
    } finally {
      setStartingSession(false);
    }
  };

  if (loading) {
    return <Loading text="Quizzen laden..." />;
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
          <Button variant="blue" onClick={() => navigate('/admin/quiz/new')}>
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
              value={selectedQuizId || ''}
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
          <div className="pt-4 flex gap-4 justify-end">
            <Button
              onClick={() => navigate('/admin')}
              variant="secondary"
            >
              Terug naar Admin Panel
            </Button>
            <Button
              onClick={handleStartSession}
              disabled={!selectedQuizId || startingSession}
              variant="blue"
            >
              Start Sessie
            </Button>
          </div>

          {session && (
            <div className="mt-8 bg-blue-100 rounded-2xl p-6 text-center border border-blue-200 shadow-lg">
              <h3 className="text-2xl font-bold text-blue-800 mb-4">
                Sessie gestart!
              </h3>
              <p className="text-blue-700 mb-2">
                Deel deze code met je spelers:
              </p>
              <p className="text-4xl font-bold text-blue-600 tracking-wider mb-6">
                {session.joinCode}
              </p>
              <Button
                onClick={() => navigate(`/quizmaster/${session.id}`)}
                variant="primary"
                fullWidth
              >
                Naar Quizmaster Panel
              </Button>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

