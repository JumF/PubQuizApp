import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';
import { Button } from '../components/shared/Button';
import { Loading } from '../components/shared/Loading';
import type { Player, Session, Quiz } from '../types';
import { getPlayersBySession, getAnswersByPlayer } from '../services/playerService';
import { getSession } from '../services/sessionService';
import { getQuiz } from '../services/quizService';
import { calculateAccuracy } from '../utils/scoring';

export const ResultsView: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  
  const [session, setSession] = useState<Session | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerStats, setPlayerStats] = useState<Map<string, { correct: number; total: number; avgTime: number }>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [sessionId]);

  const loadResults = async () => {
    if (!sessionId) return;

    setLoading(true);
    try {
      const [sessionData, playersData] = await Promise.all([
        getSession(sessionId),
        getPlayersBySession(sessionId),
      ]);

      if (!sessionData) {
        alert('Sessie niet gevonden');
        navigate('/');
        return;
      }

      setSession(sessionData);
      setPlayers(playersData);

      const quizData = await getQuiz(sessionData.quizId);
      setQuiz(quizData);

      // Load stats for each player
      const stats = new Map();
      for (const player of playersData) {
        const answers = await getAnswersByPlayer(sessionId, player.id);
        const correct = answers.filter(a => a.isCorrect).length;
        const total = answers.length;
        const avgTime = total > 0 
          ? answers.reduce((sum, a) => sum + a.timeSpent, 0) / total 
          : 0;
        
        stats.set(player.id, { correct, total, avgTime });
      }
      setPlayerStats(stats);
    } catch (error) {
      console.error('Error loading results:', error);
      alert('Fout bij laden van resultaten');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Resultaten laden..." />;
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

  return (
    <Layout title="🏆 Quiz Resultaten" maxWidth="xl">
      <div className="mb-6">
        <Button variant="secondary" onClick={() => navigate('/')}>← Naar Home</Button>
      </div>

      {/* Quiz Info */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-200">
        <h2 className="text-2xl font-bold mb-2 text-gray-900">{quiz.name}</h2>
        <div className="text-gray-700 font-medium">
          Quiz Code: <span className="text-blue-600 font-bold">{session.joinCode}</span> • {players.length} Speler{players.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Podium - Top 3 */}
      {players.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-xl p-8 mb-6 border-2 border-yellow-300">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Top 3</h3>
          <div className="flex justify-center items-end gap-6">
            {/* 2nd Place */}
            {players[1] && (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-3xl font-bold mb-2 border-4 border-gray-400 shadow-lg">
                  2
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg text-center min-w-[200px] border-2 border-gray-200">
                  <div className="font-semibold text-lg text-gray-900">{players[1].name}</div>
                  <div className="text-2xl text-blue-600 font-bold">{players[1].totalScore}</div>
                  <div className="text-sm text-gray-600 font-medium">
                    {calculateAccuracy(
                      playerStats.get(players[1].id)?.correct || 0,
                      playerStats.get(players[1].id)?.total || 0
                    )}% correct
                  </div>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {players[0] && (
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-2 shadow-xl border-4 border-yellow-500">
                  🏆
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-xl text-center min-w-[220px] border-2 border-yellow-400">
                  <div className="font-bold text-xl text-gray-900">{players[0].name}</div>
                  <div className="text-3xl text-yellow-600 font-bold">{players[0].totalScore}</div>
                  <div className="text-sm text-gray-600 font-medium">
                    {calculateAccuracy(
                      playerStats.get(players[0].id)?.correct || 0,
                      playerStats.get(players[0].id)?.total || 0
                    )}% correct
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {players[2] && (
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-orange-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2 border-4 border-orange-500 shadow-lg">
                  3
                </div>
                <div className="bg-white rounded-xl p-4 shadow-lg text-center min-w-[180px] border-2 border-gray-200">
                  <div className="font-semibold text-lg text-gray-900">{players[2].name}</div>
                  <div className="text-2xl text-blue-600 font-bold">{players[2].totalScore}</div>
                  <div className="text-sm text-gray-600 font-medium">
                    {calculateAccuracy(
                      playerStats.get(players[2].id)?.correct || 0,
                      playerStats.get(players[2].id)?.total || 0
                    )}% correct
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Rankings */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Alle Resultaten</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Rang
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Speler
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Correct
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Accuracy
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Gem. Tijd
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {players.map((player, index) => {
                const stats = playerStats.get(player.id) || { correct: 0, total: 0, avgTime: 0 };
                return (
                  <tr key={player.id} className={index < 3 ? 'bg-yellow-50' : 'hover:bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-2xl font-bold text-gray-900">
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{player.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-blue-600">{player.totalScore}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {stats.correct} / {stats.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {calculateAccuracy(stats.correct, stats.total)}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {stats.avgTime.toFixed(1)}s
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

