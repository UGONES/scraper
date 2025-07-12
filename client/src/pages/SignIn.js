import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/auth.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    console.log('[DEBUG] Submitting login with:', { email, password });

    try {
      const { data } = await axios.post('/auth/login', { email, password });

      console.log('[DEBUG] Response data:', data);

      if (!data?.token) {
        return setFormError('Login failed: Invalid response from server');
      }

      login(data);               // ✅ Context-based login
      navigate('/dashboard');    // ✅ Let DashboardRouter route by role
    } catch (err) {
      console.error('[DEBUG] Login error response:', err.response?.data || err.message);
      const msg = err.response?.data?.message || 'Login failed';
      setFormError(msg);
      setTimeout(() => setFormError(''), 5000);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign In</h2>

        {formError && (
          <div className="popup-error">
            {formError}
            <button className="close-btn" onClick={() => setFormError('')}>×</button>
          </div>
        )}

        <div className="auth-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="auth-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="auth-btn" type="submit">Sign In</button>

        <div className="auth-footer">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
