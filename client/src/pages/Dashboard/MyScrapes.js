import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import '../../css/dashboard.css';

const MyScrapes = () => {
  const [scrapes, setScrapes] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () =>
    user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';

  const fetchScrapes = () => {
    axios.get('/data/my-scrapes')
      .then(res => setScrapes(res.data))
      .catch(err => console.error('Failed to fetch scrapes:', err));
  };

  useEffect(() => {
    fetchScrapes();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };


  const handleScrape = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setStatus('Scraping...');

    try {
      const res = await axios.post('/scrape', { input });
      setStatus('Scrape completed ✅');
      setInput('');
      fetchScrapes();
    } catch (err) {
      console.error(err);
      setStatus('Scrape failed ❌');
    }

    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>{user?.role === 'admin' ? 'Admin Panel' : 'User Panel'}</h2>
        <nav>
          <ul>
            <li className="dashboard-sidebar-item"><Link to={getDashboardLink()}>My Dashboard</Link></li>
            {user?.role === 'admin' && (
              <li className="dashboard-sidebar-item pinned">
                <Link to="/admin/users">Manage Users</Link>
              </li>
            )}
            <li className="dashboard-sidebar-item"><Link to="/dashboard/profile">Profile</Link></li>
            <li className="dashboard-sidebar-item"><Link to="/dashboard/scrapes" className="active">My Scrapes</Link></li>
            <li className="dashboard-sidebar-item"><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>My Scrapes</h1>
          <p>Paste a URL or enter any keyword/text to scrape data</p>
        </header>

        <section className="scrape-form-section">
          <form onSubmit={handleScrape} className="scrape-form">
            <textarea
              placeholder="Enter URL, keywords, symbols, or write-up"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-control"
              rows="3"
              required
            ></textarea>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Scraping...' : 'Scrape'}
            </button>
          </form>
          {status && <p className="status-message">{status}</p>}
        </section>

        <section className="dashboard-table">
          <h2>Scrape History</h2>
          {scrapes.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Input</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {scrapes.map((scrape) => (
                  <tr key={scrape._id}>
                    <td>{scrape.title}</td>
                    <td>{scrape.url || scrape.input || 'N/A'}</td>
                    <td>{new Date(scrape.createdAt).toLocaleString()}</td>
                    <td className={`status ${scrape.status?.toLowerCase()}`}>{scrape.status}</td>
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

export default MyScrapes;
