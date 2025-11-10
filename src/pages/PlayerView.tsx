import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { Loading } from '../components/shared/Loading';
import { QuestionView } from '../components/player/QuestionView';
import { WaitingScreen } from '../components/player/WaitingScreen';
import { useSessionListener } from '../hooks/useSession';
import { getPlayer } from '../services/playerService';
import { getQuiz, getRounds, getQuestions } from '../services/quizService';
import type { Player, Quiz, Round, Question } from '../types';

export const PlayerView: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { session, loading: sessionLoading } = useSessionListener(sessionId || null);
  
  const [player, setPlayer] = useState<Player | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [allQuestions, setAllQuestions] = useState<Record<string, Question[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayerData();
  }, []);

  useEffect(() => {
    if (session) {
      loadQuizData();
    }
  }, [session]);

  useEffect(() => {
    if (session?.status === 'ended') {
      navigate(`/results/${sessionId}`);
    }
  }, [session?.status]);

  const loadPlayerData = async () => {
    const playerId = localStorage.getItem('playerId');
    if (!playerId) {
      navigate('/play');
      return;
    }

    try {
      const playerData = await getPlayer(playerId);
      if (!playerData || playerData.sessionId !== sessionId) {
        navigate('/play');
        return;
      }
      setPlayer(playerData);
    } catch (error) {
      console.error('Error loading player:', error);
      navigate('/play');
    }
  };

  const loadQuizData = async () => {
    if (!session) return;

    setLoading(true);
    try {
      const quizData = await getQuiz(session.quizId);
      if (!quizData) return;
      
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
    } finally {
      setLoading(false);
    }
  };

  if (sessionLoading || loading || !player) {
    return <Loading text="Quiz laden..." />;
  }

  if (!session || !quiz) {
    return (
      <Layout>
        <div className="text-center text-red-600">
          Sessie niet gevonden
        </div>
      </Layout>
    );
  }

  const currentRound = rounds[session.currentRound];
  const currentQuestions = currentRound ? allQuestions[currentRound.id] || [] : [];
  const currentQuestion = currentQuestions[session.currentQuestion];

  // Waiting for session to start
  if (session.status === 'waiting') {
    return (
      <WaitingScreen
        message="Wachten tot de quizmaster de quiz start..."
        playerName={player.name}
        joinCode={session.joinCode}
      />
    );
  }

  // Waiting for next question
  if (!session.questionStartTime || session.isQuestionClosed) {
    return (
      <WaitingScreen
        message={session.isQuestionClosed ? "Vraag gesloten! Wachten op volgende vraag..." : "Wachten tot quizmaster de vraag start..."}
        playerName={player.name}
        score={player.totalScore}
      />
    );
  }

  // Show current question
  if (currentQuestion && session.status === 'active') {
    return (
      <QuestionView
        session={session}
        player={player}
        question={currentQuestion}
        round={currentRound}
        questionNumber={session.currentQuestion + 1}
        totalQuestions={currentQuestions.length}
      />
    );
  }

  return <Loading />;
};

