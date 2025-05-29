import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${API}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setProfile(res.data);
        setFormData({ name: res.data.name, email: res.data.email });
      })
      .catch(() => setMessage('Error fetching profile'));
  }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = e => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios
      .put(`${API}/user/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setMessage('✅ Profile updated successfully');
        setProfile(res.data);
      })
      .catch(() => setMessage('❌ Update failed'));
  };

  const handlePasswordSubmit = e => {
    e.preventDefault();
    axios
      .put(`${API}/user/password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setPasswordMessage('✅ Password updated successfully');
        setPasswordData({ currentPassword: '', newPassword: '' });
      })
      .catch(err => {
        console.error(err);
        setPasswordMessage(err.response?.data?.message || '❌ Password update failed');
      });
  };

  return (
    <Layout>
      <div className="container mx-auto my-8 px-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">👤 Profile</h2>
          {message && <p className="text-sm text-green-600 mb-2">{message}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded"
            />
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Update Profile
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">🔐 Change Password</h3>
          {passwordMessage && <p className="text-sm text-red-500 mb-2">{passwordMessage}</p>}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              className="w-full px-4 py-2 border rounded"
            />
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded"
            />
            <button type="submit" className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">
              Change Password
            </button>
          </form>
        </div>

        {profile && (
          <div className="text-sm text-gray-700 border-t pt-4">
            <p><strong>Role:</strong> {profile.role}</p>
            <p><strong>Status:</strong> {profile.status}</p>
            <p><strong>Membership:</strong> {profile.membershipStatus}</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
