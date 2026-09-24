import React from 'react';

const StatCard = ({ 
  label, 
  value, 
  icon, 
  trend,
  trendValue,
  color = '#667eea',
  loading = false
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  if (loading) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #E2E8F0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          width: '100%',
          height: '100px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '8px'
        }} />
        <style>
          {`
            @keyframes shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'white',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: isHovered 
          ? '0 20px 60px rgba(0,0,0,0.15)' 
          : '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #E2E8F0',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      {/* Background Gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '150px',
        height: '150px',
        background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`,
        pointerEvents: 'none',
        transition: 'all 0.4s ease',
        transform: isHovered ? 'scale(1.5)' : 'scale(1)'
      }} />

      {/* Icon */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        marginBottom: '20px',
        boxShadow: `0 8px 24px ${color}40`,
        transition: 'all 0.3s ease',
        transform: isHovered ? 'rotate(5deg) scale(1.1)' : 'rotate(0) scale(1)'
      }}>
        {icon}
      </div>

      {/* Label */}
      <div style={{
        fontSize: '13px',
        color: '#64748B',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: '12px',
        letterSpacing: '0.5px'
      }}>
        {label}
      </div>

      {/* Value */}
      <div style={{
        fontSize: '42px',
        fontWeight: '800',
        color: color,
        marginBottom: trend ? '12px' : '0',
        lineHeight: 1,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        {value}
      </div>

      {/* Trend */}
      {trend && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: '600',
          color: trend === 'up' ? '#10B981' : trend === 'down' ? '#EF4444' : '#64748B'
        }}>
          <span style={{ fontSize: '18px' }}>
            {trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️'}
          </span>
          <span>{trendValue}</span>
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>vs last month</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;