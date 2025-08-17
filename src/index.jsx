// src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Container } from "react-bootstrap";
import { App } from './app';
import "./index.scss";

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <Container fluid>
      <App />
    </Container>
  </React.StrictMode>
);