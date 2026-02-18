const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Overall student analytics
router.get('/student/:email', auth, (req, res) => {
    db.query(
        `SELECT 
            AVG(attendance) as avg_attendance,
            AVG(internal_marks) as avg_internal,
            AVG(assignment_score) as avg_assignment,
            AVG(previous_gpa) as avg_gpa
         FROM performance 
         WHERE student_email=?`,
        [req.params.email],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results[0]);
        }
    );
});

// Section analytics for teacher
router.get('/section/:subject', auth, (req, res) => {
    db.query(
        `SELECT 
            student_email,
            (attended_classes/total_classes)*100 as attendance_percentage
         FROM attendance
         WHERE subject=?`,
        [req.params.subject],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

module.exports = router;
