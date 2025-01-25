import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Importation correcte de jwtDecode

import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import MainPage from './pages/MainPage/MainPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import InfosPage from '../InfosPage/InfosPage';

// Route privée : nécessite un token valide
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />; // Redirection si non connecté
  }

  try {
    const decodedToken = jwtDecode(token); // Décodage du token
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token'); // Suppression du token expiré
      return <Navigate to="/login" />;
    }

    return children; // Affiche le contenu protégé
  } catch (error) {
    return <Navigate to="/login" />;
  }
};

// Route publique : redirige vers Dashboard si déjà connecté
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" /> : children;
};

const App = () => {
  return (
    <Routes>
      {/* Route principale (protégée) */}
      <Route path="/" element={
        <PublicRoute>
          <MainPage />
        </PublicRoute>
      } />

      {/* Route vers InfosPage (publique) */}
      <Route path="/infos" element={
        <PublicRoute>
          <InfosPage />
        </PublicRoute>
      } />

      {/* Route de connexion (publique) */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />

      {/* Route tableau de bord (protégée) */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      } />

      {/* Route 404 : Page introuvable */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
