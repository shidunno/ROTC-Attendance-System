import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import Layout from "@/Layouts/AuthenticatedLayout";
import { QRCodeSVG } from "qrcode.react";

export default function Qrdashboard({ onBack }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [timeLeft, setTimeLeft] = useState(60);
    const [tokenSalt, setTokenSalt] = useState(Date.now());

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleGenerateNewQr = () => {
        setTimeLeft(60);
        setTokenSalt(Date.now()); // Refreshes the QR data string
    };

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            window.history.back();
        }
    };

    // Payload encoded inside the dynamic QR code
    const qrData = JSON.stringify({
        id: user?.id,
        custom_id: user?.custom_id,
        name: user?.name,
        salt: tokenSalt
    });

    return (
        <Layout pageTitle={'My QR Code'}>
            <div className="qrcode-page-container">
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

                <h1 className="qr-page-title">My QR Code</h1>

                <div className="qr-notice-card">
                    <h3>Attendance QR Code</h3>
                    <p>Present this code to your Platoon Leader</p>
                </div>

                <div className="qr-display-card">
                    <div className="qr-image-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '180px' }}>
                        {timeLeft > 0 ? (
                            <QRCodeSVG value={qrData} size={180} level="H" />
                        ) : (
                            <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                QR Code Expired
                            </div>
                        )}
                    </div>

                    <span className="qr-status-label" style={{ color: timeLeft > 0 ? '#10b981' : '#ef4444' }}>
                        {timeLeft > 0 ? "QR Code Active" : "QR Code Expired"}
                    </span>
                    
                    <div className="qr-timer-display">
                        {formatTime(timeLeft)}
                    </div>

                    <p className="qr-disclaimer">
                        This QR code is temporary and can only be used while it is active.
                    </p>
                </div>

                <button className="qr-generate-button" onClick={handleGenerateNewQr}>
                    Generate New QR Code
                </button>
            </div>
        </Layout>
    );
}