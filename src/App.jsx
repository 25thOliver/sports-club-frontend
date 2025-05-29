import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminEvents from "./pages/AdminEvents";
import MemberEvents from "./pages/MemberEvents";
import MyRSVPs from "./pages/MyRSVPs";
import CalendarView from "./pages/CalendarView";
import NewAnnouncement from "./pages/NewAnnouncement";
import Announcements from "./pages/Announcements";
import Teams from "./pages/Teams";
import FacilityManager from "./pages/FacilityManager";
import FacilityBooking from "./pages/FacilityBooking";
import MyBookings from "./pages/MyBookings";
import UserReceipts from "./pages/UserReceipts";
import AdminPayments from "./pages/AdminPayments";
import MembershipPayment from "./pages/MembershipPayment";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import './App.css';

import Forum from "./pages/Forum";
import NewPost from "./pages/NewPost";
import PostDetail from './pages/PostDetail';


function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <AuthProvider>
      <Router>
        <div className="layout">
          {/* Show sidebar only if logged in */}
          {user && <Sidebar user={user} />}

          <main className="main">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/register" element={
                <PrivateRoute>
                  {user?.role === "admin" ? <Register /> : <Navigate to="/dashboard" />}
                </PrivateRoute>
              } />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
              <Route path="/admin/events" element={<PrivateRoute><AdminEvents /></PrivateRoute>} />
              <Route path="/events" element={<PrivateRoute><MemberEvents /></PrivateRoute>} />
              <Route path="/my-events" element={<PrivateRoute><MyRSVPs /></PrivateRoute>} />
              <Route path="/calendar" element={<PrivateRoute><CalendarView /></PrivateRoute>} />
              <Route path="/announcements" element={<PrivateRoute><Announcements /></PrivateRoute>} />
              <Route path="/admin/announcements/new" element={<PrivateRoute><NewAnnouncement /></PrivateRoute>} />
              <Route path="/teams" element={<PrivateRoute><Teams /></PrivateRoute>} />
              <Route path="/facilities/manage" element={<PrivateRoute><FacilityManager /></PrivateRoute>} />
              <Route path="/facilities/book" element={<PrivateRoute><FacilityBooking /></PrivateRoute>} />
              <Route path="/facilities/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
              <Route path="/receipts" element={<PrivateRoute><UserReceipts /></PrivateRoute>} />
              <Route path="/admin/payments" element={<PrivateRoute><AdminPayments /></PrivateRoute>} />
              <Route path="/membership" element={<PrivateRoute><MembershipPayment /></PrivateRoute>} />
              <Route path="/forum" element={<PrivateRoute><Forum /></PrivateRoute>} />
              <Route path="/forum/new" element={<PrivateRoute><NewPost /></PrivateRoute>} />
              <Route path="/forum/create" element={<PrivateRoute><NewPost /></PrivateRoute>} />
              <Route path="/forum/posts/:id" element={<PrivateRoute><PostDetail /></PrivateRoute>} />

            </Routes>
          </main>
        </div>

        <ToastContainer position="top-center" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
