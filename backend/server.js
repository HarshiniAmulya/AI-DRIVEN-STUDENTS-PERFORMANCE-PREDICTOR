const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();

// Database connection
const db = require("./config/db");

// Email service
const sendAlert = require("./emailservice");

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// ======================
// ROOT ROUTE (Test Route)
// ======================
app.get("/", (req, res) => {
  res.send("🚀 AI Student Performance Predictor Backend is Running Successfully");
});

// ======================
// API ROUTES
// ======================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/teacher", require("./routes/teacherRoutes"));
app.use("/api/parent", require("./routes/parentRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));

// ======================
// DAILY CRON JOB (8 AM)
// ======================
cron.schedule("0 8 * * *", () => {
  console.log("📅 Daily reminder triggered");

  db.query(
    "SELECT email FROM users WHERE role = 'student'",
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return;
      }

      results.forEach((student) => {
        sendAlert(
          student.email,
          "Reminder: Please follow your AI generated study plan today."
        );
      });
    }
  );
});

// ======================
// START SERVER (IMPORTANT FOR RAILWAY)
// ======================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
