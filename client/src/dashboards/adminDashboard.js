import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../css/dashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Admin token:", token);

    let isMounted = true; // prevent state update if unmounted

    const fetchUsers = async () => {
      try {
        const res = await axios('/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (isMounted) setUsers(res.data);
      } catch (err) {
        console.error('Admin fetch error:', err.response?.data || err.message);
        if ([401, 403].includes(err.response?.status)) {
          logout();
          navigate('/signin');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, [token, logout, navigate]);

  if (loading) return <div className="dashboard-loading">Loading admin dashboard...</div>;
  if (!users.length) return <div className="dashboard-access-denied">No users found.</div>;

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li><a href="/admin/dashboard">My Dashboard</a></li>
            <li><a href="/dashboard/profile">Profile</a></li>
            <li><Link to="/admin/users">Manage Users</Link></li>
            <li><a href="/dashboard/scrapes">My Scrapes</a></li>
            <li><button onClick={logout} className="logout-btn">Logout</button></li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Total Users: {users.length}</p>
        </header>

        <section className="dashboard-table">
          <h2>User List</h2>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
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

export default AdminDashboard;
