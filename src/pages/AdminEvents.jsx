import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '' });
  const [editId, setEditId] = useState(null);

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API}/events`);
      setEvents(res.data);
    } catch {
      toast.error('Error loading events');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editId ? `${API}/events/${editId}` : `${API}/events`;
    const method = editId ? axios.put : axios.post;

    try {
      await method(url, form, headers);
      toast.success(editId ? 'Event updated' : 'Event created');
      setForm({ title: '', description: '', date: '', time: '' });
      setEditId(null);
      fetchEvents();
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (evt) => {
    setEditId(evt._id);
    setForm({
      title: evt.title,
      description: evt.description,
      date: evt.date.slice(0, 10),
      time: evt.time || ''
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/events/${id}`, headers);
      toast.success('Event deleted');
      fetchEvents();
    } catch (err) {
      err.response?.status === 403
        ? toast.error('Only admins can delete events')
        : toast.error('Delete failed');
    }
  };

  return (
    <Layout>
      <div className="container">
        <h2>🛠️ Admin Event Manager</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="date" name="date" value={form.date} onChange={handleChange} required />
            <input type="time" name="time" value={form.time} onChange={handleChange} required />
          </div>
          <button type="submit">{editId ? 'Update' : 'Create'} Event</button>
        </form>

        <h3>📅 All Events</h3>
        <ul>
          {events.map(evt => (
            <li key={evt._id} className={`card ${evt.attendees.length >= evt.maxAttendees ? 'bg-red-100' : ''}`}>
              <div className="event-title">
                {evt.title}
                {evt.attendees.length >= evt.maxAttendees && <span className="full-event">Full</span>}
              </div>
              <div className="event-date">
                {evt.date?.slice(0, 10)} at {evt.time}
              </div>
              <div className="event-description">{evt.description}</div>
              <div className="event-attendees">
                👥 Attendees: {evt.attendees?.length || 0} / {evt.maxAttendees || "∞"}
              </div>
              <ul className="ml-4">
                {evt.attendees.map((user, idx) => (
                  <li key={user._id || idx}>{user.name} ({user.email})</li>
                ))}
              </ul>
              <div className="button-group">
                <button onClick={() => handleEdit(evt)}>Edit</button>
                <button onClick={() => handleDelete(evt._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default AdminEvents;
