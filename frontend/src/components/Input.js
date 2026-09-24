import React from 'react';

const Input = ({ 
  label, 
  type = 'text',
  value, 
  onChange, 
  placeholder,
  icon,
  error,
  required = false,
  disabled = false,
  fullWidth = true
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '600',
          color: '#1E293B',
          marginBottom: '8px'
        }}>
          {label}
          {required && <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '20px',
            color: isFocused ? '#667eea' : '#94A3B8',
            transition: 'all 0.3s'
          }}>
            {icon}
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: '100%',
            padding: icon ? '14px 16px 14px 52px' : '14px 16px',
            fontSize: '15px',
            border: `2px solid ${error ? '#EF4444' : isFocused ? '#667eea' : '#E2E8F0'}`,
            borderRadius: '12px',
            outline: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: disabled ? '#F8FAFC' : 'white',
            boxShadow: isFocused ? '0 0 0 4px rgba(102, 126, 234, 0.1)' : 'none',
            color: '#1E293B',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {error && (
        <div style={{
          marginTop: '8px',
          fontSize: '13px',
          color: '#EF4444',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Input;