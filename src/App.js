import React, { useState } from 'react';
import JournalEntry from './JournalEntry.jsx';

function App() {
  const [entries, setEntries] = useState([]);

  const handleAddEntry = (entry) => {
    setEntries([entry, ...entries]);
  };

  return (
    <div>
      <h1>Journal & Mood Analyzer</h1>
      <p>Welcome to your daily journal and mood tracking app!</p>
      <JournalEntry onAddEntry={handleAddEntry} />
      <div style={{ maxWidth: 400, margin: '2rem auto' }}>
        {entries.length > 0 && <h3>Recent Entries</h3>}
        {entries.map((entry, idx) => (
          <div key={idx} style={{ background: '#fafbfc', borderRadius: 12, padding: 16, marginBottom: 12, boxShadow: '0 1px 4px #eee' }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{new Date(entry.date).toLocaleString()}</div>
            <div style={{ marginBottom: 6 }}>{entry.journal}</div>
            <div style={{ fontWeight: 500, color: '#007aff' }}>Mood: {entry.mood}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
