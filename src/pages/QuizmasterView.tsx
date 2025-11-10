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
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth >= 1024 ? '2fr 1fr' : '1fr',
        gap: '24px',
        animation: 'fadeInUp 0.6s ease-out'
      }}>
        {/* Main Control Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Session Info */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.9), rgba(255, 255, 255, 0.6))',
            borderRadius: '24px',
            padding: '28px',
            border: '1px solid rgba(255, 107, 53, 0.5)',
            boxShadow: '0 20px 40px rgba(255, 107, 53, 0.2)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '250px',
              height: '250px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              filter: 'blur(80px)'
            }}></div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
              <div>
                <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1A1A1A', marginBottom: '16px', fontFamily: 'Orbitron, Chakra Petch' }}>{quiz.name}</h2>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '16px 24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'inline-block'
                }}>
                  <p style={{ color: 'rgba(26, 26, 26, 0.8)', fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Join Code</p>
                  <p style={{ fontSize: '56px', fontWeight: '700', color: '#1A1A1A', fontFamily: 'monospace', letterSpacing: '4px' }}>{session.joinCode}</p>
                </div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '12px 20px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                textAlign: 'right'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'rgba(26, 26, 26, 0.9)', marginBottom: '8px', textTransform: 'uppercase' }}>Status</div>
                <div style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: session.status === 'waiting' ? '#FF6B35' : session.status === 'active' ? '#10B981' : '#64748B'
                }}>
                  {session.status === 'waiting' ? '🟡 Wachten' :
                   session.status === 'active' ? '🟢 Actief' : '⚪ Beëindigd'}
                </div>
              </div>
            </div>

            {session.status === 'waiting' && (
              <div style={{
                background: 'rgba(30, 30, 30, 0.9)',
                borderRadius: '16px',
                padding: '20px',
                marginTop: '20px',
                border: '2px solid rgba(255, 107, 53, 0.4)',
                position: 'relative',
                zIndex: 1
              }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '16px', fontWeight: '600', fontSize: '16px' }}>
                  ⏳ Wachtend op spelers... ({players.length} speler{players.length !== 1 ? 's' : ''} gejoined)
                </p>
                <Button
                  variant="primary"
                  onClick={handleStartSession}
                  fullWidth
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
            <div style={{
              background: 'rgba(30, 30, 30, 0.8)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              boxShadow: '0 10px 30px rgba(239, 68, 68, 0.1)'
            }}>
              <Button
                variant="danger"
                onClick={handleEndSession}
                fullWidth
              >
                ⏹️ Beëindig Quiz
              </Button>
            </div>
          )}
        </div>

        {/* Live Scoreboard */}
        <div style={{
          animation: 'slideInRight 0.6s ease-out'
        }}>
          <LiveScoreboard players={players} session={session} />
        </div>
      </div>
    </Layout>
  );
};

