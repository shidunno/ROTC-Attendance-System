import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export default function Systeminformation({
  onBack,
  systemSettings,
}) {
  const [formData, setFormData] = useState({
    sysName: '',
    instName: '',
    academicYear: '',
    contactEmail: '',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (systemSettings) {
      setFormData({
        sysName: systemSettings.system_name || '',
        instName: systemSettings.institution_name || '',
        academicYear: systemSettings.academic_year || '',
        contactEmail: systemSettings.contact_email || '',
      });
    }
  }, [systemSettings]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSaving(true);

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

        onFinish: () => {
          setSaving(false);
        },
      }
    );
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

        <form
          className="system-info-form"
          onSubmit={handleSubmit}
        >

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