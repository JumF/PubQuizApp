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
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        style={{
          marginBottom: '32px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'rgba(148, 163, 184, 1)',
          fontWeight: '600',
          fontSize: '14px',
          transition: 'all 0.3s ease',
          padding: '8px 0'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = 'white';
          ((e.currentTarget as HTMLElement).querySelector('svg') as SVGElement).style.transform = 'translateX(-4px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = 'rgba(148, 163, 184, 1)';
          ((e.currentTarget as HTMLElement).querySelector('svg') as SVGElement).style.transform = 'translateX(0)';
        }}
      >
        <svg style={{ width: '20px', height: '20px', transition: 'transform 0.3s ease' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Terug naar Home
      </button>

      {/* Main Card */}
      <div style={{
        position: 'relative',
        borderRadius: '28px',
        padding: '1px',
        background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.3), rgba(255, 255, 255, 0.2))',
        border: '1px solid rgba(255, 107, 53, 0.4)',
        animation: 'fadeInUp 0.8s ease-out'
      }}>
        <div style={{
          position: 'relative',
          background: 'rgba(30, 30, 30, 0.9)',
          borderRadius: '28px',
          padding: '40px',
          backdropFilter: 'blur(20px)',
          overflow: 'hidden'
        }}>
          {/* Accent orb */}
          <div style={{
            position: 'absolute',
            top: '0',
            right: '0',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(255, 255, 255, 0.1))',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }}></div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '12px',
                fontFamily: 'Orbitron, Chakra Petch'
              }}>
                Join de Quiz
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '15px',
                lineHeight: '1.6'
              }}>
                Vraag de quizmaster om de join code en voer je naam in
              </p>
            </div>

            {/* Join Code Input */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#FF6B35',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Join Code
              </label>
              <input
                type="text"
                maxLength={4}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.replace(/\D/g, ''))}
                style={{
                  width: '100%',
                  padding: '16px',
                  textAlign: 'center',
                  fontSize: '48px',
                  fontWeight: '700',
                  letterSpacing: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 107, 53, 0.3)',
                  borderRadius: '16px',
                  color: 'white',
                  fontFamily: 'monospace',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = '#FF6B35';
                  (e.target as HTMLInputElement).style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3), inset 0 2px 4px rgba(255, 107, 53, 0.1)';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 107, 53, 0.3)';
                  (e.target as HTMLInputElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.2)';
                }}
                placeholder="0000"
              />
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '8px', textAlign: 'center' }}>
                4 cijfers
              </p>
            </div>

            {/* Player Name Input */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '600',
                color: '#FF6B35',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Je Naam
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '16px',
                  fontWeight: '500',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 107, 53, 0.3)',
                  borderRadius: '16px',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.2)'
                }}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = '#FF6B35';
                  (e.target as HTMLInputElement).style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3), inset 0 2px 4px rgba(255, 107, 53, 0.1)';
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = 'rgba(255, 107, 53, 0.3)';
                  (e.target as HTMLInputElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.2)';
                }}
                placeholder="Bijv. Jan"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                marginBottom: '28px',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))',
                border: '2px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '16px',
                padding: '16px',
                fontSize: '14px',
                color: 'rgba(254, 202, 202, 1)',
                fontWeight: '600',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
                animation: 'fadeInUp 0.3s ease-out'
              }}>
                <svg style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Join Button */}
            <button
              onClick={handleJoin}
              disabled={joining}
              style={{
                width: '100%',
                marginTop: '12px',
                background: joining ? 'linear-gradient(135deg, rgba(255, 107, 53, 0.5), rgba(229, 90, 43, 0.4))' : 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: '700',
                borderRadius: '16px',
                cursor: joining ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: joining ? 'none' : '0 10px 30px rgba(255, 107, 53, 0.3)',
                opacity: joining ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!joining) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 15px 40px rgba(255, 107, 53, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!joining) {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(255, 107, 53, 0.3)';
                }
              }}
            >
              {joining ? (
                <>
                  <svg style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                  <span>Even geduld...</span>
                </>
              ) : (
                <>
                  <svg style={{ width: '20px', height: '20px' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Join Quiz</span>
                </>
              )}
            </button>

            {/* Helper text */}
            <p style={{
              marginTop: '16px',
              textAlign: 'center',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontStyle: 'italic'
            }}>
              Zorg dat je de juiste code hebt gekregen van de quizmaster
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

