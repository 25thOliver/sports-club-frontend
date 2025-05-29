import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

const MemberEvents = () => {
  const [events, setEvents] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const fetchEvents = () => {
    axios
      .get(`${API}/events`)
      .then(res => setEvents(res.data))
      .catch(() => toast.error('Failed to load events'));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const rsvp = (eventId) => {
    axios
      .post(`${API}/events/${eventId}/rsvp`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        toast.success(res.data.message);
        fetchEvents();
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'RSVP failed');
      });
  };

  const cancel = (eventId) => {
    axios
      .delete(`${API}/events/${eventId}/rsvp`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        toast.success(res.data.message);
        fetchEvents();
      })
      .catch(err => {
        toast.error(err.response?.data?.message || 'Cancel failed');
      });
  };

  return (
    <Layout>
      <div className="container">
        <h2 className="events-title">📅 Upcoming Events</h2>

        {events.length === 0 ? (
          <p className="no-events">No upcoming events found.</p>
        ) : (
          <ul className="events-list">
            {events.map(evt => {
              const isAttending = Array.isArray(evt.attendees) &&
                evt.attendees.some(a => a._id === userId);
              const isUpcoming = new Date(evt.date) >= new Date();

              return (
                <li key={evt._id} className={`event-card ${isUpcoming ? 'upcoming' : ''}`}>
                  <div className="event-title">
                    {evt.title}
                  </div>
                  <div className="event-date">
                    {evt.date?.slice(0, 10)} at {evt.time}
                  </div>
                  <div className="event-description">
                    {evt.description}
                  </div>
                  <div className="event-attendees">
                    👥 Attendees: {evt.attendees?.length || 0}
                  </div>

                  <div className="button-group">
                    {isAttending ? (
                      <button
                        className="rsvp-button bg-red-600 hover:bg-red-700"
                        onClick={() => cancel(evt._id)}
                      >
                        Cancel RSVP
                      </button>
                    ) : (
                      <button
                        className="rsvp-button bg-green-600 hover:bg-green-700"
                        onClick={() => rsvp(evt._id)}
                      >
                        RSVP
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default MemberEvents;