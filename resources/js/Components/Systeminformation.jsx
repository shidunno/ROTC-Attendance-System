import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Systeminformation({ onBack }) {
  const [formData, setFormData] = useState({
    sysName: 'ROTC Attendance System',
    instName:
      'Reserve Officers’ Training Corps - Central Luzon State University',
    academicYear: '2026 - 2027',
    contactEmail: 'rotc@gmail.com',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));

    setMessage('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage('');
    setError('');

    router.put(
      '/system-settings',
      {
        system_name: formData.sysName,
        institution_name: formData.instName,
        academic_year: formData.academicYear,
        contact_email: formData.contactEmail,
      },
      {
        preserveScroll: true,

        onSuccess: () => {
          setMessage('System information saved successfully.');
        },

        onError: (errors) => {
          console.error(errors);
          setError(
            errors.contact_email ||
              errors.system_name ||
              errors.institution_name ||
              errors.academic_year ||
              'Unable to save system information.'
          );
        },

        onFinish: () => {
          setSaving(false);
        },
      }
    );
  };

  return (
    <div className="system-info-container">

      {/* Header Section */}
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

      {/* Form Card */}
      <div className="system-info-card defcontainer">

        {message && (
          <div
            style={{
              marginBottom: '15px',
              padding: '10px 15px',
              borderRadius: '6px',
              backgroundColor: '#e8f5e9',
              color: '#325F38',
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              marginBottom: '15px',
              padding: '10px 15px',
              borderRadius: '6px',
              backgroundColor: '#ffebee',
              color: '#c62828',
            }}
          >
            {error}
          </div>
        )}

        <form
          className="system-info-form"
          onSubmit={handleSubmit}
        >

          {/* System Name */}
          <div className="sys-form-group">
            <label htmlFor="sysName">
              System Name
            </label>

            <input
              type="text"
              id="sysName"
              value={formData.sysName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Institution Name */}
          <div className="sys-form-group">
            <label htmlFor="instName">
              Institution Name
            </label>

            <input
              type="text"
              id="instName"
              value={formData.instName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Academic Year */}
          <div className="sys-form-group">
            <label htmlFor="academicYear">
              Academic Year
            </label>

            <input
              type="text"
              id="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contact Email */}
          <div className="sys-form-group">
            <label htmlFor="contactEmail">
              Contact Email
            </label>

            <input
              type="email"
              id="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
            />
          </div>

          {/* Save Button */}
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