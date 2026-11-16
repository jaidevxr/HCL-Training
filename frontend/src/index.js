// This is the starting point of the React app
// It just puts the App component on the screen

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Find the div with id="root" in index.html and render the App there
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
