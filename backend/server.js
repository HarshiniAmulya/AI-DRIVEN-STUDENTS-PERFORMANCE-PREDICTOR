const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚀 AI Student Predictor Backend is Running Successfully');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/parent', require('./routes/parentRoutes'));

cron.schedule('0 8 * * *', () => {
    console.log("Daily reminder triggered");

    // Example: fetch all students
    const db = require('./config/db');

    db.query("SELECT email FROM users WHERE role='student'", (err, results) => {
        if (!err) {
            results.forEach(student => {
                sendAlert(student.email, "Reminder: Please follow your AI generated study plan today.");
            });
        }
    });
});

app.listen(5000, () => console.log("Server running on port 5000"));

cron.schedule('0 8 * * *', ()=>{
    console.log("Daily reminder triggered");
});
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/parent', require('./routes/parentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
