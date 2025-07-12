// src/pages/Contact.js (or components/Contact.js if you keep it there)
import { useState, useEffect } from 'react';
import axios from '../api/axios';
import '../css/auth.css';
import '../css/responsive.css'; // Assuming you have a separate CSS file for contact styling

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (submitted) setSubmitted(false); // Reset if user edits form after submitting
  };
  // Add this effect to auto-dismiss messages
  useEffect(() => {
    if (formError || successMsg) {
      const timer = setTimeout(() => {
        setFormError('');
        setSuccessMsg('');
      }, 4000); // 4 seconds

      return () => clearTimeout(timer);
    }
  }, [formError, successMsg]);

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');
    setTimeout(() => setSubmitted(false), 5000); // Reset submitted state after 5 seconds
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

      <div className="auth-header">
        <h2 className="auth-title">Contact Us:</h2>
        <p className="auth-description">We'd love to hear from you! Please fill out the form below.</p>
      </div>
      {formError && (
        <div className="popup-message error">
          {formError}
        </div>
      )}

      {successMsg && (
        <div className="popup-message success">
          {successMsg}
        </div>
      )}

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
