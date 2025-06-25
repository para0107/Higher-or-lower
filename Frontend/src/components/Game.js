import React, { useState } from 'react';
import { apiService } from '../services/api';

const Game = ({ user, onBack }) => {
  const [gameState, setGameState] = useState({
    sessionId: null,
    currentNumber: null,
    consecutiveCorrect: 0,
    gameActive: false,
    gameOver: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const startNewGame = async () => {
    setLoading(true);
    setMessage('');

    try {
      console.log('Starting new game for user:', user.username);
      const gameData = await apiService.startGame(user.username);

      setGameState({
        sessionId: gameData.session_id,
        currentNumber: gameData.current_number,
        consecutiveCorrect: 0,
        gameActive: true,
        gameOver: false
      });

      setMessage(gameData.message);
      setMessageType('success');
      console.log('Game started successfully:', gameData);
    } catch (err) {
      console.error('Failed to start game:', err);
      setMessage(err.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const makeGuess = async (guess) => {
    if (!gameState.gameActive || loading) return;

    setLoading(true);
    setMessage('');

    try {
      console.log('Making guess:', guess, 'for session:', gameState.sessionId);
      const response = await apiService.makeGuess(gameState.sessionId, guess);

      if (response.game_over) {
        setGameState(prev => ({
          ...prev,
          gameActive: false,
          gameOver: true,
          consecutiveCorrect: response.consecutive_correct
        }));
        setMessage(response.message);
        setMessageType('error');
      } else {
        setGameState(prev => ({
          ...prev,
          currentNumber: response.new_number,
          consecutiveCorrect: response.consecutive_correct
        }));
        setMessage(response.message);
        setMessageType('success');
      }

      console.log('Guess response:', response);
    } catch (err) {
      console.error('Failed to make guess:', err);
      setMessage(err.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">🎲 Guessing Game</h1>
      <p className="subtitle">Welcome, {user.username}!</p>

      {!gameState.gameActive && !gameState.gameOver && (
        <div>
          <div className="message info">
            Ready to test your luck? Click below to start a new game!
          </div>
          <button
            className="button"
            onClick={startNewGame}
            disabled={loading}
          >
            {loading ? 'Starting...' : 'Start New Game'}
          </button>
        </div>
      )}

      {gameState.gameActive && (
        <div>
          <div className="current-number">
            {gameState.currentNumber}
          </div>

          <div className="streak-counter">
            🔥 Streak: {gameState.consecutiveCorrect} correct guesses
          </div>

          <div className="game-controls">
            <button
              className="button button-success"
              onClick={() => makeGuess('higher')}
              disabled={loading}
            >
              📈 Higher
            </button>
            <button
              className="button button-danger"
              onClick={() => makeGuess('lower')}
              disabled={loading}
            >
              📉 Lower
            </button>
          </div>

          {loading && <div className="loading">Making guess...</div>}
        </div>
      )}

      {gameState.gameOver && (
        <div>
          <div className="current-number" style={{ background: 'linear-gradient(135deg, #ff9a9e, #fecfef)' }}>
            Game Over!
          </div>

          <div className="streak-counter">
            🏆 Final Score: {gameState.consecutiveCorrect} correct guesses
          </div>

          <button
            className="button"
            onClick={startNewGame}
            disabled={loading}
          >
            Play Again
          </button>
        </div>
      )}

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      <div className="navigation">
        <button className="button button-secondary" onClick={onBack}>
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default Game;