import React, { Component } from 'react';

class PlayerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.player?.name || '',
      country: props.player?.country || '',
      role: props.player?.role || 'All-rounder',
      gender: props.player?.gender || '',
      bio: props.player?.bio || '',
      tags: Array.isArray(props.player?.tags) ? props.player.tags.join(', ') : (props.player?.tags || ''),
      matches: props.player?.stats?.matches || 0,
      runs: props.player?.stats?.runs || 0,
      wickets: props.player?.stats?.wickets || 0,
      average: props.player?.stats?.average || 0,
      image: null,
      imagePreview: props.player?.image 
        ? `http://localhost:5000${props.player.image}` 
        : null,
      errors: {}
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      errors: { ...this.state.errors, [name]: '' }
    });
  };

  handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        this.setState({
          errors: { ...this.state.errors, image: 'Please select an image file' }
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.setState({
          errors: { ...this.state.errors, image: 'Image size should be less than 5MB' }
        });
        return;
      }

      this.setState({
        image: file,
        imagePreview: URL.createObjectURL(file),
        errors: { ...this.state.errors, image: '' }
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const errors = {};
    if (!this.state.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!this.state.country.trim()) {
      errors.country = 'Country is required';
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    // Call parent's onSubmit handler
    this.props.onSubmit({
      name: this.state.name,
      country: this.state.country,
      role: this.state.role,
      gender: this.state.gender,
      bio: this.state.bio,
      tags: this.state.tags,
      matches: parseInt(this.state.matches) || 0,
      runs: parseInt(this.state.runs) || 0,
      wickets: parseInt(this.state.wickets) || 0,
      average: parseFloat(this.state.average) || 0,
      image: this.state.image
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="form-container">
        <h2 className="mb-4">{this.props.title || 'Player Form'}</h2>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Player Name <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${this.state.errors.name ? 'is-invalid' : ''}`}
            id="name"
            name="name"
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="Enter player name"
            required
          />
          {this.state.errors.name && (
            <div className="invalid-feedback">{this.state.errors.name}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Country <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${this.state.errors.country ? 'is-invalid' : ''}`}
            id="country"
            name="country"
            value={this.state.country}
            onChange={this.handleChange}
            placeholder="Enter country"
            required
          />
          {this.state.errors.country && (
            <div className="invalid-feedback">{this.state.errors.country}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="role" className="form-label">Role</label>
          <select
            className="form-control"
            id="role"
            name="role"
            value={this.state.role}
            onChange={this.handleChange}
          >
            <option value="Batsman">Batsman</option>
            <option value="Bowler">Bowler</option>
            <option value="All-rounder">All-rounder</option>
            <option value="Wicket-keeper">Wicket-keeper</option>
            <option value="Wicket-keeper Batsman">Wicket-keeper Batsman</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="gender" className="form-label">Gender</label>
          <select
            className="form-control"
            id="gender"
            name="gender"
            value={this.state.gender}
            onChange={this.handleChange}
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="bio" className="form-label">Biography</label>
          <textarea
            className="form-control"
            id="bio"
            name="bio"
            rows="4"
            placeholder="Write a short player biography..."
            value={this.state.bio}
            onChange={this.handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tags" className="form-label">Tags (comma separated)</label>
          <input
            type="text"
            className="form-control"
            id="tags"
            name="tags"
            placeholder="e.g., Legend, Rising Star"
            value={this.state.tags}
            onChange={this.handleChange}
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="matches" className="form-label">Matches</label>
            <input
              type="number"
              className="form-control"
              id="matches"
              name="matches"
              value={this.state.matches}
              onChange={this.handleChange}
              min="0"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="runs" className="form-label">Runs</label>
            <input
              type="number"
              className="form-control"
              id="runs"
              name="runs"
              value={this.state.runs}
              onChange={this.handleChange}
              min="0"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="wickets" className="form-label">Wickets</label>
            <input
              type="number"
              className="form-control"
              id="wickets"
              name="wickets"
              value={this.state.wickets}
              onChange={this.handleChange}
              min="0"
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="average" className="form-label">Average</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              id="average"
              name="average"
              value={this.state.average}
              onChange={this.handleChange}
              min="0"
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">Player Image</label>
          <input
            type="file"
            className={`form-control ${this.state.errors.image ? 'is-invalid' : ''}`}
            id="image"
            name="image"
            accept="image/*"
            onChange={this.handleImageChange}
          />
          {this.state.errors.image && (
            <div className="invalid-feedback">{this.state.errors.image}</div>
          )}
          {this.state.imagePreview && (
            <img
              src={this.state.imagePreview}
              alt="Preview"
              className="image-preview d-block"
            />
          )}
        </div>

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-primary">
            {this.props.submitText || 'Submit'}
          </button>
          {this.props.onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={this.props.onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  }
}

export default PlayerForm;

