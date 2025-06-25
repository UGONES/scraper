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

    try {
      const res = await axios.post('/auth/login', { email, password });

      if (res.data?.token && res.data?.username) {
        const { token, username, userId, role } = res.data;
        const userPayload = { username, userId, role, email: res.data.email || '' };
        login(token, userPayload, navigate); // ✅ Updated login usage
      } else {
        setFormError('Login failed: Invalid response from server');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setFormError(message);
    }
  };

  return (
    <div className="auth-container">
      {/* Your carousel code stays unchanged */}

      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign In</h2>

        {formError && <div className="form-error">{formError}</div>}

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
