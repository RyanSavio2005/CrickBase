import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PlayerCard = ({ player, onDelete }) => {
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const API_URL = 'http://localhost:5000/api/players';

  const handleDelete = async () => {
    if (!isAuthenticated) {
      alert('You need to login to delete players.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${player.name}?`)) {
      try {
        await axios.delete(`${API_URL}/${player._id}`, {
          headers: getAuthHeaders(),
        });
        onDelete(player._id);
      } catch (error) {
        console.error('Error deleting player:', error);
        if (error.response?.status === 401) {
          alert('Unauthorized. Please login.');
        } else {
          alert('Failed to delete player');
        }
      }
    }
  };

  const imageUrl = player.image 
    ? `http://localhost:5000${player.image}` 
    : 'https://via.placeholder.com/300x250?text=No+Image';

  return (
    <div className="col-md-4 mb-4">
      <div className="card player-card h-100">
        <img
          src={imageUrl}
          className="card-img-top player-image"
          alt={player.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x250?text=No+Image';
          }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{player.name}</h5>
          <p className="card-text">
            <strong>Country:</strong> {player.country}
            {player.role && (
              <>
                <br />
                <strong>Role:</strong> {player.role}
              </>
            )}
            {player.gender && (
              <>
                <br />
                <strong>Gender:</strong> {player.gender}
              </>
            )}
          </p>
          {player.tags && player.tags.length > 0 && (
            <div className="mb-2">
              {player.tags.map((tag, idx) => (
                <span key={idx} className="badge bg-secondary me-1">{tag}</span>
              ))}
            </div>
          )}
          {player.bio && (
            <p className="player-bio" title={player.bio}>
              {player.bio.length > 160 ? `${player.bio.slice(0, 160)}...` : player.bio}
            </p>
          )}
          <div className="mb-3">
            <span className="stats-badge">Matches: {player.stats.matches}</span>
            <span className="stats-badge">Runs: {player.stats.runs}</span>
            <span className="stats-badge">Wickets: {player.stats.wickets}</span>
            {player.stats.average > 0 && (
              <span className="stats-badge">Avg: {player.stats.average.toFixed(2)}</span>
            )}
          </div>
          <div className="mt-auto d-flex flex-column gap-2">
            <div className="d-flex gap-2">
              {isAuthenticated && (
                <Link
                  to={`/edit/${player._id}`}
                  className="btn btn-primary btn-sm flex-fill"
                >
                  Edit
                </Link>
              )}

              <Link
                to={`/player/${player._id}`}
                className="btn btn-outline-primary btn-sm flex-fill"
              >
                View
              </Link>

              {isAuthenticated && (
                <button
                  onClick={handleDelete}
                  className="btn btn-danger btn-sm flex-fill"
                >
                  Delete
                </button>
              )}
            </div>
            {!isAuthenticated && (
              <div className="text-muted small w-100 text-center">
                <Link to="/login" className="text-decoration-none">Login</Link> to edit/delete
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;

