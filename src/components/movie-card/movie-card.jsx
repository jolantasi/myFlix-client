// src/components/movie-card/movie-card.jsx
import React from "react";
import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const MovieCard = ({ movie, onFavorite }) => {
  const navigate = useNavigate();

  const handleInfo = () => {
    navigate(`/movies/${movie._id}`);
  };

  return (
    <Card style={{ width: "18rem", cursor: "pointer" }} className="mb-4">
      <Card.Img
        variant="top"
        src={movie.imageUrl}
        alt={movie.title}
        style={{ height: "250px", objectFit: "cover" }}
        onClick={handleInfo}
      />
      <Card.Body>
        <Card.Title onClick={handleInfo}>{movie.title}</Card.Title>
        <Card.Text>
          {movie.description?.length > 100
            ? movie.description.substring(0, 100) + "..."
            : movie.description}
        </Card.Text>
        {movie.genre && (
          <Card.Text>
            <strong>Genre:</strong> {movie.genre.name}
          </Card.Text>
        )}
        {movie.director && (
          <Card.Text>
            <strong>Director:</strong> {movie.director.name}
          </Card.Text>
        )}
        <div className="d-flex justify-content-between">
          <Button variant="primary" onClick={handleInfo}>
            Info
          </Button>
          <Button variant="success" onClick={() => onFavorite?.(movie)}>
            Favorite
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.object.isRequired,
  onFavorite: PropTypes.func // optional
};
