import React, { useEffect, useState } from 'react';
import type { Answer, Question } from '../../types';
import { subscribeToAnswers } from '../../services/playerService';
import { formatTime } from '../../utils/helpers';

interface AnswerOverviewProps {
  sessionId: string;
  questionId: string;
  question: Question;
}

export const AnswerOverview: React.FC<AnswerOverviewProps> = ({
  sessionId,
  questionId,
  question,
}) => {
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    if (!sessionId || !questionId) {
      setAnswers([]);
      return;
    }

    console.log('Setting up answers listener for question:', questionId);
    const unsubscribe = subscribeToAnswers(sessionId, questionId, (answers) => {
      console.log('Answers updated:', answers.length, 'answers');
      setAnswers(answers);
    });

    return () => {
      console.log('Cleaning up answers listener');
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [sessionId, questionId]);

  const getAnswerLetter = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, D
  };

  const getAnswerStats = () => {
    const total = answers.length;
    const correct = answers.filter(a => a.isCorrect).length;
    const wrong = total - correct;
    
    const answerCounts: Record<number, number> = {};
    question.answers.forEach((_, index) => {
      answerCounts[index] = answers.filter(a => a.answerIndex === index).length;
    });

    return { total, correct, wrong, answerCounts };
  };

  const stats = getAnswerStats();

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      <h3 className="text-2xl font-bold mb-4 text-gray-900">
        📊 Antwoorden Overzicht
      </h3>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm font-semibold text-gray-700 mt-1">Totaal</div>
        </div>
        <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{stats.correct}</div>
          <div className="text-sm font-semibold text-gray-700 mt-1">Correct</div>
        </div>
        <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{stats.wrong}</div>
          <div className="text-sm font-semibold text-gray-700 mt-1">Fout</div>
        </div>
      </div>

      {/* Answer Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Antwoord Verdeling:</h4>
        <div className="grid grid-cols-4 gap-3">
          {question.answers.map((_, index) => {
            const count = stats.answerCounts[index] || 0;
            const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
            const isCorrect = index === question.correctIndex;
            
            return (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isCorrect
                    ? 'bg-green-50 border-green-500 shadow-lg shadow-green-500/30'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 mb-2">
                    {getAnswerLetter(index)}
                  </div>
                  <div className="text-3xl font-bold text-blue-600">{count}</div>
                  <div className="text-xs font-semibold text-gray-600 mt-1">{percentage}%</div>
                  {isCorrect && (
                    <div className="text-xs text-green-600 font-bold mt-2">✓ Correct</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Answers */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          Individuele Antwoorden ({answers.length}):
        </h4>
        {answers.length === 0 ? (
          <div className="text-center text-gray-700 py-6 bg-gray-50 rounded-xl border-2 border-gray-200">
            <p className="font-medium">Nog geen antwoorden ontvangen</p>
            <p className="text-xs mt-2 opacity-70">Antwoorden verschijnen hier zodra spelers indienen</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {answers.map((answer) => {
              const answerLetter = getAnswerLetter(answer.answerIndex);
              const isCorrect = answer.isCorrect;
              
              return (
                <div
                  key={answer.id}
                  className={`p-4 rounded-xl border-2 ${
                    isCorrect
                      ? 'bg-green-50 border-green-400'
                      : 'bg-red-50 border-red-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-900 text-lg">{answer.playerName}</span>
                        <span className={`text-sm px-3 py-1 rounded-xl font-semibold border-2 ${
                          isCorrect
                            ? 'bg-green-200 text-green-900 border-green-500'
                            : 'bg-red-200 text-red-900 border-red-500'
                        }`}>
                          {isCorrect ? '✓ Correct' : '✗ Fout'}
                        </span>
                      </div>
                      <div className="text-sm font-medium text-gray-700">
                        Antwoord: <span className="font-semibold">{answerLetter}) {question.answers[answer.answerIndex]}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm font-medium text-gray-700">
                      <div>Tijd: {formatTime(answer.timeSpent)}</div>
                      <div className="text-base font-bold text-blue-600 mt-1">{answer.pointsEarned} punten</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

