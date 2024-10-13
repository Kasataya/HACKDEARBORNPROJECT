import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CaseSelection = ({ onCaseSelect }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available cases from the Flask backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/cases') // Replace with your backend's URL
      .then(response => {
        setCases(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cases:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading cases...</p>;
  }

  return (
    <div>
      <h1>Select a Case</h1>
      {cases.length > 0 ? (
        <ul>
          {cases.map((caseItem) => (
            <li key={caseItem.name}>
              <button onClick={() => onCaseSelect(caseItem.name)}>
                {caseItem.name}: {caseItem.description}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No cases available</p>
      )}
    </div>
  );
};

export default CaseSelection;
