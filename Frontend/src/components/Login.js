import React, { useState } from 'react';
import { apiService } from '../services/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Attempting to login with username:', username);
      const user = await apiService.getOrCreateUser(username.trim());
      console.log('Login successful:', user);
      onLogin(user);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">🎲 Guessing Game</h1>
      <p className="subtitle">Enter your username to start playing!</p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="input"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            maxLength={50}
          />
        </div>

        {error && (
          <div className="message error">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="button"
          disabled={loading || !username.trim()}
        >
          {loading ? 'Loading...' : 'Start Playing'}
        </button>
      </form>

      <div className="message info" style={{ marginTop: '30px' }}>
        <strong>How to play:</strong><br />
        Guess if the next random number (0-1000) will be higher or lower than the current one!
      </div>
    </div>
  );
};

export default Login;