import React from 'react';

function JournalList({ entries, theme, darkMode, handleDeleteEntry, getMoodColor, getMoodEmoji, getTagColor }) {
  if (entries.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '30px 20px',
        color: darkMode ? 'rgba(232, 234, 237, 0.7)' : 'rgba(56, 59, 66, 0.7)',
        fontSize: 16,
        background: theme.card,
        borderRadius: 18,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: theme.border,
      }}>
        No journal entries yet. Start journaling to see your entries here.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: '2.5rem auto 0 auto' }}>      <h3 style={{ 
        fontWeight: 600, 
        fontSize: 20, 
        marginBottom: 18, 
        letterSpacing: 0.2,
        color: theme.color,
      }}>
        My Journal
      </h3>
      
      {entries.map((entry, idx) => (
        <div
          key={idx}
          style={{
            background: theme.card,
            border: theme.border,
            borderRadius: 18,
            padding: 20,
            marginBottom: 18,
            boxShadow: darkMode ? '0 4px 16px rgba(0, 0, 0, 0.3)' : theme.shadow,
            color: theme.color,
            transition: 'all 0.5s ease',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            fontFamily: 'inherit',
            position: 'relative'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6
          }}>
            <div style={{ 
              fontSize: 13, 
              color: darkMode ? 'rgba(232, 234, 237, 0.6)' : '#888'
            }}>
              {new Date(entry.date).toLocaleString()}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Tag badge */}
              {entry.tag && (
                <div style={{
                  backgroundColor: `${getTagColor(entry.tag)}20`,
                  color: getTagColor(entry.tag),
                  borderRadius: 10,
                  padding: '3px 10px',
                  fontSize: 12,
                  fontWeight: 600,
                  border: `1px solid ${getTagColor(entry.tag)}40`,
                }}>
                  {entry.tag}
                </div>
              )}
              
              {/* Delete button */}
              {entry.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this entry?')) {
                      handleDeleteEntry(entry.id);
                    }
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: darkMode ? 'rgba(232, 234, 237, 0.5)' : 'rgba(56, 59, 66, 0.5)',
                    fontSize: 16,
                    cursor: 'pointer',
                    padding: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = darkMode ? 'rgba(232, 234, 237, 0.8)' : 'rgba(56, 59, 66, 0.8)'}
                  onMouseOut={(e) => e.currentTarget.style.color = darkMode ? 'rgba(232, 234, 237, 0.5)' : 'rgba(56, 59, 66, 0.5)'}
                  aria-label="Delete entry"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
          
          <div style={{ marginBottom: 12, fontSize: 16, lineHeight: 1.6 }}>{entry.journal}</div>
          
          {/* Space-efficient mood display */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Main mood display */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: `linear-gradient(135deg, ${getMoodColor(entry.moodValue)}15 0%, ${getMoodColor(entry.moodValue)}05 100%)`,
              padding: '6px 12px',
              borderRadius: 12,
              boxShadow: `0 2px 8px ${getMoodColor(entry.moodValue)}15`,
              border: `1px solid ${getMoodColor(entry.moodValue)}25`,
            }}>
              <span style={{ fontSize: 22 }}>{getMoodEmoji(entry.moodValue)}</span>
              <span style={{ 
                fontWeight: 600, 
                fontSize: 14,
                color: getMoodColor(entry.moodValue),
              }}>
                {entry.mood}
              </span>
            </div>
            
            {/* Specific emotion chip */}
            {entry.emotion && (
              <div style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                padding: '4px 12px',
                background: `${getMoodColor(entry.moodValue)}15`,
                borderRadius: 16,
                fontSize: 13,
                fontWeight: 500,
                color: getMoodColor(entry.moodValue),
                border: `1px solid ${getMoodColor(entry.moodValue)}30`,
              }}>
                {entry.emotion}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default JournalList;
