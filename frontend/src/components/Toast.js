import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const types = {
    success: {
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: '✓'
    },
    error: {
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      icon: '✕'
    },
    warning: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: '⚠'
    },
    info: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: 'ℹ'
    }
  };

  const style = types[type];

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      background: style.background,
      color: 'white',
      padding: '16px 24px',
      borderRadius: '16px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '300px',
      animation: 'slideIn 0.3s ease-out',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: '700'
      }}>
        {style.icon}
      </div>
      <div style={{ flex: 1, fontSize: '14px', fontWeight: '600' }}>
        {message}
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s'
        }}
      >
        ×
      </button>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Toast;