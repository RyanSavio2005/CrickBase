import React from 'react';

const DarkModeToggle = ({ darkMode, onToggle }) => {
  return (
    <button
      className="btn btn-outline-light"
      onClick={onToggle}
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default DarkModeToggle;

