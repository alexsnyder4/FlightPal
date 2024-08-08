// src/Components/Register.js
import React, { useState } from 'react';
import { registerUser } from '../Services/api'; // Assuming you will create this function

const Register = () => {
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      await registerUser({ fName, lName, email, password });
      console.log('Registration successful');
      // Redirect to login page or home page
    } catch (err) {
      setError('Registration failed.');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        value={fName}
        onChange={(e) => setFName(e.target.value)}
        placeholder="First Name"
      />
      <input
        type="text"
        value={lName}
        onChange={(e) => setLName(e.target.value)}
        placeholder="Last Name"
      />
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
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm Password"
      />
      <button type="submit">Register</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Register;
