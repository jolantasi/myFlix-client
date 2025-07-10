import React from 'react';
import PropTypes from 'prop-types';

export const MovieCard = ({ movie, onMovieClick }) => {
  return (
    <div
      onClick={() => onMovieClick(movie)}
      style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', cursor: 'pointer' }}
    >
      <h3>{movie.title}</h3>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    _id: PropTypes.string.isRequired
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired
};

