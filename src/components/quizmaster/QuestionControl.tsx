import React from 'react';
import type { Session, Quiz, Round, Question } from '../../types';
import { Timer } from './Timer';
import { 
  startQuestion, 
  closeQuestion, 
  nextQuestion, 
  nextRound 
} from '../../services/sessionService';

interface QuestionControlProps {
  session: Session;
  quiz: Quiz;
  currentRound: Round;
  currentQuestion: Question;
  rounds: Round[];
  allQuestions: Record<string, Question[]>;
}

export const QuestionControl: React.FC<QuestionControlProps> = ({
  session,
  currentRound,
  currentQuestion,
  rounds,
  allQuestions,
}) => {
  const currentQuestions = allQuestions[currentRound.id] || [];
  const isLastQuestion = session.currentQuestion >= currentQuestions.length - 1;
  const isLastRound = session.currentRound >= rounds.length - 1;

  const handleStartTimer = async () => {
    try {
      await startQuestion(session.id);
    } catch (error) {
      console.error('Error starting question:', error);
    }
  };

  const handleCloseQuestion = async () => {
    try {
      await closeQuestion(session.id);
    } catch (error) {
      console.error('Error closing question:', error);
    }
  };

  const handleNext = async () => {
    try {
      if (isLastQuestion) {
        if (isLastRound) {
          alert('Dit was de laatste vraag!');
          return;
        }
        // Move to next round
        await nextRound(session.id, session.currentRound);
      } else {
        // Move to next question
        await nextQuestion(
          session.id,
          session.currentRound,
          session.currentQuestion,
          currentQuestions.length
        );
      }
    } catch (error) {
      console.error('Error moving to next:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 space-y-6 border border-green-700">
      {/* Round and Question Info */}
      <div className="border-b-2 border-white border-opacity-20 pb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-bold text-white">
            {currentRound.name}
          </h3>
          <span className="text-sm font-semibold text-white bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white border-opacity-30">
            Vraag {session.currentQuestion + 1} van {currentQuestions.length}
          </span>
        </div>
      </div>

      {/* Question Panel */}
      <div className="bg-white rounded-xl p-6 border-2 border-yellow-300">
        <h4 className="text-2xl font-bold text-gray-900 mb-6">
          {currentQuestion.text}
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {currentQuestion.answers.map((answer, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl transition-all ${
                idx === currentQuestion.correctIndex
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                  : 'bg-gray-50 text-gray-900 border-2 border-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{String.fromCharCode(65 + idx)}.</span>
                <span className="font-semibold">{answer}</span>
                {idx === currentQuestion.correctIndex && (
                  <span className="ml-auto font-bold text-xl">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timer */}
      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 border border-red-700">
        <Timer
          session={session}
          onStart={handleStartTimer}
          onClose={handleCloseQuestion}
        />
      </div>

      {/* Question Status */}
      <div className="flex items-center justify-between p-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl border border-white border-opacity-30">
        <div className="text-sm font-semibold text-white">
          <span>Status: </span>
          {!session.questionStartTime ? (
            <span className="opacity-70">Niet gestart</span>
          ) : session.isQuestionClosed ? (
            <span className="text-red-200 font-bold">Gesloten</span>
          ) : (
            <span className="text-green-200 font-bold">Open</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="pt-4 border-t-2 border-white border-opacity-20">
        <button
          onClick={handleNext}
          disabled={!session.isQuestionClosed}
          className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform ${
            session.isQuestionClosed
              ? 'bg-white text-green-600 hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] shadow-lg'
              : 'bg-white bg-opacity-30 text-white opacity-50 cursor-not-allowed'
          }`}
        >
          {isLastQuestion
            ? isLastRound
              ? 'Laatste Vraag'
              : 'Volgende Ronde →'
            : 'Volgende Vraag →'}
        </button>
        {!session.isQuestionClosed && (
          <p className="text-sm text-white opacity-80 text-center mt-2 font-medium">
            Sluit eerst de huidige vraag
          </p>
        )}
      </div>
    </div>
  );
};

