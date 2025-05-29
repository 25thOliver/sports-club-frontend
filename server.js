const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const teamRoutes = require('./routes/teamRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const forumRoutes = require('./routes/forumRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/user', require('./routes/user'));
app.use('/api/teams', teamRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/forum', require('./routes/forumRoutes'));


const sendReminders = require('./utils/reminderService');
app.get('/send-reminders', async (req, res) => {
  await sendReminders();
  res.send('Reminders triggered');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🟢 Server running on port ${PORT}`));
