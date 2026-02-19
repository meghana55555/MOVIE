const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, username, email, password, phone } = req.body;
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ error: 'Full name, username, email and password required' });
    }
    const user_id = (username + Date.now().toString(36)).slice(0, 12).replace(/\s/g, '');
    const encoded = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO User (user_id, name, username, email, phone, password)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, fullName, username, email || '', phone || null, encoded]
    );
    res.status(201).json({ message: 'Registered. Redirect to login.', user_id });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Login - compare username & password with DB
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const [rows] = await pool.query(
      'SELECT user_id, name, username, password FROM User WHERE username = ?',
      [username]
    );
    if (!rows.length) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const token = jwt.sign(
      { user_id: user.user_id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    res.json({ token, message: 'Login success. Go to Netflix landing page.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
