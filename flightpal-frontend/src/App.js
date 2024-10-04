import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // Import HashRouter
import Login from './Components/Login';
import Register from './Components/Register';
import UserHome from './Components/UserHome';
import { EventProvider } from './Components/EventContext';
import './Components/CSS/Login.css';

function App() {
  return (
    <EventProvider>
      <Router> {/* No need for basename with HashRouter */}
        <div className="App-container">
          <header className="App-header">
            <h1>FlightPal</h1>
          </header>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/userhome/:userId" element={<UserHome />} />
            <Route path="/" element={<Login />} /> {/* Default route */}
          </Routes>
        </div>
      </Router>
    </EventProvider>
  );
}

export default App;
