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
  const [playerId, setPlayerId] = useState(null);
  const [role, setRole] = useState(null);
  const [showVerdict, setShowVerdict] = useState(false);
  const [caseDetails, setCaseDetails] = useState(null);
  const [caseFile, setCaseFile] = useState(null);
  const [waitingForOpponent, setWaitingForOpponent] = useState(false);

  // Handle case selection and game start
  const handleCaseSelect = (caseName) => {
    const playerRole = window.prompt("Enter your role (Plaintiff or Defendant):");
    if (playerRole !== "Plaintiff" && playerRole !== "Defendant") {
      alert("Invalid role. Please choose either 'Plaintiff' or 'Defendant'.");
      return;
    }
    setRole(playerRole);

    // Start game by fetching case details
    axios.post('http://localhost:5000/api/start_game', {
      case_name: caseName,
      player_role: playerRole
    })
    .then(response => {
      setGameId(response.data.game_id);
      setPlayerId(response.data.player_id);

      if (response.data.message === "Waiting for an opponent to join...") {
        alert("Waiting for an opponent to join...");
        setWaitingForOpponent(true);
        // Polling to check when the opponent joins
        const intervalId = setInterval(() => {
          axios.post('http://localhost:5000/api/game_state', { game_id: response.data.game_id })
            .then(res => {
              if (res.data.case_description) {
                // Opponent has joined
                setWaitingForOpponent(false);
                setCaseDetails({
                  name: caseName,
                  description: res.data.case_description,
                });
                setCaseFile(response.data.case_file);
                clearInterval(intervalId);
              }
            })
            .catch(err => {
              // Game not yet started
            });
        }, 3000); // Check every 3 seconds
      } else {
        setCaseDetails({
          name: caseName,
          description: response.data.case_description,
        });
        setCaseFile(response.data.case_file);
      }
    })
    .catch(error => console.error('Error starting game:', error));
  };

  const handleArgumentSubmit = () => {
    // Logic to decide when to show the verdict
    setShowVerdict(true);
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
              ) : waitingForOpponent ? (
                <p>Waiting for an opponent to join...</p>
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
