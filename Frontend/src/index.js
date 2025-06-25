import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Enable console logging for development
console.log('🎲 Guessing Game Frontend Started');
console.log('🔧 Environment:', process.env.NODE_ENV);
console.log('🌐 API URL: http://localhost:8000/api');