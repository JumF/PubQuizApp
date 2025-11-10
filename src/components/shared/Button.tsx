import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '8px 16px', fontSize: '13px' };
      case 'lg':
        return { padding: '16px 32px', fontSize: '18px' };
      case 'md':
      default:
        return { padding: '12px 24px', fontSize: '15px' };
    }
  };

  const getVariantStyles = () => {
    const baseStyle = {
      fontWeight: '700',
      borderRadius: '16px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      opacity: disabled ? 0.6 : 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'Chakra Petch, sans-serif',
      ...getSizeStyles(),
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
          color: 'white',
          boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)',
          ':hover': { boxShadow: '0 15px 40px rgba(255, 107, 53, 0.4)' }
        };
      case 'secondary':
        return {
          ...baseStyle,
          background: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          ':hover': { background: 'rgba(255, 255, 255, 0.15)' }
        };
      case 'danger':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
          color: 'white',
          boxShadow: '0 10px 30px rgba(239, 68, 68, 0.3)',
          ':hover': { boxShadow: '0 15px 40px rgba(239, 68, 68, 0.4)' }
        };
      case 'success':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: 'white',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
          ':hover': { boxShadow: '0 15px 40px rgba(16, 185, 129, 0.4)' }
        };
      default:
        return baseStyle;
    }
  };

  return (
    <button
      style={{
        ...getVariantStyles(),
        width: fullWidth ? '100%' : 'auto',
      }}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          // Apply hover box shadow from getVariantStyles directly, if defined
          const hoverShadow = getVariantStyles()[':hover']?.boxShadow;
          if (hoverShadow) {
            (e.currentTarget as HTMLElement).style.boxShadow = hoverShadow;
          }
          const hoverBackground = getVariantStyles()[':hover']?.background;
          if (hoverBackground) {
            (e.currentTarget as HTMLElement).style.background = hoverBackground;
          }
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        if (!disabled) {
          // Revert to original box shadow
          (e.currentTarget as HTMLElement).style.boxShadow = getVariantStyles().boxShadow;
          (e.currentTarget as HTMLElement).style.background = getVariantStyles().background;
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
};

