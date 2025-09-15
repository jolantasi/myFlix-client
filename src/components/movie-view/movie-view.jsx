// src/components/movie-view/movie-view.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

export const MovieView = ({ movie, onFavorite }) => {
  const navigate = useNavigate();

  return (
    <div className="movie-view container mt-4">
      <Button className="mb-3" variant="secondary" onClick={() => navigate("/movies")}>
        Back
      </Button>

      <div className="d-flex flex-column flex-md-row align-items-start mb-3">
        <img
          src={movie.imageUrl}
          alt={`${movie.title} poster`}
          style={{
            width: "14rem",
            height: "350px",
            objectFit: "cover",
            borderRadius: "10px",
            marginRight: "20px"
          }}
        />

        <div>
          <h2>{movie.title}</h2>
          <p>{movie.description}</p>
          {movie.genre && (
            <p>
              <strong>Genre:</strong> {movie.genre.name}
            </p>
          )}
          {movie.director && (
            <p>
              <strong>Director:</strong> {movie.director.name}
            </p>
          )}

          <Button variant="warning" onClick={() => onFavorite?.(movie)}>
            Favorite
          </Button>
        </div>
      </div>
    </div>
  );
};

MovieView.propTypes = {
  movie: PropTypes.object.isRequired,
  onFavorite: PropTypes.func
};