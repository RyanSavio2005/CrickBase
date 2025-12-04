import React, { Component } from 'react';
import { withRouter } from '../utils/withRouter';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PlayerForm from '../components/PlayerForm';

class EditPlayer extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      player: null,
      loading: true,
      error: null,
      submitting: false
    };
    this.API_URL = 'http://localhost:5000/api/players';
  }

  componentDidMount() {
    if (!this.context.isAuthenticated) {
      this.props.navigate('/login');
      return;
    }
    this.fetchPlayer();
  }

  fetchPlayer = async () => {
    try {
      const { id } = this.props.params;
      const response = await axios.get(`${this.API_URL}/${id}`);
      this.setState({ player: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching player:', error);
      this.setState({
        error: 'Failed to load player. Player may not exist.',
        loading: false
      });
    }
  };

  handleSubmit = async (formData) => {
    try {
      this.setState({ submitting: true });
      const { id } = this.props.params;
      
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

      await axios.put(`${this.API_URL}/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...this.context.getAuthHeaders(),
        },
      });

      this.props.navigate('/');
    } catch (error) {
      console.error('Error updating player:', error);
      if (error.response?.status === 401) {
        alert('Unauthorized. Please login.');
        this.props.navigate('/login');
      } else {
        alert('Failed to update player. Please try again.');
      }
    } finally {
      this.setState({ submitting: false });
    }
  };

  render() {
    const { player, loading, error, submitting } = this.state;
    const { isAuthenticated } = this.context;

    if (!isAuthenticated) {
      return null;
    }

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

    if (error) {
      return (
        <div className="container">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      );
    }

    if (!player) {
      return (
        <div className="container">
          <div className="alert alert-warning" role="alert">
            Player not found
          </div>
        </div>
      );
    }

    return (
      <div className="container">
        {submitting && (
          <div className="text-center mb-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Updating player...</span>
            </div>
          </div>
        )}
        <PlayerForm
          player={player}
          title="Edit Player"
          submitText="Update Player"
          onSubmit={this.handleSubmit}
          onCancel={() => this.props.navigate('/')}
        />
      </div>
    );
  }
}

export default withRouter(EditPlayer);

