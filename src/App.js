// App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [response, setResponse] = useState('');

  // Fetch recommendations based on query and location
  const fetchRecommendations = async () => {
    // This would call your backend API in practice
    // For demo, we use dummy data
    setRecommendations([
      { id: 1, text: 'Best momos at Local Street' },
      { id: 2, text: 'Try the spicy noodles at Food Plaza' }
    ]);
  };

  // Submit a new recommendation response
  const submitResponse = () => {
    // Post response to backend here
    alert('Thanks for your response!');
    setResponse('');
  };

  return (
    <div style={{ margin: 20 }}>
      <h1>Food Recommendation Platform</h1>
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Your food query (e.g. best momos)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: 300, marginRight: 10 }}
        />
        <input
          type="text"
          placeholder="Location (city or area)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={{ width: 200, marginRight: 10 }}
        />
        <button onClick={fetchRecommendations}>Search</button>
      </div>
      <div>
        <h3>Recommendations:</h3>
        {recommendations.length === 0 && <div>No recommendations yet.</div>}
        <ul>
          {recommendations.map((rec) => (
            <li key={rec.id}>{rec.text}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginTop: 30 }}>
        <h3>Submit a Response</h3>
        <textarea
          placeholder="Your response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          rows={4}
          cols={50}
        />
        <br />
        <button onClick={submitResponse}>Submit</button>
      </div>
    </div>
  );
}

export default App;
