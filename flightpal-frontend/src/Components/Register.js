import React, { useState } from 'react';
import { registerUser } from '../Services/api';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './CSS/Login.css';

const Register = () => {
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await registerUser({ fName, lName, email, password });
      console.log('Registration successful');
      alert('Registration Successful!');
      navigate(`/login`); // Redirect to login page
    } catch (err) {
      setError('Registration failed.');
    }
  };

  const handleBack = () => {
    clearForm();
    navigate('/login');
  };

  const clearForm = () => {
    setFName('');
    setLName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="login-container-wrapper">
      <div className="login-container">
        <h1>FlightPal</h1>
        <img src="LogoPropellor.webp" alt="Site Logo" className="login-logo" />
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={fName}
            onChange={(e) => setFName(e.target.value)}
            placeholder="First Name"
            required
          />
          <input
            type="text"
            value={lName}
            onChange={(e) => setLName(e.target.value)}
            placeholder="Last Name"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          {error && <p>{error}</p>}
          <button className="button" type="submit">
            Register
          </button>
          <button className="button" type="button" onClick={handleBack}>
            Back
          </button>
        </form>
      </div>
    </div> 
  );
};

export default Register;
