// src/components/profile-view/ProfileView.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MovieCard } from "../movie-card/movie-card";
import { Row, Col, Form, Button } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

export const ProfileView = ({ user, token, movies, onUserUpdate, onUserDelete, onFavoriteAdded }) => {
  const [userData, setUserData] = useState({ ...user });
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    if (!user || !movies) return;
    const favorites = movies.filter((m) => user.FavoriteMovies?.includes(m._id));
    setFavoriteMovies(favorites);
  }, [user, movies]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`https://myflix-movieapi.onrender.com/users/${user.username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        Username: userData.username,
        Password: userData.password,
        Email: userData.email,
        Birthday: userData.Birthday,
      }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update user");
        return response.json();
      })
      .then((updatedUser) => {
        alert("Profile updated successfully!");
        onUserUpdate(updatedUser);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    fetch(`https://myflix-movieapi.onrender.com/users/${user.username}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to delete user");
        alert("Account deleted successfully.");
        onUserDelete();
      })
      .catch((err) => console.error(err));
  };

  const handleFavorite = (favMovie) => {
    if (!user.FavoriteMovies.includes(favMovie._id)) {
      const updatedFavorites = [...user.FavoriteMovies, favMovie._id];
      const updatedUser = { ...user, FavoriteMovies: updatedFavorites };
      onFavoriteAdded(updatedUser);
      setFavoriteMovies(movies.filter((m) => updatedFavorites.includes(m._id)));
    }
  };

  const handleRemoveFavorite = (movieId) => {
    fetch(`https://myflix-movieapi.onrender.com/users/${user.username}/movies/${movieId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to remove favorite");
        // Update local state immediately
        const updatedFavorites = user.FavoriteMovies.filter((id) => id !== movieId);
        const updatedUser = { ...user, FavoriteMovies: updatedFavorites };
        onFavoriteAdded(updatedUser);
        setFavoriteMovies(movies.filter((m) => updatedFavorites.includes(m._id)));
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="profile-view container mt-4">
      <h2>Profile</h2>
      <Form onSubmit={handleUpdate} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" name="username" value={userData.username} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={userData.password || ""} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={userData.email || ""} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Birthday</Form.Label>
          <Form.Control type="date" name="Birthday" value={userData.Birthday || ""} onChange={handleChange} />
        </Form.Group>
        <Button variant="primary" type="submit">Update Profile</Button>
        <Button variant="danger" className="ms-3" onClick={handleDelete}>Delete Account</Button>
      </Form>

      <h3>Favorite Movies</h3>
      {favoriteMovies.length === 0 ? (
        <p>No favorite movies yet.</p>
      ) : (
        <Row>
          {favoriteMovies.map((movie) => (
            <Col xs={12} sm={6} md={4} lg={3} key={movie._id} className="mb-4">
              <MovieCard movie={movie} user={user} token={token} onFavorite={handleFavorite} />
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
  onUserDelete: PropTypes.func.isRequired,
  onFavoriteAdded: PropTypes.func.isRequired,
};
