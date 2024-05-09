// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

function App() {
  return (
      <div>
        
        <div>
          <Link to="/registration">Регистрация</Link>
        </div>
      
        <div>
          <Link to="/login">Вход</Link> 
        </div>
        
      </div>
  );
}

export default App;
