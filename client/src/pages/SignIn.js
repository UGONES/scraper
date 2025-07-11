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
      const { data } = await axios.post('/auth/login', { email, password });
      /* data = { token, role, username, userId, email } */
      if (!data?.token) {
        return setFormError('Login failed: Invalid response from server');
      }
      login(data);               // ✅ ONE correct call
      navigate('/dashboard');    // ✅ let DashboardRouter decide user/admin
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setFormError(msg);
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
