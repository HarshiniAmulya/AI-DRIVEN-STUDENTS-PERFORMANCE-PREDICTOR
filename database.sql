CREATE DATABASE IF NOT EXISTS ai_student_predictor;
USE ai_student_predictor;

-- USERS TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    usn VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('student','teacher','parent') NOT NULL,
    linked_student_email VARCHAR(100)
);

-- PERFORMANCE TABLE
CREATE TABLE performance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_email VARCHAR(100),
    attendance FLOAT,
    internal_marks FLOAT,
    assignment_score FLOAT,
    previous_gpa FLOAT
);

-- ATTENDANCE TABLE
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_email VARCHAR(100),
    subject VARCHAR(100),
    total_classes INT,
    attended_classes INT
);

-- ALERTS TABLE
CREATE TABLE alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_email VARCHAR(100),
    risk_level VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
