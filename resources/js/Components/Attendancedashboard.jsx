import React from "react";
import Layout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";

export default function Attendancedashboard({ onBack }) {
    // Pull real props passed from AttendanceController@myAttendance
    const { attendanceHistory = [], stats = { present: 0, late: 0, absent: 0, excused: 0 } } = usePage().props;

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    };

    return (
        <Layout pageTitle={'My Attendance'}>
            <div className="attendance-page-container">
                <button className="qr-back-button" onClick={handleBack}>
                    <svg 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                    >
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back
                </button>

                <h1 className="qr-page-title">My Attendance</h1>

                {/* Stat Grid */}
                <div className="attendance-stats-grid">
                    <div className="attendance-stat-card">
                        <h2 className="stat-number">{stats.present}</h2>
                        <p className="stat-label">PRESENT</p>
                    </div>

                    <div className="attendance-stat-card">
                        <h2 className="stat-number">{stats.late}</h2>
                        <p className="stat-label">LATE</p>
                    </div>

                    <div className="attendance-stat-card">
                        <h2 className="stat-number">{stats.absent}</h2>
                        <p className="stat-label">ABSENT</p>
                    </div>

                    <div className="attendance-stat-card">
                        <h2 className="stat-number">{stats.excused}</h2>
                        <p className="stat-label">EXCUSED</p>
                    </div>
                </div>

                {/* History Section */}
                <div className="attendance-history-section">
                    <h3 className="attendance-history-title">Attendance History</h3>

                    <div className="attendance-history-list">
                        {attendanceHistory.length > 0 ? (
                            attendanceHistory.map((item) => {
                                const upperStatus = item.status ? item.status.toUpperCase() : 'UNKNOWN';
                                const statusClass = `status-${item.status ? item.status.toLowerCase() : 'default'}`;

                                return (
                                    <div key={item.id} className="attendance-history-item">
                                        <h4 className="history-date">{item.date}</h4>
                                        <p className="history-event">{item.event || "Saturday Training"}</p>
                                        <p className="history-time">Time-In: {item.time_in || 'N/A'}</p>
                                        <p className="history-time">Time-Out: {item.time_out || 'Not yet timed out'}</p>
                                        <span className={`history-status ${statusClass}`}>
                                            {upperStatus}
                                        </span>
                                    </div>
                                );
                            })
                        ) : (
                            <p style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem' }}>No attendance history recorded yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}