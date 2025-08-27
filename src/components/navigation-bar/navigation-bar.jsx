// src/components/navigation-bar/NavigationBar.jsx
import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";

export const NavigationBar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          MyFlix
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user && (
              <>
                <Nav.Link as={NavLink} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={NavLink} to="/signup">
                  Signup
                </Nav.Link>
              </>
            )}
            {user && (
              <>
                <Nav.Link
                  as={NavLink}
                  to="/movies"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={NavLink}
                  to="/profile"
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
