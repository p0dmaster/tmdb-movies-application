import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

//API-nyckel och bas-URL för att hämta data från The Movie Database (TMDB)
const API_KEY = "9c5dd81f3af27cbc647fcecd314b4beb";
const BASE_URL = "https://api.themoviedb.org/3";

function Home() {
  // Tillstånd för att lagra filmer som hämtas från API:et
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Funktion som hämtar populära filmer från TMDB API
    const fetchPopularMovies = async () => {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: { api_key: API_KEY },
      });
      setMovies(response.data.results); // Sparar filmerna
    };

    fetchPopularMovies(); // Kör funktionen vid komponentens första render
  }, []);

  // Retunerar resultatet och visar upp i UI:t för användaren enligt angiven HTML-kod
  return (
    <div>
      <h2 className="popular-movies-heading">Populära Filmer Just Nu</h2>
      <ul className="movie-list">
        {movies.map((movie) => (
          <li key={movie.id} className="movie">
            <img
              src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
              alt={movie.title}
            />
            <div>
              <h3>{movie.title}</h3>
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
    </div>
  );
}

export default Home;
