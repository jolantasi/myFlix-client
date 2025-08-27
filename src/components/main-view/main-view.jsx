import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { Row, Col } from "react-bootstrap";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import { ProfileView } from "../profile-view/profile-view";
import "./main-view.scss";

// Wrapper for MovieView that fetches the movie based on :movieId
const MovieViewWrapper = ({ movies, user, token, onFavorite }) => {
  const { movieId } = useParams();
  const movie = movies.find((m) => m._id === movieId);

  if (!movie) return <p>Movie not found</p>;

  return <MovieView movie={movie} user={user} token={token} onFavorite={onFavorite} />;
};

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (!token) return;

    fetch("https://myflix-movieapi.onrender.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch movies");
        return response.json();
      })
      .then((data) => setMovies(data))
      .catch((err) => console.error(err));
  }, [token]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  // ✅ Updated: handleFavorite receives updatedUser from backend
  const handleFavorite = (updatedUser) => {
    setUser(updatedUser); // update state
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Movie added to favorites!");
  };

  return (
    <BrowserRouter>
      {user && (
        <button type="button" onClick={handleLogout} className="btn btn-primary m-3">
          Logout
        </button>
      )}

      <NavigationBar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={user ? <Navigate to="/movies" /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/movies" />
            ) : (
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
            )
          }
        />
        <Route path="/signup" element={user ? <Navigate to="/movies" /> : <SignupView />} />
        <Route
          path="/profile"
          element={
            user ? (
              <ProfileView
                user={user}
                token={token}
                movies={movies}
                onUserUpdate={(updatedUser) => setUser(updatedUser)}
                onUserDelete={() => {
                  setUser(null);
                  setToken(null);
                  localStorage.clear();
                }}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/movies"
          element={
            user ? (
              <div className="main-view">
                <h1>Movie List</h1>
                <Row>
                  {movies.map((movie) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={movie._id} className="mb-4">
                      <MovieCard
                        movie={movie}
                        user={user}
                        token={token}
                        onFavorite={handleFavorite}
                        // Clicking card navigates to movie view
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/movies/:movieId"
          element={user ? <MovieViewWrapper movies={movies} user={user} token={token} onFavorite={handleFavorite} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
};
