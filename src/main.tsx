import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/game.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing app root');
createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
