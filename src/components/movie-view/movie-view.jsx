import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

export const MovieView = ({ movie, user, token, onFavorite }) => {
  const navigate = useNavigate();

  const handleFavorite = () => {
    if (!user || !token) return;

    fetch(`https://myflix-movieapi.onrender.com/users/${user.username}/movies/${movie._id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add favorite");
        return res.json();
      })
      .then(() => onFavorite(movie))
      .catch((err) => console.error(err));
  };

  return (
    <div className="movie-view container mt-4">
      <Button className="mb-3" variant="secondary" onClick={() => navigate("/movies")}>
        Back
      </Button>

      <h2>{movie.title}</h2>
      <p>{movie.description}</p>
      {movie.genre && <p><strong>Genre:</strong> {movie.genre.name}</p>}
      {movie.director && <p><strong>Director:</strong> {movie.director.name}</p>}

      {user && (
        <Button variant="warning" onClick={handleFavorite}>
          Favorite
        </Button>
      )}
    </div>
  );
};
