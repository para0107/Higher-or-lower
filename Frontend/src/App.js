import React, { useState } from 'react';
import Login from './components/Login';
import Menu from './components/Menu';
import Game from './components/Game';
import Statistics from './components/Statistics';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // login, menu, game, statistics

  console.log('App render - current view:', currentView, 'user:', user);

  const handleLogin = (userData) => {
    console.log('User logged in:', userData);
    setUser(userData);
    setCurrentView('menu');
  };

  const handleLogout = () => {
    console.log('User logged out');
    setUser(null);
    setCurrentView('login');
  };

  const handleStartGame = () => {
    console.log('Starting game');
    setCurrentView('game');
  };

  const handleViewStats = () => {
    console.log('Viewing statistics');
    setCurrentView('statistics');
  };

  const handleBackToMenu = () => {
    console.log('Back to menu');
    setCurrentView('menu');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <Login onLogin={handleLogin} />;

      case 'menu':
        return (
          <Menu
            user={user}
            onStartGame={handleStartGame}
            onViewStats={handleViewStats}
            onLogout={handleLogout}
          />
        );

      case 'game':
        return (
          <Game
            user={user}
            onBack={handleBackToMenu}
          />
        );

      case 'statistics':
        return (
          <Statistics
            user={user}
            onBack={handleBackToMenu}
          />
        );

      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="app">
      {renderCurrentView()}
    </div>
  );
}

export default App;