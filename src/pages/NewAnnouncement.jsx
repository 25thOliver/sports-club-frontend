import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

const NewAnnouncement = () => {
  const [form, setForm] = useState({ title: '', message: '' });
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/announcements`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("🎉 Announcement posted!");
      setForm({ title: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Post failed ❌");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto my-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">📢 New Announcement</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              name="title"
              id="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter title"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              id="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your announcement here..."
              required
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Publish Announcement
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default NewAnnouncement;
