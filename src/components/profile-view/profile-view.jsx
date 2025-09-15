// src/components/profile-view/ProfileView.jsx
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { MovieCard } from "../movie-card/movie-card";
import { Row, Col, Form, Button } from "react-bootstrap";

// ✅ Normalize backend user response to consistent keys
const normalizeUser = (rawUser) => ({
  username: rawUser.Username || rawUser.username || "",
  email: rawUser.Email || rawUser.email || "",
  Birthday: rawUser.Birthday || rawUser.birthday || "",
  favoriteMovies: rawUser.FavoriteMovies || rawUser.favoriteMovies || []
});

export const ProfileView = ({ user, token, movies, onUserUpdate, onUserDelete }) => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    email: "",
    birthday: ""
  });
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize form + favorites when user/movies load
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    const normalized = normalizeUser(user);

    setUserData({
      username: normalized.username,
      password: "",
      email: normalized.email,
      birthday: normalized.Birthday ? String(normalized.Birthday).slice(0, 10) : ""
    });

    const favIds = normalized.favoriteMovies || [];
    const favs = Array.isArray(movies)
      ? movies.filter((m) => favIds.includes(m._id))
      : [];
    setFavoriteMovies(favs);
    setIsLoading(false);
  }, [user, movies]);

  // Handlers
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const refreshFavoritesFromUpdatedUser = useCallback(
    (updatedUser) => {
      const normalized = normalizeUser(updatedUser);
      const favIds = normalized.favoriteMovies || [];
      const favs = Array.isArray(movies)
        ? movies.filter((m) => favIds.includes(m._id))
        : [];
      setFavoriteMovies(favs);
    },
    [movies]
  );

  const handleUpdate = useCallback(
    (e) => {
      e.preventDefault();

      // Build payload - only include password if it's provided
      const payload = {
        username: userData.username, // backend expects capitalized keys
        email: userData.email,
        Birthday: userData.birthday
      };
      
      // Only add password to payload if user entered one
      if (userData.password && userData.password.trim() !== "") {
        payload.password = userData.password.trim();
        console.log("Including password in update"); // Debug log
      } else {
        console.log("No password provided, skipping password update"); // Debug log
      }
      
      console.log("Update payload:", { ...payload, Password: payload.password ? "[HIDDEN]" : undefined });

      fetch(`https://myflix-movieapi.onrender.com/users/${user.username}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(async (res) => {
          console.log("Update response status:", res.status);
          if (!res.ok) {
            const errData = await res.json().catch(() => null);
            console.log("Update error response:", errData);
            const msg =
              errData?.errors?.map((e) => e.msg).join(", ") ||
              errData?.message ||
              `Failed to update user (HTTP ${res.status})`;
            throw new Error(msg);
          }
          return res.json();
        })
        .then((updatedUser) => {
          const normalized = normalizeUser(updatedUser);
          alert("Profile updated successfully!");
          
          // Update the form data with the new values (clear password field)
          setUserData({
            username: normalized.username,
            password: "", // Always clear password field after update
            email: normalized.email,
            birthday: normalized.Birthday ? String(normalized.Birthday).slice(0, 10) : ""
          });
          
          // Update parent component and localStorage
          onUserUpdate(normalized);
          refreshFavoritesFromUpdatedUser(normalized);
        })
        .catch((err) => {
          console.error("Profile update error:", err);
          alert("Error updating profile: " + err.message);
        });
    },
    [user.username, token, userData, onUserUpdate, refreshFavoritesFromUpdatedUser]
  );

  const handleDelete = useCallback(() => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    fetch(`https://myflix-movieapi.onrender.com/users/${user.username}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete user");
        alert("Account deleted successfully.");
        onUserDelete();
      })
      .catch((err) => console.error(err));
  }, [user.username, token, onUserDelete]);

  // ✅ This function handles adding movies to favorites from the MovieCard
  const handleFavoriteMovie = useCallback(
    (movie) => {
      fetch(
        `https://myflix-movieapi.onrender.com/users/${user.username}/movies/${movie._id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` }
        }
      )
        .then((res) => {
          if (!res.ok) throw new Error("Failed to add favorite");
          return res.json();
        })
        .then((updatedUser) => {
          const normalized = normalizeUser(updatedUser);
          onUserUpdate(normalized);
          refreshFavoritesFromUpdatedUser(normalized);
          alert("Movie added to favorites!");
        })
        .catch((err) => {
          console.error(err);
          alert("Error adding to favorites: " + err.message);
        });
    },
    [user.username, token, onUserUpdate, refreshFavoritesFromUpdatedUser]
  );

  const handleRemoveFavorite = useCallback(
    (movieId) => {
      console.log("Removing movie from favorites:", movieId);
      console.log("User:", user.username);
      
      if (!window.confirm("Are you sure you want to remove this movie from favorites?")) {
        return;
      }
      
      fetch(
        `https://myflix-movieapi.onrender.com/users/${user.username}/movies/${movieId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }
      )
        .then(async (res) => {
          console.log("Remove favorite response status:", res.status);
          if (!res.ok) {
            const errorText = await res.text();
            console.log("Remove favorite error:", errorText);
            throw new Error(`Failed to remove favorite: ${errorText}`);
          }
          return res.json();
        })
        .then((updatedUser) => {
          console.log("User after removing favorite:", updatedUser);
          const normalized = normalizeUser(updatedUser);
          onUserUpdate(normalized);
          refreshFavoritesFromUpdatedUser(normalized);
          alert("Movie removed from favorites!");
        })
        .catch((err) => {
          console.error("Error removing favorite:", err);
          alert("Error removing from favorites: " + err.message);
        });
    },
    [user.username, token, onUserUpdate, refreshFavoritesFromUpdatedUser]
  );

  // ✅ Show loading only when actually loading
  if (isLoading) {
    return <div className="mt-4">Loading profile...</div>;
  }

  // ✅ Handle case where user is not available
  if (!user) {
    return <div className="mt-4">No user data available.</div>;
  }

  return (
    <div className="profile-view container mt-4">
      <h2>Profile</h2>
      <Form onSubmit={handleUpdate} className="mb-4">
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="password" className="mt-2">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            minLength={6}
          />
          <Form.Text className="text-muted">
            {userData.password ? "New password will be set" : "Current password will be kept"}
          </Form.Text>
        </Form.Group>
        <Form.Group controlId="email" className="mt-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="birthday" className="mt-2">
          <Form.Label>Birthday</Form.Label>
          <Form.Control
            type="date"
            name="birthday"
            value={userData.birthday}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Update Profile
        </Button>
        <Button
          variant="danger"
          type="button"
          className="mt-3 ms-2"
          onClick={handleDelete}
        >
          Delete Account
        </Button>
      </Form>

      <h3>Favorite Movies</h3>
      {favoriteMovies.length === 0 ? (
        <p>No favorite movies yet.</p>
      ) : (
        <Row>
          {favoriteMovies.map((movie) => (
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={movie._id}
              className="mb-4"
            >
              <MovieCard
                movie={movie}
                onFavorite={handleFavoriteMovie}
              />
              <Button
                variant="danger"
                className="mt-2"
                onClick={() => handleRemoveFavorite(movie._id)}
              >
                Remove from Favorites
              </Button>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

ProfileView.propTypes = {
  user: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired,
  movies: PropTypes.array.isRequired,
  onUserUpdate: PropTypes.func.isRequired,
  onUserDelete: PropTypes.func.isRequired
};