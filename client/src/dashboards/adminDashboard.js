import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../css/dashboard.css';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDashboardData(res.data);
      } catch (err) {
        console.error('Admin fetch error:', err.response?.data || err.message);
        if ([401, 403].includes(err.response?.status)) {
          logout();
          navigate('/signin');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, logout, navigate]);

  const users = dashboardData?.users || [];
  const scrapes = dashboardData?.scrapes || [];
  const userCount = dashboardData?.userCount || users.length;
  const adminEmail = dashboardData?.admin || user?.email || 'N/A';
  const getDashboardLink = () => '/admin/dashboard';
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };
  if (loading) return <div className="dashboard-loading">Loading admin dashboard...</div>;
  if (!dashboardData) return <div className="dashboard-access-denied">Access denied.</div>;

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>{user?.role === 'admin' ? 'Admin Panel' : 'User Panel'}</h2>
        <nav>
          <ul>
            <li className="dashboard-sidebar-item">
              <Link to={getDashboardLink()}>My Dashboard</Link>
            </li>
            {user?.role === 'admin' && (
              <li className="dashboard-sidebar-item">
                <Link to="/admin/users">Manage Users</Link>
              </li>
            )}
            <li className="dashboard-sidebar-item">
              <Link to="/dashboard/profile">Profile</Link>
            </li>
            <li className="dashboard-sidebar-item">
              <Link to="/dashboard/scrapes">My Scrapes</Link>
            </li>
            <li className="dashboard-sidebar-item">
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </li>
          </ul>

        </nav>
      </aside>


      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome, {user?.username || 'Admin'}</h1>
          <p>Email: {adminEmail}</p>
          <p>Total Users:{dashboardData?.userCount || users.length}</p>
        </header>

        <section className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Scrapes</h3>
            <p>{scrapes.length}</p>
          </div>
        </section>

        <section className="dashboard-table">
          <h2>Scrape History</h2>
          {scrapes.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scrapes.map((scrape) => (
                  <tr key={scrape._id}>
                    <td>{scrape.title}</td>
                    <td>{new Date(scrape.createdAt).toLocaleDateString()}</td>
                    <td className={`status ${scrape.status.toLowerCase()}`}>{scrape.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No scrapes found.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
