// src/pages/LobbyCreation.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LobbyCreation.css'; // Import a CSS file for styling

function LobbyCreation() {
  const [prompt, setPrompt] = useState('');
  const [rounds, setRounds] = useState(1);
  const [time, setTime] = useState(30);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle lobby creation logic here
    console.log('Lobby created with:', { prompt, rounds, time });
  };

  return (
    <div className="lobby-creation-container">
      <Link to="/home" className="back-button">Back to Home</Link>
      <header className="header">
        <h1 className="title">Create Lobby</h1>
      </header>
      <main className="main-content">
        <form onSubmit={handleSubmit} className="lobby-form">
          <div className="form-group">
            <label htmlFor="prompt">Debate Prompt:</label>
            <input
              type="text"
              id="prompt"
              className="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rounds">Number of Rounds:</label>
            <select
              id="rounds"
              className="rounds-select"
              value={rounds}
              onChange={(e) => setRounds(e.target.value)}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="time">Time per Round:</label>
            <select
              id="time"
              className="time-select"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={120}>2 minutes</option>
            </select>
          </div>
          <button type="submit" className="create-lobby-button">Create Lobby</button>
        </form>
      </main>
      <footer className="footer">
      </footer>
    </div>
  );
}

export default LobbyCreation;
