import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/shared/Layout';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const createCardStyle = (color1: string, color2: string, delay: number) => ({
    position: 'relative' as const,
    cursor: 'pointer',
    borderRadius: '24px',
    overflow: 'hidden',
    animation: `fadeInUp 0.8s ease-out ${delay}s backwards`,
    transition: 'all 0.3s ease'
  });

  return (
    <Layout title="AI PubQuiz" maxWidth="lg">
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '32px',
        marginBottom: '40px'
      }}>
        {/* Admin Card - Orange/White */}
        <div 
          style={{
            ...createCardStyle('#FF6B35', '#FFFFFF', 0),
            position: 'relative',
            borderRadius: '24px',
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.4), rgba(255, 255, 255, 0.2))',
            border: '1px solid rgba(255, 107, 53, 0.3)'
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(-12px)';
            el.style.boxShadow = '0 30px 60px rgba(255, 107, 53, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            el.style.borderColor = 'rgba(255, 107, 53, 0.8)';
            (el.querySelector('[data-content]') as HTMLElement).style.background = 'rgba(30, 30, 30, 0.95)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(0px)';
            el.style.boxShadow = '0 10px 30px rgba(255, 107, 53, 0.1)';
            el.style.borderColor = 'rgba(255, 107, 53, 0.3)';
            (el.querySelector('[data-content]') as HTMLElement).style.background = 'rgba(30, 30, 30, 0.85)';
          }}
          onClick={() => navigate('/admin')}
        >
          <div data-content style={{
            background: 'rgba(30, 30, 30, 0.85)',
            borderRadius: '24px',
            padding: '32px',
            transition: 'all 0.3s ease',
            position: 'relative',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              right: '-50px',
              width: '150px',
              height: '150px',
              background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(255, 255, 255, 0.1))',
              borderRadius: '50%',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }}></div>
            
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 1
            }}>
              <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '8px', fontFamily: 'Orbitron, Chakra Petch' }}>Admin Panel</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Beheer quizzen en vragen</p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#FF6B35', fontSize: '13px', fontWeight: '600' }}>
              <span>Verkennen</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* Quizmaster Card - White/Orange */}
        <div 
          style={{
            ...createCardStyle('#FFFFFF', '#FF6B35', 0.1),
            position: 'relative',
            borderRadius: '24px',
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 107, 53, 0.2))',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(-12px)';
            el.style.boxShadow = '0 30px 60px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 107, 53, 0.1)';
            el.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            (el.querySelector('[data-content2]') as HTMLElement).style.background = 'rgba(30, 30, 30, 0.95)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(0px)';
            el.style.boxShadow = '0 10px 30px rgba(255, 255, 255, 0.1)';
            el.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            (el.querySelector('[data-content2]') as HTMLElement).style.background = 'rgba(30, 30, 30, 0.85)';
          }}
          onClick={() => navigate('/admin/session/new')}
        >
          <div data-content2 style={{
            background: 'rgba(30, 30, 30, 0.85)',
            borderRadius: '24px',
            padding: '32px',
            transition: 'all 0.3s ease',
            position: 'relative',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '-50px',
              left: '-50px',
              width: '150px',
              height: '150px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 107, 53, 0.1))',
              borderRadius: '50%',
              filter: 'blur(50px)',
              pointerEvents: 'none'
            }}></div>
            
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F0F0 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: '0 10px 30px rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 1
            }}>
              <svg style={{ width: '32px', height: '32px', color: '#303030' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '8px', fontFamily: 'Orbitron, Chakra Petch' }}>Quizmaster</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Start nieuwe quiz sessie</p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#FF6B35', fontSize: '13px', fontWeight: '600' }}>
              <span>Verkennen</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* Player Card - Orange/Black */}
        <div 
          style={{
            ...createCardStyle('#FF6B35', '#1A1A1A', 0.2),
            position: 'relative',
            borderRadius: '24px',
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.3), rgba(26, 26, 26, 0.3))',
            border: '1px solid rgba(255, 107, 53, 0.3)'
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(-12px)';
            el.style.boxShadow = '0 30px 60px rgba(255, 107, 53, 0.25), 0 0 40px rgba(26, 26, 26, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            el.style.borderColor = 'rgba(255, 107, 53, 0.8)';
            (el.querySelector('[data-content3]') as HTMLElement).style.background = 'rgba(30, 30, 30, 0.95)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.transform = 'translateY(0px)';
            el.style.boxShadow = '0 10px 30px rgba(255, 107, 53, 0.1)';
            el.style.borderColor = 'rgba(255, 107, 53, 0.3)';
            (el.querySelector('[data-content3]') as HTMLElement).style.background = 'rgba(30, 30, 30, 0.85)';
          }}
          onClick={() => navigate('/play')}
        >
          <div data-content3 style={{
            background: 'rgba(30, 30, 30, 0.85)',
            borderRadius: '24px',
            padding: '32px',
            transition: 'all 0.3s ease',
            position: 'relative',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              right: '-50px',
              width: '150px',
              height: '150px',
              background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15), rgba(26, 26, 26, 0.15))',
              borderRadius: '50%',
              filter: 'blur(50px)',
              pointerEvents: 'none',
              transform: 'translate(-50%)'
            }}></div>
            
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #FF6B35 0%, #1A1A1A 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.4), 0 0 20px rgba(26, 26, 26, 0.2)',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 1,
              animation: 'float 4s ease-in-out infinite'
            }}>
              <svg style={{ width: '32px', height: '32px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: '700', color: 'white', marginBottom: '8px', fontFamily: 'Orbitron, Chakra Petch' }}>Speler</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Join een quiz met code</p>
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(90deg, #FF6B35, #E55A2B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontSize: '13px', fontWeight: '600' }}>
              <span>Verkennen</span>
              <span>→</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

