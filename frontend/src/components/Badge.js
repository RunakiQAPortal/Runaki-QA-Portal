import React from 'react';

const Badge = ({ children, variant = 'default', size = 'medium', pulse = false }) => {
  const variants = {
    default: { bg: '#F1F5F9', color: '#475569' },
    primary: { bg: '#DBEAFE', color: '#1E40AF' },
    success: { bg: '#D1FAE5', color: '#065F46' },
    warning: { bg: '#FEF3C7', color: '#92400E' },
    danger: { bg: '#FEE2E2', color: '#991B1B' },
    purple: { bg: '#EDE9FE', color: '#5B21B6' }
  };

  const sizes = {
    small: { padding: '4px 10px', fontSize: '11px' },
    medium: { padding: '6px 14px', fontSize: '13px' },
    large: { padding: '8px 18px', fontSize: '14px' }
  };

  const style = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: sizeStyle.padding,
      fontSize: sizeStyle.fontSize,
      fontWeight: '600',
      backgroundColor: style.bg,
      color: style.color,
      borderRadius: '10px',
      position: 'relative'
    }}>
      {pulse && (
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: style.color,
          animation: 'pulse 2s infinite'
        }} />
      )}
      {children}
      {pulse && (
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}
        </style>
      )}
    </span>
  );
};

export default Badge;