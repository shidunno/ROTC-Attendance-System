import React from 'react';
import Layout from "@/Layouts/AuthenticatedLayout";
import { useForm, usePage, router } from '@inertiajs/react';

export default function Excuseletterdashboard() {
    // 1. Grab the cadet's submission history passed from the controller
    const { letters } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        date: '',
        file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Use a standard URL string instead of route()
        post('/excuse-letters', {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    // Helper to dynamically style the status text
    const getStatusClass = (status) => {
        switch (status) {
            case 'accepted': return 'status-approved';
            case 'rejected': return 'status-rejected';
            default: return 'status-pending';
        }
    };

    return (
        <Layout pageTitle={'Excuse Letter'}>
            <div className="excuse-letter-container">
                {/* Back Button */}
                <button 
                    className="excuse-back-btn" 
                    onClick={() => router.visit('/Dashboard')} 
                    type="button"
                >
                    <span className="back-arrow">&larr;</span> Back
                </button>

                {/* Page Header */}
                <h1 className="excuse-title">Submit Excuse Letter</h1>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="excuse-form">
                    <div className="form-group">
                        <label htmlFor="absence-date" className="form-label">
                            Date of Absence
                        </label>
                        <input
                            type="date"
                            id="absence-date"
                            className="form-input"
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            required
                        />
                        {errors.date && <div className="text-red-500 text-sm mt-1">{errors.date}</div>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="supporting-document" className="form-label">
                            Supporting Document (PDF/Image)
                        </label>
                        <input
                            type="file"
                            id="supporting-document"
                            className="form-file-input"
                            onChange={(e) => setData('file', e.target.files[0])}
                            required
                        />
                        {errors.file && <div className="text-red-500 text-sm mt-1">{errors.file}</div>}
                    </div>

                    <button type="submit" className="submit-excuse-btn" disabled={processing}>
                        {processing ? 'Submitting...' : 'Submit Excuse Letter'}
                    </button>
                </form>

                {/* Dynamic Submission History Section */}
                <div className="submission-history-section">
                    <h2 className="history-title">Submission History</h2>

                    <div className="history-list">
                        {letters && letters.length > 0 ? (
                            letters.map((item) => (
                                <div className="history-item" key={item.id}>
                                    <h3 className="history-date">{item.date}</h3>
                                    <p className="history-status">
                                        STATUS: <span className={getStatusClass(item.status)}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#666' }}>No submission history found.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}