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
// ===============================
// SAFE DAILY CRON JOB (Railway Safe)
// ===============================

// Runs every day at 8:00 AM
cron.schedule("0 8 * * *", async () => {
  console.log("⏰ Daily reminder triggered");

  try {
    // Check if DB connection exists
    if (!connection) {
      console.error("❌ No database connection available");
      return;
    }

    // Fetch student emails safely
    const [students] = await connection
      .promise()
      .query("SELECT email FROM users WHERE role = 'student'");

    console.log(`📧 Found ${students.length} students`);

    if (!students || students.length === 0) {
      console.log("⚠️ No students found, skipping email sending.");
      return;
    }

    // Loop through students
    for (const student of students) {
      try {
        console.log(`Sending reminder to: ${student.email}`);

        // TODO: Replace this with your email function
        // await sendEmail(student.email);

      } catch (emailError) {
        console.error(
          `❌ Failed to send email to ${student.email}:`,
          emailError
        );
      }
    }

    console.log("✅ Daily reminder job completed successfully");

  } catch (error) {
    console.error("🚨 Cron job error:", error);
  }
});

// ======================
// START SERVER (IMPORTANT FOR RAILWAY)
// ======================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
