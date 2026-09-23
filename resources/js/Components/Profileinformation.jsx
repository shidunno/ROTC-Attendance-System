import React, { useState } from 'react';
import { usePage, useForm } from '@inertiajs/react';

export default function ProfileInformation({ onBack }) {
  const { auth } = usePage().props;
  const user = auth?.user;

  const isAdmin = user?.role === 'admin';

  const { data, setData, post, processing, errors } = useForm({
    name: user?.name || '',
    email: user?.email || '',
    avatar: null,
  });

  const [photoPreview, setPhotoPreview] = useState(
    user?.profile_photo_path
      ? `/storage/${user.profile_photo_path}`
      : null
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === 'name' || name === 'email') && !isAdmin) {
      return;
    }

    setData(name, value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setData('avatar', file);

    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    post('/profile/update', {
      preserveScroll: true,
      forceFormData: true,

      onSuccess: () => {
        window.location.reload();
      },
    });
  };

  return (
    <div className="profile-info-container">

      {/* Header */}
      <div className="profile-info-header">

        <button
          className="profile-back-btn"
          type="button"
          aria-label="Go back"
          onClick={onBack}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#325F38"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <div className="profile-title-group">
          <h1>Profile Information</h1>

          <p>
            {isAdmin
              ? 'Update user details and display photo'
              : 'Update your display photo'}
          </p>
        </div>

      </div>

      {/* Profile Form */}
      <form
        className="profile-info-card"
        onSubmit={handleSubmit}
      >

        {/* Profile Photo */}
        <div className="profile-photo-section">

          <div className="profile-avatar-wrapper">

            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Profile Avatar"
                className="profile-avatar-img"
              />
            ) : (
              <svg
                className="profile-avatar-placeholder"
                viewBox="0 0 100 100"
                width="200"
                height="200"
                fill="#325F38"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="50"
                />

                <circle
                  cx="50"
                  cy="35"
                  r="18"
                  fill="#ffffff"
                />

                <path
                  d="M 16 82 C 16 62, 30 52, 50 52 C 70 52, 84 62, 84 82 Z"
                  fill="#ffffff"
                />
              </svg>
            )}

          </div>

          <label
            htmlFor="photo-upload"
            className="profile-change-photo-btn"
            style={{ cursor: 'pointer' }}
          >
            Change Photo
          </label>

          <input
            type="file"
            id="photo-upload"
            name="avatar"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
          />

          {errors.avatar && (
            <span className="error-text">
              {errors.avatar}
            </span>
          )}

        </div>

        {/* Full Name */}
        <div className="profile-field-group">

          <label htmlFor="name">
            Full Name
          </label>

          <input
            type="text"
            id="name"
            name="name"
            value={data.name}
            onChange={handleChange}
            readOnly={!isAdmin}
          />

          {errors.name && (
            <span className="error-text">
              {errors.name}
            </span>
          )}

        </div>

        {/* Email */}
        <div className="profile-field-group">

          <label htmlFor="email">
            Email Address
          </label>

          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            readOnly={!isAdmin}
          />

          {errors.email && (
            <span className="error-text">
              {errors.email}
            </span>
          )}

        </div>

        {/* Save */}
        <button
          type="submit"
          className="profile-update-btn"
          disabled={processing}
        >
          {processing
            ? 'Saving...'
            : 'Save Changes'}
        </button>

      </form>

    </div>
  );
}