require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');        // ✅ Changed
const studentRoutes = require('./routes/studentRoutes');  // ✅ Changed
const parentRoutes = require('./routes/parentRoutes');    // ✅ Added
const teacherRoutes = require('./routes/teacherRoutes');  // ✅ Added
const analyticsRoutes = require('./routes/analyticsRoutes'); // ✅ Added
const { sendEmail } = require('./emailservice');

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: '✅ Server is running' });
});

// Daily Cron Job (8 AM)
cron.schedule('0 8 * * *', async () => {
  console.log('⏰ Daily reminder triggered');

  try {
    if (!db) {
      console.error('❌ Database not connected');
      return;
    }

    const [students] = await db
      .promise()
      .query("SELECT email FROM users WHERE role = 'student'");

    if (!students || students.length === 0) {
      console.log('⚠️ No students found');
      return;
    }

    for (const { email } of students) {
      try {
        console.log(`📧 Sending email to ${email}`);
        await sendEmail(email);
      } catch (err) {
        console.error(`Failed to send email to ${email}:`, err.message);
      }
    }

    console.log('✅ Daily reminder job completed');
  } catch (err) {
    console.error('🚨 Cron job error:', err.message);
  }
});

// Error handlers
process.on('unhandledRejection', err => console.error('❌ Unhandled Rejection:', err));
process.on('uncaughtException', err => console.error('❌ Uncaught Exception:', err));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Public URL: https://your-railway-service.up.railway.app`);
});