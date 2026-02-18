const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Mark attendance
router.post('/mark-attendance', auth, (req, res) => {
    const { student_email, subject, total_classes, attended_classes } = req.body;

    db.query(
        "INSERT INTO attendance (student_email, subject, total_classes, attended_classes) VALUES (?, ?, ?, ?)",
        [student_email, subject, total_classes, attended_classes],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Attendance marked successfully" });
        }
    );
});

// Get attendance by section/subject
router.get('/attendance/:subject', auth, (req, res) => {
    db.query(
        "SELECT * FROM attendance WHERE subject=?",
        [req.params.subject],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

// View high-risk students
router.get('/high-risk', auth, (req, res) => {
    db.query(
        "SELECT * FROM alerts WHERE risk_level='High Risk'",
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

module.exports = router;
