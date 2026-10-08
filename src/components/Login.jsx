import React, { useState } from 'react';
import { login } from '../services/authService';

function Login({ onLoginSuccess, onSwitchToRegister }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(credentials);
      onLoginSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed!');
    }
  };

  return (
    <div style={{ maxWidth: '350px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label><br />
          <input type="email" name="email" value={credentials.email} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label><br />
          <input type="password" name="password" value={credentials.password} onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Login</button>
      </form>
      <p style={{ marginTop: '10px' }}>
        Don't have an account?{' '}
        <button onClick={onSwitchToRegister} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
          Register here
        </button>
      </p>
    </div>
  );
}

export default Login;