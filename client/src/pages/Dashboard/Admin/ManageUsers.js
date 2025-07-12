import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios';
import Sidebar from '../../../components/Sidebar';
import { useAuth } from '../../../context/AuthContext';
import '../../../css/dashboard.css';

const ManageUsers = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/admin/users')
      .then(({ data }) => {
        const sorted = [...data].sort((a, b) => (a.role === 'admin' ? -1 : 1));
        setUsers(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUserClick = (user) => {
    if (user.role !== 'admin') {
      navigate(`/admin/scrapes?userId=${user._id}&username=${user.username}`);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar role={auth?.role} />
      <main className="page-container dashboard-page">
        <h1 className="page-header">Manage Users</h1>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr
                    key={u._id}
                    className={u.role === 'admin' ? 'admin-row' : 'clickable-row'}
                    onClick={() => handleUserClick(u)}
                    title={u.role !== 'admin' ? 'Click to view user scrapes' : ''}
                  >
                    <td>{index + 1}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageUsers;
