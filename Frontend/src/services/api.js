import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Get or create user
  async getOrCreateUser(username) {
    try {
      const response = await api.post('/user', { username });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get/create user');
    }
  },

  // Start a new game
  async startGame(username) {
    try {
      const response = await api.post('/game/start', { username });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to start game');
    }
  },

  // Make a guess
  async makeGuess(sessionId, guess) {
    try {
      const response = await api.post('/game/guess', {
        session_id: sessionId,
        guess: guess
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to make guess');
    }
  },

  // Get user statistics
  async getStatistics(username) {
    try {
      const response = await api.get(`/statistics/${username}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to get statistics');
    }
  },

  // Clear user statistics
  async clearStatistics(username) {
    try {
      const response = await api.delete(`/statistics/${username}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to clear statistics');
    }
  }
};