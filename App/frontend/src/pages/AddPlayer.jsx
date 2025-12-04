import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PlayerForm from '../components/PlayerForm';

const AddPlayer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const API_URL = 'http://localhost:5000/api/players';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('gender', formData.gender || '');
      formDataToSend.append('bio', formData.bio || '');
      if (formData.tags) formDataToSend.append('tags', formData.tags);
      formDataToSend.append('matches', formData.matches);
      formDataToSend.append('runs', formData.runs);
      formDataToSend.append('wickets', formData.wickets);
      formDataToSend.append('average', formData.average);
      
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const res = await axios.post(API_URL, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders(),
        },
      });

      const newPlayer = res.data;

      // Offer choice to view card or go home
      const goToCard = window.confirm('Player added successfully! View player card? Click OK to view, Cancel to go to Players list.');
      if (goToCard && newPlayer?._id) {
        navigate(`/player/${newPlayer._id}`);
      } else {
        navigate('/players');
      }
    } catch (error) {
      console.error('Error adding player:', error);
      if (error.response?.status === 401) {
        alert('Unauthorized. Please login.');
        navigate('/login');
      } else {
        alert('Failed to add player. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container">
      {loading && (
        <div className="text-center mb-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Adding player...</span>
          </div>
        </div>
      )}
      <PlayerForm
        title="Add New Player"
        submitText="Add Player"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/players')}
      />
    </div>
  );
};

export default AddPlayer;

