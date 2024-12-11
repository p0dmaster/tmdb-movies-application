import React, { useEffect, useState } from "react";
import axios from "axios";

// API-nyckel och bas-URL för The Movie Database
const API_KEY = "9c5dd81f3af27cbc647fcecd314b4beb";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

// Lista över genrer att hämta filmer från (genrekoder enligt TMDb)
const GENRES = [28, 35, 18, 10751, 878];

// Mappning av genrekoder till läsbara namn
const GENRE_NAMES = {
  28: "Action",
  35: "Komedi",
  18: "Drama",
  10751: "Familj",
  878: "Science Fiction",
};

// Komponent som visar slumpmässiga trailers från olika genrer
function RandomVideos() {
  // för att hålla listan av hämtade filmer med trailers
  const [videos, setVideos] = useState([]);

  // för att hantera om modal (trailerspelare) ska visas
  const [showModal, setShowModal] = useState(false);

  // den aktuella trailern som visas
  const [currentTrailer, setCurrentTrailer] = useState(null);

  // useEffect-hook för att hämta filmer vid komponentens laddning
  useEffect(() => {
    const fetchRandomVideos = async () => {
      // Skapa en array av promises för att hämta filmer för varje genre
      const videoPromises = GENRES.map(async (genre) => {
        const response = await axios.get(`${BASE_URL}/discover/movie`, {
          params: {
            api_key: API_KEY,
            with_genres: genre,
            sort_by: "popularity.desc", // Sortera efter popularitet
            page: Math.floor(Math.random() * 10) + 1, // Välj en slumpmässig sida
          },
        });

        // Välj en slumpmässig film från den hämtade sidan
        const randomMovie =
          response.data.results[
            Math.floor(Math.random() * response.data.results.length)
          ];

        if (randomMovie) {
          // Hämta trailers för den valda filmen
          const videoResponse = await axios.get(
            `${BASE_URL}/movie/${randomMovie.id}/videos`,
            {
              params: { api_key: API_KEY },
            }
          );

          // Filtrera fram trailern om den finns på YouTube
          const trailer = videoResponse.data.results.find(
            (video) => video.type === "Trailer" && video.site === "YouTube"
          );

          // Returnera filmens information inklusive trailern
          return {
            id: randomMovie.id,
            title: randomMovie.title,
            genre: genre,
            trailer: trailer
              ? `https://www.youtube.com/embed/${trailer.key}`
              : null,
            poster: randomMovie.poster_path
              ? `${IMAGE_BASE_URL}${randomMovie.poster_path}`
              : null,
          };
        }
        return null; // Om ingen film hittades
      });

      // Vänta tills alla promises är lösta och filtrera bort null-värden
      const results = await Promise.all(videoPromises);
      setVideos(results.filter((video) => video && video.trailer)); // Filtrera bort filmer utan trailers
    };

    fetchRandomVideos(); // Kör funktionen för att hämta filmer
  }, []);

  // Öppna modal för en specifik trailer
  const handleTrailerOpen = (trailer) => {
    setCurrentTrailer(trailer); // Sätt den aktuella trailern
    setShowModal(true); // Visa modal
  };

  // Stäng modal
  const handleTrailerClose = () => {
    setCurrentTrailer(null); // Nollställ trailern
    setShowModal(false); // Dölj modal
  };

  // Retunerar resultatet och visar upp i UI:t för användaren enligt angiven HTML-kod
  return (
    <div>
      <h2 className="popular-movies-heading">Slumpmässiga Filmer</h2>
      <p>
        Trött på att konstant leta efter en film medans maten står och blir
        kall? Oroa dig inte, nedan hittar du 5 slumpmässiga film-trailers från
        olika genres att välja mellan!
      </p>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {videos.map((video, index) => (
          <li key={index} className="movie">
            {video.poster && (
              <img src={video.poster} alt={`${video.title} poster`} />
            )}
            <div>
              <h3>{video.title}</h3>
              <p>
                <strong>Genre:</strong>{" "}
                {GENRE_NAMES[video.genre] || "Okänd Genre"}
              </p>
              <button
                className="trailer-button"
                onClick={() => handleTrailerOpen(video.trailer)}
              >
                Se Trailer
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal-overlay" onClick={handleTrailerClose}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Förhindra att modal stängs vid klick inuti
          >
            <iframe
              width="100%"
              height="400"
              src={currentTrailer}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button className="close-button" onClick={handleTrailerClose}>
              Stäng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RandomVideos;
