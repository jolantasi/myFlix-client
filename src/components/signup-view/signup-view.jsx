// src/signup-view/signup-view.jsx
import React, { useState } from "react";

export const SignupView = ({ onSignedUp }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Basic validation
    if (!username || !password || !email) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError(""); // Clear old errors

    fetch("https://myflix-movieapi.onrender.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Username: username,
        Password: password,
        Email: email,
        Birthday: birthday
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Signup failed. Try a different username.");
        }
        return response.json();
      })
      .then((data) => {
        setSuccess("Signup successful! You can now log in.");
        setUsername("");
        setPassword("");
        setEmail("");
        setBirthday("");
        if (onSignedUp) onSignedUp(data);
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="signup-view">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username*:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password*:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email*:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Birthday:</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};
