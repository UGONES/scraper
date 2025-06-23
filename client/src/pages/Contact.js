// src/pages/Contact.js (or components/Contact.js if you keep it there)
import { useState } from 'react';
import axios from '../api/axios';
import '../css/auth.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');
    try {
      const res = await axios.post('/contact', form);
      setSuccessMsg(res.data.message || 'Thanks for reaching out! We\'ll get back to you soon.');
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Contact Us:</h2>
      <p className="auth-description">We'd love to hear from you! Please fill out the form below.</p>
      {formError && <div className="form-error">{formError}</div>}
      {successMsg && <p className="message success">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <label className="auth-label">
          Name:
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your name"
            className="auth-input"
          />
        </label>

        <label className="auth-label">
          Email:
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            className="auth-input"
          />
        </label>

        <label className="auth-label">
          Message:
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            placeholder="Write your message here..."
            rows={4}
            className="auth-input"
          />
        </label>

        <button type="submit" className="btn btn-primary">
          Send Message
        </button>
      </form>
    </div>
  );
}
