import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import Sidebar from '../../../components/Sidebar';
import { FiFileText, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import '../../../css/dashboard.css';

const UserScrapes = () => {
  const { auth } = useAuth();
  const [scrapes, setScrapes] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [selectedScrape, setSelectedScrape] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleScrape = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/scrape/user', { input }).finally(() => setLoading(false));
      setScrapes([data, ...scrapes]);
      setSelectedScrape(data);
      setInput('');
      setError('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Scrape failed';
      setError(msg);
      setTimeout(() => setError(''), 5000);
    } finally {
      setSuccessMsg('Scrape successful!');
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  useEffect(() => {
    api.get('/scrape/user')
      .then(({ data }) => setScrapes(data));
  }, []);

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  };


  return (
    <div className="dashboard-wrapper">
      <Sidebar role={auth?.role} />

      {/* Sidebar toggle button (always visible) */}
      {!sidebarOpen && (
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
          <FiMenu />
        </button>
      )}
      {/* Slide-in sidebar + overlay */}
      {sidebarOpen && (
        <div className="history-overlay" onClick={() => setSidebarOpen(false)}>
          <aside
            className={`history-sidebar open`}
            onClick={(e) => e.stopPropagation()} // prevent overlay click from closing
          >
            <h2 className="history-title">
              <FiFileText />
              <span>Scrape History</span>
              <button className="history-close" onClick={() => setSidebarOpen(false)}>
                <FiX />
              </button>
            </h2>
            <div className="history-list">
              {scrapes.map((scrape) => (
                <button
                  key={scrape._id}
                  className="history-item"
                  onClick={() => {
                    setSelectedScrape(scrape);
                    setShowAnalysis(false);
                    setSidebarOpen(false); // auto-close on click
                  }}
                >
                  <div>{scrape.source.slice(0, 20)}</div>
                  <small>{formatDate(scrape.createdAt)}</small>
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      <main className="page-container dashboard-page">
        <h1 className="page-header">My Scrapes</h1>
        {loading ? (<p>Loading User Scrapes ...</p>) : (
          <>
            <form onSubmit={handleScrape} className="scrape-form">
              {error && (
                <div className="popup-error">
                  {error}
                  <button className="close-btn" onClick={() => setError('')}>×</button>
                </div>
              )}
              <textarea
                rows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a URL or some text to scrape..."
                required
              />
              {successMsg && (
                <div className="popup-success">
                  {successMsg}
                  <button className="close-btn" onClick={() => setSuccessMsg('')}>×</button>
                </div>
              )}
              <button type="submit" className="scrape-btn">Scrape</button>
            </form>

            {selectedScrape && (
              <div className="scrape-display">
                <h2 className="scrape-source">{selectedScrape.source}</h2>
                <p className="scrape-result">{selectedScrape.result.slice(0, 100)}...</p>

                <button
                  className="analysis-btn"
                  onClick={() => setShowAnalysis(!showAnalysis)}
                >
                  {showAnalysis ? 'Hide Analysis' : 'Show Analysis'}
                </button>

                {showAnalysis && (
                  <div className="scrape-analysis">
                    <pre className="analysis">{selectedScrape.result}</pre>
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default UserScrapes;
