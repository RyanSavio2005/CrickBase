import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, getAuthHeaders, login } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const API_URL = 'http://localhost:5000/api/auth/avatar';

  const handleFile = (e) => {
    setError(''); setSuccess('');
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.match(/image\/(jpeg|png)/)) {
      setError('Only JPG/PNG images are allowed');
      return;
    }
    if (f.size > 3 * 1024 * 1024) {
      setError('Max file size is 3MB');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const upload = async () => {
    try {
      setLoading(true);
      setError(''); setSuccess('');
      const form = new FormData();
      form.append('avatar', file);
      const res = await axios.post(API_URL, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders(),
        }
      });
      if (res.data?.user) {
        login(res.data.user); // refresh auth user with new avatar
        setSuccess('Profile photo updated');
      }
    } catch (e) {
      setError(e.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const avatarUrl = user?.avatar
    ? `http://localhost:5000${user.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=0D8ABC&color=fff&size=128`;

  return (
    <div className="container">
      <h1 className="h3 mb-3">My Profile</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3">
            <img
              src={preview || avatarUrl}
              alt="Avatar"
              style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}`; }}
            />
            <div>
              <div className="mb-2"><strong>{user?.username}</strong></div>
              <input type="file" accept="image/png,image/jpeg" onChange={handleFile} className="form-control mb-2" />
              <button className="btn btn-primary" onClick={upload} disabled={!file || loading}>{loading ? 'Uploading...' : 'Upload Photo'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


