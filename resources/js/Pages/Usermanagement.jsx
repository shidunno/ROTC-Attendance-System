import Layout from "@/Layouts/AuthenticatedLayout";
import Usermanagementheader from "@/Components/Usermanagementheader";
import Usermanagementnumber from "@/Components/Usermanagementnumber";
import Usertable from "@/Components/Usertable";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Usermanagement({ users = [], platoons = [], userCounts }) {
    // Get the authenticated user from Inertia page props
    const { auth } = usePage().props;
    const currentUser = auth.user;

    const [search, setSearch] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('');

    // Filter the users array entirely in the browser (Instant, 0ms latency)
    const filteredUsers = users.filter((user) => {
        const matchesSearch = 
            search === '' || 
            user.name?.toLowerCase().includes(search.toLowerCase()) || 
            user.id_number?.toString().toLowerCase().includes(search.toLowerCase());

        const matchesRole = role === '' || user.role === role;
        const matchesStatus = status === '' || user.status === status;

        return matchesSearch && matchesRole && matchesStatus;
    });

    // Handlers only update local state—no server requests!
    const handleSearchChange = (value) => {
        setSearch(value);
    };

    const handleRoleChange = (value) => {
        setRole(value);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
    };

    const handleUpdateUser = (userData) => {
        router.put(`/Usermanagement/${userData.id}`, userData, { preserveScroll: true });
    };

    const handleDeleteUser = (userId) => {
        router.delete(`/Usermanagement/${userId}`, { preserveScroll: true });
    };

    const handleBatchDelete = (userIds) => {
        router.post('/Usermanagement/batch-delete', { ids: userIds }, { preserveScroll: true });
    };

    const handleBatchArchive = (userIds) => {
        router.post('/Usermanagement/batch-archive', { ids: userIds }, { preserveScroll: true });
    };

    // Platoon Handlers
    const handleStorePlatoon = (platoonData) => {
        router.post(route('platoons.store'), platoonData, {
            preserveScroll: true,
        });
    };

    const handleAssignPlatoon = (selectedUserIds, platoonId) => {
        router.patch('/users/assign-platoon', {
            user_ids: selectedUserIds,
            platoon_id: platoonId,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <Layout pageTitle={'Users'}>
            <div className="usermanagementmain">
                <Usermanagementheader 
                    search={search} 
                    role={role}
                    status={status}
                    onSearchChange={handleSearchChange} 
                    onRoleChange={handleRoleChange}
                    onStatusChange={handleStatusChange}
                />
                <Usermanagementnumber userCounts={userCounts} />
                <Usertable
                    users={filteredUsers} // Pass the instantly filtered array here!
                    platoons={platoons}
                    currentUser={currentUser}
                    onUpdateUser={handleUpdateUser}
                    onDeleteUser={handleDeleteUser}
                    onBatchDelete={handleBatchDelete}
                    onBatchArchive={handleBatchArchive}
                    onStorePlatoon={handleStorePlatoon}
                    onAssignPlatoon={handleAssignPlatoon}
                />
            </div>
        </Layout>
    );
}