// MembershipPayment.jsx
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MembershipPayment = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/payments/membership`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("✅ Membership activated for 1 year");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Membership Payment</h3>
      <p>Pay KES 1500 to activate 1-year membership</p>
      <button onClick={pay} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default MembershipPayment;
