import React, { useState, useEffect, useCallback, useRef } from 'react';

const SearchBar = ({ onSearch, onFilterChange, onQuickFilter }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    country: '',
    role: '',
    gender: '',
    runsMin: '',
    runsMax: '',
    wicketsMin: '',
    wicketsMax: '',
    matchesMin: '',
    matchesMax: '',
    averageMin: '',
    averageMax: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const debounceTimerRef = useRef(null);

  // Debounced filter update function
  const debouncedUpdate = useCallback((newFilters) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      const filterObj = {
        country: newFilters.country || undefined,
        role: newFilters.role || undefined,
        gender: newFilters.gender || undefined,
        runsMin: newFilters.runsMin || undefined,
        runsMax: newFilters.runsMax || undefined,
        wicketsMin: newFilters.wicketsMin || undefined,
        wicketsMax: newFilters.wicketsMax || undefined,
        matchesMin: newFilters.matchesMin || undefined,
        matchesMax: newFilters.matchesMax || undefined,
        averageMin: newFilters.averageMin || undefined,
        averageMax: newFilters.averageMax || undefined,
        sortBy: newFilters.sortBy || undefined,
        sortOrder: newFilters.sortOrder || undefined
      };
      
      // Remove undefined values
      Object.keys(filterObj).forEach(key => {
        if (filterObj[key] === undefined || filterObj[key] === '') {
          delete filterObj[key];
        }
      });
      
      onFilterChange(filterObj);
      if (newFilters.searchTerm !== undefined) {
        onSearch(newFilters.searchTerm || '');
      }
    }, 300); // 300ms debounce delay
  }, [onSearch, onFilterChange]);

  // Update filters and trigger debounced search
  const updateFilters = useCallback((updates) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, ...updates };
      debouncedUpdate(newFilters);
      return newFilters;
    });
  }, [debouncedUpdate]);

  // Handle search change
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    updateFilters({ searchTerm: value });
  }, [updateFilters]);

  // Handle filter changes
  const handleCountryFilter = useCallback((e) => {
    updateFilters({ country: e.target.value });
  }, [updateFilters]);

  const handleRoleFilter = useCallback((e) => {
    updateFilters({ role: e.target.value });
  }, [updateFilters]);

  const handleGenderFilter = useCallback((e) => {
    updateFilters({ gender: e.target.value });
  }, [updateFilters]);

  const handleNumericFilter = useCallback((field, value) => {
    updateFilters({ [field]: value });
  }, [updateFilters]);

  const handleSortChange = useCallback((field, value) => {
    updateFilters({ [field]: value });
  }, [updateFilters]);

  const clearFilters = useCallback(() => {
    const defaultFilters = {
      searchTerm: '',
      country: '',
      role: '',
      gender: '',
      runsMin: '',
      runsMax: '',
      wicketsMin: '',
      wicketsMax: '',
      matchesMin: '',
      matchesMax: '',
      averageMin: '',
      averageMax: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    
    setFilters(defaultFilters);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    onSearch('');
    onFilterChange({});
  }, [onSearch, onFilterChange]);

  const handleQuickFilterClick = useCallback((preset) => {
    if (preset === 'topBatsmen') {
      setFilters(prevFilters => {
        const newFilters = { ...prevFilters, role: 'Batsman', sortBy: 'stats.runs', sortOrder: 'desc' };
        onFilterChange({ role: 'Batsman', sortBy: 'stats.runs', sortOrder: 'desc' });
        onQuickFilter && onQuickFilter('topBatsmen');
        return newFilters;
      });
    } else if (preset === 'allRounders') {
      setFilters(prevFilters => {
        const newFilters = { ...prevFilters, role: 'All-rounder', sortBy: 'stats.runs', sortOrder: 'desc' };
        onFilterChange({ role: 'All-rounder', sortBy: 'stats.runs', sortOrder: 'desc' });
        onQuickFilter && onQuickFilter('allRounders');
        return newFilters;
      });
    }
  }, [onFilterChange, onQuickFilter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title mb-3">Search & Filter Players</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="search" className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              id="search"
              placeholder="Search by name, country, or role..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="countryFilter" className="form-label">Filter by Country</label>
            <input
              type="text"
              className="form-control"
              id="countryFilter"
              placeholder="Country..."
              value={filters.country}
              onChange={handleCountryFilter}
            />
          </div>
          <div className="col-md-3">
            <label htmlFor="roleFilter" className="form-label">Filter by Role</label>
            <select
              className="form-select"
              id="roleFilter"
              value={filters.role}
              onChange={handleRoleFilter}
            >
              <option value="">All Roles</option>
              <option value="Batsman">Batsman</option>
              <option value="Bowler">Bowler</option>
              <option value="All-rounder">All-rounder</option>
              <option value="Wicket-keeper">Wicket-keeper</option>
              <option value="Wicket-keeper Batsman">Wicket-keeper Batsman</option>
            </select>
          </div>
          <div className="col-md-2">
            <label htmlFor="genderFilter" className="form-label">Gender</label>
            <select
              className="form-select"
              id="genderFilter"
              value={filters.gender}
              onChange={handleGenderFilter}
            >
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-md-3">
            <label className="form-label">Runs (min - max)</label>
            <div className="d-flex gap-2">
              <input 
                className="form-control" 
                type="number" 
                placeholder="Min" 
                value={filters.runsMin} 
                onChange={e => handleNumericFilter('runsMin', e.target.value)} 
              />
              <input 
                className="form-control" 
                type="number" 
                placeholder="Max" 
                value={filters.runsMax} 
                onChange={e => handleNumericFilter('runsMax', e.target.value)} 
              />
            </div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Wickets (min - max)</label>
            <div className="d-flex gap-2">
              <input 
                className="form-control" 
                type="number" 
                placeholder="Min" 
                value={filters.wicketsMin} 
                onChange={e => handleNumericFilter('wicketsMin', e.target.value)} 
              />
              <input 
                className="form-control" 
                type="number" 
                placeholder="Max" 
                value={filters.wicketsMax} 
                onChange={e => handleNumericFilter('wicketsMax', e.target.value)} 
              />
            </div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Matches (min - max)</label>
            <div className="d-flex gap-2">
              <input 
                className="form-control" 
                type="number" 
                placeholder="Min" 
                value={filters.matchesMin} 
                onChange={e => handleNumericFilter('matchesMin', e.target.value)} 
              />
              <input 
                className="form-control" 
                type="number" 
                placeholder="Max" 
                value={filters.matchesMax} 
                onChange={e => handleNumericFilter('matchesMax', e.target.value)} 
              />
            </div>
          </div>
          <div className="col-md-3">
            <label className="form-label">Average (min - max)</label>
            <div className="d-flex gap-2">
              <input 
                className="form-control" 
                type="number" 
                step="0.01" 
                placeholder="Min" 
                value={filters.averageMin} 
                onChange={e => handleNumericFilter('averageMin', e.target.value)} 
              />
              <input 
                className="form-control" 
                type="number" 
                step="0.01" 
                placeholder="Max" 
                value={filters.averageMax} 
                onChange={e => handleNumericFilter('averageMax', e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="row g-3 mt-1">
          <div className="col-md-4">
            <label className="form-label">Sort By</label>
            <div className="d-flex gap-2">
              <select 
                className="form-select" 
                value={filters.sortBy} 
                onChange={e => handleSortChange('sortBy', e.target.value)}
              >
                <option value="createdAt">Created</option>
                <option value="name">Name</option>
                <option value="stats.runs">Runs</option>
                <option value="stats.wickets">Wickets</option>
                <option value="stats.matches">Matches</option>
                <option value="stats.average">Average</option>
              </select>
              <select 
                className="form-select" 
                value={filters.sortOrder} 
                onChange={e => handleSortChange('sortOrder', e.target.value)}
              >
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
              </select>
            </div>
          </div>
          <div className="col-md-6 d-flex align-items-end gap-2">
            <button 
              className={`btn ${filters.role === 'Batsman' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleQuickFilterClick('topBatsmen')}
            >
              Top Batsmen
            </button>
            <button 
              className={`btn ${filters.role === 'All-rounder' ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => handleQuickFilterClick('allRounders')}
            >
              All-rounders
            </button>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

