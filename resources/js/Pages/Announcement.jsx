import Layout from "@/Layouts/AuthenticatedLayout";
import Createannouncement from "@/Components/Createannouncement";
import Announcementtab from "@/Components/Announcementtab";

export default function Announcement({ user, announcements = [] }) {
    const renderList = () => (
        announcements.length > 0 ? (
            announcements.map((announcement, index) => (
                <Announcementtab 
                    key={announcement.id || index} 
                    user={user} 
                    announcement={announcement} 
                />
            ))
        ) : (
            <p>No announcements found.</p>
        )
    );

    if (user.role === 'admin') {
        return (
            <Layout pageTitle='Announcement'>
                <div className="createannouncementcontainer">
                    <Createannouncement /> 
                    {renderList()}
                </div>
            </Layout>
        );
    }

    if (user.role === 'leader' || user.role === 'cadet') {
        return (
            <Layout pageTitle='Announcement'>
                <div className="createannouncementcontainer">
                    {renderList()}
                </div>
            </Layout>
        );
    }
}