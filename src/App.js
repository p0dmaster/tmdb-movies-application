import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./components/Home";
import MovieDetails from "./components/MovieDetails";
import Search from "./components/Search";
import RandomVideos from "./components/RandomVideos.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";

function App() {

  return (
    <Router>
      <header>
      <Link to="/" className="logo">
        Film Hittaren <FontAwesomeIcon icon={faSliders} />
      </Link>
      <nav>
        <ul>
          <li>
            <Link to="/">Populära Filmer</Link>
          </li>
          <li>
            <Link to="/random-videos">Slumpade Filmer</Link>
          </li>
          <li>
            <Link to="/search">Sök Film</Link>
          </li>
        </ul>
      </nav>
      </header>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/random-videos" element={<RandomVideos />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
