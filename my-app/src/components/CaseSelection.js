import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CaseSelection.css'; // Import the CSS file

const CaseSelection = ({ onCaseSelect }) => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch available cases from the Flask backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/cases')
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
    <div className="case-selection-container">
      <h1 className="title">Select a Case</h1>
      <div className="main-content">
        {cases.length > 0 ? (
          <ul className="case-list">
            {cases.map((caseItem) => (
              <li key={caseItem.name} className="case-item">
                <button className="case-button" onClick={() => onCaseSelect(caseItem.name)}>
                  {caseItem.name}: {caseItem.description}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No cases available</p>
        )}
      </div>
    </div>
  );
};

export default CaseSelection;
