import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #2c2c2c',
        },
        success: { iconTheme: { primary: '#34A853', secondary: '#fff' } },
        error: { iconTheme: { primary: '#EA4335', secondary: '#fff' } },
      }}
    />
    <App />
  </React.StrictMode>,
);
