import React, { useState } from 'react';
import { loginUser } from '../Services/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CSS/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await loginUser({ email, password });
      console.log('Login successful');
      // Redirect to user dashboard
      navigate(`/userhome/${response.data.user.userId}`); // Use navigate to redirect
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false); // Set loading state to false after completion
    }
  };

  return (
    <div className="login-container-wrapper"> 
      <div className = "login-container">
        <h1>FlightPal</h1>
        <img src='LogoPropellor.webp' alt='Site Logo' className='login-logo'/>
        <h2>Log In</h2>
        <form onSubmit={handleSubmit}>
          <input                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {error && <p>{error}</p>}
          <button className = "button" type="submit"> {isLoading ? 'Loading...' : 'Login'}</button>
          
        </form>
        <button className = "button" onClick={() => navigate('/register')}>Register</button> {/* Redirect to Register */}
      </div>
    </div>
  );
};

export default Login;
