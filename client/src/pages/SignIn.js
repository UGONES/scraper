import { useState } from 'react';
import axios from '../api/axios'; // Make sure this instance has the correct baseURL
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/auth.css';

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

  const handleSubmit = async e => {
  e.preventDefault();
  try {
    const res = await axios.post('/auth/login', { email, password });
    login(res.data.token);
    navigate('/dashboard');
  } catch (err) {
    alert(err.response?.data?.message || 'Login failed');
  }
};

    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign In</h2>
            <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button type="submit">Sign In</button>
        </form>
    );
};

export default SignIn;
