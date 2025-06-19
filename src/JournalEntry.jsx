import React, { useState, useEffect } from 'react';
import './slider.css'; // Import custom styling for the slider

function JournalEntry({ onAddEntry, theme }) {
  const [journal, setJournal] = useState('');
  const [moodValue, setMoodValue] = useState(5); // Default to middle (neutral)
  const [focused, setFocused] = useState(false);
  const [selectedTag, setSelectedTag] = useState('Personal'); // Default tag
  const [selectedEmotion, setSelectedEmotion] = useState(''); // Selected specific emotion

  // Tag options
  const tagOptions = ['Family', 'Personal', 'Office', 'Other'];
  
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

  // Map emotions based on mood value
  const getEmotions = (value) => {
    if (value <= 2) {
      return ["Angry", "Scared", "Annoyed", "Frustrated", "Anxious", "Stressed"];
    } else if (value <= 4) {
      return ["Sad", "Disappointed", "Lonely", "Tired", "Bored", "Confused"];
    } else if (value === 5) {
      return ["Calm", "Focused", "Content", "Neutral", "Relaxed", "Mindful"];
    } else if (value <= 7) {
      return ["Happy", "Optimistic", "Grateful", "Motivated", "Proud", "Peaceful"];
    } else {
      return ["Excited", "Joyful", "Inspired", "Energetic", "Enthusiastic", "Thrilled"];
    }
  };

  // Reset selected emotion when mood value changes
  useEffect(() => {
    setSelectedEmotion('');
  }, [moodValue]);

  // Enhanced glassmorphism values for dark mode
  const inputBg = theme.input || (theme.color === '#e8eaed' ? 'rgba(58, 58, 60, 0.65)' : 'rgba(255, 255, 255, 0.05)');
  const surfaceAlt = theme.surfaceAlt || inputBg;
  const glassSurface = theme.glassSurface || (theme.color === '#e8eaed' ? 'rgba(44, 44, 46, 0.65)' : 'rgba(255, 255, 255, 0.7)');

  // Map mood value to descriptive text
  const getMoodText = (value) => {
    if (value <= 2) return "Very Unpleasant";
    if (value <= 4) return "Unpleasant";
    if (value === 5) return "Neutral";
    if (value <= 7) return "Pleasant";
    return "Very Pleasant";
  };

  // Map mood value to emoji
  const getMoodEmoji = (value) => {
    if (value <= 2) return "😞";
    if (value <= 4) return "😐";
    if (value === 5) return "😊";
    if (value <= 7) return "😃";
    return "😁";
  };

  // Get color for slider based on mood value
  const getMoodColor = (value) => {
    if (value <= 2) return "#e74c3c";      // Red for very unpleasant
    if (value <= 4) return "#e67e22";      // Orange for unpleasant
    if (value === 5) return "#f1c40f";      // Yellow for neutral
    if (value <= 7) return "#2ecc71";      // Light green for pleasant
    return "#27ae60";                       // Green for very pleasant
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (journal && moodValue) {
      const moodText = getMoodText(moodValue);
      onAddEntry({ 
        journal, 
        mood: `${moodText} (${moodValue}/9)`, 
        moodValue, 
        tag: selectedTag,
        emotion: selectedEmotion || getEmotions(moodValue)[0], // Use the first emotion if none selected
        date: new Date().toISOString() 
      });
      setJournal('');
      setMoodValue(5); // Reset to neutral
      setSelectedTag('Personal'); // Reset to default tag
      setSelectedEmotion(''); // Reset selected emotion
    }
  };

  const today = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 420,
        margin: '2rem auto',
        padding: 28,
        borderRadius: 22,
        boxShadow: theme.shadow,
        background: theme.card,
        border: theme.border,
        fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        color: theme.color,
        transition: 'all 0.5s ease',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Date display like in iOS Journal */}      <div style={{ marginBottom: 20 }}>
        <div style={{ 
          fontSize: 14, 
          color: theme.textMuted || (theme.color === '#e8eaed' ? 'rgba(232, 234, 237, 0.7)' : 'rgba(56, 59, 66, 0.6)'), 
          letterSpacing: 0.4,
          fontWeight: 500,
          textTransform: 'uppercase'
        }}>
          {formattedDate}
        </div>
        <h2 style={{ 
          fontSize: 24, 
          fontWeight: 700, 
          margin: '8px 0 20px',
          color: theme.color,
          letterSpacing: theme.color === '#e8eaed' ? '0.2px' : 0
        }}>
          What's on your mind today?
        </h2>
      </div>
      
      {/* Main textarea with enhanced glassmorphism for dark mode */}      <div 
        style={{ 
          marginBottom: 26,
          position: 'relative',
          background: focused ? 
            (theme.color === '#e8eaed' ? 'rgba(58, 58, 60, 0.8)' : 'rgba(40, 44, 52, 0.25)') : 
            (theme.color === '#e8eaed' ? glassSurface : inputBg),
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 16,
          padding: 2,
          boxShadow: theme.color === '#e8eaed' ? '0 4px 12px rgba(0, 0, 0, 0.3)' : theme.shadow,
          border: theme.color === '#e8eaed' ? '1px solid rgba(70, 70, 72, 0.8)' : 'none',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="I feel..."
          rows={4}
          style={{
            width: '100%',
            border: 'none',
            borderRadius: 16,
            background: 'transparent',
            color: theme.color,
            padding: 18,
            fontSize: 17,
            fontFamily: 'inherit',
            resize: 'none',
            outline: 'none',
            lineHeight: 1.6,
            transition: 'background 0.3s'
          }}
          required
        />
      </div>
      
      {/* Tag selection with iOS-inspired design */}
      <div style={{ marginBottom: 26 }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10
        }}>
          <label style={{ 
            fontSize: 16, 
            fontWeight: 600,
            color: theme.color,
            opacity: 0.9,
          }}>
            Tag your entry
          </label>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: `linear-gradient(135deg, ${getTagColor(selectedTag)}20 0%, ${getTagColor(selectedTag)}10 100%)`,
            padding: '6px 12px',
            borderRadius: 12,
            border: `1px solid ${getTagColor(selectedTag)}30`,
            boxShadow: `0 2px 8px ${getTagColor(selectedTag)}20`,
          }}>
            <span style={{ 
              fontSize: 15, 
              fontWeight: 600, 
              color: getTagColor(selectedTag),
            }}>
              {selectedTag}
            </span>
          </div>
        </div>
        
        <div style={{
          background: theme.color === '#e8eaed' ? glassSurface : inputBg,
          borderRadius: 16,
          padding: '18px 20px',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: theme.color === '#e8eaed' ? '0 2px 8px rgba(0, 0, 0, 0.25)' : theme.shadow,
          border: theme.color === '#e8eaed' ? '1px solid rgba(70, 70, 72, 0.8)' : 'none',
          transition: 'all 0.3s ease',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            gap: 8,
          }}>
            {tagOptions.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                style={{ 
                  flex: 1,
                  background: selectedTag === tag ? 
                    `linear-gradient(135deg, ${getTagColor(tag)}30 0%, ${getTagColor(tag)}15 100%)` : 
                    'transparent',
                  border: selectedTag === tag ? 
                    `2px solid ${getTagColor(tag)}60` : 
                    '2px solid transparent',
                  borderRadius: 14,
                  padding: '8px 0',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  fontWeight: selectedTag === tag ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedTag === tag ? 
                    `0 4px 12px ${getTagColor(tag)}30` : 
                    'none',
                  color: selectedTag === tag ? 
                    getTagColor(tag) : 
                    theme.color === '#e8eaed' ? 'rgba(232, 234, 237, 0.85)' : 'rgba(56, 59, 66, 0.85)',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Redesigned space-efficient mood selector with single emoji display */}
      <div style={{ marginBottom: 26 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16
        }}>
          <label 
            htmlFor="mood-slider" 
            style={{ 
              fontSize: 16, 
              fontWeight: 600,
              color: theme.color,
              opacity: 0.9,
            }}
          >
            How are you feeling today?
          </label>
          
          {/* Single emoji display with text - positioned prominently */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            background: `linear-gradient(135deg, ${getMoodColor(moodValue)}20 0%, ${getMoodColor(moodValue)}10 100%)`,
            padding: '8px 14px',
            borderRadius: 14,
            border: `1px solid ${getMoodColor(moodValue)}30`,
            boxShadow: `0 2px 8px ${getMoodColor(moodValue)}20`,
          }}>
            <span style={{ fontSize: 24 }}>{getMoodEmoji(moodValue)}</span>
            <span style={{ 
              fontSize: 15, 
              fontWeight: 600, 
              color: getMoodColor(moodValue),
            }}>
              {getMoodText(moodValue)}
            </span>
          </div>
        </div>
        
        {/* Horizontal slider and mood selection with quick selectors but no emojis displayed */}
        <div style={{
          background: theme.color === '#e8eaed' ? glassSurface : inputBg,
          borderRadius: 16,
          padding: '18px 20px',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow: theme.color === '#e8eaed' ? '0 2px 8px rgba(0, 0, 0, 0.25)' : theme.shadow,
          border: theme.color === '#e8eaed' ? '1px solid rgba(70, 70, 72, 0.8)' : 'none',
          transition: 'all 0.3s ease',
        }}>
          {/* Quick selection buttons - without displaying emoji */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: 16,
            position: 'relative',
          }}>
            
          </div>
          
          {/* Custom styling for the iOS-like range input */}
          <div style={{ position: 'relative' }}>
            <input
              id="mood-slider"
              type="range"
              min="1"
              max="9"
              step="1"
              value={moodValue}
              onChange={(e) => setMoodValue(parseInt(e.target.value))}
              style={{
                width: '100%',
                height: 8,
              }}
            />
            
            {/* Mood scale labels */}            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: 10,
              fontSize: 13,
              color: theme.textMuted || (theme.color === '#e8eaed' ? 'rgba(232, 234, 237, 0.75)' : 'rgba(56, 59, 66, 0.7)'),
              fontWeight: 500,
            }}>
              <span>Very Unpleasant</span>
              <span>Very Pleasant</span>
            </div>
          </div>
          
          {/* Specific emotion chips */}
          <div style={{ 
            marginTop: 20, 
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }}>
            <label style={{ 
              fontSize: 15, 
              fontWeight: 600,
              color: theme.color,
              opacity: 0.9,
            }}>
              What describes this feeling specifically?
            </label>
            
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 8,
              marginTop: 4
            }}>
              {getEmotions(moodValue).map(emotion => (
                <button
                  key={emotion}
                  type="button"
                  onClick={() => setSelectedEmotion(emotion)}
                  style={{ 
                    background: selectedEmotion === emotion ? 
                      `linear-gradient(135deg, ${getMoodColor(moodValue)}30 0%, ${getMoodColor(moodValue)}15 100%)` : 
                      'transparent',
                    border: `1px solid ${getMoodColor(moodValue)}40`,
                    borderRadius: 20,
                    padding: '6px 12px',
                    fontSize: 14,
                    fontWeight: selectedEmotion === emotion ? 600 : 500,
                    color: selectedEmotion === emotion ? 
                      getMoodColor(moodValue) : 
                      theme.color === '#e8eaed' ? 'rgba(232, 234, 237, 0.85)' : 'rgba(56, 59, 66, 0.85)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedEmotion === emotion ? 
                      `0 2px 8px ${getMoodColor(moodValue)}30` : 
                      'none',
                  }}
                >
                  {emotion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Save button with iOS styling */}
      <button
        type="submit"
        style={{
          width: '100%',
          padding: 16,
          borderRadius: 16,
          background: theme.accentGradient || theme.accent,
          color: '#fff',
          border: 'none',
          fontWeight: 600,
          fontSize: 17,
          letterSpacing: 0.5,
          fontFamily: 'inherit',
          boxShadow: theme.buttonShadow || '0 4px 16px rgba(0, 122, 255, 0.35)',
          transition: 'transform 0.2s, opacity 0.2s',
          cursor: 'pointer',
          opacity: journal ? 1 : 0.7,
          transform: journal ? 'scale(1)' : 'scale(0.98)',
        }}
      >
        Add
      </button>
    </form>
  );
}

export default JournalEntry;
