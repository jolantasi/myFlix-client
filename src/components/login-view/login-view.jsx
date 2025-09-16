import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(""); // Clear previous errors

    fetch("https://myflix-movieapi.onrender.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          // Try to read error message from API
          const errData = await response.json().catch(() => null);
          const message = errData?.message || "Login failed";
          throw new Error(message);
        }
        return response.json();
      })
      .then((data) => {
        if (!data.token || !data.user) {
          throw new Error("Invalid response from server");
        }
        // Save token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        onLoggedIn(data.user, data.token);
      })
      .catch((err) => {
        console.error(err);
        setError("Invalid username or password");
      });
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
  <Form.Group className="mb-3" controlId="username">
    <Form.Label>Username</Form.Label>
    <Form.Control
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="password">
    <Form.Label>Password</Form.Label>
    <Form.Control
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </Form.Group>

  <Button type="submit" variant="primary">
    Log In
  </Button>
</Form>
    </div>
  );
};