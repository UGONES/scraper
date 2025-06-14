import React, { useState } from 'react';
import axios from '../api/axios'; // Assumes baseURL is set to your backend
import { useNavigate } from 'react-router-dom';
import '../css/auth.css';

const SignUp = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Updated endpoint to match backend
      await axios.post('/auth/register', form);

      // ✅ Redirect to login after successful registration
      navigate('signin');
    } catch (err) {
      console.error('Signup error:', err);
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="example@gmail.com"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
