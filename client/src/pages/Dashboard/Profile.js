import { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
const [selectedFile] = useState(null); 
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/user/dashboard')
      .then(res => {
        const user = res.data.user;
        setProfile(user);
        setForm({
          fullName: user.fullName || '',
          email: user.email || '',
          username: user.username || '',
          description: user.description || '',
          gender: user.gender || '',
          avatar: user.avatar || ''
        });
        setPreview(user.avatar || '/default-avatar.png');
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch profile:', err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate('/signin');
        }
        setLoading(false);
      });
  }, [logout, navigate]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
      // Optional: save to state for upload later
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

      const res = await axios.put('/user/dashboard', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfile(res.data.updatedUser);
      setMessage('✅ Profile updated successfully');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to update profile');
    }

    setUpdating(false);
  };
  const handleScroll = () => {
    const avatar = document.querySelector('.profile-avatar');
    if (window.scrollY > 80) {
      avatar?.classList.add('sticky');
    } else {
      avatar?.classList.remove('sticky');
    }
  };

  window.addEventListener('scroll', handleScroll);
  window.removeEventListener('scroll', handleScroll);

  if (loading) return <div className="dashboard-loading">Loading profile...</div>;

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <h2>User Panel</h2>
        <nav>
          <ul>
            <li><a href="/dashboard">My Dashboard</a></li>
            <li><a href="/dashboard/profile" className="active">Profile</a></li>
            <li><a href="/dashboard/scrapes">My Scrapes</a></li>
            <li><button onClick={logout} className="logout-btn">Logout</button></li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Your Profile</h1>
          <p>Update your account details below</p>
        </header>

        <div className="profile-card shadow p-4 rounded">
          <div className="profile-photo-upload text-center mb-4">
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


          {message && <p className="text-center text-info">{message}</p>}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
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
              <label className="form-label">Username (read-only)</label>
              <input
                type="text"
                className="form-control"
                value={form.username}
                readOnly
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
      </main >
    </div >
  );
};

export default Profile;
