import Announcementprofileimg from '../assets/announcementprofileimg.svg'
import Pinimg from '../assets/pinimg.svg'
import Dotimg from '../assets/dotimg.svg'
import Commentimg from '../assets/commentimg.svg'
import { useState } from 'react';
import Fullpostimg from '../assets/fullpostimg.svg'
import Announcementmodal from './Announcementmodal';
import { Link, router } from '@inertiajs/react'

export default function Announcementtab({ user, announcement }) {

    const [visible, setVisible] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Dynamic data mapping matching Controller schema
    const postContent = announcement?.content || "No announcement content available.";
    const authorName = announcement?.user?.name || "System Administrator";
    const authorRole = announcement?.user?.role || "System Administrator";
    const postDate = announcement?.posted_at 
        ? new Date(announcement.posted_at).toLocaleDateString() 
        : new Date().toLocaleDateString();

    // Extract image and document paths from controller's 'attachments' array
    const attachments = announcement?.attachments || {};
    const imagePath = attachments.image ? `/storage/${attachments.image}` : null;
    const documentPath = attachments.document ? `/storage/${attachments.document}` : null;

    // Helper to extract filename from path
    const getFileName = (path) => path ? path.split('/').pop() : 'Attachment';

    function Comment() {
        return (
            <div className='commentcontainer'>
                <img src={Commentimg} alt="comment" />
                <button 
                    type="button" 
                    onClick={() => setVisible(false)} 
                    style={{ background: 'none', border: 'none', color: '#325F38', fontWeight: 'bold', marginTop: '0.3vw', cursor: 'pointer' }}
                >
                    Comment
                </button>
            </div>
        );
    }

    function Setcomment() {
        return (
            <div className='commentcontainer'>
                <img src={Announcementprofileimg} alt="profile" />
                <input type='text' autoFocus placeholder='Enter comment' />
            </div>
        );
    }

    return (
        <>
            <div
                id="announcementtab"
                className="defcontainer"
                style={{
                    backgroundColor: announcement?.is_pinned ? '#E8F3EA' : ''
                }}
            >
                <div id='Amaincont'>
                    <div id='Ainnercont1'>
                        <img src={Announcementprofileimg} alt="profile" />
                        <div id='Ainnercont2'>
                            <h1>{authorName}</h1>
                            <p>{authorRole} │ {postDate}</p>
                        </div>
                    </div>
                    <div id='Ainnercont3'>
                        {user?.role === 'admin' && (
                            <>
                                <img
                                    src={Pinimg}
                                    alt="pin"
                                    onClick={() => {
                                        router.put(`/announcements/${announcement.announcement_id}/pin`);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                />
                                <img src={Dotimg} onClick={() => setShowDropdown(!showDropdown)} alt="options" style={{ cursor: 'pointer' }} />  
                                {showDropdown && (
                                    <div className='dropdownannouncement'>

                                        <div className='dropdown-item'>
                                            <Link
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsEditMode(true);
                                                    setIsModalOpen(true);
                                                    setShowDropdown(false);
                                                }}
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                        <div className='dropdown-item'>
                                            <Link
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (confirm('Are you sure you want to delete this announcement?')) {
                                                        router.delete(`/announcements/${announcement.announcement_id}`);
                                                    }
                                                }}
                                            >
                                                Delete
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}               
                    </div>
                </div>

                {/* Title renders ONLY if present AND NOT 'General Announcement' */}
                {announcement?.title && announcement.title !== 'General Announcement' && (
                    <h3>{announcement.title}</h3>
                )}
                
                <p>{postContent}</p>

                {/* Display Uploaded Image */}
                {imagePath && (
                    <div style={{ margin: '0.75rem 0' }}>
                        <a 
                            href={imagePath} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#325F38', fontWeight: 'bold', textDecoration: 'underline', display: 'inline-block', wordBreak: 'break-all' }}
                        >
                            {getFileName(imagePath)}
                        </a>
                    </div>
                )}

                {/* Display Uploaded Document */}
                {documentPath && (
                    <div style={{ margin: '0.5rem 0' }}>
                        <a 
                            href={documentPath} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#325F38', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px'}}
                        >
                            {getFileName(attachments.document)}
                        </a>
                    </div>
                )}

                <div className='comment'>
                    {visible ? <Comment /> : <Setcomment />}
                    <button 
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className='commentcontainer1' 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        <img src={Fullpostimg} alt="view post" />
                        <span>View Post</span>
                    </button>
                </div>
            </div>

            <Announcementmodal 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setIsEditMode(false);
                }} 
                isEditMode={isEditMode}
                announcement={{
                    announcement_id: announcement?.announcement_id,
                    authorName,
                    role: authorRole,
                    date: postDate,
                    title: announcement?.title !== 'General Announcement' ? announcement?.title : null,
                    content: postContent,
                    imagePath,
                    documentPath
                }}
            />
        </>
    );
}