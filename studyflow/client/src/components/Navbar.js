import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            StudyFlow
          </Link>

          <div className="nav-links">
            {user ? (
              <>
                <Link to="/dashboard" className="nav-link" style={{ fontWeight: '600', color: 'var(--primary)' }}>
                  Dashboard
                </Link>
                <span className="nav-link" style={{ fontStyle: 'italic', color: 'var(--text-light)' }}>
                  👋 Hello, {user.name}
                </span>
                <button
                  onClick={logout}
                  className="btn btn-outline"
                  style={{ padding: '0.45rem 1rem', fontWeight: '500' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
