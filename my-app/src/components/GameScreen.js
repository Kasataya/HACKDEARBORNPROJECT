import React, { useState } from 'react';
import axios from 'axios';

const GameScreen = ({ gameId, playerId, role, onSubmit }) => {
  const [argument, setArgument] = useState('');
  const [currentTurn, setCurrentTurn] = useState('Plaintiff'); // Keep track of turns

  const handleArgumentSubmit = () => {
    if (currentTurn !== role) {
      alert("It's not your turn yet!");
      return;
    }

    // Submit the argument
    axios.post('http://localhost:5000/api/submit_argument', {
      game_id: gameId,
      player_id: playerId,
      argument: argument
    })
    .then(response => {
      // Switch turns after submission
      const nextTurn = currentTurn === 'Plaintiff' ? 'Defendant' : 'Plaintiff';
      setCurrentTurn(nextTurn);
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
      <p>Current Turn: {currentTurn}</p> {/* Show current turn */}
    </div>
  );
};

export default GameScreen;
