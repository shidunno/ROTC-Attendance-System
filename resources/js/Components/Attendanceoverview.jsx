import React, { useEffect, useRef, useState } from 'react';
import * as Recharts from 'recharts';
import jsQR from 'jsqr';
import { router, usePage } from '@inertiajs/react';

const COLORS = ['#16a34a', '#f59e0b', '#dc2626', '#3b82f6'];

export default function Attendanceoverview({ role = 'leader', attendanceData: initialAttendanceData = [] }) {
    const [attendanceData, setAttendanceData] = useState(
        initialAttendanceData.length > 0 ? initialAttendanceData : [
            { status: 'Present', count: 45 },
            { status: 'Late', count: 10 },
            { status: 'Absent', count: 5 },
            { status: 'Excused', count: 8 },
        ]
    );

    useEffect(() => {
        if (initialAttendanceData && initialAttendanceData.length > 0) {
            setAttendanceData(initialAttendanceData);
        }
    }, [initialAttendanceData]);

    const total = attendanceData.reduce((sum, item) => sum + item.count, 0);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [facingMode, setFacingMode] = useState('environment');
    const [cameraError, setCameraError] = useState(null);
    const [scanResult, setScanResult] = useState(null);
    const [scanningError, setScanningError] = useState(null);

    // Access flash messages passed from Laravel controller (e.g., ->with('success', '...'))
    const { flash } = usePage().props;

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const startCamera = async () => {
        stopCamera();
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access error:", err);
            setCameraError("Unable to access camera. Check browser permissions.");
            setIsCameraOn(false);
        }
    };

    useEffect(() => {
        if (role === 'leader' && isCameraOn) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [isCameraOn, facingMode, role]);

    // Auto-clear scan results after 4 seconds
    useEffect(() => {
        if (scanResult || scanningError) {
            const timer = setTimeout(() => {
                setScanResult(null);
                setScanningError(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [scanResult, scanningError]);

    useEffect(() => {
        if (!isCameraOn || role !== 'leader') return;

        let animationFrameId;
        let isScanning = true; // Prevent multiple rapid duplicate requests while processing
        const canvasElement = document.createElement('canvas');
        const canvasContext = canvasElement.getContext('2d', { willReadFrequently: true });

        const scanFrame = () => {
            if (!isScanning) return;

            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
                canvasElement.height = videoRef.current.videoHeight;
                canvasElement.width = videoRef.current.videoWidth;
                canvasContext.drawImage(videoRef.current, 0, 0, canvasElement.width, canvasElement.height);
                
                const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code) {
                    isScanning = false; // Pause scanning while network request processes

                    router.post('/admin/attendance/scan', { qr_data: code.data }, {
                        preserveScroll: true,
                        onSuccess: (page) => {
                            // Pull message from Laravel session flash or page props
                            const successMsg = page.props.flash?.success || "Attendance recorded successfully!";
                            setScanResult(successMsg);
                            setScanningError(null);
                        },
                        onError: (errors) => {
                            setScanningError(errors.qr_data || "Failed to process QR code.");
                        },
                        onFinish: () => {
                            // Resume scanning after a brief cooldown so it doesn't spam requests
                            setTimeout(() => {
                                isScanning = true;
                                animationFrameId = requestAnimationFrame(scanFrame);
                            }, 3000);
                        }
                    });
                    return;
                }
            }
            animationFrameId = requestAnimationFrame(scanFrame);
        };

        animationFrameId = requestAnimationFrame(scanFrame);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isCameraOn, role]);

    const toggleCameraFacing = () => {
        setFacingMode((prevMode) => (prevMode === 'environment' ? 'user' : 'environment'));
    };

    return (
        <div className="attendanceoverviewcontainer">
            <h1>{role === 'admin' ? 'Attendance Log' : 'Attendance Scanner'}</h1>

            <div className="defcontainer" id="attendanceoverview" style={{ position: 'relative', overflow: 'hidden' }}>
                {role === 'admin' ? (
                    <div style={{ height: '100%', width: '100%' }}>
                        <Recharts.ResponsiveContainer width="100%" height="100%">
                            <Recharts.PieChart>
                                <Recharts.Pie
                                    data={attendanceData}
                                    dataKey="count"
                                    nameKey="status"
                                    cx="50%"
                                    cy="50%"
                                    paddingAngle={1}
                                    outerRadius="90%"
                                    labelLine={false}
                                    style={{ outline: 'none' }}
                                    label={{
                                        position: 'inside',
                                        fill: '#ffffff',
                                        fontSize: 10,
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {attendanceData.map((entry, index) => (
                                        <Recharts.Cell
                                            key={entry.status}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Recharts.Pie>
                                <Recharts.Tooltip
                                    formatter={(value, name) => [
                                        `${value} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
                                        name
                                    ]}
                                />
                                <Recharts.Legend
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"
                                    wrapperStyle={{ paddingRight: '20%' }}
                                />
                            </Recharts.PieChart>
                        </Recharts.ResponsiveContainer>
                    </div>
                ) : (
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#111827',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            zIndex: 10,
                            display: 'flex',
                            gap: '8px'
                        }}>
                            {isCameraOn && (
                                <button
                                    onClick={toggleCameraFacing}
                                    style={{
                                        padding: '0.5rem 0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        backgroundColor: 'rgba(0,0,0,0.5)',
                                        color: '#ffffff',
                                        fontWeight: '600',
                                        fontSize: '0.85rem',
                                        cursor: 'pointer',
                                        backdropFilter: 'blur(4px)'
                                    }}
                                >
                                   {facingMode === 'environment' ? 'Front Cam' : 'Back Cam'}
                                </button>
                            )}

                            <button
                                onClick={() => setIsCameraOn(!isCameraOn)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: isCameraOn ? '#dc2626' : '#325F38',
                                    color: '#ffffff',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                }}
                            >
                                {isCameraOn ? 'Turn Off' : 'Turn On'}
                            </button>
                        </div>

                        {/* Scanner Feedback Banners with auto-fade */}
                        {scanResult && (
                            <div style={{ position: 'absolute', bottom: '16px', background: '#16a34a', color: '#fff', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', zIndex: 20, textAlign: 'center', maxWidth: '90%' }}>
                                {scanResult}
                            </div>
                        )}
                        {scanningError && (
                            <div style={{ position: 'absolute', bottom: '16px', background: '#dc2626', color: '#fff', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', zIndex: 20, textAlign: 'center', maxWidth: '90%' }}>
                                {scanningError}
                            </div>
                        )}

                        {isCameraOn ? (
                            <>
                                {cameraError ? (
                                    <p style={{ color: '#ef4444', textAlign: 'center', padding: '1rem' }}>
                                        {cameraError}
                                    </p>
                                ) : (
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transform: facingMode === 'user' ? 'scaleX(-1)' : 'none'
                                        }}
                                    />
                                )}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📷</div>
                                <p style={{ margin: 0, fontWeight: '600' }}>Camera is off</p>
                                <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                                    Click "Turn On" in the top right to start camera
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}