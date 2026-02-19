import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Browse.css';

const API = import.meta.env.VITE_API_URL || '';

function Row({ title, query }) {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/movies/search?s=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((d) => setMovies(d.Search || []))
      .catch(() => setMovies([]));
  }, [query]);

  return (
    <section className="browse-row">
      <h3>{title}</h3>
      <div className="browse-row-posters">
        {movies.map((m) => (
          <img
            key={m.imdbID}
            src={m.Poster !== 'N/A' ? m.Poster : '/placeholder-poster.png'}
            alt={m.Title}
            onError={(e) => e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster'}
          />
        ))}
      </div>
    </section>
  );
}

export default function Browse() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetch(`${API}/api/movies/search?s=movie`)
      .then((r) => r.json())
      .then((d) => {
        const list = d.Search || [];
        setFeatured(list[0] || null);
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="browse">
      <nav className="browse-nav">
        <span className="browse-logo">BOOKY</span>
        <button className="browse-logout" onClick={handleLogout}>Sign out</button>
      </nav>
      {featured && (
        <header
          className="browse-hero"
          style={{ backgroundImage: `url(${featured.Poster !== 'N/A' ? featured.Poster : ''})` }}
        >
          <div className="browse-hero-content">
            <h1>{featured.Title}</h1>
            <p>{featured.Year} · {featured.Type}</p>
          </div>
        </header>
      )}
      <main className="browse-content">
        <Row title="Trending Now" query="action" />
        <Row title="New This Week" query="adventure" />
        <Row title="Popular Movies" query="popular" />
      </main>
    </div>
  );
}
