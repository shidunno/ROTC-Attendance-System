import Announcementprofileimg from '../assets/announcementprofileimg.svg';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Announcementmodal({
    isOpen,
    onClose,
    announcement,
    isEditMode
}) {
    const [content, setContent] = useState('');

    useEffect(() => {
        if (announcement) {
            setContent(announcement.content || '');
        }
    }, [announcement, isEditMode]);

    if (!isOpen || !announcement) return null;

    const handleSave = () => {
        router.put(
            `/announcements/${announcement.announcement_id}`,
            {
                content: content,
            },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-card"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="usermodal-close-btn"
                    onClick={onClose}
                >
                    &times;
                </button>

                <div className="announcementmodalinnercontainer">
                    <div className="announcementmodalinnercontainer1">
                        <img
                            src={announcement.authorImg || Announcementprofileimg}
                            alt="profile"
                        />

                        <div className="announcementmodalinnercontainer2">
                            <h1>{announcement.authorName}</h1>
                            <p>
                                {announcement.role} │ {announcement.date}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="announcementmodal-content">
                    {isEditMode ? (
                        <textarea
                            className="announcementmodal-textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Announcement content"
                        />
                    ) : (
                        <p>{announcement.content}</p>
                    )}
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '16px'
                    }}
                >
                    {announcement.imagePath && (
                        <a
                            href={announcement.imagePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="profile-update-btn"
                            style={{
                                textDecoration: 'none',
                                display: 'inline-block'
                            }}
                        >
                            View Attached Image
                        </a>
                    )}

                    {announcement.documentPath && (
                        <a
                            href={announcement.documentPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="profile-update-btn"
                            style={{
                                textDecoration: 'none',
                                display: 'inline-block'
                            }}
                        >
                            Download Document
                        </a>
                    )}

                    {isEditMode && (
                        <button
                            type="button"
                            className="profile-update-btn"
                            onClick={handleSave}
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

