// src/pages/Contact.js (or components/Contact.js if you keep it there)
import { useState } from 'react';
import '../css/auth.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log('Contact form submitted:', form);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Contact Us:</h2>
      <p className="auth-description">We'd love to hear from you! Please fill out the form below.</p>
      {submitted && <p className="message success">Thanks for reaching out! We'll get back to you soon.</p>}

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
