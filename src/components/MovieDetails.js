import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// API-nyckel och bas-URL för att hämta data från The Movie Database (TMDB)
const API_KEY = "9c5dd81f3af27cbc647fcecd314b4beb";
const BASE_URL = "https://api.themoviedb.org/3";

function MovieDetails() {
  // Hämtar filmens ID från URL-parametrarna via React Router
  const { id } = useParams();

  // för att lagra filmens detaljer, trailer-länk, och modalen
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Funktion för att hämta detaljer om en specifik film
    const fetchMovieDetails = async () => {
      const response = await axios.get(`${BASE_URL}/movie/${id}`, {
        params: { api_key: API_KEY },
      });
      setMovie(response.data); // Sätter filmens data
    };

    // Funktion för att hämta trailer för filmen
    const fetchMovieTrailer = async () => {
      const response = await axios.get(`${BASE_URL}/movie/${id}/videos`, {
        params: { api_key: API_KEY },
      });
      const officialTrailer = response.data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (officialTrailer) {
        // Bygger YouTube-länken för trailern
        setTrailer(`https://www.youtube.com/embed/${officialTrailer.key}`);
      }
    };

    // Kör båda funktionerna vid komponentens första render
    fetchMovieDetails();
    fetchMovieTrailer();
  }, [id]);

  // Visar laddningsmeddelande om data inte har hämtats än
  if (!movie) return <p>Laddar detaljer...</p>;

  // Retunerar resultatet och visar upp i UI:t för användaren enligt angiven HTML-kod
  return (
    <div className="movie-details-page">
      <div className="movie-header">
        <img
          className="movie-poster"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />

        <div className="movie-title-section">
          <h1 className="movie-title">
            {movie.title} ({movie.release_date.slice(0, 4)})
          </h1>

          <div className="movie-meta">
            <p>
              <strong>Släpptes:</strong> {movie.release_date}
            </p>
            <p>
              <strong>Betyg:</strong> {movie.vote_average * 10}% Positiva
            </p>
            <p>
              <strong>Genres:</strong>{" "}
              {movie.genres.map((genre) => genre.name).join(", ")}
            </p>
          </div>

          <div className="movie-overview">
            <h2>Översikt</h2>
            <p>{movie.overview}</p>
          </div>

          <div className="movie-footer">
            <p>
              <strong>Status:</strong> {movie.status}
            </p>
            <p>
              <strong>Originalspråk:</strong> {movie.original_language}
            </p>
          </div>

          {trailer && (
            <div className="movie-trailer">
              <button
                className="trailer-button"
                onClick={() => setShowModal(true)}
              >
                Se Trailer
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Förhindrar stängning vid klick inuti modal
          >
            <iframe
              width="100%"
              height="400"
              src={trailer}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
            >
              Stäng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetails;
