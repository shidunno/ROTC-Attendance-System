import {Link, router, usePage} from "@inertiajs/react";
import {useState} from "react";
import Userprofileimg from '../assets/userprofileimg.svg';
import Dashboardimg from '../assets/dashboardimg.svg'
import Announcementimg from '../assets/announcementsidebarimg.svg'
import Studentimg from '../assets/studentimg.svg'
import Platoonimg from '../assets/platoonimg.svg'
import Excuseletterimg from '../assets/excuseletterimg.svg'
import Settingimg from '../assets/settingimg.svg'
import Reportsimg from '../assets/reportsidebarimg.svg'
import Usermanagementimg from '../assets/usermanagementimg.svg'

export default function Sidebar() {
    const [loading, setLoading] = useState(false);
    const {auth} = usePage().props;
    const user = auth?.user;

    const handleClick = (e, url) => {
        e.preventDefault(); 

        if (loading) return;
        setLoading(true);

        router.visit(url, {
            onFinish: () => setLoading(false),
        });
    };

    if (user.role === 'leader') {
        return (
            <div id = 'sidebarlink' className={`sidebar ${loading ? 'pointer-events-none opacity-50' : ''}`}>
                <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <img src={Userprofileimg} alt="User Profile" />
                    <h1 style={{ color: 'white', fontSize: '2vw', textAlign: 'center' }}>ROTC Attendance System</h1>
                    <li><Link href="/Dashboard" onClick={(e) => handleClick(e, "/Dashboard")}><img src={Dashboardimg}></img><p>Dashboard</p></Link></li>
                    <li><Link href="/Announcement" onClick={(e) => handleClick(e, "/Announcement")}><img src={Announcementimg}></img><p>Announcement</p></Link></li>
                    <li><Link href="/Platoon" onClick={(e) => handleClick(e, "/Platoon")}><img src={Platoonimg}></img><p>Platoon</p></Link></li>
                    <li><Link href="/Excuseletter" onClick={(e) => handleClick(e, "/Excuseletter")}><img src={Excuseletterimg}></img><p>Excuse Letter</p></Link></li>
                    <li><Link href="/Reports" onClick={(e) => handleClick(e, "/Reports")}><img src={Reportsimg}></img><p>Reports</p></Link></li>
                    <li><Link href ='Usermanagement' onClick={(e) => handleClick(e, '/Usermanagement')}><img src = {Usermanagementimg}></img><p>User Management</p></Link></li>
                    <li><Link href="/Setting" onClick={(e) => handleClick(e, "/Setting")}><img src={Settingimg}></img><p>Setting</p></Link></li>
                </ul>
            </div>
        );
    }

    if (user.role === 'cadet') {
        return (
             <div id = 'sidebarlink' className={`sidebar ${loading ? 'pointer-events-none opacity-50' : ''}`}>
                <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <img src={Userprofileimg} alt="User Profile" />
                    <h1 style={{ color: 'white', fontSize: '2vw', textAlign: 'center' }}>ROTC Attendance System</h1>
                    <li><Link href="/Dashboard" onClick={(e) => handleClick(e, "/Dashboard")}><img src={Dashboardimg}></img><p>Dashboard</p></Link></li>
                    <li><Link href="/Announcement" onClick={(e) => handleClick(e, "/Announcement")}><img src={Announcementimg}></img><p>Announcement</p></Link></li>
                    <li><Link href="/Excuseletter" onClick={(e) => handleClick(e, "/Excuseletter")}><img src={Excuseletterimg}></img><p>Excuse Letter</p></Link></li>
                    <li><Link href="/Setting" onClick={(e) => handleClick(e, "/Setting")}><img src={Settingimg}></img><p>Setting</p></Link></li>
                </ul>
            </div>
        );
    }

    if (user.role === 'admin') {
        return (
            <div id = 'sidebarlink' className={`sidebar ${loading ? 'pointer-events-none opacity-50' : ''}`}>
                <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                    <img src={Userprofileimg} alt="User Profile" />
                    <h1 style={{ color: 'white', fontSize: '2vw', textAlign: 'center' }}>ROTC Attendance System</h1>
                    <li><Link href="/Dashboard" onClick={(e) => handleClick(e, "/Dashboard")}><img src={Dashboardimg}></img><p>Dashboard</p></Link></li>
                    <li><Link href="/Announcement" onClick={(e) => handleClick(e, "/Announcement")}><img src={Announcementimg}></img><p>Announcement</p></Link></li>
                    <li><Link href="/Excuseletter" onClick={(e) => handleClick(e, "/Excuseletter")}><img src={Excuseletterimg}></img><p>Excuse Letter</p></Link></li>
                    <li><Link href="/Reports" onClick={(e) => handleClick(e, "/Reports")}><img src={Reportsimg}></img><p>Reports</p></Link></li>
                    <li><Link href ='Usermanagement' onClick={(e) => handleClick(e, '/Usermanagement')}><img src = {Usermanagementimg}></img><p>User Management</p></Link></li>
                    <li><Link href="/Setting" onClick={(e) => handleClick(e, "/Setting")}><img src={Settingimg}></img><p>Setting</p></Link></li>
                </ul>
            </div>
        );
    }
}