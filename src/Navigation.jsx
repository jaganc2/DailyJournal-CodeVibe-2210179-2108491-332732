import React from 'react';

function Navigation({ activeView, onViewChange, theme, toggleDarkMode, darkMode }) {
  // Include both My Journal and Mood Tracker options
  const menuItems = [
    { id: 'list', label: 'My Journal' },
    { id: 'tracker', label: 'Mood Tracker' }
  ];
  
  return (
    <div style={{ 
      marginBottom: 20,
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: theme.card,
      boxShadow: '0 2px 16px rgba(0, 0, 0, 0.08)',
      borderRadius: '0 0 20px 20px',
      border: theme.border,
      transition: 'background 0.3s',
    }}>
      <div style={{
        maxWidth: 480,
        margin: '0 auto',
        padding: '16px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Title and navigation in a single row */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ 
            fontWeight: 700, 
            fontSize: 24, 
            letterSpacing: 0.5, 
            fontFamily: 'inherit', 
            textShadow: '0 2px 8px rgba(0,0,0,0.04)',
            color: theme.color,
            marginRight: 16,
          }}>
            Journal
          </div>
          
          {/* Single button for My Journal */}
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              style={{
                background: activeView === item.id ? 
                  (theme.color === '#e8eaed' ? 'rgba(44, 44, 46, 0.7)' : 'rgba(255, 255, 255, 0.15)') : 
                  'transparent',
                border: 'none',
                borderRadius: 10,
                padding: '8px 14px',
                fontSize: 15,
                fontWeight: 600,
                color: activeView === item.id ?
                  (theme.color === '#e8eaed' ? '#fff' : theme.color) :
                  (theme.color === '#e8eaed' ? 'rgba(255,255,255,0.7)' : 'rgba(56, 59, 66, 0.7)'),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
        
        {/* Dark mode toggle */}
        <button
          aria-label="Toggle dark mode"
          onClick={toggleDarkMode}
          style={{
            background: theme.card,
            color: theme.color,
            border: theme.border,
            borderRadius: 12,
            padding: 8,
            boxShadow: theme.shadow,
            cursor: 'pointer',
            fontSize: 18,
            transition: 'background 0.3s, color 0.3s',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>      </div>
    </div>
  );
}

export default Navigation;
