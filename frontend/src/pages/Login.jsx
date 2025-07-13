import React, { useState } from 'react';
import InputField from '../components/InputField';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

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
    <div className="w-full max-w-md mx-auto mt-20 p-6 rounded-xl shadow-xl border bg-gradient-to-br from-white via-indigo-50 to-blue-50">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
          <InputField label="Password" type="password" name="password" value={form.password} onChange={handleChange} />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition">
          Log In
        </button>
      </form>
    </div>
  );
};

export default Login;
