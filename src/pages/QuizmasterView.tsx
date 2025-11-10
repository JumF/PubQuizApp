import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { Button } from '../components/shared/Button';
import { Loading } from '../components/shared/Loading';
import { QuestionControl } from '../components/quizmaster/QuestionControl';
import { LiveScoreboard } from '../components/quizmaster/LiveScoreboard';
import { AnswerOverview } from '../components/quizmaster/AnswerOverview';
import { useSessionListener } from '../hooks/useSession';
import { usePlayersListener } from '../hooks/usePlayers';
import { getQuiz, getRounds, getQuestions } from '../services/quizService';
import { startSession, endSession } from '../services/sessionService';
import type { Quiz, Round, Question } from '../types';

export const QuizmasterView: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useSessionListener(sessionId || null);
  const { players } = usePlayersListener(sessionId || null);
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [allQuestions, setAllQuestions] = useState<Record<string, Question[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      loadQuizData();
    }
  }, [session]);

  const loadQuizData = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const quizData = await getQuiz(session.quizId);
      if (!quizData) {
        alert('Quiz niet gevonden');
        navigate('/');
        return;
      }
      
      setQuiz(quizData);
      
      const roundsData = await getRounds(session.quizId);
      setRounds(roundsData);

      // Load all questions for all rounds
      const questionsMap: Record<string, Question[]> = {};
      for (const round of roundsData) {
        const questions = await getQuestions(session.quizId, round.id);
        questionsMap[round.id] = questions;
      }
      setAllQuestions(questionsMap);
    } catch (error) {
      console.error('Error loading quiz data:', error);
      alert('Fout bij laden van quiz data');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    if (!sessionId) return;
    try {
      await startSession(sessionId);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const handleEndSession = async () => {
    if (!sessionId) return;
    if (!window.confirm('Weet je zeker dat je de quiz wilt beëindigen?')) return;
    
    try {
      await endSession(sessionId);
      navigate(`/results/${sessionId}`);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  if (sessionLoading || loading) {
    return <Loading text="Quiz laden..." />;
  }

  if (!session || !quiz) {
    return (
      <Layout>
        <div className="text-center">
          <p className="text-red-600">Sessie niet gevonden</p>
          <Button onClick={() => navigate('/')}>Terug naar Home</Button>
        </div>
      </Layout>
    );
  }

  const currentRound = rounds[session.currentRound];
  const currentQuestions = currentRound ? allQuestions[currentRound.id] || [] : [];
  const currentQuestion = currentQuestions[session.currentQuestion];

  return (
    <Layout title="🎮 Quizmaster Control" maxWidth="full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeInUp">
        {/* Main Control Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Session Info */}
          <div className="bg-blue-600 rounded-2xl shadow-xl p-6 border border-blue-800 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full mix-blend-overlay filter blur-xl"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{quiz.name}</h2>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white border-opacity-30 inline-block">
                  <p className="text-sm font-semibold text-white opacity-80 mb-1">Join Code</p>
                  <p className="text-4xl font-bold text-white tracking-wider">{session.joinCode}</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white border-opacity-30 text-right">
                <p className="text-sm font-semibold text-white opacity-80 mb-1">Status</p>
                <p className={`text-xl font-bold ${
                  session.status === 'waiting' ? 'text-yellow-300' :
                  session.status === 'active' ? 'text-green-300' :
                  'text-gray-300'
                }`}>
                  {session.status === 'waiting' ? '🟡 Wachten' :
                   session.status === 'active' ? '🟢 Actief' : '⚪ Beëindigd'}
                </p>
              </div>
            </div>

            {session.status === 'waiting' && (
              <div className="mt-6 p-4 bg-blue-700 rounded-xl border border-blue-600 shadow-inner relative z-10">
                <p className="text-white opacity-90 mb-4 text-lg font-semibold">
                  ⏳ Wachtend op spelers... ({players.length} speler{players.length !== 1 ? 's' : ''} gejoined)
                </p>
                <Button
                  variant="primary"
                  onClick={handleStartSession}
                  fullWidth
                  size="lg"
                >
                  ▶️ Start Quiz
                </Button>
              </div>
            )}
          </div>

          {/* Question Control */}
          {session.status === 'active' && currentRound && currentQuestion && (
            <>
              <QuestionControl
                session={session}
                quiz={quiz}
                currentRound={currentRound}
                currentQuestion={currentQuestion}
                rounds={rounds}
                allQuestions={allQuestions}
              />
              
              {/* Answer Overview */}
              {session.questionStartTime && (
                <AnswerOverview
                  sessionId={session.id}
                  questionId={currentQuestion.id}
                  question={currentQuestion}
                />
              )}
            </>
          )}

          {/* End Session */}
          {session.status === 'active' && (
            <div className="p-6 bg-red-600 rounded-2xl shadow-xl border border-red-700">
              <Button
                variant="danger"
                onClick={handleEndSession}
                fullWidth
                size="lg"
              >
                ⏹️ Beëindig Quiz
              </Button>
            </div>
          )}
        </div>

        {/* Live Scoreboard */}
        <div className="lg:col-span-1 animate-slideInRight">
          <LiveScoreboard players={players} session={session} />
        </div>
      </div>
    </Layout>
  );
};

