// src/main-view/main-view.jsx
import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view"; // <-- import your login view

export const MainView = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [user, setUser] = useState(null); // <-- add user state
  const [token, setToken] = useState(null); // <-- add token state

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  if (!user) {
    return (
      <LoginView
        onLoggedIn={(userData, token) => {
          setUser(userData);
          setToken(token);
          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("token", token);
        }}
      />
    );
  }

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const movies = [
    {
      _id: "1",
      title: "Inception",
      description:
        "A thief who steals corporate secrets through dream-sharing technology...",
      image:
        "https://media.themoviedb.org/t/p/w440_and_h660_face/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg",
      genre: "Sci-Fi",
      director: "Christopher Nolan",
    },
    {
      _id: "2",
      title: "The Matrix",
      description:
        "A computer hacker learns about the true nature of reality and his role in the war...",
      image:
        "https://media.themoviedb.org/t/p/w440_and_h660_face/sRaupdJawe6UTS0t77vwJoLjd7h.jpg",
      genre: "Action",
      director: "The Wachowskis",
    },
    {
      _id: "3",
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space...",
      image:
        "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
      genre: "Adventure",
      director: "Christopher Nolan",
    },
  ];

  // Show login screen if not logged in
  if (!user) {
    return (
      <LoginView
        onLoggedIn={(userData, token) => {
          setUser(userData);
          setToken(token);
        }}
      />
    );
  }

  // Show movie details if one is selected
  if (selectedMovie) {
    return (
      <MovieView
        movie={selectedMovie}
        onBackClick={() => setSelectedMovie(null)}
      />
    );
  }

  // Show movie list
  return (
    <div>
      <h1>Movie List</h1>
      {movies.map((movie) => (
        <MovieCard
          key={movie._id}
          movie={movie}
          onMovieClick={setSelectedMovie}
        />
      ))}
    </div>
  );
};
