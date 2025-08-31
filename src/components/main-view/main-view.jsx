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

// ✅ Normalize user data to handle backend inconsistencies
const normalizeUser = (rawUser) => ({
  username: rawUser.Username || rawUser.username || "",
  email: rawUser.Email || rawUser.email || "",
  Birthday: rawUser.Birthday || rawUser.birthday || "",
  favoriteMovies: rawUser.FavoriteMovies || rawUser.favoriteMovies || []
});

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? normalizeUser(JSON.parse(savedUser)) : null;
  });
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (!token) {
      console.log("No token found, skipping movie fetch");
      return;
    }

    console.log("Fetching movies with token:", token.substring(0, 20) + "...");
    
    fetch("https://myflix-movieapi.onrender.com/movies", {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    })
      .then((response) => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          if (response.status === 401) {
            // Token is invalid/expired, clear it
            setUser(null);
            setToken(null);
            localStorage.clear();
            throw new Error("Session expired, please login again");
          }
          throw new Error(`HTTP ${response.status}: Failed to fetch movies`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Movies fetched successfully:", data.length);
        setMovies(data);
        setFetchError(null);
      })
      .catch((err) => {
        console.error("Error fetching movies:", err);
        setFetchError(err.message);
        // If it's a network error, show a user-friendly message
        if (err.message.includes("Failed to fetch")) {
          console.error("Network error: Backend server might be down or unreachable");
          setFetchError("Unable to connect to server. Please check your internet connection.");
        }
      });
  }, [token]);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  };

  // ✅ Handle adding favorites from MovieCard - makes API call
  const handleFavorite = (movie) => {
    console.log("Adding movie to favorites from MovieCard:", movie._id);
    console.log("User:", user?.username || "NO USERNAME");
    
    if (!user?.username) {
      alert("Error: User not properly logged in. Please refresh and try again.");
      return;
    }
    
    fetch(`https://myflix-movieapi.onrender.com/users/${user.username}/movies/${movie._id}`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(async (res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          const errorText = await res.text();
          console.log("Error response:", errorText);
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        return res.json();
      })
      .then((updatedUser) => {
        console.log("Updated user from MovieCard favorite:", updatedUser);
        const normalizedUser = normalizeUser(updatedUser);
        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        alert("Movie added to favorites!");
      })
      .catch((err) => {
        console.error("Full error:", err);
        alert("Error adding to favorites: " + err.message);
      });
  };

  // ✅ Handle user updates (for profile updates)
  const handleUserUpdate = (updatedUser) => {
    const normalizedUser = normalizeUser(updatedUser);
    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    console.log("User updated:", normalizedUser); // Debug log
  };

  // ✅ Handle adding favorites from MovieView
  const handleMovieViewFavorite = (movie) => {
    console.log("Adding movie to favorites:", movie._id);
    console.log("User:", user?.username || "NO USERNAME");
    console.log("Full user object:", user);
    console.log("Token:", token ? token.substring(0, 20) + "..." : "NO TOKEN");
    
    if (!user?.username) {
      alert("Error: User not properly logged in. Please refresh and try again.");
      return;
    }
    
    fetch(`https://myflix-movieapi.onrender.com/users/${user.username}/movies/${movie._id}`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then(async (res) => {
        console.log("Response status:", res.status);
        if (!res.ok) {
          const errorText = await res.text();
          console.log("Error response:", errorText);
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        return res.json();
      })
      .then((updatedUser) => {
        console.log("Updated user:", updatedUser);
        const normalizedUser = normalizeUser(updatedUser);
        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        alert("Movie added to favorites!");
      })
      .catch((err) => {
        console.error("Full error:", err);
        alert("Error adding to favorites: " + err.message);
      });
  };

  return (
    <BrowserRouter>
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
                    const normalizedUser = normalizeUser(userData);
                    setUser(normalizedUser);
                    setToken(token);
                    localStorage.setItem("user", JSON.stringify(normalizedUser));
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
                onUserUpdate={handleUserUpdate}
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
                {fetchError && (
                  <div className="alert alert-danger" role="alert">
                    Error: {fetchError}
                  </div>
                )}
                {movies.length === 0 && !fetchError ? (
                  <div className="alert alert-info" role="alert">
                    Loading movies...
                  </div>
                ) : (
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
                )}
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/movies/:movieId"
          element={user ? <MovieViewWrapper movies={movies} user={user} token={token} onFavorite={handleMovieViewFavorite} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
};