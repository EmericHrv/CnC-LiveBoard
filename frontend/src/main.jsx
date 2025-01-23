import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/index.css'; // Importez le fichier CSS global
import App from './App'; // Importez le composant App

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <App /> {/* Rendu du composant App */}
    </Router>
  </React.StrictMode>
);
