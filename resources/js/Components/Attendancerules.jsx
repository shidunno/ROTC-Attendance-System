import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Attendancerules({ onBack }) {
    const { data, setData, post, processing, errors } = useForm({
        time_in_start: '',
        time_in_end: '',
        time_out_start: '',
        time_out_end: '',
        late_after: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/attendance-rules'); // Update this route to match your Laravel backend route
    };

    return (
        <div className="system-info-container">
            {/* Header / Title Bar */}
            <div className="system-info-header">
                <button type="button" className="profile-back-btn" aria-label="Go back" onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e4d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <div className="system-info-title-group">
                    <h1>Attendance Rules</h1>
                    <p>Manage time-in, time-out, and late rules</p>
                </div>
            </div>

            {/* Rules Form Card */}
            <div className="system-info-card">
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Time-In Row */}
                    <div style={{ display: 'flex', gap: '1.5rem', width: '100%', flexWrap: 'wrap' }}>
                        <div className="sys-form-group" style={{ flex: '1 1 200px' }}>
                            <label htmlFor="timeInStart" style={{ marginTop: 0 }}>Time-In Start</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="text" 
                                    id="timeInStart" 
                                    value={data.time_in_start}
                                    onChange={e => setData('time_in_start', e.target.value)}
                                    placeholder="e.g., 6:00 AM"
                                    style={{ width: '100%', paddingRight: '2.5rem' }}
                                />
                                <span style={clockIconStyle}>🕒</span>
                            </div>
                            {errors.time_in_start && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errors.time_in_start}</span>}
                        </div>

                        <div className="sys-form-group" style={{ flex: '1 1 200px' }}>
                            <label htmlFor="timeInEnd" style={{ marginTop: 0 }}>Time-In End</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="text" 
                                    id="timeInEnd" 
                                    value={data.time_in_end}
                                    onChange={e => setData('time_in_end', e.target.value)}
                                    placeholder="e.g., 7:30 AM"
                                    style={{ width: '100%', paddingRight: '2.5rem' }}
                                />
                                <span style={clockIconStyle}>🕒</span>
                            </div>
                            {errors.time_in_end && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errors.time_in_end}</span>}
                        </div>
                    </div>

                    {/* Time-Out Row */}
                    <div style={{ display: 'flex', gap: '1.5rem', width: '100%', flexWrap: 'wrap' }}>
                        <div className="sys-form-group" style={{ flex: '1 1 200px' }}>
                            <label htmlFor="timeOutStart" style={{ marginTop: 0 }}>Time-Out Start</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="text" 
                                    id="timeOutStart" 
                                    value={data.time_out_start}
                                    onChange={e => setData('time_out_start', e.target.value)}
                                    placeholder="e.g., 12:00 PM"
                                    style={{ width: '100%', paddingRight: '2.5rem' }}
                                />
                                <span style={clockIconStyle}>🕒</span>
                            </div>
                            {errors.time_out_start && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errors.time_out_start}</span>}
                        </div>

                        <div className="sys-form-group" style={{ flex: '1 1 200px' }}>
                            <label htmlFor="timeOutEnd" style={{ marginTop: 0 }}>Time-Out End</label>
                            <div style={{ position: 'relative' }}>
                                <input 
                                    type="text" 
                                    id="timeOutEnd" 
                                    value={data.time_out_end}
                                    onChange={e => setData('time_out_end', e.target.value)}
                                    placeholder="e.g., 1:00 PM"
                                    style={{ width: '100%', paddingRight: '2.5rem' }}
                                />
                                <span style={clockIconStyle}>🕒</span>
                            </div>
                            {errors.time_out_end && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errors.time_out_end}</span>}
                        </div>
                    </div>

                    {/* Late After Single Field Row */}
                    <div className="sys-form-group">
                        <label htmlFor="lateAfter" style={{ marginTop: 0 }}>Late After</label>
                        <input 
                            type="text" 
                            id="lateAfter" 
                            value={data.late_after}
                            onChange={e => setData('late_after', e.target.value)}
                            placeholder="e.g., 7:15 AM"
                            style={{ width: '100%' }}
                        />
                        {errors.late_after && <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>{errors.late_after}</span>}
                    </div>

                    {/* Action Button */}
                    <button type="submit" disabled={processing} className="sys-save-btn" style={{ marginTop: '0.5rem' }}>
                        {processing ? 'Saving...' : 'Save Changes'}
                    </button>

                </form>
            </div>
        </div>
    );
}

// Inline helper positioning for clock icons inside inputs
const clockIconStyle = {
    position: 'absolute',
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    opacity: 0.4,
    fontSize: '1rem'
};