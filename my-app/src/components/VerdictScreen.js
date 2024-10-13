import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerdictScreen = ({ gameId }) => {
  const [verdict, setVerdict] = useState(null);

  useEffect(() => {
    axios.post('http://localhost:5000/api/verdict', { game_id: gameId })
      .then(response => setVerdict(response.data.verdict))
      .catch(error => console.error('Error fetching verdict:', error));
  }, [gameId]);

  return (
    <div>
      <h1>Verdict</h1>
      {verdict ? <p>{verdict}</p> : <p>Loading verdict...</p>}
    </div>
  );
};

export default VerdictScreen;
