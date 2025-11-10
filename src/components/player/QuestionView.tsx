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

  const answerColors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-500',
    'bg-gradient-to-br from-red-500 to-red-600'
  ];
  
  return (
    <Layout maxWidth="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl shadow-xl p-6 border border-purple-800">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-2xl font-bold text-white">{round.name}</h2>
              <p className="text-white opacity-90">
                Vraag {questionNumber} van {totalQuestions}
              </p>
            </div>
            <div className="text-right bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white border-opacity-30">
              <div className="text-sm opacity-90 text-white">Je Score</div>
              <div className="text-3xl font-bold text-white">{player.totalScore}</div>
            </div>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl p-4 border border-red-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-white">Tijd over:</span>
            <span className={`text-4xl font-bold text-white ${
              isLowTime ? 'animate-pulse' : ''
            }`}>
              {formatTime(timeRemaining)}
            </span>
          </div>
          <div className="w-full bg-white bg-opacity-20 backdrop-blur-sm rounded-full h-4 overflow-hidden border border-white border-opacity-30">
            <div
              className={`h-full transition-all duration-300 ${
                isLowTime ? 'bg-yellow-300' : 'bg-white'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Question Panel */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-300">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {question.text}
          </h3>

          {/* Answers */}
          <div className="space-y-3">
            {question.answers.map((answer, idx) => (
              <button
                key={idx}
                onClick={() => !submitted && !session.isQuestionClosed && setSelectedAnswer(idx)}
                disabled={submitted || session.isQuestionClosed}
                className={`w-full p-4 text-left rounded-xl transition-all duration-200 transform ${
                  selectedAnswer === idx
                    ? `${answerColors[idx]} text-white shadow-lg scale-[1.02]`
                    : 'bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md'
                } ${
                  (submitted || session.isQuestionClosed) ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-2 ${
                  selectedAnswer === idx 
                    ? 'bg-white bg-opacity-30 border-white text-white' 
                    : 'bg-gray-200 border-gray-300 text-gray-700'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="flex-1 font-semibold text-lg">{answer}</span>
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-center font-semibold">
                ✓ Antwoord ingediend!
              </div>
            ) : session.isQuestionClosed ? (
              <div className="bg-gray-100 border border-gray-200 text-gray-700 px-4 py-3 rounded-xl text-center font-medium">
                Vraag gesloten
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={selectedAnswer === null || submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-blue-500/30"
              >
                {submitting ? 'Indienen...' : '✓ Antwoord Indienen'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

