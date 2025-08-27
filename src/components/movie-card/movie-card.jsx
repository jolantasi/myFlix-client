import React from "react";
import PropTypes from "prop-types";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const MovieCard = ({ movie, user, token, onFavorite }) => {
  const navigate = useNavigate();

  const handleFavorite = () => {
    if (!user || !token) return;

    fetch(`https://myflix-movieapi.onrender.com/users/${user.username}/movies/${movie._id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to add favorite");
        return response.json();
      })
      .then((updatedUser) => onFavorite(updatedUser))
      .catch((err) => console.error(err));
  };

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
        onClick={handleInfo} // clicking image navigates
      />
      <Card.Body>
        <Card.Title onClick={handleInfo}>{movie.title}</Card.Title>
        <Card.Text>
          {movie.description.length > 100
            ? movie.description.substring(0, 100) + "..."
            : movie.description}
        </Card.Text>
        {movie.genre && <Card.Text><strong>Genre:</strong> {movie.genre.name}</Card.Text>}
        {movie.director && <Card.Text><strong>Director:</strong> {movie.director.name}</Card.Text>}
        <div className="d-flex justify-content-between">
          <Button variant="primary" onClick={handleInfo}>
            Info
          </Button>
          <Button variant="success" onClick={handleFavorite}>
            Favorite
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.object.isRequired,
  user: PropTypes.object,
  token: PropTypes.string,
  onFavorite: PropTypes.func.isRequired,
};
