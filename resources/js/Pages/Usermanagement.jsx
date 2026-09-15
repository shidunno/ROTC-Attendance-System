import Layout from "@/Layouts/AuthenticatedLayout";
import Usermanagementheader from "@/Components/Usermanagementheader";
import Usermanagementnumber from "@/Components/Usermanagementnumber";
import Usertable from "@/Components/Usertable";
import { router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Usermanagement({ users = [], platoons = [], userCounts, filters = {} }) {
    // Get the authenticated user from Inertia page props
    const { auth } = usePage().props;
    const currentUser = auth.user;

    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [status, setStatus] = useState(filters.status || '');

    // Centralized function to trigger Inertia GET requests with active filters
    const applyFilters = (newFilters) => {
        router.get('/Usermanagement', newFilters, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearchChange = (value) => {
        setSearch(value);
        applyFilters({ search: value, role, status });
    };

    const handleRoleChange = (value) => {
        setRole(value);
        applyFilters({ search, role: value, status });
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        applyFilters({ search, role, status: value });
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
                    users={users}
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