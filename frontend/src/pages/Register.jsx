import React, { useState } from 'react';
import InputField from '../components/InputField';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await registerUser(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-20 p-6 rounded-xl shadow-xl border bg-gradient-to-br from-white via-indigo-50 to-blue-50">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <InputField label="Username" type="text" name="username" value={form.username} onChange={handleChange} />
          <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} />
          <InputField label="Password" type="password" name="password" value={form.password} onChange={handleChange} />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
