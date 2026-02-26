require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');           // ← changed
const studentRoutes = require('./routes/studentRoutes');     // ← changed
const parentRoutes = require('./routes/parentRoutes');       // optional
const teacherRoutes = require('./routes/teacherRoutes');     // optional
const analyticsRoutes = require('./routes/analyticsRoutes'); // optional
const { sendEmail } = require('./emailservice');

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/analytics', analyticsRoutes);

// health check
app.get('/', (req, res) => res.json({ status: '✅ Server is running' }));

// cron job etc…
cron.schedule('0 8 * * *', async () => {
  console.log('⏰ Daily reminder triggered');
  try {
    if (!db) { console.error('❌ DB not connected'); return; }
    const [students] = await db
      .promise()
      .query("SELECT email FROM users WHERE role = 'student'");
    if (!students || students.length === 0) {
      console.log('⚠️ no students');
      return;
    }
    for (const { email } of students) {
      try { await sendEmail(email); } catch (e) { console.error(e); }
    }
    console.log('✅ Cron job finished');
  } catch (e) { console.error('🚨 Cron job error', e); }
});

process.on('unhandledRejection', e => console.error('Unhandled Rejection', e));
process.on('uncaughtException', e => console.error('Uncaught Exception', e));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});