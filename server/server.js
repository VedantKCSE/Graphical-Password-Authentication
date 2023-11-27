const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const crypto = require('crypto');

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
    const { name, email, password } = req.body;

    const sql = 'INSERT INTO users (email, password, name) VALUES (?, ?, ?)';
    db.query(sql, [email, password, name], (error, result) => {
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

// Nodemailer configuration
const transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'gmail',
      auth: {
        user: 'servicegauth@gmail.com',
        pass: 'ywfg errc cvwa kzfq'
      }
    })
  );

  // Generate a random token for password reset
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
  }
  
  // Store the token in the database along with the user's email
  function storeResetToken(email, token) {
    const updateTokenSql = 'UPDATE users SET reset_token = ? WHERE email = ?';
    db.query(updateTokenSql, [token, email], (error, result) => {
      if (error) {
        console.error('Error storing reset token:', error);
      }
    });
  }
  
  app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    const resetToken = generateToken();
  
    // Send reset email
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
    const mailOptions = {
      to: email,
      subject: 'Password Reset',
      html: `Click <a href="${resetLink}">here</a> to reset your password.`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending reset email:', error);
        res.json({ success: false });
      } else {
        storeResetToken(email, resetToken);
        console.log('Reset email sent:', info.response);
        res.json({ success: true });
      }
    });
  });
  
// Add this to your existing Node.js server code

// ... (existing code)

app.post('/reset-password', (req, res) => {
  const { email, password, token } = req.body;

  // Verify the token against the stored token in the database
  const verifyTokenSql = 'SELECT * FROM users WHERE email = ? AND reset_token = ?';
  db.query(verifyTokenSql, [email, token], (error, results) => {
      if (error) {
          console.error('Error verifying reset token:', error);
          res.json({ success: false });
      } else {
          if (results.length === 1) {
              // Update the password and reset token in the database
              const updatePasswordSql = 'UPDATE users SET password = ?, reset_token = NULL WHERE email = ?';
              db.query(updatePasswordSql, [password, email], (updateError, updateResult) => {
                  if (updateError) {
                      console.error('Error updating password:', updateError);
                      res.json({ success: false });
                  } else {
                      res.json({ success: true });
                  }
              });
          } else {
              // Invalid token or email
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
