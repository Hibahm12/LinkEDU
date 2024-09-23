import React from 'react';
import './Attender.css';

import { useNavigate } from 'react-router-dom'; // Import useNavigate

const navigate = useNavigate(); // Hook for navigation

const handleBackToHome = () => {
  navigate('/Espace-Etudiant/home');
};
function Attender() {
  return (
    <div className="attender-background">
           <Button variant="contained" onClick={handleBackToHome} sx={{ position: 'absolute', top: 20, left: 20 }}>
          Go Back to Home
        </Button>
    </div>
  );
}

export default Attender;
