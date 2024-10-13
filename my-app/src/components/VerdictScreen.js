import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerdictScreen = ({ gameId }) => {
  const [verdict, setVerdict] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the verdict from the backend
    axios.post('http://localhost:5000/api/verdict', { game_id: gameId })
      .then(response => {
        setVerdict(response.data.verdict);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching verdict:', error);
        setLoading(false);
      });
  }, [gameId]);

  return (
    <div>
      <h1>Verdict</h1>
      {loading ? <p>Loading verdict...</p> : <p>{verdict}</p>}
    </div>
  );
};

export default VerdictScreen;
