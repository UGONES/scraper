import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../../css/dashboard.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  // 🔄 Fetch users on load
  useEffect(() => {
    axios.get('/admin/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error('Failed to fetch users:', err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          setError('Access denied. Admins only.');
          logout();
          navigate('/signin');
        } else {
          setError('Failed to load users.');
        }
      })
      .finally(() => setLoading(false));
  }, [logout, navigate]);

  // 🔐 Logout handler
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  if (loading) return <div className="dashboard-loading">Loading users...</div>;

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li className="dashboard-sidebar-item"><Link to="/admin/dashboard">My Dashboard</Link></li>
            <li className="dashboard-sidebar-item"><Link to="/dashboard/profile">Profile</Link></li>
            <li className="dashboard-sidebar-item"><Link to="/admin/users" className="active">Manage Users</Link></li>
            <li className="dashboard-sidebar-item"><Link to="/dashboard/scrapes">My Scrapes</Link></li>
            <li className="dashboard-sidebar-item">
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Manage Users</h1>
          {error && <div className="form-error">{error}</div>}
        </header>

        <section className="dashboard-table">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr key={u._id}>
                  <td>{index + 1}</td>
                  <td>{u.username || 'N/A'}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default ManageUsers;
