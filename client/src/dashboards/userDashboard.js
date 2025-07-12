import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import DashboardHome from './DashboardHome';
import '../css/dashboard.css';

export default function UserDashboardHome() {
  const { auth } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [myScrapes, setMyScrapes] = useState([]);


  useEffect(() => {
    if (!auth?.token) return;

    const load = async () => {
      try {
        const { data } = await api.get('/dashboard/user/summary');
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load summary');
      }
    };

    api.get("/scrape/user") // 👈 user's own scrapes
      .then(({ data }) => setMyScrapes(data))
      .catch(err => console.error("Error fetching user's scrapes:", err));
    load();
  }, [auth]);

  return (
    <div className="dashboard-wrapper">
      <Sidebar role={auth?.role} />
      <main className="page-container dashboard-page">
        <h1 className="page-header">My Dashboard</h1>

        {error && (
          <div className="popup-error">
            {error}
            <button className="close-btn" onClick={() => setError('')}>×</button>
          </div>
        )}
        {stats ? (
          <div className="card inline-card">
            <p className="card-label">My Total Scrapes</p>
            <p className="card-value">{myScrapes.length || 0}</p>
            <DashboardHome />
          </div>
        ) : (
          <p>Loading…</p>
        )}
      </main>
    </div>
  );
}
