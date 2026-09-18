import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

export default function Forgotpassword() {
    const [codeSent, setCodeSent] = useState(false);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        email: '',
        code: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/Forgotpassword', {
            onSuccess: () => setCodeSent(true),
        });
    };

    const submitCode = (e) => {
        e.preventDefault();
        post('/VerifyCode');
    };

    return (
        <div className="forgot-password-page-wrapper">
            <div className="profile-info-container">
                <div className="profile-info-card" style={{ textAlign: 'center', alignItems: 'center' }}>
                    <div className="profile-title-group">
                        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Forgot Password?</h1>
                        <p style={{ maxWidth: '400px', margin: '0 auto 1.5rem auto', lineHeight: '1.4' }}>
                            Enter your registered email address and we'll send you a verification code.
                        </p>
                    </div>

                    <form className="change-password-form" style={{ width: '100%', maxWidth: '480px' }} onSubmit={submit}>
                        <div className="profile-field-group" style={{ textAlign: 'left' }}>
                            <label htmlFor="email">Email Address</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter email address"
                                    style={{ flex: 1 }}
                                />
                                <button
                                    type="submit"
                                    className="change-password-btn"
                                    disabled={processing}
                                >
                                    {processing ? 'Sending...' : 'Send Code'}
                                </button>
                            </div>
                            {errors.email && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.email}</div>}
                        </div>

                        {recentlySuccessful && (
                            <div style={{ color: 'green', marginBottom: '1rem' }}>Reset code sent! Check your email.</div>
                        )}

                        <div className="profile-field-group" style={{ textAlign: 'left' }}>
                            <label htmlFor="code">Verification Code</label>
                            <input
                                type="text"
                                id="code"
                                name="code"
                                maxLength={6}
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="Enter 6-digit code"
                                disabled={!codeSent}
                            />
                            {errors.code && <div style={{ color: 'red', fontSize: '0.85rem' }}>{errors.code}</div>}
                        </div>

                        <button
                            type="button"
                            className="change-password-btn"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            onClick={submitCode}
                            disabled={processing || !codeSent}
                        >
                            {processing ? 'Verifying...' : 'Change Password'}
                        </button>

                        <div style={{ marginTop: '1rem' }}>
                            <Link href="/" style={{ textDecoration: 'underline', color: '#325F38', fontWeight: '500', fontSize: '0.95rem' }}>
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}