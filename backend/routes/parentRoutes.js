const express = require('express');
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// View child performance
router.get('/performance/:email', auth, (req, res) => {
    db.query(
        "SELECT * FROM performance WHERE student_email=?",
        [req.params.email],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

// View attendance
router.get('/attendance/:email', auth, (req, res) => {
    db.query(
        "SELECT * FROM attendance WHERE student_email=?",
        [req.params.email],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

// View alerts
router.get('/alerts/:email', auth, (req, res) => {
    db.query(
        "SELECT * FROM alerts WHERE student_email=?",
        [req.params.email],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );
});

module.exports = router;
