import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-full',
};

export const Layout: React.FC<LayoutProps> = ({ children, title, maxWidth = 'lg' }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#202020',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {/* Orange orb */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: '#FF6B35',
          borderRadius: '50%',
          mixBlendMode: 'screen',
          filter: 'blur(120px)',
          opacity: 0.15,
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '0s'
        }}></div>

        {/* White orb */}
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '400px',
          height: '400px',
          background: '#FFFFFF',
          borderRadius: '50%',
          mixBlendMode: 'screen',
          filter: 'blur(120px)',
          opacity: 0.1,
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '1s'
        }}></div>

        {/* Dark Grey accent orb */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '350px',
          height: '350px',
          background: '#1A1A1A',
          borderRadius: '50%',
          mixBlendMode: 'screen',
          filter: 'blur(100px)',
          opacity: 0.08,
          animation: 'float 12s ease-in-out infinite',
          animationDelay: '2s'
        }}></div>

        {/* Grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          opacity: 0.3
        }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>
          {title && (
            <div style={{
              marginBottom: '48px',
              animation: 'fadeInUp 0.8s ease-out'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                marginBottom: '12px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  width: '6px',
                  height: '40px',
                  background: 'linear-gradient(180deg, #FF6B35 0%, #E55A2B 100%)',
                  borderRadius: '999px',
                  boxShadow: '0 0 20px rgba(255, 107, 53, 0.5)'
                }}></div>
                <h1 style={{
                  fontSize: 'clamp(32px, 8vw, 56px)',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FF6B35 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em',
                  fontFamily: 'Orbitron, sans-serif'
                }}>
                  {title}
                </h1>
              </div>
              <div style={{
                height: '3px',
                width: '80px',
                background: 'linear-gradient(90deg, #FF6B35 0%, #E55A2B 100%)',
                borderRadius: '999px',
                boxShadow: '0 0 20px rgba(255, 107, 53, 0.5)'
              }}></div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

