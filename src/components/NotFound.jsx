import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Terminal } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon-wrapper">
          <Terminal className="not-found-icon" />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-description">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="not-found-button">
          <Home className="not-found-button-icon" />
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
