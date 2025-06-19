import React, { useState, useEffect } from 'react';
import JournalEntry from './JournalEntry.jsx';
import JournalList from './JournalList.jsx';
import Navigation from './Navigation.jsx';
import MoodTracker from './MoodTracker.jsx';
import './slider.css'; // Import for emoji styles
import journalDB from './services/db.js'; // Import the IndexedDB service
import { seedDatabase } from './services/seedData.js'; // Import the seed function

const lightTheme = {
  background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ebf2 100%)',
  color: '#383b42',
  card: 'rgba(255,255,255,0.85)',
  accent: '#2c6bed',
  accentGradient: 'linear-gradient(135deg, #2c6bed 0%, #5d8eff 100%)',
  shadow: '0 8px 32px 0 rgba(156, 175, 226, 0.14)',
  border: '1px solid rgba(255,255,255,0.6)',
  input: 'rgba(240, 242, 248, 0.7)',
  buttonShadow: '0 4px 16px rgba(44, 107, 237, 0.35)',
  surfaceAlt: 'rgba(230, 236, 245, 0.8)',
};

const darkTheme = {
  background: 'linear-gradient(180deg, #1c1c1e 0%, #2c2c2e 50%, #1c1c1e 100%)',
  color: '#e8eaed',
  card: 'rgba(44, 44, 46, 0.75)',
  accent: '#8ab4f8',
  accentGradient: 'linear-gradient(135deg, #8ab4f8 0%, #6899e8 100%)',
  shadow: '0 8px 32px 0 rgba(0,0,0,0.4)',
  border: '1px solid rgba(70, 70, 72, 0.7)',
  input: 'rgba(58, 58, 60, 0.65)',
  buttonShadow: '0 4px 16px rgba(138, 180, 248, 0.25)',
  surfaceAlt: 'rgba(58, 58, 60, 0.75)',
  glassSurface: 'rgba(44, 44, 46, 0.65)',
  textMuted: 'rgba(232, 234, 237, 0.7)',
};

// Tag colors - matching the app's aesthetic
const getTagColor = (tag) => {
  switch(tag) {
    case 'Family': return "#9b59b6"; // Purple
    case 'Personal': return "#3498db"; // Blue
    case 'Office': return "#2ecc71"; // Green
    case 'Other': return "#f39c12"; // Orange
    default: return "#3498db"; // Default blue
  }
};

function App() {
  const [entries, setEntries] = useState([]);
  const [darkMode, setDarkMode] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [isLoading, setIsLoading] = useState(true);
  const [dbError, setDbError] = useState(null);
  const [activeView, setActiveView] = useState('new'); // 'new' or 'list'
  const [notification, setNotification] = useState(null);

  // Set up theme styles
  useEffect(() => {
    document.body.style.background = '';
    document.body.style.backgroundImage = darkMode ? darkTheme.background : lightTheme.background;
    document.body.style.color = darkMode ? darkTheme.color : lightTheme.color;
    document.body.style.fontFamily = 'SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif';
    document.body.style.transition = 'background 0.5s, color 0.3s';
  }, [darkMode]);
    // Load entries from IndexedDB when component mounts
  useEffect(() => {
    async function loadEntries() {
      try {
        setIsLoading(true);
        
        // Load stored entries
        const storedEntries = await journalDB.getAllEntries();
        
        // Check if we need to seed the database (if less than 10 entries)
        if (storedEntries.length < 10) {
          console.log('Few entries found. Seeding database with sample data...');
          const seedResult = await seedDatabase();
          
          if (seedResult.success) {
            // Show notification about the seeded data
            
            // Reload entries after seeding
            const freshEntries = await journalDB.getAllEntries();
            setEntries(freshEntries);
          } else {
            console.log(seedResult.message);
            setEntries(storedEntries);
          }
        } else {
          setEntries(storedEntries);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load entries from IndexedDB:', error);
        setDbError('Failed to load your journal entries. Please refresh the page.');
        setIsLoading(false);
      }
    }
    
    loadEntries();
  }, []);

  const theme = darkMode ? darkTheme : lightTheme;

  // Helper function to get mood color based on mood value
  const getMoodColor = (moodValue) => {
    if (!moodValue) return "#f1c40f"; // Default/fallback color
    
    if (moodValue <= 2) return "#e74c3c";      // Red for very unpleasant
    if (moodValue <= 4) return "#e67e22";      // Orange for unpleasant
    if (moodValue === 5) return "#f1c40f";      // Yellow for neutral
    if (moodValue <= 7) return "#2ecc71";      // Light green for pleasant
    return "#27ae60";                       // Green for very pleasant
  };

  // Helper function to get mood emoji based on mood value
  const getMoodEmoji = (moodValue) => {
    if (!moodValue) return "😊"; // Default/fallback emoji
    
    if (moodValue <= 2) return "😞";
    if (moodValue <= 4) return "😐";
    if (moodValue === 5) return "😊";
    if (moodValue <= 7) return "😃";
    return "😁";
  };

  // Get gradient background for emoji container based on mood value
  const getEmojiBackground = (value) => {
    if (!value) return "linear-gradient(135deg, rgba(241, 196, 15, 0.2) 0%, rgba(241, 196, 15, 0.1) 100%)";
    
    if (value <= 2) return "linear-gradient(135deg, rgba(231, 76, 60, 0.2) 0%, rgba(231, 76, 60, 0.1) 100%)";
    if (value <= 4) return "linear-gradient(135deg, rgba(230, 126, 34, 0.2) 0%, rgba(230, 126, 34, 0.1) 100%)";
    if (value === 5) return "linear-gradient(135deg, rgba(241, 196, 15, 0.2) 0%, rgba(241, 196, 15, 0.1) 100%)";
    if (value <= 7) return "linear-gradient(135deg, rgba(46, 204, 113, 0.2) 0%, rgba(46, 204, 113, 0.1) 100%)";
    return "linear-gradient(135deg, rgba(39, 174, 96, 0.2) 0%, rgba(39, 174, 96, 0.1) 100%)";
  };
  
  const handleAddEntry = async (entry) => {
    try {
      // Save to IndexedDB and get the assigned ID
      const entryId = await journalDB.addEntry(entry);
      
      // Update the entry with the ID from the database
      const entryWithId = { ...entry, id: entryId };
      
      // Update state with the new entry
      setEntries([entryWithId, ...entries]);
      
      // Show success notification
      showNotification("Entry saved successfully!");
    } catch (error) {
      console.error('Error saving entry to IndexedDB:', error);
      // Show error notification
      showNotification("Failed to save entry. Please try again.", true);
      
      // Still update the UI state for better UX even if DB fails
      setEntries([entry, ...entries]);
    }
  };
  
  // Handle entry deletion
  const handleDeleteEntry = async (id) => {
    try {
      // Delete from IndexedDB
      await journalDB.deleteEntry(id);
      
      // Update state by filtering out the deleted entry
      setEntries(entries.filter(entry => entry.id !== id));
      
      // Show success notification
      showNotification("Entry deleted successfully!");
    } catch (error) {
      console.error('Error deleting entry:', error);
      showNotification("Failed to delete entry. Please try again.", true);
    }
  };

  // Simple notification system
  const showNotification = (message, isError = false) => {
    setNotification({
      message,
      isError
    });
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'none', 
      color: theme.color, 
      transition: 'background 0.5s, color 0.3s',
      paddingBottom: 60, // Add padding to account for FAB
      width: '100%',
    }}>
      {/* Navigation bar */}
      <Navigation 
        activeView={activeView}
        onViewChange={setActiveView}
        theme={theme}
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />
      
      <div style={{ 
        maxWidth: activeView === 'tracker' ? '1200px' : '480px', 
        margin: '0 auto', 
        padding: '0 1rem', 
        position: 'relative',
        width: '100%',
      }}>
        {/* Notification component */}
        {notification && (
          <div style={{
            position: 'fixed',
            top: 80, // Position below the navigation
            left: '50%',
            transform: 'translateX(-50%)',
            background: notification.isError ? 'rgba(231, 76, 60, 0.95)' : 'rgba(46, 204, 113, 0.95)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: 1000,
            maxWidth: '80%',
            textAlign: 'center',
            fontSize: 15,
            fontWeight: 500,
            animation: 'fadeIn 0.3s ease',
          }}>
            {notification.message}
          </div>
        )}
        
        {/* Loading indicator */}
        {isLoading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '20px 0',
          }}>
            <div style={{
              borderRadius: '50%',
              width: 40,
              height: 40,
              border: '3px solid rgba(0,0,0,0.1)',
              borderTopColor: theme.accent,
              animation: 'spin 1s linear infinite',
            }} />
            <style jsx>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -10px); }
                to { opacity: 1; transform: translate(-50%, 0); }
              }
            `}</style>
          </div>
        )}
        
        {/* Database error message */}
        {dbError && (
          <div style={{
            background: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            color: '#e74c3c',
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
            textAlign: 'center',
          }}>
            {dbError}
          </div>
        )}        {/* Conditional rendering based on active view */}
        {activeView === 'new' ? (
          <JournalEntry onAddEntry={handleAddEntry} theme={theme} />
        ) : activeView === 'tracker' ? (
          <MoodTracker
            entries={entries}
            theme={theme}
            darkMode={darkMode}
            getMoodColor={getMoodColor}
          />
        ) : (
          <JournalList 
            entries={entries} 
            theme={theme}
            darkMode={darkMode}
            handleDeleteEntry={handleDeleteEntry}
            getMoodColor={getMoodColor}
            getMoodEmoji={getMoodEmoji}
            getTagColor={getTagColor}
          />
        )}        {/* Floating Action Button (FAB) for iOS feel */}
        <button
          onClick={() => {
            if (activeView === 'list' || activeView === 'tracker') {
              setActiveView('new');
            } else {
              // If already in new entry view, just scroll to top
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          aria-label={activeView !== 'new' ? "Add new entry" : "Scroll to top"}
          style={{
            position: 'fixed',
            right: 32,
            bottom: 32,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: darkMode ? theme.accentGradient : theme.accent,
            color: '#fff',
            border: 'none',
            boxShadow: darkMode ? '0 6px 20px rgba(138, 180, 248, 0.3)' : '0 4px 24px #007aff44',
            fontSize: activeView !== 'new' ? 32 : 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          {activeView !== 'new' ? '＋' : '↑'}
        </button>
      </div>
    </div>
  );
}

export default App;
