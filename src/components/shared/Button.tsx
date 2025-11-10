import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'blue' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const variantClasses = {
  primary: 'bg-robot-orange hover:bg-robot-orange-dark text-white shadow-robot hover:shadow-robot-lg',
  secondary: 'bg-white hover:bg-robot-gray border-2 border-robot-black text-robot-black hover:bg-robot-gray-dark',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-robot',
  success: 'bg-green-500 hover:bg-green-600 text-white shadow-robot',
  blue: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40',
  gradient: 'bg-gradient-to-r from-blue-600 to-orange-600 hover:from-blue-700 hover:to-orange-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-orange-500/40',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

