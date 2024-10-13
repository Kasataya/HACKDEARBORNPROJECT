import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GameScreen = ({ gameId, playerId, role, onGameEnd }) => {
  const [argument, setArgument] = useState('');
  const [currentTurn, setCurrentTurn] = useState(null);
  const [opponentArguments, setOpponentArguments] = useState([]);
  const [turnCount, setTurnCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGameState = () => {
      axios.post('http://localhost:5000/api/game_state', { game_id: gameId })
        .then(response => {
          setCurrentTurn(response.data.turn);
          setTurnCount(response.data.turn_count);
          const opponentRole = role === 'Plaintiff' ? 'defendant' : 'plaintiff';
          setOpponentArguments(response.data.arguments[opponentRole]);
        })
        .catch(error => console.error('Error fetching game state:', error));
    };

    fetchGameState();
    const interval = setInterval(fetchGameState, 3000);
    return () => clearInterval(interval);
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

    setIsLoading(true);
    axios.post('http://localhost:5000/api/submit_argument', {
      game_id: gameId,
      player_id: playerId,
      argument: argument
    })
    .then(response => {
      setArgument('');
      setIsLoading(false);
      if (response.data.turn_count >= 6) {
        onGameEnd();
      }
    })
    .catch(error => {
      console.error('Error submitting argument:', error);
      alert('Error submitting argument. Please try again.');
      setIsLoading(false);
    });
  };

  return (
    <div>
      <h2>Submit your argument ({role})</h2>
      <textarea
        value={argument}
        onChange={e => setArgument(e.target.value)}
        disabled={currentTurn !== playerId || isLoading}
      />
      <button
        onClick={handleArgumentSubmit}
        disabled={currentTurn !== playerId || isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit Argument'}
      </button>
      <p>{currentTurn === playerId ? 'Your turn' : 'Waiting for opponent...'}</p>
      <p>Turn count: {turnCount}/6</p>
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
