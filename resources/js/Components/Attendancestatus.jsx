import React, { useState } from 'react';

export default function Attendancestatus({ onBack }) {
    // Initial state matching the UI
    const [statuses, setStatuses] = useState([
        { id: 1, label: 'Present', active: true },
        { id: 2, label: 'Late', active: true },
        { id: 3, label: 'Absent', active: true },
        { id: 4, label: 'Excused', active: true },
    ]);

    // Handler to toggle active/disable state
    const toggleStatus = (id) => {
        setStatuses(prev =>
            prev.map(item =>
                item.id === id ? { ...item, active: !item.active } : item
            )
        );
    };

    return (
        <div className="system-info-container">
            {/* Header Section */}
            <div className="system-info-header">
                <button type="button" className="profile-back-btn" aria-label="Go back" onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e4d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <div className="system-info-title-group">
                    <h1 style={{ color: '#2e4d32', fontWeight: 700 }}>Attendance Status</h1>
                    <p style={{ color: '#6b7280', margin: 0 }}>Manage time-in, time-out, and late rules</p>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="system-info-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    
                    {/* Status List Items */}
                    {statuses.map((status) => (
                        <div 
                            key={status.id} 
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1.25rem 0',
                                borderBottom: '1px solid #e5e7eb'
                            }}
                        >
                            <span style={{ fontWeight: 600, color: '#2e4d32', fontSize: '1rem' }}>
                                {status.label}
                            </span>
                            
                            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                {/* Active Badge */}
                                <button
                                    type="button"
                                    onClick={() => toggleStatus(status.id)}
                                    style={{
                                        backgroundColor: status.active ? '#6b9080' : '#e5e7eb',
                                        color: status.active ? '#ffffff' : '#6b7280',
                                        border: 'none',
                                        borderRadius: '20px',
                                        padding: '0.4rem 1.5rem',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Active
                                </button>

                                {/* Disable/Enable Toggle Button */}
                                <button
                                    type="button"
                                    onClick={() => toggleStatus(status.id)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        color: '#374151',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        padding: '0.4rem 1.25rem',
                                        fontWeight: 500,
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {status.active ? 'Disable' : 'Enable'}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add Status Button */}
                    <div style={{ marginTop: '2rem' }}>
                        <button
                            type="button"
                            className="sys-save-btn"
                            style={{
                                width: 'auto',
                                padding: '0.45rem 1.3rem',
                                borderRadius: '6px',
                                backgroundColor: '#2e4d32',
                                color: '#ffffff',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Add Status
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}