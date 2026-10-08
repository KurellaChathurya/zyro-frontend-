import React, { useState } from 'react';
import { register } from '../services/authService';

function Register({ onSwitchToLogin }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await register(formData);
      setMessage('Registration successful! Please login.');
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed!');
    }
  };

  return (
    <div style={{ maxWidth: '350px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Register</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Name:</label><br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Register</button>
      </form>
      <p style={{ marginTop: '10px' }}>
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
          Login here
        </button>
      </p>
    </div>
  );
}

export default Register;