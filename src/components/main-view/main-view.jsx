// src/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { Row, Col } from "react-bootstrap";
import './main-view.scss';

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
  if (!token) return;

  fetch("https://myflix-movieapi.onrender.com/movies", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }
      return response.json();
    })
    .then((data) => {
      setMovies(data);
    })
    .catch((err) => {
      console.error(err);
    });
}, [token]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  // Show movie details if one is selected
  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }

  // Show login/signup if no user
  if (!user) {
    return (
      <div style={{ maxWidth: "400px", margin: "2rem auto" }}>
        <LoginView
          onLoggedIn={(userData, token) => {
            setUser(userData);
            setToken(token);
            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("token", token);
          }}
        />

        <div style={{ textAlign: "center", margin: "1rem 0" }}>or</div>

        <SignupView />
      </div>
    );
  }

  // Show movie list
  return (
    <div className="main-view">
      <button
        type="button"
        onClick={handleLogout}
        className="btn btn-primary"
      >
        Logout
      </button>

      <h1>Movie List</h1>

      <Row>
        {movies.length === 0 ? (
          <p>No movies found</p>
        ) : (
          movies.map((movie) => (
            <Col xs={12} sm={6} md={4} lg={3} key={movie._id} className="mb-4">
              <MovieCard
                movie={movie}
                onMovieClick={setSelectedMovie}
              />
            </Col>
          ))
        )}
      </Row>
    </div>
  );
};
