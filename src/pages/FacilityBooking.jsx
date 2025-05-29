import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';

const FacilityBooking = () => {
  const [facilities, setFacilities] = useState([]);
  const [booking, setBooking] = useState({ date: '', time: '' });
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const headers = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    axios.get(`${API}/facilities`, headers)
      .then(res => setFacilities(res.data))
      .catch(() => toast.error("Failed to load facilities"));
  }, []);

  const handleBook = async (id) => {
    try {
      await axios.post(`${API}/facilities/${id}/book`, booking, headers);
      toast.success('Booking successful ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed ❌');
    }
  };

  return (
    <Layout>
      <div className="container">
        <h2>📅 Book a Facility</h2>
        <input
          type="date"
          value={booking.date}
          onChange={(e) => setBooking({ ...booking, date: e.target.value })}
        />
        <input
          type="time"
          value={booking.time}
          onChange={(e) => setBooking({ ...booking, time: e.target.value })}
        />
        <ul>
          {facilities.map(fac => (
            <li key={fac._id} className="card">
              <strong>{fac.name}</strong>
              <p>{fac.description}</p>
              <p>💵 Price: {fac.price} KES</p>
              <button onClick={() => handleBook(fac._id)}>Book</button>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default FacilityBooking;
