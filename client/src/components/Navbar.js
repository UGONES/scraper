import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar = ({ query, setQuery, items = [] }) => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  const filtered = items.filter(item =>
    item.title?.toLowerCase().includes(query.toLowerCase())
  );

  const getDashboardLink = () => {
    return user?.role === 'admin' ? '/admin/dashboard' : '/dashboard/user';
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <Link to="/" className="navbar-logo">DataScraper</Link>

        <div className="navbar-menu">
          <ul className="nav-list">
            <li className="nav-item"><Link to="/">Home</Link></li>
            <li className="nav-item"><Link to="/about">About</Link></li>
            <li className="nav-item"><Link to="/services">Services</Link></li>
            {token && (
              <li className="nav-item">
                <Link to={getDashboardLink()}>My Dashboard</Link>
              </li>
            )}
          </ul>
        </div>

        <div className="auth-buttons">
          {token ? (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/signup">
                <i className="fas fa-user-circle fa-lg" style={{ color: '#61dafb' }}></i>
              </Link>
            </>
          )}
        </div>
      </nav>

      <header className="search-header">
        <div className="search-container">
          <input
            type="search"
            className="search-input"
            placeholder="Search..."
            aria-label="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ul className="search-results">
            {query && filtered.length > 0 ? (
              filtered.map((item) => (
                <li key={item.id || item._id} className="result-item">
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </li>
              ))
            ) : query ? (
              <li className="no-results">No results found.</li>
            ) : null}
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
