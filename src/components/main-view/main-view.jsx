// src/main-view/main-view.jsx
import React, { useState } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export const MainView = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const movies = [
    {
      _id: '1',
      title: 'Inception',
      description: 'A thief who steals corporate secrets through dream-sharing technology...',
      image: 'https://image.tmdb.org/t/p/w185https://media.themoviedb.org/t/p/w440_and_h660_face/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
      genre: 'Sci-Fi',
      director: 'Christopher Nolan'
    },
    {
      _id: '2',
      title: 'The Matrix',
      description: 'A computer hacker learns about the true nature of reality and his role in the war...',
      image: 'https://media.themoviedb.org/t/p/w440_and_h660_face/sRaupdJawe6UTS0t77vwJoLjd7h.jpg',
      genre: 'Action',
      director: 'The Wachowskis'
    },
    {
      _id: '3',
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space...',
      image: 'https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
      genre: 'Adventure',
      director: 'Christopher Nolan'
    }
  ];

  if (selectedMovie) {
    return (
      <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  return (
    <div>
      <h1>Movie List</h1>
      {movies.map((movie) => (
        <MovieCard key={movie._id} movie={movie} onMovieClick={setSelectedMovie} />
      ))}
    </div>
  );
};
