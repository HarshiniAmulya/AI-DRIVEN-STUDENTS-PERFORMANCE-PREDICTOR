const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'harshini@123',
    database: 'ai_student_predictor'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('MySQL Connected');
    }
});

module.exports = db;
