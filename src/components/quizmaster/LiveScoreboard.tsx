import React from 'react';
import type { Player, Session } from '../../types';

interface LiveScoreboardProps {
  players: Player[];
  session: Session;
}

export const LiveScoreboard: React.FC<LiveScoreboardProps> = ({ players, session }) => {
  // Debug logging
  React.useEffect(() => {
    console.log('LiveScoreboard - Players:', players.length, players);
  }, [players]);

  const getCardColorClass = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-yellow-400 to-yellow-500',
      'bg-gradient-to-br from-blue-500 to-blue-600', 
      'bg-gradient-to-br from-green-500 to-green-600', 
      'bg-gradient-to-br from-red-500 to-red-600', 
      'bg-gradient-to-br from-pink-500 to-pink-600', 
      'bg-gradient-to-br from-cyan-500 to-cyan-600', 
      'bg-gradient-to-br from-purple-500 to-purple-600'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-6 sticky top-6 border border-blue-800">
      <h3 className="text-2xl font-bold mb-4 text-white">
        🏆 Live Scoreboard
      </h3>

      {players.length === 0 ? (
        <div className="text-center text-white py-8">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white border-opacity-30">
            <p className="font-semibold text-lg">Nog geen spelers</p>
            <p className="text-sm mt-2 opacity-90">Join Code:</p>
            <p className="text-4xl font-bold text-white mt-2">{session.joinCode}</p>
          </div>
          <p className="text-xs opacity-80">Wachtend op spelers...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`${getCardColorClass(index)} rounded-xl p-4 shadow-lg border border-white border-opacity-20`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg bg-white bg-opacity-30 text-white border-2 border-white">
                    {index + 1}
                  </div>
                  <span className="font-semibold text-white text-lg">
                    {player.name}
                  </span>
                </div>
                <span className="text-2xl font-bold text-white">
                  {player.totalScore}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t-2 border-white border-opacity-20">
        <div className="flex justify-between text-sm font-semibold text-white">
          <span>Totaal spelers:</span>
          <span className="text-lg">{players.length}</span>
        </div>
      </div>
    </div>
  );
};

