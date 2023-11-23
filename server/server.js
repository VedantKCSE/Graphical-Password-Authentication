const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myappdb'
});

db.connect(err => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to the database');
        console.log(' ');
        console.log('<--------------------------->');
        console.log(' ');
        console.log('Authentication System Activated');
    }
});

app.use(cors());
app.use(bodyParser.json());

app.post('/signup', (req, res) => {
    const { email, password } = req.body;

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

app.post('/signin', (req, res) => {
    const { email, password } = req.body;

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

const port = 3000;
app.listen(port, () => {
    console.log('<--------------------------->');
    console.log(' ');
    console.log(`Server is running on port ${port}`);
});
