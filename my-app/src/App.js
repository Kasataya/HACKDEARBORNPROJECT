// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Login</Link>
          <Link to="/home">Home</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Login />} /> {/* Login page as the first route */}
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
