import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function App() {
  // Declare a state variable to store user input
  const [inputValue, setInputValue] = useState('');

  // Function to handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      {/* Text Box component at the bottom */}
      <div className="text-box">
        <input 
          type="text" 
          placeholder="Enter text here..." 
          value={inputValue} 
          onChange={handleInputChange}
        />
        <p>You entered: {inputValue}</p>
      </div>
    </div>
  );
}

export default App;
