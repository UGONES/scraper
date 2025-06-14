// src/components/Navbar.js
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/navbar.css';

const Navbar = ({ query, setQuery, items = [] }) => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  useEffect(() => {
    const navLinks = document.querySelectorAll('.nav-link');
    const toggleCollapse = () => {
      const navbarCollapse = document.getElementById('navbarContent');
      if (navbarCollapse?.classList.contains('show')) {
        new window.bootstrap.Collapse(navbarCollapse).toggle();
      }
    };

    navLinks.forEach(link => link.addEventListener('click', toggleCollapse));

    return () => {
      navLinks.forEach(link => link.removeEventListener('click', toggleCollapse));
    };
  }, []);

  const filtered = items.filter(item =>
    item.title?.toLowerCase().includes(query.toLowerCase())
  );

  const getDashboardLink = () => {
    return user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user';
  };

  return (
    <div>
      <nav className="navbar">
        <Link to="/" className="logo"><h1>DataScraper</h1></Link>
        <div className="nav-links">
          <ul className='nav-item'>
            <li className='a'><Link to="/">Home</Link></li>
            <li className='a'> <Link to="/about">About</Link></li>
            <li className='a'> <Link to="/services">Services</Link></li>
          </ul>
          {token && <Link to="/dashboard">Dashboard</Link>}
        </div>
        
        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
          <ul className='nav-item'>
            <li className='a'><Link to="/signin">Sign In</Link></li>
            <li className='a'><Link to="/signup">Sign Up</Link></li>
          </ul>
          </>
        )}
      </nav>

      <header className="py-3 mb-4 border-bottom">
        <div className="container d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center">
          <Link to="/" className="d-flex align-items-center mb-2 text-dark text-decoration-none">
          </Link>

          <div className="col-12 col-lg-6">
            <input
              type="search"
              className="form-control mb-2"
              placeholder="Search..."
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <ul className="list-group">
              {query && filtered.length > 0 ? (
                filtered.map((item) => (
                  <li key={item.id || item._id} className="list-group-item">
                    <strong>{item.title}</strong>
                    <p className="mb-0">{item.description}</p>
                  </li>
                ))
              ) : query ? (
                <li className="list-group-item text-muted">No results found.</li>
              ) : null}
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navbar;
