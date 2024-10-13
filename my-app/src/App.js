import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import CaseSelection from './components/CaseSelection';
import GameScreen from './components/GameScreen';
import VerdictScreen from './components/VerdictScreen';

function App() {
  const [gameId, setGameId] = useState(null);
  const [playerId, setPlayerId] = useState(null);  // Dynamically set player ID
  const [role, setRole] = useState(null);  // Set role dynamically (Plaintiff/Defendant)
  const [showVerdict, setShowVerdict] = useState(false);
  const [caseDetails, setCaseDetails] = useState(null);
  const [caseFile, setCaseFile] = useState(null);

  // Handle case selection and game start
  const handleCaseSelect = (caseName) => {
    const playerRole = window.prompt("Enter your role (Plaintiff or Defendant):");  // Allow player to choose role
    if (playerRole !== "Plaintiff" && playerRole !== "Defendant") {
      alert("Invalid role. Please choose either 'Plaintiff' or 'Defendant'.");
      return;
    }
    const playerId = playerRole === "Plaintiff" ? "player1_id" : "player2_id";  // Assign player ID based on role
    setRole(playerRole);
    setPlayerId(playerId);

    // Start game by fetching case details
    axios.post('http://localhost:5000/api/start_game', {
      game_id: 'game1',
      case_name: caseName,
      player1_id: 'player1_id',  // Static player IDs for now
      player2_id: 'player2_id'
    })
    .then(response => {
      setGameId('game1');
      setCaseDetails({
        name: caseName,
        description: response.data.case_description,
      });
      if (playerRole === "Plaintiff") {
        setCaseFile(response.data.plaintiff_file);  // Show plaintiff file
      } else {
        setCaseFile(response.data.defendant_file);  // Show defendant file
      }
    })
    .catch(error => console.error('Error starting game:', error));
  };

  const handleArgumentSubmit = () => {
    setShowVerdict(true);  // Show verdict after submitting arguments
  };

  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Login</Link>
          <Link to="/home">Home</Link>
          <Link to="/game">Game</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />

          {/* Game Route */}
          <Route path="/game" element={
            <div>
              {!gameId ? (
                <CaseSelection onCaseSelect={handleCaseSelect} />
              ) : !showVerdict ? (
                <>
                  <h2>Case: {caseDetails?.name}</h2>
                  <p>Description: {caseDetails?.description}</p>
                  <p>Your role: {role}</p>
                  <p>Your case file: {caseFile}</p>
                  <GameScreen
                    gameId={gameId}
                    playerId={playerId}
                    role={role}
                    onSubmit={handleArgumentSubmit}
                  />
                </>
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
