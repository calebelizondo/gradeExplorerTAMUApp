import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

function App() {

  useEffect(() => {
    const fetchData = async () => {
      try {
        let apiUrl;
        if (process.env.NODE_ENV === 'development') {
          // Development environment
          apiUrl = 'http://localhost:8000/get_subject_codes';
        } else {
          // Production environment
          // Use the actual production API URL here
          apiUrl = 'https://csce315331-07b.onrender.com/datamanagement/getCategories';
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        console.log(data);

      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    
  );
}

export default App;
