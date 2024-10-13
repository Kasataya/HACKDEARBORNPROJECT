import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GameScreen = ({ gameId, playerId, role, onSubmit }) => {
  const [argument, setArgument] = useState('');
  const [currentTurn, setCurrentTurn] = useState(null);
  const [opponentArguments, setOpponentArguments] = useState([]);

  useEffect(() => {
    // Function to fetch the current game state
    const fetchGameState = () => {
      axios.post('http://localhost:5000/api/game_state', { game_id: gameId })
        .then(response => {
          setCurrentTurn(response.data.turn);
          // Set opponent's arguments
          const opponentRole = role === 'Plaintiff' ? 'defendant' : 'plaintiff';
          setOpponentArguments(response.data.arguments[opponentRole]);
        })
        .catch(error => console.error('Error fetching game state:', error));
    };

    fetchGameState();

    // Poll the game state every 3 seconds
    const interval = setInterval(fetchGameState, 3000);

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [gameId, role]);

  const handleArgumentSubmit = () => {
    if (currentTurn !== playerId) {
      alert("It's not your turn yet!");
      return;
    }

    if (argument.trim() === '') {
      alert("Argument cannot be empty.");
      return;
    }

    // Submit the argument
    axios.post('http://localhost:5000/api/submit_argument', {
      game_id: gameId,
      player_id: playerId,
      argument: argument
    })
    .then(response => {
      onSubmit(); // Notify parent that the argument is submitted
      setArgument(''); // Clear the input field after submission
      // Fetch the updated game state
      axios.post('http://localhost:5000/api/game_state', { game_id: gameId })
        .then(response => {
          setCurrentTurn(response.data.turn);
        })
        .catch(error => console.error('Error fetching game state:', error));
    })
    .catch(error => {
      console.error('Error submitting argument:', error);
      alert('Error submitting argument. Please try again.');
    });
  };

  return (
    <div>
      <h2>Submit your argument ({role})</h2>
      <textarea value={argument} onChange={e => setArgument(e.target.value)} />
      <button onClick={handleArgumentSubmit}>Submit Argument</button>
      <p>{currentTurn === playerId ? 'Your turn' : 'Waiting for opponent...'}</p>
      {opponentArguments.length > 0 && (
        <div>
          <h3>Opponent's Arguments:</h3>
          <ul>
            {opponentArguments.map((arg, index) => (
              <li key={index}>{arg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GameScreen;
