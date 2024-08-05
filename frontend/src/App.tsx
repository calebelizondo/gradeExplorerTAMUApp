import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Dashboard from './Dashboard';

function App() {

  //needs to sendHeight to dynamically size parent iframe on embed
  useEffect(() => {
    const sendHeight = () => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: 'SET_HEIGHT', height }, '*');
    };

    sendHeight();
    window.addEventListener('resize', sendHeight);

    return () => window.removeEventListener('resize', sendHeight);
  }, []);

  return (
    <Dashboard />
  );
}

export default App;
