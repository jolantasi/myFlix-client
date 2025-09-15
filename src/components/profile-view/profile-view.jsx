// src/components/profile-view/profile-view.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MovieCard } from "../movie-card/movie-card";
import { Row, Col, Form, Button } from "react-bootstrap";

export const ProfileView = ({ user, token, movies, onUserUpdate, onUserDelete }) => {
  const [currentUser, setCurrentUser] = useState(user);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    birthday: ""
  });

  // Fetch user details
  useEffect(() => {
    if (!token) return;

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser?.username) return;

    fetch(`https://myflix-movieapi.onrender.com/users/${storedUser.username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then((data) => {
        setCurrentUser(data);
        setFormData({
          username: data.username,
          password: "",
          email: data.email,
          birthday: data.Birthday ? String(data.Birthday).slice(0, 10) : ""
        });

        // Map fav IDs → actual movie objects
        const favs = Array.isArray(data.favoriteMovies)
          ? movies.filter((m) => data.favoriteMovies.includes(m._id))
          : [];
        setFavoriteMovies(favs);

        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [token, movies]);

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update profile
  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`https://myflix-movieapi.onrender.com/users/${currentUser.username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update user");
        return res.json();
      })
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        onUserUpdate(updatedUser);
        alert("Profile updated successfully!");
      })
      .catch((err) => console.error(err));
  };

  // Delete account
  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    fetch(`https://myflix-movieapi.onrender.com/users/${currentUser.username}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete user");
        localStorage.clear();
        onUserDelete();
        alert("Your account has been deleted.");
      })
      .catch((err) => console.error(err));
  };

  if (isLoading) {
    return <div className="container mt-4">Loading profile...</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Profile</h2>
      <Form onSubmit={handleUpdate}>
        <Form.Group controlId="formUsername" className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-3">
          <Form.Label>Password (leave blank to keep current)</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="formBirthday" className="mb-3">
          <Form.Label>Birthday</Form.Label>
          <Form.Control
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="me-2">
          Update
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete Account
        </Button>
      </Form>

      <h3 className="mt-5">Favorite Movies</h3>
      <Row>
        {favoriteMovies.length > 0 ? (
          favoriteMovies.map((movie) => (
            <Col md={4} key={movie._id} className="mb-4">
              <MovieCard movie={movie} />
            </Col>
          ))
        ) : (
          <p>No favorite movies yet.</p>
        )}
      </Row>
    </div>
  );
};

ProfileView.propTypes = {
  user: PropTypes.object,
  token: PropTypes.string.isRequired,
  movies: PropTypes.array.isRequired,
  onUserUpdate: PropTypes.func.isRequired,
  onUserDelete: PropTypes.func.isRequired
};
