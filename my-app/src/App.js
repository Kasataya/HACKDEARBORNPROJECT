import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import { database } from './firebase'; // Adjust the path if necessary
import { ref, set, onValue } from 'firebase/database';

function App() {
  // Declare state variables
  const [inputValue, setInputValue] = useState('');
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Function to handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function to add new entry to the database
  const addEntry = async () => {
    if (inputValue.trim() === '') return; // Prevent empty entries

    setIsLoading(true); // Show loading indicator

    const entriesRef = ref(database, 'entries');
    const newEntryRef = ref(database, `entries/${Date.now()}`);
    await set(newEntryRef, inputValue); // Send data to Firebase
    setInputValue(''); // Clear input after adding

    setIsLoading(false); // Hide loading indicator
  };

  // Listen for changes in the database
  useEffect(() => {
    const entriesRef = ref(database, 'entries');
    onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      const entriesList = data ? Object.values(data) : [];
      setEntries(entriesList);
    });
  }, []);

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
        {isLoading && <div className="loading-icon">🔄</div>} {/* Loading icon */}
        <input 
          type="text" 
          placeholder="Enter text here..." 
          value={inputValue} 
          onChange={handleInputChange}
        />
        <button onClick={addEntry}>Add Entry</button>
        <p>You entered: {inputValue}</p>
      </div>

      {/* Side view of texts entered */}
      <div className="entries-view">
        <h3>Shared Entries</h3>
        <ul>
          {entries.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
