import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [read, setRead] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const [annRes, userRes] = await Promise.all([
          axios.get(`${API}/announcements`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${API}/users/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        setAnnouncements(annRes.data);
        setRead(userRes.data.readAnnouncements || []);
      } catch (err) {
        toast.error("Failed to load announcements");
      }
    };

    fetchAnnouncements();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.post(`${API}/announcements/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRead(prev => [...prev, id]);
    } catch {
      toast.error('Mark as read failed');
    }
  };

  const unreadCount = announcements.filter(a => !read.includes(a._id)).length;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          📢 Announcements
          {unreadCount > 0 && (
            <span className="ml-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {unreadCount} New
            </span>
          )}
        </h2>

        {announcements.length === 0 ? (
          <p className="text-gray-600 italic">No announcements yet.</p>
        ) : (
          <div className="space-y-5">
            {announcements.map(ann => {
              const isRead = read.includes(ann._id);
              return (
                <div
                  key={ann._id}
                  className={`card ${
                    isRead ? 'card-read' : 'card-unread'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {ann.title}
                      {!isRead && <span className="ml-2 text-red-600 text-sm">• New</span>}
                    </h3>
                    {!isRead && (
                      <button
                        onClick={() => markAsRead(ann._id)}
                        className="bg-red-600 text-white text-xs px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{ann.message}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    🕒 {new Date(ann.createdAt).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Announcements;
