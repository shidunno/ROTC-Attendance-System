import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function ResetPassword() {
    const { email, code } = usePage().props;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        setMessage({ text: '', type: '' });

        if (!newPassword || !confirmPassword) {
            setMessage({
                text: 'Please fill in all fields.',
                type: 'error',
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({
                text: 'Passwords do not match.',
                type: 'error',
            });
            return;
        }

        if (newPassword.length < 8) {
            setMessage({
                text: 'Password must be at least 8 characters long.',
                type: 'error',
            });
            return;
        }

        setLoading(true);

        router.post(
            '/Resetpassword',
            {
                email: email,
                code: code,
                password: newPassword,
                password_confirmation: confirmPassword,
            },
            {
                onSuccess: () => {
                    setMessage({
                        text: 'Password successfully reset!',
                        type: 'success',
                    });

                    setNewPassword('');
                    setConfirmPassword('');

                    setTimeout(() => {
                        window.location.href = '/';
                    }, 1500);
                },

                onError: (errors) => {
                    const firstError = Object.values(errors)[0];

                    setMessage({
                        text: firstError || 'Failed to reset password.',
                        type: 'error',
                    });
                },

                onFinish: () => {
                    setLoading(false);
                },
            }
        );
    };

    return (
        <div className="forgot-password-page-wrapper">
            <div className="profile-info-container">
                <div
                    className="profile-info-card"
                    style={{
                        textAlign: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div className="profile-title-group">
                        <h1
                            style={{
                                fontSize: '2.2rem',
                                marginBottom: '0.5rem',
                            }}
                        >
                            Set New Password
                        </h1>

                        <p
                            style={{
                                maxWidth: '400px',
                                margin: '0 auto 1.5rem auto',
                                lineHeight: '1.4',
                            }}
                        >
                            Enter your new password below.
                        </p>
                    </div>

                    {message.text && (
                        <div
                            className={`form-message ${message.type}`}
                            style={{
                                marginBottom: '15px',
                                color:
                                    message.type === 'error'
                                        ? 'red'
                                        : 'green',
                            }}
                        >
                            {message.text}
                        </div>
                    )}

                    <form
                        className="change-password-form"
                        style={{
                            width: '100%',
                            maxWidth: '480px',
                        }}
                        onSubmit={handleSubmit}
                    >
                        <div
                            className="profile-field-group"
                            style={{ textAlign: 'left' }}
                        >
                            <label htmlFor="newPassword">
                                New Password
                            </label>

                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                placeholder="Enter new password"
                            />
                        </div>

                        <div
                            className="profile-field-group"
                            style={{ textAlign: 'left' }}
                        >
                            <label htmlFor="confirmPassword">
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm new password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="change-password-btn"
                            style={{
                                width: '100%',
                                marginTop: '0.5rem',
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>

                        <div style={{ marginTop: '1rem' }}>
                            <Link
                                href="/"
                                style={{
                                    textDecoration: 'underline',
                                    color: '#325F38',
                                    fontWeight: '500',
                                    fontSize: '0.95rem',
                                }}
                            >
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}