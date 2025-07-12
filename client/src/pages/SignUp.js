import React, { useState } from 'react';
import axios from '../api/axios'; // Assumes baseURL is configured
import { useNavigate } from 'react-router-dom';
import '../css/auth.css';

const SignUp = () => {
  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' });
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await axios.post('/auth/register', {
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate('/signin');
    } catch (err) {
      setFormError(err.response?.data?.message || 'Signup failed');
      setTimeout(() => setFormError(''), 5000);
    }
  };

  return (
    <div className="auth-container">
      {formError && (
        <div className="popup-error">
          {formError}
          <button className="close-btn" onClick={() => setFormError('')}>×</button>
        </div>
      )}      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign Up</h2>

        <div className="auth-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="auth-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="auth-btn">Sign Up</button>

        <div className="auth-footer">
          Already have an account? <a href="/signin">Sign In</a>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
