// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import a CSS file for styling

function Home() {
  return (
    <div className="home-container">
      <header className="header">
        <h1 className="title">JudgedByAI</h1>
        <p className="subtitle">Debate your Friends!</p>
      </header>
      <main className="main-content">
        <div className="button-container">
          <div className="input-container">
            <input
              type="text"
              className="game-code-input"
              placeholder="Enter Game Code"
            />
            <button className="play-button">Play Now</button>
          </div>
          <Link to="/lobbycreation" className="join-button">Create Lobby</Link>
        </div>
        <div className="rules">
          <h2>How to Play</h2>
          <ul>
            <li>Two debaters will be given a case to defend</li>
            <li>They will be given some time to formulate they're argument</li>
            <li>They will each be given time to Debate their argument</li>
            <li>After each is done the Judge will give feedback and decide the winner</li>
            <li>Have fun and compete with friends!</li>
          </ul>
        </div>
      </main>
      <footer className="footer">
        <p>©hey there</p>
      </footer>
    </div>
  );
}

export default Home;
