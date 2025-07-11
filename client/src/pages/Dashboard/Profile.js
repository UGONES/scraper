import { useEffect, useState } from "react";
import { useAuth } from '../../context/AuthContext';
import Sidebar from "../../components/Sidebar";
import api from "../../api/axios";
import '../../css/profile.css';
import '../../css/dashboard.css';

const Input = ({ label, ...rest }) => (
  <label className="mb-3">
    <span className="form-label">{label}</span>
    <input {...rest} className="form-control" />
  </label>
);

const Select = ({ label, name, value, onChange, options }) => (
  <label className="mb-3">
    <span className="form-label">{label}</span>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="form-control"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </label>
);

const Profile = () => {
  const { auth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    bio: "",
    gender: "",
    description: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [editing, setEditing] = useState(false);

  const profileUrl = auth?.role === 'admin'
    ? '/dashboard/admin/profile'
    : '/dashboard/user/profile';

  useEffect(() => {
    api.get(profileUrl)
      .then(({ data }) => {
        setProfile(data);
        if (data) setForm(data);
      });
  }, [profileUrl]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => setAvatar(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      fd.append(key, value);
    });
    if (avatar) {
      fd.append("avatar", avatar);
    }

    api
      .put(profileUrl, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(({ data }) => {
        setProfile(data);
        setEditing(false);
        setAvatar(null);
      });
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar role={auth?.role} />
      <main className="profile-container">
        <h1 className="form-label mb-3">Profile</h1>

        {profile && !editing ? (
          <div className="profile-card">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="profile-avatar fallback">No Avatar</div>
            )}

            <p><strong>Username:</strong> {profile.username || "—"}</p>
            <p><strong>Name:</strong> {profile.fullName || "—"}</p>
            <p><strong>Bio:</strong> {profile.bio || "—"}</p>
            <p><strong>Gender:</strong> {profile.gender || "—"}</p>
            <p><strong>Description:</strong> {profile.description || "—"}</p>

            <button className="btn-primary" onClick={() => setEditing(true)}>
              Update Profile
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="profile-form profile-card"
            encType="multipart/form-data"
          >
            <div className="upload-label">
              {avatar ? (
                <img src={URL.createObjectURL(avatar)} alt="Preview" className="profile-avatar" />
              ) : profile?.avatar ? (
                <img src={profile.avatar} alt="Profile" className="profile-avatar" />
              ) : (
                <div className="profile-avatar fallback">No Avatar</div>
              )}

              <span className="form-label">Upload Avatar</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="form-control"
              />
            </div>

            <Input
              name="fullName"
              label="Full Name"
              value={form.fullName}
              onChange={handleChange}
            />
            <Input
              name="bio"
              label="Bio"
              value={form.bio}
              onChange={handleChange}
            />
            <Select
              name="gender"
              label="Gender"
              value={form.gender}
              onChange={handleChange}
              options={[
                { value: "", label: "Select" },
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "non-binary", label: "Non-binary" },
                { value: "prefer-not-to-say", label: "Prefer not to say" },
              ]}
            />
            <Input
              name="description"
              label="Description"
              value={form.description}
              onChange={handleChange}
            />

            <button className="btn-primary">
              {profile ? "Save Changes" : "Add Profile"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

export default Profile;
