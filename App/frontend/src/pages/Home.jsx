import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const goToPlayers = () => {
    navigate('/players');
  };

  const goToTeamPredictor = () => {
    navigate('/predict');
  };

  return (
    <div className="home-page">
      <section className="hero-section hero-full">
        <div className="container hero-container">
          <div className="hero-text">
            <span className="hero-kicker">Welcome to CrickBase</span>
            <h1 className="hero-heading">Your Gateway to Smarter Cricket Decisions!</h1>
            <p className="hero-description">
            Built with passion for cricket and powered by technology — get reliable data, smooth browsing, and rich player profiles.
            </p>
            <div className="hero-actions">
              <button className="hero-btn primary" onClick={goToPlayers}>
                Explore Players
              </button>
              <button className="hero-btn secondary" onClick={goToTeamPredictor}>
                Build Your XI
              </button>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <img
              className="hero-image"
              src="https://i.pinimg.com/736x/64/9c/90/649c9085b81c47a9118fbf47a816df62.jpg"
              alt="Cricket Lounge"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

