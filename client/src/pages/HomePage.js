import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <section className="homepage-clean">
      <div className="container">
        {/* Hero Section */}
        <header className="hero text-center">
          <h1 className="hero-title">Welcome to StudyFlow</h1>
          <p className="hero-subtitle">Your smart, distraction-free study space</p>
          <p className="hero-description">
            Stay on track with Pomodoro sessions, task management, and productivity insights
          </p>

          {user ? (
            <Link to="/dashboard" className="btn btn-primary btn-large">
              Go to Dashboard
            </Link>
          ) : (
            <div className="btn-group">
              <Link to="/register" className="btn btn-green btn-large">
                Start Planning
              </Link>
              <Link to="/login" className="btn btn-outline btn-large">
                Sign In
              </Link>
            </div>
          )}
        </header>

        {/* Feature Cards */}
        <div className="grid grid-3 mt-4">
          <div className="card text-center feature-card">
            <div className="feature-icon">⏰</div>
            <h3 className="feature-title sessions">Focused Sessions</h3>
            <p className="feature-desc">
              Use Pomodoro technique for deep, effective study blocks.
            </p>
          </div>

          <div className="card text-center feature-card">
            <div className="feature-icon">📝</div>
            <h3 className="feature-title pending">Organize Tasks</h3>
            <p className="feature-desc">
              Create, manage, and mark study goals with ease.
            </p>
          </div>

          <div className="card text-center feature-card">
            <div className="feature-icon">📊</div>
            <h3 className="feature-title this-week">Track Progress</h3>
            <p className="feature-desc">
              Visualize your focus time and completed goals.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;