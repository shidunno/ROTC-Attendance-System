import React from 'react';

export default function Changepassword({ onBack }) {
    return (
        <div className="profile-info-container">
            {/* Header sits ABOVE the card container */}
            <div className="profile-info-header">
                <button className="profile-back-btn" onClick={onBack || (() => window.history.back())}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#325F38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <div className="profile-title-group">
                    <h1>Change Password</h1>
                    <p>Update your password</p>
                </div>
            </div>

            {/* Main Form Box */}
            <div className="profile-info-card">
                <form className="change-password-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="profile-field-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input type="password" id="currentPassword" name="currentPassword" />
                    </div>

                    <div className="profile-field-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input type="password" id="newPassword" name="newPassword" />
                    </div>

                    <div className="profile-field-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" />
                    </div>

                    <button type="submit" className="change-password-btn">
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    );
}