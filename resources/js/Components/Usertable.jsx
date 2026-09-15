import { useState } from 'react';
import Editimg from '../assets/editimg.svg';

export default function Usertable({ users = [], onUpdateUser, onDeleteUser, onBatchDelete, onBatchArchive, platoons = [], onAssignPlatoon, currentUser }) {
    // Determine if the current user is an admin
    const isAdmin = currentUser?.role ? currentUser.role.toLowerCase() === 'admin' : true;

    // Filter users if the current user is a platoon leader
    const filteredUsers = (() => {
        if (!currentUser) return users;
        const role = currentUser.role ? currentUser.role.toLowerCase() : '';
        if (role === 'leader' || role === 'platoon_leader') {
            const leaderPlatoonId = currentUser.platoon_id || currentUser.platoon?.id || currentUser.platoon?.number;
            if (leaderPlatoonId) {
                return users.filter((user) => {
                    const userPlatoonId = user.platoon_id || user.platoon?.id || user.platoon?.number;
                    return String(userPlatoonId) === String(leaderPlatoonId);
                });
            }
        }
        return users;
    })();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Multi-select state (stores selected user IDs)
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ 
        id: '', 
        custom_id: '',
        name: '', 
        role: 'cadet', 
        email: '',
        status: 'Active'
    });

    // Platoon Assignment Modal State
    const [isPlatoonModalOpen, setIsPlatoonModalOpen] = useState(false);
    const [selectedPlatoonId, setSelectedPlatoonId] = useState('');

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    // Multi-select handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const currentIds = currentUsers.map((user) => user.id || user.custom_id);
            setSelectedUserIds((prev) => [...new Set([...prev, ...currentIds])]);
        } else {
            const currentIds = currentUsers.map((user) => user.id || user.custom_id);
            setSelectedUserIds((prev) => prev.filter((id) => !currentIds.includes(id)));
        }
    };

    const handleSelectOne = (id) => {
        setSelectedUserIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const isAllCurrentSelected = 
        currentUsers.length > 0 && 
        currentUsers.every((user) => selectedUserIds.includes(user.id || user.custom_id));

    // Batch Action Handlers
    const handleBatchDelete = () => {
        if (selectedUserIds.length === 0) return;
        
        if (window.confirm(`Are you sure you want to delete ${selectedUserIds.length} selected user(s)?`)) {
            if (onBatchDelete) {
                onBatchDelete(selectedUserIds);
            }
            setSelectedUserIds([]);
        }
    };

    const handleBatchArchive = () => {
        if (selectedUserIds.length === 0) return;

        if (window.confirm(`Are you sure you want to archive ${selectedUserIds.length} selected user(s)?`)) {
            if (onBatchArchive) {
                onBatchArchive(selectedUserIds);
            }
            setSelectedUserIds([]);
        }
    };

    // Platoon Assignment Handlers
    const handleOpenPlatoonModal = () => {
        if (selectedUserIds.length === 0) return;
        setSelectedPlatoonId('');
        setIsPlatoonModalOpen(true);
    };

    const handleClosePlatoonModal = () => {
        setIsPlatoonModalOpen(false);
    };

    const handlePlatoonCheckboxChange = (platoonId) => {
        setSelectedPlatoonId((prev) => (prev === platoonId ? '' : platoonId));
    };

    const handleSavePlatoonAssignment = (e) => {
        e.preventDefault();
        if (!selectedPlatoonId) {
            alert('Please select a platoon.');
            return;
        }

        if (onAssignPlatoon) {
            onAssignPlatoon(selectedUserIds, selectedPlatoonId);
        }

        setSelectedUserIds([]);
        handleClosePlatoonModal();
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleEditClick = (user) => {
        setFormData({
            id: user.id || '',
            custom_id: user.custom_id || '',
            name: user.name || '',
            role: user.role ? user.role.toLowerCase() : 'cadet',
            email: user.email || '',
            status: user.status || 'Active'
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (onUpdateUser) {
            onUpdateUser({
                id: formData.id || formData.custom_id,
                custom_id: formData.custom_id,
                name: formData.name,
                role: formData.role,
                email: formData.email,
                status: formData.status
            });
        }
        handleCloseModal();
    };

    const handleDelete = () => {
        const targetId = formData.id || formData.custom_id;
        if (window.confirm(`Are you sure you want to delete ${formData.name}?`)) {
            if (onDeleteUser) {
                onDeleteUser(targetId);
            }
            handleCloseModal();
        }
    };

    return (
        <div className="tablecontainer">
            <table>
                <thead>
                    <tr>
                        {isAdmin && (
                            <th style={{ width: '40px', textAlign: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={isAllCurrentSelected}
                                    onChange={handleSelectAll}
                                />
                            </th>
                        )}
                        <th>User ID</th>
                        <th>Name</th>
                        <th>User Role</th>
                        <th>Platoon</th>
                        <th>Email</th>
                        <th>Status</th>
                        {isAdmin && <th></th>}
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.length > 0 ? (
                        currentUsers.map((user) => {
                            const userId = user.id || user.custom_id;
                            const isChecked = selectedUserIds.includes(userId);

                            return (
                                <tr key={userId} className={isChecked ? 'selected-row' : ''}>
                                    {isAdmin && (
                                        <td style={{ textAlign: 'center' }}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => handleSelectOne(userId)}
                                            />
                                        </td>
                                    )}
                                    <td>{user.custom_id ?? 'N/A'}</td>
                                    <td>{user.name}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{user.role}</td>
                                    <td>{user.platoon?.number ? `Platoon ${user.platoon.number}` : (user.platoon_id ?? 'N/A')}</td>
                                    <td>{user.email}</td>
                                    <td style={{ textTransform: 'capitalize' }}>{user.status}</td>
                                    {isAdmin && (
                                        <td>
                                            <img
                                                src={Editimg}
                                                alt="Edit"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleEditClick(user)}
                                            />
                                        </td>
                                    )}
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={isAdmin ? "8" : "7"} style={{ textAlign: 'center' }}>
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Bottom Footer Bar with Centered Batch Actions */}
            <div className="pagination-container">
                <div className="pagination-info">
                    Showing {filteredUsers.length > 0 ? startIndex + 1 : 0} to{' '}
                    {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                </div>

                {/* Batch Action Buttons placed in the Middle (Admin Only) */}
                {isAdmin && (
                    <div className="table-batch-actions">
                        <button
                            type="button"
                            className="btn-batch-archive"
                            onClick={handleOpenPlatoonModal}
                            disabled={selectedUserIds.length === 0}
                        >
                            Assign Platoon {selectedUserIds.length > 0 && `(${selectedUserIds.length})`}
                        </button>

                        <button
                            type="button"
                            className="btn-batch-archive"
                            onClick={handleBatchArchive}
                            disabled={selectedUserIds.length === 0}
                        >
                            Archive Selected {selectedUserIds.length > 0 && `(${selectedUserIds.length})`}
                        </button>

                        <button
                            type="button"
                            className="btn-batch-delete"
                            onClick={handleBatchDelete}
                            disabled={selectedUserIds.length === 0}
                        >
                            Delete Selected {selectedUserIds.length > 0 && `(${selectedUserIds.length})`}
                        </button>
                    </div>
                )}

                <div className="pagination-buttons">
                    <button
                        className="pagination-btn"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => {
                        const pageNum = index + 1;
                        return (
                            <button
                                key={pageNum}
                                className={`pagination-num-btn ${
                                    currentPage === pageNum ? 'active' : ''
                                }`}
                                onClick={() => goToPage(pageNum)}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        className="pagination-btn"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Platoon Assignment Modal (Admin Only) */}
            {isAdmin && isPlatoonModalOpen && (
                <div className="edit-user-modal-overlay" onClick={handleClosePlatoonModal}>
                    <div className="edit-user-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="edit-user-modal-close" onClick={handleClosePlatoonModal}>
                            &times;
                        </button>
                        
                        <div className="edit-user-modal-header">
                            <h2>Assign Platoon</h2>
                            <p>Select a platoon for {selectedUserIds.length} selected user(s)</p>
                        </div>

                        <form onSubmit={handleSavePlatoonAssignment} className="edit-user-modal-form">
                            <div className="edit-user-input-group">
                                <label>Existing Platoons</label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
                                    {platoons.length > 0 ? (
                                        platoons.map((platoon) => {
                                            const pId = platoon.id || platoon.custom_id;
                                            const pName = platoon.name || `Platoon ${platoon.number || pId}`;
                                            const isChecked = selectedPlatoonId === pId;

                                            return (
                                                <label key={pId} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handlePlatoonCheckboxChange(pId)}
                                                    />
                                                    {pName}
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <p style={{ fontSize: '14px', color: '#666' }}>No platoons available.</p>
                                    )}
                                </div>
                            </div>

                            <div className="edit-user-modal-actions">
                                <button
                                    type="button"
                                    className="edit-user-btn-delete"
                                    onClick={handleClosePlatoonModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="edit-user-btn-save"
                                    disabled={!selectedPlatoonId}
                                >
                                    Confirm Assignment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal (Admin Only) */}
            {isAdmin && isModalOpen && (
                <div className="edit-user-modal-overlay" onClick={handleCloseModal}>
                    <div className="edit-user-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="edit-user-modal-close" onClick={handleCloseModal}>
                            &times;
                        </button>
                        
                        <div className="edit-user-modal-header">
                            <h2>Edit User</h2>
                            <p>Update details for {formData.name}</p>
                        </div>

                        <form onSubmit={handleSave} className="edit-user-modal-form">
                            <div className="edit-user-input-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="edit-user-input-group">
                                <label>Role</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="cadet">Cadet</option>
                                    <option value="leader">Leader</option>
                                </select>
                            </div>

                            <div className="edit-user-input-group">
                                <label>Status</label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="Active">Active</option>
                                    <option value="Archive">Archive</option>
                                </select>
                            </div>

                            <div className="edit-user-input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="edit-user-modal-actions">
                                <button
                                    type="button"
                                    className="edit-user-btn-delete"
                                    onClick={handleDelete}
                                >
                                    Delete User
                                </button>
                                <button
                                    type="submit"
                                    className="edit-user-btn-save"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}