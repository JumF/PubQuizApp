import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { getSessionByJoinCode } from '../services/sessionService';
import { createPlayer } from '../services/playerService';
import { isValidJoinCode } from '../utils/helpers';

export const PlayerJoin: React.FC = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  // Load saved player name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const handleJoin = async () => {
    setError('');

    if (!joinCode.trim() || !isValidJoinCode(joinCode)) {
      setError('Vul een geldige 4-cijferige join code in');
      return;
    }

    if (!playerName.trim()) {
      setError('Vul je naam in');
      return;
    }

    setJoining(true);

    try {
      // Find session by join code
      const session = await getSessionByJoinCode(joinCode);
      
      if (!session) {
        setError('Ongeldige join code of sessie is beëindigd. Vraag de quizmaster om de juiste code.');
        setJoining(false);
        return;
      }

      // Create player
      const playerId = await createPlayer(session.id, playerName.trim());
      
      // Save player info to localStorage
      localStorage.setItem('playerName', playerName.trim());
      localStorage.setItem('playerId', playerId);
      localStorage.setItem('sessionId', session.id);

      // Navigate to player view
      navigate(`/play/${session.id}`);
    } catch (error: any) {
      console.error('Error joining session:', error);
      const errorMessage = error?.message || error?.code || 'Onbekende fout';
      setError(`Fout bij joinen: ${errorMessage}. Check de browser console (F12) voor details.`);
    } finally {
      setJoining(false);
    }
  };

  return (
    <Layout title="Join Quiz" maxWidth="sm">
      <button
        onClick={() => navigate('/')}
        className="mb-8 inline-flex items-center gap-2 text-slate-300 hover:text-white font-semibold transition-colors duration-200 group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Terug
      </button>

      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-orange-500 rounded-3xl blur opacity-20"></div>
        <div className="relative bg-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border border-slate-700">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Join de Quiz
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Vraag de quizmaster om de join code
            </p>
          </div>

          {/* Join Code */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Join Code
            </label>
            <input
              type="text"
              maxLength={4}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-6 py-4 text-center text-4xl font-bold border-2 border-slate-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-700 text-white placeholder-slate-500 transition-all duration-200 hover:border-slate-500"
              placeholder="1234"
            />
            <p className="text-xs text-slate-500 mt-2 text-center">4 cijfers</p>
          </div>

          {/* Player Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3">
              Je Naam
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-4 py-3.5 border-2 border-slate-600 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-slate-700 text-white font-medium placeholder-slate-500 transition-all duration-200 hover:border-slate-500"
              placeholder="Bijv. Jan"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl font-medium text-sm backdrop-blur-sm">
              <div className="flex gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Join Button */}
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full relative group mt-8"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-100 group-active:opacity-100 transition duration-200"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {joining ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                  Joinen...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Join Quiz
                </span>
              )}
            </div>
          </button>
        </div>
      </div>
    </Layout>
  );
};

