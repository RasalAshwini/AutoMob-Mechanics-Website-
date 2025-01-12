const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs'); // Using bcryptjs as specified in package.json
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ROOT', // Update as per your MySQL configuration
    database: 'automob_mechanic'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Register route
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    const checkUserSql = 'SELECT * FROM users WHERE username = ?';
    db.query(checkUserSql, [username], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: err.message });

            const insertUserSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.query(insertUserSql, [username, hashedPassword], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(200).json({ message: 'User registered successfully' });
            });
        });
    });
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) {
            // User does not exist, suggest registration
            return res.status(400).json({ message: 'User not found. Please register.' });
        }

        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!isMatch) return res.status(400).json({ message: 'Incorrect password.' });

            // Login successful
            res.status(200).json({ message: 'Login successful' });
        });
    });
});


/// Booking route
app.post('/booking', (req, res) => {
    const { name, emailID, phNo, selectService, carMake, carModel, fuelType, appointmentDate, address } = req.body;

    // Validate required fields
    if (!address) {
        return res.status(400).json({ success: false, message: "Address is required" });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!appointmentDate.match(dateRegex)) {
        return res.status(400).json({ success: false, message: "Invalid date format. Use YYYY-MM-DD." });
    }

    // Check if the date is a valid date
    const dateObj = new Date(appointmentDate);
    if (isNaN(dateObj.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid date." });
    }

    const insertQuery = `
        INSERT INTO bookings (name, emailID, phNo, selectService, carMake, carModel, fuelType, appointmentDate, address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const queryValues = [name, emailID, phNo, selectService, carMake, carModel, fuelType, appointmentDate, address];

    db.query(insertQuery, queryValues, (err, result) => {
        if (err) {
            console.error('Error booking the service:', err);
            return res.status(500).json({ success: false, message: 'Error booking the service' });
        }

        res.status(200).json({ success: true, message: 'Booking successful' });
    });
});




// Start server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
