import React, { useState, useEffect } from 'react';
import './navigation.css'; // Import navigation CSS

function Navigation({ activeView, onViewChange, theme, toggleDarkMode, darkMode }) {
  const [isMobileView, setIsMobileView] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Include both My Journal and Mood Tracker options
  const menuItems = [
    { id: 'list', label: 'My Journal' },
    { id: 'tracker', label: 'Mood Tracker' },
    { id: 'new', label: 'New Entry' }
  ];

  // Check if we're in mobile view whenever the window resizes
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    checkMobileView();

    // Set up listener for window resize
    window.addEventListener('resize', checkMobileView);

    // Clean up
    return () => window.removeEventListener('resize', checkMobileView);
  }, []);

  // Close mobile menu when a menu item is clicked
  const handleMenuItemClick = (viewId) => {
    onViewChange(viewId);
    setMobileMenuOpen(false);
  };

  // Hamburger menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
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
      borderRadius: '0 0',
      border: theme.border,
      transition: 'background 0.3s',
      width: '100%',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px', // Wider container for desktop view
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* App Title - Left Aligned */}
        <div style={{ 
          fontWeight: 700, 
          fontSize: 24, 
          letterSpacing: 0.5, 
          fontFamily: 'inherit', 
          textShadow: '0 2px 8px rgba(0,0,0,0.04)',
          color: theme.color,
        }}>
          Journal
        </div>
          {/* Desktop Menu - Right Aligned */}
        {!isMobileView && (
          <div className="desktop-menu" style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            {/* Menu Items */}
            <div style={{ display: 'flex', gap: '8px' }}>
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
            </button>
          </div>
        )}
          {/* Mobile Menu - Hamburger Icon */}
        {isMobileView && (
          <div className="mobile-menu" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Dark mode toggle for mobile */}
            <button
              aria-label="Toggle dark mode"
              onClick={toggleDarkMode}
              style={{
                background: 'transparent',
                color: theme.color,
                border: 'none',
                padding: 8,
                cursor: 'pointer',
                fontSize: 18,
              }}
            >
              {darkMode ? '🌙' : '☀️'}
            </button>
            
            {/* Hamburger Button */}
            <button
              onClick={toggleMobileMenu}
              aria-label="Open menu"
              aria-expanded={mobileMenuOpen}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '24px',
                width: '30px',
              }}
            >
              <span
                style={{
                  height: '2px',
                  width: '100%',
                  background: theme.color,
                  borderRadius: '2px',
                  transition: 'transform 0.2s, opacity 0.2s',
                  transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none',
                }}
              />
              <span
                style={{
                  height: '2px',
                  width: '100%',
                  background: theme.color,
                  borderRadius: '2px',
                  opacity: mobileMenuOpen ? 0 : 1,
                  transition: 'opacity 0.2s',
                }}
              />
              <span
                style={{
                  height: '2px',
                  width: '100%',
                  background: theme.color,
                  borderRadius: '2px',
                  transition: 'transform 0.2s',
                  transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none',
                }}
              />
            </button>
          </div>
        )}
      </div>
        {/* Mobile Menu Dropdown */}
      {isMobileView && mobileMenuOpen && (
        <div className="mobile-menu-dropdown" style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: theme.card,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          borderRadius: '0 0 20px 20px',
          overflow: 'hidden',
          zIndex: 20,
          padding: '8px 0',
          border: theme.border,
          animation: 'fadeIn 0.2s ease-out',
        }}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                background: activeView === item.id ? 
                  (theme.color === '#e8eaed' ? 'rgba(44, 44, 46, 0.7)' : 'rgba(255, 255, 255, 0.15)') :
                  'transparent',
                border: 'none',
                padding: '12px 24px',
                fontSize: 16,
                fontWeight: 600,
                color: activeView === item.id ?
                  (theme.color === '#e8eaed' ? '#fff' : theme.color) :
                  (theme.color === '#e8eaed' ? 'rgba(255,255,255,0.7)' : 'rgba(56, 59, 66, 0.7)'),
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Navigation;
