const express = require('express');
const router = express.Router();
const axios = require('axios');
const db = require('../config/db');

// Predict Route
router.post('/predict', async (req, res) => {
    try {
        const response = await axios.post(
            'http://localhost:6000/predict',
            req.body
        );

        if (response.data.risk_level === "High Risk") {
            console.log("High Risk Student detected");
        }

        res.json(response.data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Prediction failed" });
    }
});

module.exports = router;
