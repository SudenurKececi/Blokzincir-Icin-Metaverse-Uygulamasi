import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@google/model-viewer';


import App from './App.js';


import { Buffer } from 'buffer';
window.Buffer = Buffer;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


