const express = require('express');

const router = express.Router();
const OMDB_KEY = process.env.OMDB_API_KEY || '6be3423a';
const BASE = 'https://www.omdbapi.com/';

router.get('/search', async (req, res) => {
  try {
    const { s, page } = req.query;
    const url = `${BASE}?apikey=${OMDB_KEY}&s=${encodeURIComponent(s || 'movie')}&page=${page || 1}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/by-id', async (req, res) => {
  try {
    const { i } = req.query;
    if (!i) return res.status(400).json({ error: 'imdb id required' });
    const url = `${BASE}?apikey=${OMDB_KEY}&i=${i}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
