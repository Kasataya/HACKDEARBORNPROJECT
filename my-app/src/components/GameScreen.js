import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for API calls

const GameScreen = ({ gameId, playerId, role, onSubmit }) => {
  const [argument, setArgument] = useState('');

  const handleArgumentSubmit = () => {
    axios.post('http://localhost:5000/api/submit_argument', {
      game_id: gameId,
      player_id: playerId,
      argument: argument
    })
    .then(response => {
      onSubmit(); // Notify parent that the argument is submitted
      setArgument(''); // Clear the input field after submission
    })
    .catch(error => console.error('Error submitting argument:', error));
  };

  return (
    <div>
      <h2>Submit your argument ({role})</h2>
      <textarea value={argument} onChange={e => setArgument(e.target.value)} />
      <button onClick={handleArgumentSubmit}>Submit Argument</button>
    </div>
  );
};

export default GameScreen;
