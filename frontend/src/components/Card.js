import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  icon,
  gradient = false,
  glassmorphism = false,
  hover = true,
  padding = 'default',
  onClick
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const paddingStyles = {
    small: '16px',
    default: '24px',
    large: '32px'
  };

  const baseStyle = {
    background: gradient 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
      : glassmorphism
      ? 'rgba(255, 255, 255, 0.7)'
      : 'white',
    backdropFilter: glassmorphism ? 'blur(10px)' : 'none',
    borderRadius: '20px',
    padding: paddingStyles[padding],
    boxShadow: isHovered && hover 
      ? '0 20px 60px rgba(0,0,0,0.15)' 
      : '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHovered && hover ? 'translateY(-8px)' : 'translateY(0)',
    border: glassmorphism ? '1px solid rgba(255,255,255,0.2)' : '1px solid #E2E8F0',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {gradient && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
      )}

      {(title || icon) && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: subtitle ? '8px' : '20px'
        }}>
          {icon && (
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
            }}>
              {icon}
            </div>
          )}
          <div style={{ flex: 1 }}>
            {title && (
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                color: '#1E293B',
                margin: 0
              }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ 
                fontSize: '14px', 
                color: '#64748B',
                margin: '4px 0 0 0'
              }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {children}
    </div>
  );
};

export default Card;