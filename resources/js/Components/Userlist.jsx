import Ellipsisimg from '../assets/ellipsisimg.svg'
import Announcementprofileimg from '../assets/announcementprofileimg.svg'
import Arrowdownimg from '../assets/arrowdownimg.svg'
import { Link } from '@inertiajs/react'
import Usermodal from './Usermodal'
import React, { useState } from 'react'

// Sub-component to manage individual user row state (dropdowns, modals, cadet toggles)
function UserItem({ user, page }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showCadets, setShowCadets] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    function Cadetset() {
        return (
            <div style={{ position: 'relative', display: 'inline-block' }}>
                <img 
                    src={Ellipsisimg} 
                    onClick={() => setShowDropdown(!showDropdown)}
                    style={{ cursor: 'pointer' }}
                    alt="options"
                />
                {showDropdown && (
                    <div className='dropdownuser'>
                        <div className='dropdown-item'><Link href="#">Add</Link></div>
                    </div>
                )}
            </div>
        );
    }

    function Platoonset() {
        return (
            <>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img 
                        src={Ellipsisimg} 
                        onClick={() => setShowDropdown(!showDropdown)}
                        style={{ cursor: 'pointer' }}
                        alt="options"
                    />
                    {showDropdown && (
                        <div className='dropdownuser'>
                            <div className='dropdown-item'><Link href="#">Add</Link></div>
                        </div>
                    )}
                </div>
                <img 
                    src={Arrowdownimg} 
                    id='arrowdown' 
                    onClick={() => setShowCadets(!showCadets)}
                    style={{ cursor: 'pointer', marginLeft: '8px' }}
                    alt="toggle cadets"
                />
            </>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1vh', marginTop: '2vh'}}>
            <div id='userlist'>
                <div className='userlistcontainer'>
                    <div id='userlistinnercontainer2'>
                        <img src={Announcementprofileimg} alt="profile" />
                        <div id='userlistcontainer3'>
                            <span 
                                onClick={() => setIsModalOpen(true)} 
                                style={{ textDecoration: 'none', color: '#467646', cursor: 'pointer' }}
                            >
                                {user.name}
                            </span>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <div id='userlistinnercontainer'>
                        {page === 'Cadets' ? <Cadetset /> : <Platoonset />}
                    </div>
                </div>

                {showCadets && (
                    <div id='userlistcontainerinplatoon' className='userlistcontainer' style={{ marginLeft: '4vw', marginTop: '1vh' }}>  
                        <div id='userlistinnercontainer2'>
                            <img src={Announcementprofileimg} alt="profile" />
                            <div id='userlistcontainer3'>
                                <span onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>
                                    {user.name}
                                </span>
                                <p>{user.email}</p>
                            </div>
                        </div>
                        <div id='userlistinnercontainer'>
                            <img src={Ellipsisimg} alt="options" />
                        </div>
                    </div>
                )}
            </div>

            {/* Pass current user data to modal */}
            <Usermodal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                user={user}
            />
        </div>
    );
}

// Main component that receives users array from Laravel Inertia
export default function Userlist({ page, users = [] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    // Calculate slice indexes
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const totalPages = Math.ceil(users.length / itemsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    return (
        <>
            {users.length > 0 ? (
                <>
                    {currentUsers.map((user) => (
                        <UserItem key={user.id} user={user} page={page} />
                    ))}

                    {/* Simple Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="pagination-containers" style = {{display: 'flex', gap: '1vw'}}>
                            <button 
                                onClick={handlePrev} 
                                disabled={currentPage === 1}
                                className="pagination-buttons"
                            >
                                Previous
                            </button>
                            <span className="pagination-info">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button 
                                onClick={handleNext} 
                                disabled={currentPage === totalPages}
                                className="pagination-buttons"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                    No users found.
                </div>
            )}
        </>
    );
}