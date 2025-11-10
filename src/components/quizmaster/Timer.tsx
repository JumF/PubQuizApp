import React, { useEffect, useState } from 'react';
import type { Session } from '../../types';
import { formatTime } from '../../utils/helpers';

interface TimerProps {
  session: Session;
  onStart: () => void;
  onClose: () => void;
}

export const Timer: React.FC<TimerProps> = ({ session, onStart, onClose }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!session.questionStartTime) {
      setTimeRemaining(session.timerDuration);
      return;
    }

    if (session.isQuestionClosed) {
      return;
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - session.questionStartTime!.getTime()) / 1000);
      const remaining = Math.max(0, session.timerDuration - elapsed);
      setTimeRemaining(remaining);

      // Auto-close when timer reaches 0
      if (remaining === 0 && session.autoCloseOnTimerEnd && !session.isQuestionClosed) {
        onClose();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [session.questionStartTime, session.isQuestionClosed, session.timerDuration, session.autoCloseOnTimerEnd, onClose]);

  const percentage = (timeRemaining / session.timerDuration) * 100;
  const isLowTime = timeRemaining <= 10 && timeRemaining > 0;
  const isTimeUp = timeRemaining === 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`text-8xl font-bold text-white ${
          isTimeUp ? 'text-red-200' :
          isLowTime ? 'animate-pulse' :
          ''
        }`}>
          {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white bg-opacity-20 backdrop-blur-sm rounded-full h-5 overflow-hidden border border-white border-opacity-30">
        <div
          className={`h-full transition-all duration-300 ${
            isTimeUp ? 'bg-red-400' :
            isLowTime ? 'bg-yellow-300' :
            'bg-white'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {!session.questionStartTime ? (
          <button
            onClick={onStart}
            className="w-full bg-white text-red-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            ▶️ Start Timer
          </button>
        ) : !session.isQuestionClosed ? (
          <button
            onClick={onClose}
            className="w-full bg-white text-red-600 font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
          >
            ⏹️ Sluit Vraag
          </button>
        ) : (
          <div className="w-full p-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl text-center font-semibold text-white border border-white border-opacity-30">
            Vraag Gesloten
          </div>
        )}
      </div>

      <div className="text-sm font-medium text-white text-center bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 border border-white border-opacity-30">
        Timer: {session.timerDuration}s
        {session.autoCloseOnTimerEnd && ' (Auto-close)'}
      </div>
    </div>
  );
};

