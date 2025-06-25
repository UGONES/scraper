import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../css/dashboard.css';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const endpoint = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';

    axios.get(endpoint, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((res) => setUserData(res.data))
      .catch((err) => {
        if ([401, 403].includes(err.response?.status)) {
          logout();
          navigate('/signin');
        }
      })
      .finally(() => setLoading(false));
  }, [logout, navigate, user]);

  const getDashboardLink = () => user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };
  if (loading) return <div className="dashboard-loading">Loading user dashboard...</div>;
  if (!userData) return <div className="dashboard-access-denied">Access denied.</div>;

  const userInfo = user || {}; // Get from AuthContext
  const scrapes = userData?.scrapes || [];

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>User Panel</h2>
        <nav>
          <ul>
            <li className="dashboard-sidebar-item"><Link to={getDashboardLink()}>My Dashboard</Link></li>
            <li className="dashboard-sidebar-item"><Link to="/dashboard/profile">Profile</Link></li>
            <li className="dashboard-sidebar-item"><Link to="/dashboard/scrapes">My Scrapes</Link></li>
            <li className="dashboard-sidebar-item"><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome, {userInfo.username || userInfo.email || 'User'}</h1>
          <p>Email: {userInfo.email || 'N/A'}</p>
        </header>

        <section className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Scrapes</h3>
            <p>{scrapes.length}</p>
          </div>
        </section>

        <section className="dashboard-table">
          <h2>My Scrape History</h2>
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

export default UserDashboard;