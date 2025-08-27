import React from 'react';
import PropTypes from 'prop-types';
import { Button } from "react-bootstrap";

export const MovieView = ({ movie, onBackClick }) => {
  return (
    <div>
      <h2>{movie.title}</h2>
      <img 
        src={movie.imageUrl} 
        alt={movie.title} 
        style={{ width: '300px' }} 
      />
      <p>{movie.description}</p>

      {movie.genre && (
        <p><strong>Genre:</strong> {movie.genre.name}</p>
      )}

      {movie.director && (
        <p><strong>Director:</strong> {movie.director.name}</p>
      )}

      <Button variant="secondary" onClick={onBackClick}>
        Back
      </Button>
    </div>
  );
};

MovieView.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    imageUrl: PropTypes.string,   // ✅ updated
    genre: PropTypes.shape({      // ✅ now an object
      name: PropTypes.string,
      description: PropTypes.string
    }),
    director: PropTypes.shape({   // ✅ now an object
      name: PropTypes.string,
      bio: PropTypes.string
    })
  }).isRequired,
  onBackClick: PropTypes.func.isRequired
};
