import React from 'react';

const Menu = ({ user, onStartGame, onViewStats, onLogout }) => {
  return (
    <div className="container">
      <h1 className="title">🎲 Guessing Game</h1>
      <p className="subtitle">Welcome back, {user.username}!</p>

      <div className="message info">
        What would you like to do today?
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
        <button className="button" onClick={onStartGame}>
          🎮 Start New Game
        </button>

        <button className="button button-secondary" onClick={onViewStats}>
          📊 View Statistics
        </button>

        <button className="button" style={{ background: 'linear-gradient(135deg, #ffeaa7, #fab1a0)' }} onClick={onLogout}>
          👋 Logout
        </button>
      </div>

      <div className="message" style={{
        background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
        marginTop: '30px',
        color: '#333',
        border: '2px solid rgba(255, 255, 255, 0.5)'
      }}>
        <strong>Game Rules:</strong><br />
        • A random number (0-1000) is shown<br />
        • Guess if the next number will be higher or lower<br />
        • Keep guessing correctly to build your streak<br />
        • One wrong guess ends the game!
      </div>
    </div>
  );
};

export default Menu;