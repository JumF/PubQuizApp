import React, { useState, useEffect } from 'react';
import type { Session, Player, Question, Round } from '../../types';
import { Layout } from '../shared/Layout';
import { formatTime } from '../../utils/helpers';
import { calculatePoints } from '../../utils/scoring';
import { submitAnswer, getPlayerAnswer } from '../../services/playerService';

interface QuestionViewProps {
  session: Session;
  player: Player;
  question: Question;
  round: Round;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  session,
  player,
  question,
  round,
  questionNumber,
  totalQuestions,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    checkExistingAnswer();
  }, [question.id]);

  useEffect(() => {
    if (!session.questionStartTime || session.isQuestionClosed) {
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - session.questionStartTime!.getTime()) / 1000);
      const remaining = Math.max(0, session.timerDuration - elapsed);
      setTimeRemaining(remaining);
    }, 100);

    return () => clearInterval(interval);
  }, [session.questionStartTime, session.isQuestionClosed, session.timerDuration]);

  const checkExistingAnswer = async () => {
    try {
      const existingAnswer = await getPlayerAnswer(session.id, player.id, question.id);
      if (existingAnswer) {
        setSubmitted(true);
        setSelectedAnswer(existingAnswer.answerIndex);
      } else {
        setSubmitted(false);
        setSelectedAnswer(null);
      }
    } catch (error) {
      console.error('Error checking existing answer:', error);
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer === null) {
      setError('Selecteer een antwoord');
      return;
    }

    if (session.isQuestionClosed) {
      setError('Vraag is gesloten');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const timeSpent = Math.floor((Date.now() - session.questionStartTime!.getTime()) / 1000);
      const isCorrect = selectedAnswer === question.correctIndex;
      const points = isCorrect ? calculatePoints(timeSpent, session.timerDuration) : 0;

      await submitAnswer(
        session.id,
        player.id,
        player.name,
        question.id,
        round.id,
        selectedAnswer,
        isCorrect,
        timeSpent,
        points
      );

      setSubmitted(true);
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      setError(error.message || 'Fout bij indienen van antwoord');
    } finally {
      setSubmitting(false);
    }
  };

  const percentage = (timeRemaining / session.timerDuration) * 100;
  const isLowTime = timeRemaining <= 10 && timeRemaining > 0;

  const answerColorGradients = [
    'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
    'linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)',
    'linear-gradient(135deg, #1A1A1A 0%, #303030 100%)',
    'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)' // Oranje voor de 4e optie
  ];
  
  return (
    <Layout maxWidth="md">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', animation: 'fadeInUp 0.6s ease-out' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.9), rgba(255, 255, 255, 0.6))',
          borderRadius: '20px',
          padding: '28px',
          border: '1px solid rgba(255, 107, 53, 0.5)',
          boxShadow: '0 20px 40px rgba(255, 107, 53, 0.2)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            filter: 'blur(60px)'
          }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: '700', color: '#1A1A1A', marginBottom: '8px', fontFamily: 'Orbitron, Chakra Petch' }}>{round.name}</h2>
              <p style={{ color: 'rgba(26, 26, 26, 0.85)', fontSize: '14px' }}>Vraag {questionNumber} van {totalQuestions}</p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textAlign: 'right'
            }}>
              <div style={{ fontSize: '12px', opacity: 0.9, color: '#1A1A1A', fontWeight: '600' }}>Je Score</div>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#1A1A1A', marginTop: '4px' }}>{player.totalScore}</div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.9), rgba(229, 90, 43, 0.8))',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(255, 107, 53, 0.5)',
          boxShadow: isLowTime ? '0 0 30px rgba(255, 107, 53, 0.4)' : '0 10px 30px rgba(255, 107, 53, 0.2)',
          backdropFilter: 'blur(20px)',
          animation: isLowTime ? 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: 'white' }}>⏱️ Tijd over:</span>
            <span style={{
              fontSize: '48px',
              fontWeight: '700',
              color: 'white',
              fontFamily: 'monospace',
              animation: isLowTime ? 'pulse 1s ease-in-out infinite' : 'none'
            }}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '999px',
            height: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            <div
              style={{
                height: '100%',
                background: '#FFFFFF',
                transition: 'all 0.3s ease',
                width: `${percentage}%`,
                borderRadius: '999px'
              }}
            />
          </div>
        </div>

        {/* Question Panel */}
        <div style={{
          background: 'rgba(30, 30, 30, 0.95)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255, 107, 53, 0.3)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(20px)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-80px',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(255, 255, 255, 0.1))',
            borderRadius: '50%',
            filter: 'blur(80px)'
          }}></div>

          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '28px',
            lineHeight: '1.5',
            position: 'relative',
            zIndex: 1
          }}>
            {question.text}
          </h3>

          {/* Answers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
            {question.answers.map((answer, idx) => (
              <button
                key={idx}
                onClick={() => !submitted && !session.isQuestionClosed && setSelectedAnswer(idx)}
                disabled={submitted || session.isQuestionClosed}
                style={{
                  width: '100%',
                  padding: '18px',
                  textAlign: 'left',
                  border: 'none',
                  borderRadius: '16px',
                  background: selectedAnswer === idx 
                    ? answerColorGradients[idx]
                    : 'rgba(255, 255, 255, 0.1)',
                  color: selectedAnswer === idx ? (idx === 1 ? '#1A1A1A' : 'white') : 'rgba(248, 250, 252, 0.9)',
                  fontWeight: selectedAnswer === idx ? '700' : '600',
                  cursor: (submitted || session.isQuestionClosed) ? 'not-allowed' : 'pointer',
                  opacity: (submitted || session.isQuestionClosed) ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  transform: selectedAnswer === idx ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: selectedAnswer === idx ? `0 10px 30px ${idx === 0 ? 'rgba(255, 107, 53, 0.4)' : idx === 1 ? 'rgba(255, 255, 255, 0.4)' : idx === 2 ? 'rgba(26, 26, 26, 0.4)' : 'rgba(255, 107, 53, 0.4)'}` : '0 4px 12px rgba(0, 0, 0, 0.2)',
                  border: selectedAnswer === idx ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}
                onMouseEnter={(e) => {
                  if (!submitted && !session.isQuestionClosed) {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(255, 107, 53, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAnswer !== idx) {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
                  }
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '16px',
                  background: selectedAnswer === idx ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                  border: selectedAnswer === idx ? '2px solid white' : '2px solid rgba(255, 255, 255, 0.3)',
                  color: selectedAnswer === idx ? (idx === 1 ? '#1A1A1A' : 'white') : 'white',
                  flexShrink: 0
                }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span style={{ flex: 1, fontSize: '16px' }}>{answer}</span>
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))',
              border: '2px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '16px',
              padding: '16px',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: '600',
              color: 'rgba(254, 202, 202, 1)',
              marginBottom: '20px',
              animation: 'fadeInUp 0.3s ease-out',
              position: 'relative',
              zIndex: 1
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            {submitted ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                fontWeight: '700',
                fontSize: '15px',
                color: 'rgba(167, 243, 208, 1)',
                backdropFilter: 'blur(10px)'
              }}>
                ✅ Antwoord ingediend!
              </div>
            ) : session.isQuestionClosed ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '16px',
                textAlign: 'center',
                fontWeight: '600',
                fontSize: '15px',
                color: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)'
              }}>
                🔒 Vraag gesloten
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null || submitting}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  fontSize: '16px',
                  fontWeight: '700',
                  borderRadius: '16px',
                  cursor: (selectedAnswer === null || submitting) ? 'not-allowed' : 'pointer',
                  opacity: (selectedAnswer === null || submitting) ? 0.6 : 1,
                  transition: 'all 0.3s ease',
                  boxShadow: (selectedAnswer === null || submitting) ? 'none' : '0 10px 30px rgba(255, 107, 53, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  if (selectedAnswer !== null && !submitting) {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 15px 40px rgba(255, 107, 53, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  if (selectedAnswer !== null && !submitting) {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(255, 107, 53, 0.3)';
                  }
                }}
              >
                {submitting ? (
                  <>
                    <svg style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                    <span>Indienen...</span>
                  </>
                ) : (
                  <>
                    <svg style={{ width: '18px', height: '18px' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>✓ Antwoord Indienen</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

