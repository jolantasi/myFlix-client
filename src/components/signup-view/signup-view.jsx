// src/signup-view/signup-view.jsx
import React, { useState } from "react";
import { Form, Button } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

export const SignupView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Basic frontend validation
    if (username.length < 5 || !/^[a-zA-Z0-9]+$/.test(username)) {
      setError("Username must be at least 5 alphanumeric characters.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }
    if (!email.includes("@")) {
      setError("Email must be valid.");
      return;
    }

    const data = {
      username,
      password,
      email,
      Birthday: birthday, // API expects capital B
    };

    fetch("https://myflix-movieapi.onrender.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          // Try to read detailed backend errors
          const errData = await response.json().catch(() => null);
          const message =
            errData?.errors?.map((e) => e.msg).join(", ") ||
            errData?.message ||
            "Signup failed";
          throw new Error(message);
        }
        return response.json();
      })
      .then(() => {
        setSuccess("Signup successful! You can now log in.");
        setUsername("");
        setPassword("");
        setEmail("");
        setBirthday("");
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className="signup-view">
      <h2>Sign Up</h2>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      {success && (
        <div style={{ color: "green", marginBottom: "1rem" }}>{success}</div>
      )}
      <Form onSubmit={handleSubmit}>
  <Form.Group className="mb-3" controlId="username">
    <Form.Label>Username*</Form.Label>
    <Form.Control
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="password">
    <Form.Label>Password*</Form.Label>
    <Form.Control
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="email">
    <Form.Label>Email*</Form.Label>
    <Form.Control
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  </Form.Group>

  <Form.Group className="mb-3" controlId="birthday">
    <Form.Label>Birthday</Form.Label>
    <Form.Control
      type="date"
      value={birthday}
      onChange={(e) => setBirthday(e.target.value)}
    />
  </Form.Group>

  <Button type="submit" variant="primary">
    Submit
  </Button>
</Form>
    </div>
  );
};
