import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import '../../css/dashboard.css';
import '../../css/profile.css';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    description: '',
    gender: '',
    avatar: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const { logout, user, token } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () =>
    user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  // ✅ Fetch profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const endpoint = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const userData = res.data.user || res.data;
        setProfile(userData);
        setForm({
          fullName: userData.fullName || '',
          email: userData.email || '',
          username: userData.username || '',
          description: userData.description || '',
          gender: userData.gender || '',
          avatar: userData.avatar || ''
        });
        setPreview(userData.avatar || '/default-avatar.png');
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) fetchProfile();
  }, [logout, navigate, token, user]);

  // ✅ Scroll effect for avatar
  useEffect(() => {
    const handleScroll = () => {
      const avatar = document.querySelector('.profile-avatar');
      if (avatar) {
        if (window.scrollY > 80) {
          avatar.classList.add('shrink');
        } else {
          avatar.classList.remove('shrink');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append('fullName', form.fullName);
      formData.append('email', form.email);
      formData.append('username', form.username);
      formData.append('description', form.description);
      formData.append('gender', form.gender);
      if (selectedFile) formData.append('avatar', selectedFile);

      const endpoint = user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';

      const res = await axios.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setProfile(res.data.user || res.data);
      setMessage('✅ Profile updated successfully');
    } catch (err) {
      console.error(err);
      const errMsg = err?.response?.data?.message || '❌ Failed to update profile';
      setMessage(`❌ ${errMsg}`);
    }

    setUpdating(false);
  };

  if (loading) return <div className="dashboard-loading">Loading profile...</div>;

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>{user?.role === 'admin' ? 'Admin Panel' : 'User Panel'}</h2>
        <nav>
          <ul>
            <li className="dashboard-sidebar-item">
              <Link to={getDashboardLink()}>My Dashboard</Link>
            </li>

            <li className="dashboard-sidebar-item">
              <Link to="/dashboard/profile" className="active">Profile</Link>
            </li>

            {user?.role === 'admin' && (
              <li className="dashboard-sidebar-item">
                <Link to="/admin/users">Manage Users</Link>
              </li>
            )}

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
          <h1>Your Profile</h1>
          <p>Update your account details below</p>
        </header>

        <div className="profile-card">
          <div className="profile-photo-upload">
            <div className="profile-avatar-container">
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                onChange={handleFileChange}
                className="d-none"
              />
              <label htmlFor="avatarInput" className="upload-label">
                <img
                  src={preview || '/default-avatar.png'}
                  alt=""
                  className="profile-avatar"
                />
                <div className="upload-overlay"></div>
              </label>
            </div>
          </div>

          {message && <p className="text-center text-info">{message}</p>}

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="profile-form">
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                name="username"
                type="text"
                className="form-control"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Gender</label>
              <select
                className="form-control"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Description / Bio</label>
              <textarea
                className="form-control"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="text-center">
              <button type="submit" className="btn btn-primary" disabled={updating}>
                {updating ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
