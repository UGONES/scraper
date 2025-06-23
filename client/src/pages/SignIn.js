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
      const res = await axios.post('/auth/login', { email, password }); // FIX: Use correct backend route for login

      if (res.data?.token) {
        login(res.data.token, navigate); // ✅ pass navigate into login
      } else {
        setFormError('Invalid response from server');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1" />
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2" />
          <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3" />
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="#" className="d-block w-100 carousel-img" alt="First Slide" />
          </div>
          <div className="carousel-item">
            <img src="#" className="d-block w-100 carousel-img" alt="Second Slide" />
          </div>
          <div className="carousel-item">
            <img src="#" className="d-block w-100 carousel-img" alt="Third Slide" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      {formError && <div className="form-error">{formError}</div>}
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Sign In</h2>

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
