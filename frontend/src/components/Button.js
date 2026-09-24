import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  icon,
  disabled = false,
  fullWidth = false,
  loading = false
}) => {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      hoverTransform: 'translateY(-2px)',
      hoverShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
    },
    secondary: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      hoverTransform: 'translateY(-2px)',
      hoverShadow: '0 12px 40px rgba(240, 147, 251, 0.4)'
    },
    success: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: 'white',
      hoverTransform: 'translateY(-2px)',
      hoverShadow: '0 12px 40px rgba(79, 172, 254, 0.4)'
    },
    danger: {
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      color: 'white',
      hoverTransform: 'translateY(-2px)',
      hoverShadow: '0 12px 40px rgba(250, 112, 154, 0.4)'
    },
    outline: {
      background: 'transparent',
      color: '#667eea',
      border: '2px solid #667eea',
      hoverBackground: '#667eea',
      hoverColor: 'white'
    }
  };

  const sizes = {
    small: { padding: '8px 16px', fontSize: '13px' },
    medium: { padding: '12px 24px', fontSize: '14px' },
    large: { padding: '16px 32px', fontSize: '16px' }
  };

  const style = variants[variant];
  const sizeStyle = sizes[size];

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: '600',
        background: isHovered && style.hoverBackground ? style.hoverBackground : style.background,
        color: isHovered && style.hoverColor ? style.hoverColor : style.color,
        border: style.border || 'none',
        borderRadius: '12px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered && !disabled && !loading ? style.hoverTransform : 'translateY(0)',
        boxShadow: isHovered && !disabled && !loading ? style.hoverShadow : '0 4px 16px rgba(0,0,0,0.1)',
        opacity: disabled ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {loading && (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTop: '2px solid white',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      )}
      {icon && <span style={{ fontSize: '18px' }}>{icon}</span>}
      {children}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
};

export default Button;