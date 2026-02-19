const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../db');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, username, email, password, phone } = req.body;
    if (!fullName || !username || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Full name, username, email and password required' });
    }

    const existing = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existing) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const userId = (username + Date.now().toString(36)).slice(0, 12).replace(/\s/g, '');
    const encoded = await bcrypt.hash(password, 10);

    await User.create({
      userId,
      name: fullName,
      username,
      email,
      phone: phone || undefined,
      password: encoded,
    });

    res.status(201).json({ message: 'Registered. Redirect to login.', userId });
  } catch (err) {
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

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user.userId, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ token, message: 'Login success. Go to Netflix landing page.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
