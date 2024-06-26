const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vivek@#123',
    database: 'user'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.post('/signup', (req, res) => {
    console.log('Received signup request');
    const { name, email, password } = req.body;

    // Check if the user already exists
    const checkUserSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserSql, [email], (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            res.status(500).json({ message: 'Error querying database' });
            return;
        }

        if (results.length > 0) {
            console.log('User already exists:', email);
            res.status(400).json({ message: 'User already exists' });
        } else {
            // Insert new user
            const insertUserSql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
            db.query(insertUserSql, [name, email, password], (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    res.status(500).json({ message: 'Error inserting data' });
                    return;
                }
                console.log('Data inserted:', result);
                res.status(200).json({ message: 'Signup successful' });
            });
        }
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
