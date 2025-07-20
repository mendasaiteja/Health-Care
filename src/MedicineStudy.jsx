import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';
import './MedicineStudy.css';

const MedicineStudy = () => {
  const [prescriptionInput, setPrescriptionInput] = useState('');
  const [sideEffectsOutput, setSideEffectsOutput] = useState('Prevention techniques information will appear here.');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getPreventionTips = async (text) => {
    const prompt = `Based on the following medical prescription, list any prevention techniques or precautions associated with the medications mentioned. 
If multiple medications are included, explain prevention tips for each. 
If no specific medication can be identified, clearly mention that. 
Use simple, easy-to-understand language suitable for patients.

Prescription:
${text}

Prevention Techniques:`;

    const chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAKVhbxpQz71nC7DPhCv6MGvNDu0Af-CTc";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.error.message}`);
      }

      const result = await response.json();
      const textResult = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (textResult) {
        setSideEffectsOutput(textResult.replace(/\n/g, '\n'));
      } else {
        setSideEffectsOutput('No response. Try again.');
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      setErrorMessage("Failed to fetch prevention techniques.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = () => {
    if (!prescriptionInput.trim()) {
      setErrorMessage("Please enter or upload a prescription.");
      return;
    }
    setErrorMessage('');
    setIsLoading(true);
    getPreventionTips(prescriptionInput);
  };

 
  return (
    <div className="container">
      <h1>Medical Prescription Prevention Techniques Checker</h1>

      <div className="form-group">
        <label htmlFor="prescriptionInput">Enter Medical Prescription:</label>
        <textarea
          id="prescriptionInput"
          placeholder="e.g., Rx: Paracetamol 500mg – Take 1 tablet after food every 6 hours. What precautions should I follow?"
          value={prescriptionInput}
          onChange={(e) => setPrescriptionInput(e.target.value)}
          rows="6"
        ></textarea>
      </div>


      <button
        className="submit-btn"
        onClick={handleTextSubmit}
        disabled={isLoading || !prescriptionInput.trim()}
      >
        {isLoading ? 'Processing...' : 'Get Prevention Techniques'}
      </button>

      {errorMessage && <div className="error-box">{errorMessage}</div>}

      <div className="output-section">
        <label>Prevention Techniques:</label>
        <div className="output-box">{sideEffectsOutput}</div>
      </div>
    </div>
  );
};

export default MedicineStudy;
