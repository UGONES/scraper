import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/sidebar.css';
import '../css/dashboard.css'; // Ensure dashboard styles are applied

const linksByRole = {
  admin: [
    { to: '/dashboard/admin', label: 'My Dashboard' },
    { to: '/admin/scrapes', label: 'My Scrapes' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/profile', label: 'Profile' },
  ],
  user: [
    { to: '/dashboard/user', label: 'My Dashboard' },
    { to: '/user/scrapes', label: 'My Scrapes' },
    { to: '/user/profile', label: 'Profile' },
  ],
};

const Sidebar = () => {
  const { auth, logout } = useAuth();
  const role = auth?.role;
  const { pathname } = useLocation();
  const navLinks = linksByRole[role] || [];

  return (
      <div className="wrapper">
      <aside className="sidebar">
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className={`sidebar-link ${pathname === to ? 'active' : ''}`}
          >
            {label}
          </Link>
        ))}
        <button onClick={logout} className="sidebar-logout">
          Logout
        </button>
      </aside>
      </div>
  );
};

export default Sidebar;
