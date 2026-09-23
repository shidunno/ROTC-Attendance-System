import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';

export default function Systeminformation({ onBack, systemSettings }) {
  const { flash, errors } = usePage().props;

  const [formData, setFormData] = useState({
    system_name: '',
    institution_name: '',
    academic_year: '',
    contact_email: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (systemSettings) {
      setFormData({
        system_name: systemSettings.system_name || '',
        institution_name: systemSettings.institution_name || '',
        academic_year: systemSettings.academic_year || '',
        contact_email: systemSettings.contact_email || '',
      });
    }
  }, [systemSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSaving(true);

    router.put('/system-settings', formData, {
      preserveScroll: true,

      onFinish: () => {
        setSaving(false);
      },
    });
  };

  return (
    <div className="system-info-container">

      <div className="system-info-header">
        <button
          className="profile-back-btn"
          type="button"
          aria-label="Go back"
          onClick={onBack}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#325F38"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="system-info-title-group">
          <h1>System Information</h1>
          <p>Manage system and institution details</p>
        </div>
      </div>

      <div className="system-info-card defcontainer">

        {flash?.success && (
          <div className="success-text">
            {flash.success}
          </div>
        )}

        {errors?.system_name && (
          <div className="error-text">
            {errors.system_name}
          </div>
        )}

        {errors?.institution_name && (
          <div className="error-text">
            {errors.institution_name}
          </div>
        )}

        {errors?.academic_year && (
          <div className="error-text">
            {errors.academic_year}
          </div>
        )}

        {errors?.contact_email && (
          <div className="error-text">
            {errors.contact_email}
          </div>
        )}

        <form
          className="system-info-form"
          onSubmit={handleSubmit}
        >

          <div className="sys-form-group">
            <label htmlFor="system_name">
              System Name
            </label>

            <input
              type="text"
              id="system_name"
              name="system_name"
              value={formData.system_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sys-form-group">
            <label htmlFor="institution_name">
              Institution Name
            </label>

            <input
              type="text"
              id="institution_name"
              name="institution_name"
              value={formData.institution_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sys-form-group">
            <label htmlFor="academic_year">
              Academic Year
            </label>

            <input
              type="text"
              id="academic_year"
              name="academic_year"
              value={formData.academic_year}
              onChange={handleChange}
              required
            />
          </div>

          <div className="sys-form-group">
            <label htmlFor="contact_email">
              Contact Email
            </label>

            <input
              type="email"
              id="contact_email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="sys-save-btn"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

        </form>
      </div>
    </div>
  );
}