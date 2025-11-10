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
    <div className="min-h-screen bg-robot-black font-sans text-gray-100 antialiased">
      {/* Decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-robot-orange rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>
          {title && (
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-8 bg-robot-orange rounded-full"></div>
                <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight font-display">
                  {title}
                </h1>
              </div>
              <div className="h-1 w-16 bg-robot-orange rounded-full"></div>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};

