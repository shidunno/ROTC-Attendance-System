import React, { useState } from 'react';

export default function Changepassword({ onBack }) {
    // 1. State for form inputs
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // 2. State for feedback messages and loading
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    // Helper: read Laravel's CSRF token from the meta tag
    const getCsrfToken = () => {
        const tag = document.querySelector('meta[name="csrf-token"]');
        return tag ? tag.getAttribute('content') : '';
    };

    // 3. Handle form submission logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });

        // Basic validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage({ text: 'Please fill in all fields.', type: 'error' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ text: 'New passwords do not match.', type: 'error' });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ text: 'New password must be at least 6 characters long.', type: 'error' });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                credentials: 'same-origin', // sends the Laravel session cookie
                body: JSON.stringify({
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: confirmPassword,
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage({ text: data.message || 'Password successfully updated!', type: 'success' });
                // Clear inputs
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                // Laravel validation errors come back as data.errors (object of arrays)
                const firstError =
                    data.errors && Object.values(data.errors)[0]?.[0];
                setMessage({
                    text: firstError || data.message || 'Failed to update password.',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error updating password:', error);
            setMessage({ text: 'A network error occurred. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

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
                {/* Feedback message container */}
                {message.text && (
                    <div className={`form-message ${message.type}`} style={{ marginBottom: '15px', color: message.type === 'error' ? 'red' : 'green' }}>
                        {message.text}
                    </div>
                )}

                <form className="change-password-form" onSubmit={handleSubmit}>
                    <div className="profile-field-group">
                        <label htmlFor="currentPassword">Current Password</label>
                        <input 
                            type="password" 
                            id="currentPassword" 
                            name="currentPassword" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>

                    <div className="profile-field-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input 
                            type="password" 
                            id="newPassword" 
                            name="newPassword" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="profile-field-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="change-password-btn" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}