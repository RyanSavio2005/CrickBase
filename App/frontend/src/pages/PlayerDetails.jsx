import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PlayerDetails = () => {
  const { id } = useParams();
  const API_URL = 'http://localhost:5000/api/players';
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`);
        setPlayer(res.data);
      } catch (e) {
        setError('Failed to load player');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error || 'Player not found'}</div>
      </div>
    );
  }

  const imageUrl = player.image ? `http://localhost:5000${player.image}` : 'https://via.placeholder.com/800x400?text=No+Image';

  return (
    <div className="container">
      <div className="mb-3">
        <Link to="/" className="btn btn-outline-secondary btn-sm">← Back</Link>
      </div>
      <div className="card">
        <img src={imageUrl} className="card-img-top" alt={player.name} />
        <div className="card-body">
          <h3 className="card-title">{player.name}</h3>
          <p className="card-text mb-1"><strong>Country:</strong> {player.country}</p>
          <p className="card-text mb-1"><strong>Role:</strong> {player.role}</p>
          {player.gender && <p className="card-text mb-1"><strong>Gender:</strong> {player.gender}</p>}
          {player.tags && player.tags.length > 0 && (
            <p className="card-text">
              <strong>Tags:</strong> {player.tags.join(', ')}
            </p>
          )}
          {player.bio && (
            <div className="mt-3">
              <h5>Biography</h5>
              <p className="mb-0">{player.bio}</p>
            </div>
          )}
          <div className="mt-3">
            <h5>Statistics</h5>
            <div className="d-flex flex-wrap gap-2">
              <span className="stats-badge">Matches: {player.stats.matches}</span>
              <span className="stats-badge">Runs: {player.stats.runs}</span>
              <span className="stats-badge">Wickets: {player.stats.wickets}</span>
              <span className="stats-badge">Average: {player.stats.average}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerDetails;


