import React from 'react';
import PropTypes from 'prop-types';

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <h2>{movie.title}</h2>
      <img src={movie.image} alt={movie.title} style={{ width: '300px' }} />
      <p>{movie.description}</p>
      <p><strong>Genre:</strong> {movie.genre}</p>
      <p><strong>Director:</strong> {movie.director}</p>
      <button onClick={onBackClick}>Back</button>
    </div>
  );
};

MovieView.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    genre: PropTypes.string,
    director: PropTypes.string
  }).isRequired,
  onBackClick: PropTypes.func.isRequired
};
