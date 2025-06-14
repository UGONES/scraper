import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/dashboard.css';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/admin/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Admin fetch error:', err.response?.data || err.message);
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate('/signin');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, logout, navigate]);

  if (loading) return <div className="dashboard-loading">Loading admin dashboard...</div>;
  if (!users.length) return <div className="dashboard-access-denied">No users found.</div>;

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li><a href="/admin/dashboard">Dashboard</a></li>
            <li><Link to="/admin/users">Manage Users</Link></li>            <li><button onClick={logout} className="logout-btn">Logout</button></li>
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
