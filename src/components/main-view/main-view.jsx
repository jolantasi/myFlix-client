import React, { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export const MainView = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('https://myflix-movieapi.onrender.com/movies')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        return response.json();
      })
      .then((data) => {
        // Map API data to match component props (lowercase keys)
        const moviesFromApi = data.map(movie => ({
          _id: movie._id,
          title: movie.Title,
          description: movie.Description,
          image: movie.ImagePath,
          genre: movie.Genre?.Name,
          director: movie.Director?.Name,
        }));

        setMovies(moviesFromApi);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
      });
  }, []);

  return (
    <div>
      <h1>MyFlix Movies</h1>

      {!selectedMovie ? (
        movies.length === 0 ? (
          <p>Loading movies...</p>
        ) : (
          movies.map(movie => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onMovieClick={setSelectedMovie}
            />
          ))
        )
      ) : (
        <MovieView
          movie={selectedMovie}
          onBackClick={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
};
