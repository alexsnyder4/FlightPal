import React from 'react';
import Login from './Components/Login';
import UserList from './Components/UserList';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>FlightPal</h1>
        <Login />
        <UserList />
      </header>
    </div>
  );
}

export default App;