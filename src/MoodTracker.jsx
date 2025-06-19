import React, { useState, useEffect } from 'react';

function MoodTracker({ entries, theme, darkMode, getMoodColor }) {  const [moodData, setMoodData] = useState({
    averageMood: 0,
    moodCounts: {},
    moodHistory: [],
    mostFrequentMood: '',
    highestMood: 0,
    lowestMood: 10,
    moodByDay: {},
    recentTrend: 'stable',
    emotionCounts: {},
    wordCloudData: []
  });
  // Function to extract meaningful words from journal text
  const extractWords = (text) => {
    if (!text) return [];
    
    // List of common stop words to filter out
    const stopWords = [
      'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 
      'any', 'are', 'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 
      'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could', 'couldn\'t', 
      'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 
      'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 
      'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 
      'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 
      'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 
      'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 
      'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 
      'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s', 'should', 
      'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 
      'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 
      'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 
      'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 
      'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 
      'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 
      'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves'
    ];
    
    // Split text into words, convert to lowercase, and filter out stop words and short words
    const words = text.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word));
      
    return words;
  };

  // Process entries to extract mood data
  useEffect(() => {
    if (!entries || entries.length === 0) return;

    // Sort entries by date
    const sortedEntries = [...entries].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate mood statistics
    let sum = 0;
    const moodCounts = {};
    const emotionCounts = {};
    let highest = 0;
    let lowest = 10;
    const moodByDay = {};
    
    // Word collection for word cloud
    const wordFrequency = {};
    
    // Last 10 entries for history (or fewer if less than 10 entries exist)
    const historyEntries = sortedEntries.slice(-10);
    const moodHistory = historyEntries.map(entry => ({
      date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      mood: entry.moodValue,
      emotion: entry.emotion,
      fullDate: entry.date
    }));
      // Process all entries for statistics
    entries.forEach(entry => {
      const moodValue = entry.moodValue || 5;
      const entryDate = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' });
      
      // Sum for average
      sum += moodValue;
      
      // Track counts of each mood value
      moodCounts[moodValue] = (moodCounts[moodValue] || 0) + 1;
      
      // Track emotion frequency
      if (entry.emotion) {
        emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
      }
      
      // Track moods by day of week
      if (!moodByDay[entryDate]) {
        moodByDay[entryDate] = { sum: 0, count: 0 };
      }
      moodByDay[entryDate].sum += moodValue;
      moodByDay[entryDate].count += 1;
      
      // Track highest and lowest
      if (moodValue > highest) highest = moodValue;
      if (moodValue < lowest) lowest = moodValue;
      
      // Extract and count words for word cloud
      if (entry.journal) {
        const words = extractWords(entry.journal);
        words.forEach(word => {
          wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        });
      }
    });
    
    // Calculate most frequent mood
    let mostFrequentMood = 5; // default to neutral
    let maxCount = 0;
    Object.keys(moodCounts).forEach(mood => {
      if (moodCounts[mood] > maxCount) {
        maxCount = moodCounts[mood];
        mostFrequentMood = parseInt(mood);
      }
    });
    
    // Calculate trend (if we have enough entries)
    let recentTrend = 'stable';
    if (moodHistory.length >= 3) {
      const recent = moodHistory.slice(-3);
      if (recent[2].mood > recent[0].mood) {
        recentTrend = 'improving';
      } else if (recent[2].mood < recent[0].mood) {
        recentTrend = 'declining';
      }
    }
    
    // Calculate average mood by day
    Object.keys(moodByDay).forEach(day => {
      moodByDay[day].average = Math.round((moodByDay[day].sum / moodByDay[day].count) * 10) / 10;
    });
      // Convert word frequency object to array of word objects for the word cloud
    // Sort by frequency and take top 40 words
    const wordCloudData = Object.keys(wordFrequency)
      .map(word => ({
        text: word,
        value: wordFrequency[word],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 40);
      
    // Add emotions to the word cloud with their counts
    Object.keys(emotionCounts).forEach(emotion => {
      wordCloudData.push({
        text: emotion,
        value: emotionCounts[emotion] * 1.5, // Make emotions slightly more prominent
        isEmotion: true
      });
    });
      
    setMoodData({
      averageMood: Math.round((sum / entries.length) * 10) / 10, // one decimal place
      moodCounts,
      moodHistory,
      mostFrequentMood,
      highestMood: highest,
      lowestMood: lowest,
      moodByDay,
      recentTrend,
      emotionCounts,
      wordCloudData
    });
  }, [entries]);

  // Helper function to get mood text
  const getMoodText = (value) => {
    if (!value) return "Neutral";
    if (value <= 2) return "Very Unpleasant";
    if (value <= 4) return "Unpleasant";
    if (value === 5) return "Neutral";
    if (value <= 7) return "Pleasant";
    return "Very Pleasant";
  };
  
  // Helper function to get mood emoji
  const getMoodEmoji = (value) => {
    if (!value) return "😊";
    if (value <= 2) return "😞";
    if (value <= 4) return "😐";
    if (value === 5) return "😊";
    if (value <= 7) return "😃";
    return "😁";
  };

  // Get trend emoji and text
  const getTrendInfo = (trend) => {
    switch(trend) {
      case 'improving':
        return { emoji: "↗️", text: "Improving", color: "#2ecc71" };
      case 'declining':
        return { emoji: "↘️", text: "Declining", color: "#e74c3c" };
      default:
        return { emoji: "→", text: "Stable", color: "#f1c40f" };
    }
  };

  if (!entries || entries.length === 0) {
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
        No journal entries yet. Start journaling to see your mood trends.
      </div>
    );
  }
  // Generate vibrant gradient based on mood data
  const generateVibrantGradient = () => {
    const avgMood = moodData.averageMood || 5;
    
    // Create vibrant gradients based on mood range
    if (avgMood <= 3) {
      return darkMode 
        ? 'linear-gradient(135deg, #1E0338 0%, #380440 50%, #4B0945 100%)' 
        : 'linear-gradient(135deg, #FFD3E0 0%, #FFA6C9 50%, #FF7DAB 100%)';
    } else if (avgMood <= 5) {
      return darkMode
        ? 'linear-gradient(135deg, #0A2342 0%, #1C3752 50%, #2C4A62 100%)'
        : 'linear-gradient(135deg, #C4D7E0 0%, #99C1DE 50%, #7EB1E5 100%)';
    } else if (avgMood <= 7) {
      return darkMode
        ? 'linear-gradient(135deg, #0F3B2C 0%, #1B584A 50%, #276B5E 100%)'
        : 'linear-gradient(135deg, #B6EDD0 0%, #8BE0B3 50%, #60D69F 100%)';
    } else {
      return darkMode
        ? 'linear-gradient(135deg, #273307 0%, #3D4A18 50%, #5C6B2A 100%)'
        : 'linear-gradient(135deg, #D7F7A0 0%, #B9F269 50%, #9CE33C 100%)';
    }
  };

  return (
    <div style={{ 
      width: '100%',
      padding: '0',
      margin: '0',
      background: generateVibrantGradient(),
      minHeight: 'calc(100vh - 80px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Hero Section - Apple Style */}
      <div style={{
        padding: '40px 5% 20px 5%',
        textAlign: 'center',
        position: 'relative',
      }}>
        <h2 style={{
          fontSize: '38px',
          fontWeight: 800,
          marginBottom: '12px',
          color: darkMode ? '#ffffff' : '#000000',
          letterSpacing: '-0.5px',
          textShadow: darkMode ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(255,255,255,0.3)',
        }}>
          Mood Insights
        </h2>
        
        <p style={{
          fontSize: '20px',
          fontWeight: 500,
          maxWidth: '700px',
          margin: '0 auto 30px auto',
          color: darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
          letterSpacing: '0.1px',
        }}>
          {`Your emotional journey across ${entries.length} journal ${entries.length === 1 ? 'entry' : 'entries'}`}
        </p>
      </div>

      {/* Stats Overview - Apple Card Style */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        padding: '0 5% 40px 5%',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Average Mood Card */}
        <div style={{
          flex: '1 1 300px',
          maxWidth: '380px',
          background: darkMode ? 'rgba(20, 20, 22, 0.75)' : 'rgba(255, 255, 255, 0.85)',
          borderRadius: '24px',
          padding: '25px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: darkMode 
            ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset' 
            : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'default',
        }}>
          <div style={{
            fontSize: '80px',
            lineHeight: '1',
            marginBottom: '10px',
          }}>
            {getMoodEmoji(Math.round(moodData.averageMood))}
          </div>
          
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            marginBottom: '15px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
          }}>
            Average Mood
          </h3>
          
          <div style={{
            fontSize: '48px',
            fontWeight: '700',
            background: getMoodColor(moodData.averageMood),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            marginBottom: '10px',
          }}>
            {moodData.averageMood}
          </div>
          
          <div style={{
            fontSize: '18px',
            fontWeight: '500',
            color: getMoodColor(moodData.averageMood),
            borderTop: `1px solid ${getMoodColor(moodData.averageMood)}30`,
            paddingTop: '15px',
            width: '100%',
            textAlign: 'center',
          }}>
            {getMoodText(Math.round(moodData.averageMood))}
          </div>
        </div>
        
        {/* Most Common Mood */}
        <div style={{
          flex: '1 1 300px',
          maxWidth: '380px',
          background: darkMode ? 'rgba(20, 20, 22, 0.75)' : 'rgba(255, 255, 255, 0.85)',
          borderRadius: '24px',
          padding: '25px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: darkMode 
            ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset' 
            : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'default',
        }}>
          <div style={{
            fontSize: '80px',
            lineHeight: '1',
            marginBottom: '10px',
          }}>
            {getMoodEmoji(moodData.mostFrequentMood)}
          </div>
          
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            marginBottom: '15px',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
          }}>
            Most Common Mood
          </h3>
          
          <div style={{
            fontSize: '48px',
            fontWeight: '700',
            background: getMoodColor(moodData.mostFrequentMood),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            marginBottom: '10px',
          }}>
            {moodData.mostFrequentMood}
          </div>
          
          <div style={{
            fontSize: '18px',
            fontWeight: '500',
            color: getMoodColor(moodData.mostFrequentMood),
            borderTop: `1px solid ${getMoodColor(moodData.mostFrequentMood)}30`,
            paddingTop: '15px',
            width: '100%',
            textAlign: 'center',
          }}>
            {getMoodText(moodData.mostFrequentMood)}
          </div>
        </div>
      </div>
        {/* Mood History Graph - Apple Keynote Style */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 40px auto',
        padding: '0 5%',
      }}>
        <div style={{
          background: darkMode ? 'rgba(20, 20, 22, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '30px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: darkMode 
            ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset' 
            : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
        }}>
          <h3 style={{ 
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '30px',
            color: darkMode ? '#ffffff' : '#000000',
            textAlign: 'center',
          }}>
            Your Mood Journey
          </h3>
          
          {/* Enhanced visual graph */}
          <div style={{ marginBottom: 25 }}>
            <div style={{ 
              height: 280, 
              position: 'relative',
              marginBottom: 15,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              paddingBottom: 15,
              paddingLeft: 40,
            }}>
              {/* Decorative background pattern */}
              <div style={{
                position: 'absolute',
                left: 40,
                right: 0,
                top: 0,
                bottom: 0,
                background: darkMode 
                  ? 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px)' 
                  : 'radial-gradient(circle, rgba(0, 0, 0, 0.03) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }} />
              
              {/* Y-axis tick marks */}
              <div style={{ 
                position: 'absolute', 
                left: 0, 
                top: 0, 
                height: '100%', 
                width: 40,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontSize: 14,
                fontWeight: 500,
                color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
              }}>
                <div style={{ textAlign: 'right', paddingRight: 10 }}>9</div>
                <div style={{ textAlign: 'right', paddingRight: 10 }}>7</div>
                <div style={{ textAlign: 'right', paddingRight: 10 }}>5</div>
                <div style={{ textAlign: 'right', paddingRight: 10 }}>3</div>
                <div style={{ textAlign: 'right', paddingRight: 10 }}>1</div>
              </div>
              
              {/* Horizontal grid lines */}
              <div style={{ 
                position: 'absolute', 
                left: 40, 
                top: 0, 
                height: '100%', 
                width: 'calc(100% - 40px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
                {[0, 1, 2, 3, 4].map((_, i) => (
                  <div 
                    key={i}
                    style={{ 
                      height: 1, 
                      width: '100%',
                      background: darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'
                    }}
                  />
                ))}
              </div>
              
              {/* Enhanced data points with connection lines */}
              {moodData.moodHistory.map((point, i, arr) => {
                const height = ((point.mood / 9) * 240) + 15;  // Scale to height
                const nextPoint = arr[i + 1];
                
                return (
                  <div key={i} style={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    position: 'relative',
                    zIndex: 2,
                  }}>
                    {/* Data point */}
                    <div style={{
                      position: 'absolute',
                      bottom: height,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: getMoodColor(point.mood),
                      boxShadow: `0 0 0 4px ${darkMode ? 'rgba(20, 20, 22, 0.7)' : 'rgba(255, 255, 255, 0.7)'}`,
                      zIndex: 3,
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.2)',
                      }
                    }} />
                    
                    {/* Connection line to next point */}
                    {nextPoint && (
                      <svg
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          right: '-50%',
                          width: '100%',
                          height: '100%',
                          zIndex: 1,
                          overflow: 'visible',
                        }}
                      >
                        <defs>
                          <linearGradient id={`lineGradient-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={getMoodColor(point.mood)} stopOpacity="0.7" />
                            <stop offset="100%" stopColor={getMoodColor(nextPoint.mood)} stopOpacity="0.7" />
                          </linearGradient>
                        </defs>
                        <line
                          x1="0"
                          y1={280 - height}
                          x2="100%"
                          y2={280 - ((nextPoint.mood / 9) * 240 + 15)}
                          stroke={`url(#lineGradient-${i})`}
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    
                    {/* Animated glow effect */}
                    <div style={{
                      position: 'absolute',
                      bottom: height,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: 'transparent',
                      boxShadow: `0 0 20px 5px ${getMoodColor(point.mood)}80`,
                      animation: 'pulse 2s infinite',
                      animationDelay: `${i * 0.3}s`,
                      opacity: 0.7,
                      zIndex: 1,
                    }} />
                    
                    {/* Emoji indicator */}
                    <div style={{
                      position: 'absolute',
                      bottom: height + 25,
                      fontSize: '18px',
                      zIndex: 4,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    }}>
                      {getMoodEmoji(point.mood)}
                    </div>
                  </div>
                );
              })}
              
              {/* Add animation keyframes */}
              <style>{`
                @keyframes pulse {
                  0% { transform: scale(0.8); opacity: 0.7; }
                  50% { transform: scale(1.3); opacity: 0.3; }
                  100% { transform: scale(0.8); opacity: 0.7; }
                }
              `}</style>
            </div>
            
            {/* X-axis labels */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              paddingLeft: 40,
              fontSize: 14,
              fontWeight: 500,
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
            }}>
              {moodData.moodHistory.map((point, i) => (
                <div key={i} style={{ 
                  flex: 1, 
                  textAlign: 'center', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  paddingTop: 8,
                  borderTop: darkMode 
                    ? '2px solid rgba(255, 255, 255, 0.1)' 
                    : '2px solid rgba(0, 0, 0, 0.1)',
                }}>
                  {point.date}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mood Distribution */}
      <div style={{
        background: theme.card,
        borderRadius: 18,
        padding: 20,
        marginBottom: 24,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: theme.border,
        boxShadow: theme.shadow,
      }}>
        <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: theme.color }}>
          Mood Distribution
        </h4>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          {/* Distribution bars */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => {
            // Calculate percentage for this mood value
            const count = moodData.moodCounts[value] || 0;
            const percentage = count / entries.length;
            const barHeight = Math.max(percentage * 100, 4); // Minimum height for visualization
            
            return (
              <div key={value} style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6
              }}>
                {/* Bar */}
                <div style={{ 
                  height: 100,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column-reverse'
                }}>
                  <div style={{
                    height: `${barHeight}%`,
                    width: '100%',
                    background: `linear-gradient(to top, ${getMoodColor(value)}30, ${getMoodColor(value)}70)`,
                    borderRadius: '4px 4px 0 0',
                    position: 'relative',
                  }}>
                    {/* Count label for non-zero values */}
                    {count > 0 && (
                      <div style={{
                        position: 'absolute',
                        top: -20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: getMoodColor(value)
                      }}>
                        {count}
                      </div>
                    )}
                  </div>
                </div>
                {/* Value label */}
                <div style={{
                  fontSize: 11,
                  color: darkMode ? 'rgba(232, 234, 237, 0.6)' : 'rgba(56, 59, 66, 0.6)'
                }}>
                  {value}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 12,
          color: darkMode ? 'rgba(232, 234, 237, 0.7)' : 'rgba(56, 59, 66, 0.7)',
          marginTop: 8,
          paddingTop: 10,
          borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
        }}>
          <span>Very Unpleasant</span>
          <span>Very Pleasant</span>
        </div>
      </div>
        {/* Insights with Word Cloud */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto 40px auto',
        padding: '0 5%',
      }}>
        <div style={{
          background: darkMode ? 'rgba(20, 20, 22, 0.8)' : 'rgba(255, 255, 255, 0.9)',
          borderRadius: '24px',
          padding: '30px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: darkMode 
            ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset' 
            : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
        }}>
          <h3 style={{ 
            fontSize: '28px',
            fontWeight: '700',
            marginBottom: '30px',
            color: darkMode ? '#ffffff' : '#000000',
            textAlign: 'center',
          }}>
            Your Journal Insights
          </h3>
          
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '30px',
          }}>
            {/* Insights list */}
            <div style={{ 
              flex: '1 1 300px', 
              fontSize: 15, 
              lineHeight: 1.5, 
              margin: '0 auto 40px auto',
              color: darkMode ? '#e8eaed' : '#383b42' 
            }}>
              <h4 style={{ 
                fontSize: 20, 
                fontWeight: 600, 
                marginBottom: 16, 
                color: darkMode ? '#fff' : '#000' 
              }}>
                Mood Analysis
              </h4>
              <p style={{ marginBottom: 12 }}>
                Based on your {entries.length} journal entries:
              </p>
              <ul style={{ 
                paddingLeft: 20,
                marginBottom: 0,
              }}>
                <li style={{ marginBottom: 8 }}>
                  Your average mood is <span style={{ fontWeight: 600, color: getMoodColor(moodData.averageMood) }}>{moodData.averageMood}</span> ({getMoodText(Math.round(moodData.averageMood))})
                </li>
                <li style={{ marginBottom: 8 }}>
                  Your most common mood is <span style={{ fontWeight: 600, color: getMoodColor(moodData.mostFrequentMood) }}>{moodData.mostFrequentMood}</span> ({getMoodText(moodData.mostFrequentMood)})
                </li>
                <li style={{ marginBottom: 8 }}>
                  Your mood range is from <span style={{ fontWeight: 600, color: getMoodColor(moodData.lowestMood) }}>{moodData.lowestMood}</span> to <span style={{ fontWeight: 600, color: getMoodColor(moodData.highestMood) }}>{moodData.highestMood}</span>
                </li>
                <li style={{ marginBottom: 8 }}>
                  Most frequent emotion: <span style={{ fontWeight: 600, color: darkMode ? '#8ab4f8' : '#2c6bed' }}>
                    {Object.entries(moodData.emotionCounts)
                      .sort((a, b) => b[1] - a[1])[0]?.[0] || "None"}
                  </span>
                </li>
              </ul>
            </div>
            
            {/* Word Cloud */}
            <div style={{ 
              flex: '1 1 450px', 
              minHeight: '300px',
              position: 'relative',
              padding: '20px',
              background: darkMode ? 'rgba(30, 30, 32, 0.5)' : 'rgba(245, 245, 250, 0.5)',
              borderRadius: '18px',
              boxShadow: 'inset 0 0 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}>
              <h4 style={{ 
                fontSize: 20, 
                fontWeight: 600, 
                marginBottom: 20, 
                color: darkMode ? '#fff' : '#000',
                textAlign: 'center'
              }}>
                Word & Emotion Cloud
              </h4>
              
              {/* Custom Word Cloud implementation */}
              <div style={{ 
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                height: '250px',
                overflow: 'hidden',
              }}>
                {moodData.wordCloudData && moodData.wordCloudData.length > 0 ? (
                  moodData.wordCloudData.map((word, index) => {
                    // Calculate size based on frequency (value)
                    const minSize = 14;
                    const maxSize = 42;
                    const range = maxSize - minSize;
                    const maxValue = Math.max(...moodData.wordCloudData.map(w => w.value));
                    const size = minSize + (word.value / maxValue) * range;
                    
                    // Different colors for emotions vs. regular words
                    const color = word.isEmotion 
                      ? (darkMode ? '#ff9580' : '#e74c3c') // Red for emotions
                      : (darkMode 
                          ? ['#8ab4f8', '#a5d6a7', '#ffcc80', '#ef9a9a', '#b39ddb'][index % 5] // Colorful in dark mode
                          : ['#2c6bed', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6'][index % 5]); // Colorful in light mode
                    
                    // Different rotation for visual interest
                    const rotation = [-15, -5, 0, 5, 15][Math.floor(Math.random() * 5)];
                    
                    return (
                      <div 
                        key={index}
                        style={{ 
                          fontSize: `${size}px`,
                          fontWeight: word.isEmotion ? 700 : (size > 24 ? 600 : 400),
                          color: color,
                          padding: '5px',
                          transform: `rotate(${rotation}deg)`,
                          opacity: (0.7 + (word.value / maxValue) * 0.3),
                          transition: 'all 0.2s ease',
                          cursor: 'default',
                          textShadow: word.isEmotion 
                            ? `0 1px 2px rgba(0,0,0,0.2)` 
                            : 'none',
                          '&:hover': {
                            transform: 'scale(1.1) rotate(0deg)',
                            opacity: 1
                          }
                        }}
                      >
                        {word.text}
                      </div>
                    );
                  })
                ) : (
                  <div style={{ color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                    Not enough journal data to generate word cloud
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoodTracker;
