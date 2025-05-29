import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

export default function Dashboard() {
  const { user: contextUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState({});
  const [events, setEvents] = useState([]);

  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    axios.get(`${API}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setProfile(res.data))
    .catch(() => console.error("Profile fetch failed"));

    axios.get(`${API}/events`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setEvents(res.data))
    .catch(() => console.error("Event fetch failed"));
  }, []);

  const upcomingRSVPs = events.filter(evt =>
    evt.attendees?.some(a => a._id === contextUser?.id) &&
    new Date(evt.date) >= new Date()
  );

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Layout>
      <div className="dashboard-container, container mx-auto my-8 px-4">
        <h1 className="dashboard-title">
          Welcome, {profile.name || contextUser?.name}
        </h1>
        <div className="profile-info">
          <p><strong>Email:</strong> {profile.email || contextUser?.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          <p><strong>Status:</strong> {profile.status}</p>
          <p><strong>Membership:</strong> {profile.membershipStatus}</p>
          {profile.role === "admin" && (
            <p className="admin-access">🛡️ Admin Access Enabled</p>
          )}
        </div>
        <div className="events-section, container mx-auto my-8 px-4">
          <h2 className="events-title">📋 Upcoming RSVP Events</h2>
          {upcomingRSVPs.length === 0 ? (
            <p className="no-events">No upcoming events RSVP’d yet.</p>
          ) : (
            <ul className="events-list">
              {upcomingRSVPs.map(evt => (
                <li key={evt._id} className="event-item">
                  <strong>{evt.title}</strong> — {evt.date?.slice(0, 10)} at {evt.time}
                  <br />
                  <em className="event-description">{evt.description}</em>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>
      </div>
    </Layout>
  );
}