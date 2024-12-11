import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function App() {
  // för att lagra filmer
  const [movies, setMovies] = useState([]);
  // för att lagra användarens sökfråga
  const [query, setQuery] = useState("");
  // för att indikera om data hämtas
  const [loading, setLoading] = useState(false);

  // API-nyckel och bas-URL för The Movie Database
  const API_KEY = "9c5dd81f3af27cbc647fcecd314b4beb";
  const BASE_URL = "https://api.themoviedb.org/3";
  const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

  // Funktion för att hämta filmer baserat på användarens sökfråga
  const fetchMovies = async () => {
    if (!query) return; // Avbryt om sökfrågan är tom
    setLoading(true); // Sätt laddningsstatus till true
    try {
      // Hämta data från TMDB API
      const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: {
          api_key: API_KEY,
          query,
        },
      });
      setMovies(response.data.results); // Uppdatera state med filmer
    } catch (error) {
      console.error("Error fetching movies:", error); // Logga eventuella fel
    } finally {
      setLoading(false); // Återställ laddningsstatus
    }
  };

  // Kör fetchMovies när sökfrågan ändras
  useEffect(() => {
    fetchMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Retunerar resultatet och visar upp i UI:t för användaren enligt angiven HTML-kod
  return (
    <div>
      <h1>Sök film</h1>
      <input
        type="text"
        placeholder="Sök efter en film..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="movie-list">
          {movies.map((movie) => (
            <li key={movie.id} className="movie-item">
              {movie.poster_path ? (
                <img
                  src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
              <div className="movie-details">
                <h2>{movie.title}</h2>
                <h3>Översikt</h3>
                <p>{movie.overview}</p>
                <p>
                  <strong>Släpptes:</strong> {movie.release_date}
                </p>
                <p>
                  <strong>Betyg:</strong> {movie.vote_average * 10}% Positiva
                </p>
                <Link to={`/movie/${movie.id}`}>Se detaljer</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
