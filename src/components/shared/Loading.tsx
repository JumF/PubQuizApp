import React from 'react';

interface LoadingProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

export const Loading: React.FC<LoadingProps> = ({ text = 'Laden...', size = 'md' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-blue-600`}></div>
      {text && <p className="mt-4 text-gray-700 font-medium">{text}</p>}
    </div>
  );
};

export const LoadingScreen: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loading text={text} size="lg" />
    </div>
  );
};

