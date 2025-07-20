// Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <h1 className="main-title">Hello! How can I cure you today...</h1>

      <div className="button-grid">
        <button className="action-button" onClick={() => navigate('/summarize')}>Summarize</button>
        <button className="action-button" onClick={() => navigate('/prevention')}>Prevention</button>
        <button className="action-button" onClick={() => navigate('/side-effect')}>Side Effect</button>
        <button className="action-button" onClick={() => navigate('/medicine-study')}>Study About</button>
      </div>
    </div>
  );
}

export default Home;
