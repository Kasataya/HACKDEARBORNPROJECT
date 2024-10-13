import React, { useState } from 'react';
import axios from 'axios'; // Add Axios import
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import CaseSelection from './components/CaseSelection';
import GameScreen from './components/GameScreen';
import VerdictScreen from './components/VerdictScreen';

function App() {
  const [gameId, setGameId] = useState(null);
  const [playerId, setPlayerId] = useState('player1_id'); // Placeholder for now
  const [role, setRole] = useState(null);
  const [showVerdict, setShowVerdict] = useState(false);

  const handleCaseSelect = (caseName) => {
    // Start the game by calling the Flask backend
    axios.post('http://localhost:5000/api/start_game', {
      game_id: 'game1', // Static game ID for now
      case_name: caseName,
      player1_id: 'player1_id',
      player2_id: 'player2_id'
    })
    .then(response => {
      setGameId('game1'); // Using a static game ID for now
      setRole('Plaintiff'); // Static role for now, adjust based on backend logic
    })
    .catch(error => console.error('Error starting game:', error));
  };

  const handleArgumentSubmit = () => {
    setShowVerdict(true); // Transition to verdict display after argument submission
  };

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Login</Link>
          <Link to="/home">Home</Link>
          <Link to="/game">Game</Link> {/* New link for the game route */}
        </nav>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/game" element={
            <div>
              {!gameId ? (
                <CaseSelection onCaseSelect={handleCaseSelect} />
              ) : !showVerdict ? (
                <GameScreen gameId={gameId} playerId={playerId} role={role} onSubmit={handleArgumentSubmit} />
              ) : (
                <VerdictScreen gameId={gameId} />
              )}
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
