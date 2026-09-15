import React, { useState } from 'react';

export default function Systeminformation({onBack}) {
  const [formData, setFormData] = useState({
    sysName: 'ROTC Attendance System',
    instName: 'Reserve Officers’ Training Corps - Central Luzon State University',
    academicYear: '2026 - 2027',
    contactEmail: 'rotc@gmail.com',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saved System Information:', formData);
  };

  return (
    <div className="system-info-container">
      {/* Header Section */}
      <div className="system-info-header">
        <button className="profile-back-btn" type="button" aria-label="Go back" onClick={onBack}>
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
        <form className="system-info-form" onSubmit={handleSubmit}>
          <div className="sys-form-group">
            <label htmlFor="sysName">System Name</label>
            <input
              type="text"
              id="sysName"
              value={formData.sysName}
              onChange={handleChange}
            />
          </div>

          <div className="sys-form-group">
            <label htmlFor="instName">Institution Name</label>
            <input
              type="text"
              id="instName"
              value={formData.instName}
              onChange={handleChange}
            />
          </div>

          <div className="sys-form-group">
            <label htmlFor="academicYear">Academic Year</label>
            <input
              type="text"
              id="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
            />
          </div>

          <div className="sys-form-group">
            <label htmlFor="contactEmail">Contact Email</label>
            <input
              type="email"
              id="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="sys-save-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}