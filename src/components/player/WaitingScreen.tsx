import React from 'react';
import { Layout } from '../shared/Layout';

interface WaitingScreenProps {
  message: string;
  playerName: string;
  joinCode?: string;
  score?: number;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({
  message,
  playerName,
  joinCode,
  score,
}) => {
  return (
    <Layout maxWidth="md">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6 border border-gray-200">
        {/* Animated waiting dots */}
        <div className="flex justify-center">
          <div className="flex gap-3">
            <div className="w-5 h-5 bg-blue-600 rounded-full animate-bounce border-2 border-blue-700" style={{ animationDelay: '0ms' }}></div>
            <div className="w-5 h-5 bg-blue-600 rounded-full animate-bounce border-2 border-blue-700" style={{ animationDelay: '150ms' }}></div>
            <div className="w-5 h-5 bg-blue-600 rounded-full animate-bounce border-2 border-blue-700" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          {message}
        </h2>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 space-y-4">
          <div>
            <div className="text-sm font-semibold text-gray-600">Speler</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{playerName}</div>
          </div>

          {joinCode && (
            <div>
              <div className="text-sm font-semibold text-gray-600">Join Code</div>
              <div className="text-4xl font-bold text-blue-600 mt-2">{joinCode}</div>
            </div>
          )}

          {score !== undefined && (
            <div>
              <div className="text-sm font-semibold text-gray-600">Je Huidige Score</div>
              <div className="text-4xl font-bold text-green-600 mt-2">{score}</div>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 font-medium">
          Deze pagina update automatisch
        </p>
      </div>
    </Layout>
  );
};

