import React, { useState } from 'react';
import InputField from '../components/InputField';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const { token } = await loginUser(form);
      localStorage.setItem('token', token);
      navigate('/board');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
          <InputField label="Password" type="password" name="password" value={form.password} onChange={handleChange} />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="login-button">
          Log In
        </button>
        <p className="auth-switch-text">
          Don't have an account? <a href="/register" className="auth-link">Register here</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
