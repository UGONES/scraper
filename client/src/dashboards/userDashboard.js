import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../css/dashboard.css';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/user/dashboard')
      .then((res) => setUserData(res.data))
      .catch((err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate('/signin');
        }
      })
      .finally(() => setLoading(false));
  }, [logout, navigate]);

  if (loading) return <div className="dashboard-loading">Loading user dashboard...</div>;

  if (!userData) return <div className="dashboard-access-denied">Access denied.</div>;

  const { user, scrapes = [] } = userData;

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>User Panel</h2>
        <nav>
          <ul>
            <li><a href="/dashboard">My Dashboard</a></li>
            <li><a href="/dashboard/scrapes">My Scrapes</a></li>
            <li><a href="/dashboard/profile">Profile</a></li>
            <li><button onClick={logout} className="logout-btn">Logout</button></li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome, {user.username || user.email}</h1>
          <p>Email: {user.email}</p>
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
