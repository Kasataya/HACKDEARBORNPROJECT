import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerdictScreen = ({ gameId }) => {
  const [verdict, setVerdict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.post('http://localhost:5000/api/verdict', { game_id: gameId })
      .then(response => {
        if (response.data.verdict) {
          const verdictText = response.data.verdict;
          const winnerMatch = verdictText.match(/Winner:\s*(Plaintiff|Defendant)/i);
          const reasoningMatch = verdictText.match(/Reasoning:\s*([\s\S]*)/i);

          setVerdict({
            winner: winnerMatch ? winnerMatch[1] : 'Unknown',
            reasoning: reasoningMatch ? reasoningMatch[1].trim() : 'No reasoning provided.'
          });
        } else if (response.data.error) {
          setError(response.data.error);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching verdict:', error);
        setError('An error occurred while fetching the verdict.');
        setLoading(false);
      });
  }, [gameId]);

  if (loading) {
    return <p>Loading verdict...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Verdict</h1>
      {verdict && (
        <>
          <h2>Winner: {verdict.winner}</h2>
          <h3>Reasoning:</h3>
          <p>{verdict.reasoning}</p>
        </>
      )}
    </div>
  );
};

export default VerdictScreen;
