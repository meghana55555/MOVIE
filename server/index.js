const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { pool, initDB } = require('./db');
const authRoutes = require('./routes/auth');
const moviesRoutes = require('./routes/movies');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/movies', moviesRoutes);

initDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
  })
  .catch((err) => console.error('DB init failed:', err));
