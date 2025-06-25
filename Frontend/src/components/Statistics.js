import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const Statistics = ({ user, onBack }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clearingStats, setClearingStats] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadStatistics();
  }, [user.username]);

  const loadStatistics = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Loading statistics for user:', user.username);
      const statsData = await apiService.getStatistics(user.username);
      setStats(statsData);
      console.log('Statistics loaded:', statsData);
    } catch (err) {
      console.error('Failed to load statistics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearStatistics = async () => {
    if (!window.confirm('Are you sure you want to clear all your game statistics? This action cannot be undone.')) {
      return;
    }

    setClearingStats(true);
    setMessage('');

    try {
      console.log('Clearing statistics for user:', user.username);
      const response = await apiService.clearStatistics(user.username);
      setMessage(response.message);

      // Reload statistics to show updated data
      await loadStatistics();
      console.log('Statistics cleared successfully');
    } catch (err) {
      console.error('Failed to clear statistics:', err);
      setError(err.message);
    } finally {
      setClearingStats(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1 className="title">📊 Statistics</h1>
        <div className="loading">Loading your statistics...</div>
        <div className="navigation">
          <button className="button button-secondary" onClick={onBack}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="title">📊 Statistics</h1>
      <p className="subtitle">{user.username}'s Game Performance</p>

      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      {message && (
        <div className="message success">
          {message}
        </div>
      )}

      {stats && (
        <div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total_games}</div>
              <div className="stat-label">Games Played</div>
            </div>
            <div className="stat-card" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>
              <div className="stat-value">{stats.longest_streak}</div>
              <div className="stat-label">Best Streak</div>
            </div>
          </div>

          {stats.total_games === 0 ? (
            <div className="message info">
              <strong>No games played yet!</strong><br />
              Start your first game to see your statistics here.
            </div>
          ) : (
            <div className="message" style={{
              background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
              color: '#333',
              border: '2px solid rgba(255, 255, 255, 0.5)'
            }}>
              <strong>Performance Summary:</strong><br />
              You've completed {stats.total_games} game{stats.total_games !== 1 ? 's' : ''} with your best streak being {stats.longest_streak} correct guess{stats.longest_streak !== 1 ? 'es' : ''} in a row!
              {stats.longest_streak >= 10 && ' 🏆 Amazing performance!'}
              {stats.longest_streak >= 5 && stats.longest_streak < 10 && ' 🔥 Great job!'}
            </div>
          )}
        </div>
      )}

      <div className="navigation">
        <button className="button button-secondary" onClick={onBack}>
          Back to Menu
        </button>

        {stats && stats.total_games > 0 && (
          <button
            className="button"
            style={{ background: 'linear-gradient(135deg, #fa709a, #fee140)' }}
            onClick={clearStatistics}
            disabled={clearingStats}
          >
            {clearingStats ? 'Clearing...' : '🗑️ Clear Stats'}
          </button>
        )}

        <button
          className="button"
          onClick={loadStatistics}
          disabled={loading}
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
};

export default Statistics;