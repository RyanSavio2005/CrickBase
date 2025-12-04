import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import PlayerCard from '../components/PlayerCard';
import SearchBar from '../components/SearchBar';
import StatsChart from '../components/StatsChart';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChart, setShowChart] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const API_URL = 'http://localhost:5000/api/players';
  const abortControllerRef = useRef(null);

  // Fetch players when search or filters change
  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    fetchPlayers(searchTerm, filters, abortControllerRef.current.signal);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  
  }, [searchTerm, filters]);

  const fetchPlayers = async (search = '', filterObj = {}, signal = null) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (filterObj.country) params.append('country', filterObj.country);
      if (filterObj.role) params.append('role', filterObj.role);
      if (filterObj.gender) params.append('gender', filterObj.gender);
      if (filterObj.runsMin) params.append('runsMin', filterObj.runsMin);
      if (filterObj.runsMax) params.append('runsMax', filterObj.runsMax);
      if (filterObj.wicketsMin) params.append('wicketsMin', filterObj.wicketsMin);
      if (filterObj.wicketsMax) params.append('wicketsMax', filterObj.wicketsMax);
      if (filterObj.matchesMin) params.append('matchesMin', filterObj.matchesMin);
      if (filterObj.matchesMax) params.append('matchesMax', filterObj.matchesMax);
      if (filterObj.averageMin) params.append('averageMin', filterObj.averageMin);
      if (filterObj.averageMax) params.append('averageMax', filterObj.averageMax);
      if (filterObj.sortBy) params.append('sortBy', filterObj.sortBy);
      if (filterObj.sortOrder) params.append('sortOrder', filterObj.sortOrder);

      const config = signal ? { signal } : {};
      const response = await axios.get(`${API_URL}?${params.toString()}`, config);
      
      // Only update if request wasn't aborted
      if (!signal || !signal.aborted) {
        setPlayers(response.data);
        setError(null);
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        // Request was cancelled, ignore
        return;
      }
      console.error('Error fetching players:', err);
      setError('Failed to load players. Make sure the backend server is running.');
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false);
      }
    }
  };

  const handleSearch = useCallback((searchValue) => {
    setSearchTerm(searchValue || '');
  }, []);

  const handleFilterChange = useCallback((filterObj) => {
    setFilters(filterObj || {});
  }, []);

  const handleQuickFilter = useCallback((preset) => {
    // Quick filters are handled by SearchBar component
    // This is just a placeholder for compatibility
  }, []);

  const handleDelete = useCallback((playerId) => {
    setPlayers(prevPlayers => prevPlayers.filter(player => player._id !== playerId));
  }, []);

  
  
  return (
    <div className="players-page">
      <section className="players-section">
        <div className="container">
          <div className="players-header">
            <div>
              <h2 className="players-title">Player Hub</h2>
              <p className="players-subtitle">Refine your squad with filters, charts, and detailed profiles.</p>
            </div>
            <div className="players-meta">
              <span className="players-count">
                Total Players: {players.length}
              </span>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setShowChart(!showChart)}
              >
                {showChart ? 'Hide' : 'Show'} Charts
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <SearchBar onSearch={handleSearch} onFilterChange={handleFilterChange} onQuickFilter={handleQuickFilter} />

          {showChart && players.length > 0 && (
            <div className="players-chart">
              <StatsChart players={players} />
            </div>
          )}

          {loading ? (
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : players.length === 0 ? (
            <div className="empty-state">
              <h3>No players found</h3>
              <p>Start by adding your first cricket player!</p>
            </div>
          ) : (
            <div className="row">
              {players.map((player) => (
                <PlayerCard
                  key={player._id}
                  player={player}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Players;

