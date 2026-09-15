import React, { useState } from 'react';
import Layout from "@/Layouts/AuthenticatedLayout";

export default function Excuseletterdashboard({ onBack }) {
    const [dateOfAbsence, setDateOfAbsence] = useState('');
    const [file, setFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <Layout pageTitle={'Excuse Letter'}>
            <div className="excuse-letter-container">
                {/* Back Button */}
                <button className="excuse-back-btn" onClick={onBack}>
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
                            value={dateOfAbsence}
                            onChange={(e) => setDateOfAbsence(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="supporting-document" className="form-label">
                            Supporting Document
                        </label>
                        <input
                            type="file"
                            id="supporting-document"
                            className="form-file-input"
                            onChange={(e) => setFile(e.target.files[0])}
                        />
                    </div>

                    <button type="submit" className="submit-excuse-btn">
                        Submit Excuse Letter
                    </button>
                </form>

                {/* Submission History Section */}
                <div className="submission-history-section">
                    <h2 className="history-title">Submission History</h2>

                    <div className="history-list">
                        <div className="history-item">
                            <h3 className="history-date">August 29, 2026</h3>
                            <p className="history-status">
                                STATUS: <span className="status-approved">Approved</span>
                            </p>
                        </div>

                        <div className="history-item">
                            <h3 className="history-date">July 29, 2026</h3>
                            <p className="history-status">
                                STATUS: <span className="status-rejected">Rejected</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}