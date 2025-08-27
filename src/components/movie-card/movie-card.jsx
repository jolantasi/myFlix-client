import React from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-bootstrap';

export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <Card style={{ width: '18rem' }} className="mb-4">
  <Card.Img
    variant="top"
    src={movie.imageUrl}
    alt={movie.title}
    style={{ height: '250px', objectFit: 'cover' }}
  />
  <Card.Body>
    <Card.Title>{movie.title}</Card.Title>
    <Card.Text>
      {movie.description.length > 100
        ? movie.description.substring(0, 100) + '...'
        : movie.description}
    </Card.Text>
    {movie.genre && (
      <Card.Text><strong>Genre:</strong> {movie.genre.name}</Card.Text>
    )}
    {movie.director && (
      <Card.Text><strong>Director:</strong> {movie.director.name}</Card.Text>
    )}
    <Button variant="primary" onClick={() => onMovieClick(movie)}>
      View
    </Button>
  </Card.Body>
</Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired,
    image: PropTypes.string,
    description: PropTypes.string
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired
};
