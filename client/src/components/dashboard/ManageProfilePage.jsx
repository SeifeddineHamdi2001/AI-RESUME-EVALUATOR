// ManageProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../assets/styles/ManageProfile.css';

const API_URL = 'http://localhost:5000/api/auth/profile';

const ManageProfilePage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profileImage: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
      if (user.profileImage) {
        setPreview(`http://localhost:5000/${user.profileImage.replace(/\\/g, '/')}`);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage' && files && files[0]) {
      setFormData((prev) => ({ ...prev, profileImage: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      if (formData.currentPassword) data.append('currentPassword', formData.currentPassword);
      if (formData.newPassword) data.append('newPassword', formData.newPassword);
      if (formData.profileImage) data.append('profileImage', formData.profileImage);
      const res = await axios.put(API_URL, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile updated successfully!');
      // Optionally, refresh user info in AuthContext here
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="candidate-main with-sidebar">
      <form className="manage-profile-form" onSubmit={handleSubmit} encType="multipart/form-data">
        <h2 className="section-title">Manage Profile</h2>
        <div className="manage-profile-group profile-image-preview-group">
          {preview && (
            <img src={preview} alt="Profile Preview" className="profile-image-preview" />
          )}
        </div>
        <div className="manage-profile-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="manage-profile-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="manage-profile-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            placeholder="Enter current password"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </div>
        <div className="manage-profile-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>
        <div className="manage-profile-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <div className="manage-profile-group">
          <label htmlFor="profileImage">Profile Image</label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
        <div className="manage-profile-buttons">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" className="btn btn-outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageProfilePage;