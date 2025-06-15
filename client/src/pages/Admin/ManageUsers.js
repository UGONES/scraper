import { useEffect, useState } from 'react';
import axios from '../../api/axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/users')
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error('Failed to fetch users:', err);
        if (err.response?.status === 403) {
          setError('Access denied. Admins only.');
        } else {
          setError('Failed to load users.');
        }
      });
  }, []);

  return (
    <div className="container">
      <h2>Manage Users</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group">
        {users.map(user => (
          <li key={user._id} className="list-group-item">
            {user.username} ({user.email}) - Role: {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageUsers;
