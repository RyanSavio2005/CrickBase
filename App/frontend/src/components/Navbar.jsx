import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          🏏 CrickBase
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                to="/"
              >
                Home
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link
                  className={`nav-link ${location.pathname === '/add' ? 'active' : ''}`}
                  to="/add"
                >
                  Add Player
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/predict' ? 'active' : ''}`}
                to="/predict"
              >
                Team Predictor
              </Link>
            </li>
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
                    to="/register"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && (
              <li className="nav-item d-flex align-items-center gap-2">
                <Link to="/profile" className="d-inline-flex align-items-center text-decoration-none">
                  <img
                    src={user?.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=0D8ABC&color=fff&size=32`}
                    alt="Profile"
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&size=32`; }}
                  />
                </Link>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

