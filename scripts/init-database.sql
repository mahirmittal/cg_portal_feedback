-- Create database for Chhattisgarh Government Portal
CREATE DATABASE IF NOT EXISTS chhattisgarh_gov_portal;

USE chhattisgarh_gov_portal;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mobile_number VARCHAR(10) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    call_id VARCHAR(50) NOT NULL,
    citizen_mobile VARCHAR(10) NOT NULL,
    satisfaction ENUM('satisfied', 'not-satisfied') NOT NULL,
    description TEXT NOT NULL,
    submitted_by VARCHAR(10) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'resolved') DEFAULT 'pending',
    resolved_at TIMESTAMP NULL,
    resolved_by VARCHAR(50) NULL,
    INDEX idx_call_id (call_id),
    INDEX idx_citizen_mobile (citizen_mobile),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash, full_name, role) 
VALUES ('admin', '$2b$10$rQZ8kHWKQVnqVY8kHWKQVnqVY8kHWKQVnqVY8kHWKQVnqVY8kHWKQ', 'System Administrator', 'super_admin')
ON DUPLICATE KEY UPDATE username = username;

-- Create audit log table for tracking changes
CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    changed_by VARCHAR(50),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_changed_at (changed_at)
);

-- Create OTP table for mobile verification
CREATE TABLE IF NOT EXISTS otp_verification (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mobile_number VARCHAR(10) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    purpose ENUM('login', 'registration') NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_mobile_otp (mobile_number, otp_code),
    INDEX idx_expires_at (expires_at)
);

-- Sample data for testing
INSERT INTO feedback (call_id, citizen_mobile, satisfaction, description, submitted_by, status) VALUES
('CG001', '9876543210', 'satisfied', 'The service was excellent and my issue was resolved quickly.', '9123456789', 'resolved'),
('CG002', '9876543211', 'not-satisfied', 'The response time was too slow and the staff was not helpful.', '9123456788', 'pending'),
('CG003', '9876543212', 'satisfied', 'Good service, but could be improved.', '9123456787', 'resolved'),
('CG004', '9876543213', 'not-satisfied', 'Very poor experience, need immediate attention.', '9123456786', 'pending');
