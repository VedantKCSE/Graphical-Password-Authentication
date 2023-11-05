const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

// Replace with your actual database configuration
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myappdb' // Use the name of the database you created
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database');
    }
});

app.use(cors());
app.use(bodyParser.json());

// Handle the signup request
app.post('/signup', (req, res) => {
    const { email, password } = req.body;

    // Perform the database INSERT operation here
    // Insert the email and password into your SQL database

    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(sql, [email, password], (error, result) => {
        if (error) {
            console.error('Error while signing up:', error);
            res.json({ success: false });
        } else {
            res.json({ success: true });
        }
    });
});

// Handle the signin request
app.post('/signin', (req, res) => {
    const { email, password } = req.body;

    // Perform the database SELECT operation here
    // Retrieve the stored password for the provided email

    const sql = 'SELECT password FROM users WHERE email = ?';
    db.query(sql, [email], (error, results) => {
        if (error) {
            console.error('Error while signing in:', error);
            res.json({ success: false });
        } else {
            if (results.length === 1) {
                const storedPassword = results[0].password;
                const success = storedPassword === password;
                res.json({ success });
            } else {
                res.json({ success: false });
            }
        }
    });
});

const port = 3000; // Replace with your desired port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
