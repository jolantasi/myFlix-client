// src/main-view/main-view.jsx
import React, { useState, useEffect } from 'react';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { LoginView } from '../login-view/login-view';
import { SignupView } from '../signup-view/signup-view';

export const MainView = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const storedToken = localStorage.getItem('token');

  const [user, setUser] = useState(storedUser ? storedUser : null);
  const [token, setToken] = useState(storedToken ? storedToken : null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [showSignup, setShowSignup] = useState(false);

  // Fetch movies when logged in
useEffect(() => {
  if (!token) return; // Do nothing if no token yet

  fetch('https://myflix-movieapi.onrender.com/movies', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch movies');
      return res.json();
    })
    .then((data) => setMovies(data))
    .catch((err) => console.error('Error fetching movies:', err));
}, [token]);


  // If not logged in → show login or signup
  if (!user) {
    return (
      <div>
        {showSignup ? (
          <>
            <SignupView
              onSignedUp={() => {
                setShowSignup(false); // Go back to login after signup
              }}
            />
            <p>
              Already have an account?{' '}
              <button onClick={() => setShowSignup(false)}>Log in</button>
            </p>
          </>
        ) : (
          <>
            <LoginView
              onLoggedIn={(user, token) => {
                setUser(user);
                setToken(token);
              }}
            />
            <p>
              Don’t have an account?{' '}
              <button onClick={() => setShowSignup(true)}>Sign up</button>
            </p>
          </>
        )}
      </div>
    );
  }

  // If a movie is selected → show movie details
  if (selectedMovie) {
    return (
      <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
    );
  }

  // Logged-in view → show movies & logout
  return (
    <div>
      <h1>Welcome, {user.Username}</h1>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
          setMovies([]);
        }}
      >
        Logout
      </button>

      <h2>Movie List</h2>
      {movies.length === 0 ? (
        <p>Loading movies...</p>
      ) : (
        movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} onMovieClick={setSelectedMovie} />
        ))
      )}
    </div>
  );
};
