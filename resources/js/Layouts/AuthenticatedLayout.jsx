import profileimg from '../assets/profileimg.svg'
import Sidebar from '../Components/Sidebar'
import Dropdownimg from '../assets/dropdownimg.svg'
import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';

export default function Layout({children, pageTitle}) {

    const [open, setOpen] = useState(false)
    const isMobile = window.innerWidth <= 1200;
    const user = usePage().props.auth?.user;

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/Logout');
    }

    function DesktopDropdown() {
        return (
            <>
                <div className="dropdown-item"><Link>Profile</Link></div>
                <div className="dropdown-item"><Link href='/Logout' onClick={handleLogout}>Logout</Link></div>
            </>
        );
    }

    function MobileDropdown() {
        if (user?.role === 'admin') {
            return (
                <>
                    <div className="dropdown-item"><Link href='/Dashboard'>Dashboard</Link></div>
                    <div className="dropdown-item"><Link href='/Announcement'>Announcement</Link></div>
                    <div className="dropdown-item"><Link href='/Platoon'>Platoon</Link></div>
                    <div className="dropdown-item"><Link href='/Excuseletter'>Excuse Letter</Link></div>
                    <div className='dropdown-item'><Link href ='/Usermanagement'>Users</Link></div>
                    <div className="dropdown-item"><Link href='/Setting'>Setting</Link></div>
                    <div className="dropdown-item"><Link href='/Logout' onClick={handleLogout}>Logout</Link></div>
                </>
            );  
        }

        if (user?.role === 'leader') {
            return (
                <>
                    <div className="dropdown-item"><Link href='/Dashboard'>Dashboard</Link></div>
                    <div className="dropdown-item"><Link href='/Announcement'>Announcement</Link></div>
                    <div className="dropdown-item"><Link href='/Platoon'>Platoon</Link></div>
                    <div className="dropdown-item"><Link href='/Excuseletter'>Excuse Letter</Link></div>
                    <div className='dropdown-item'><Link href ='/Usermanagement'>Users</Link></div>
                    <div className="dropdown-item"><Link href='/Setting'>Setting</Link></div>
                    <div className="dropdown-item"><Link href='/Logout' onClick={handleLogout}>Logout</Link></div>
                </>
            );
        }

        if (user?.role === 'cadet') {
            return (
                <>
                    <div className="dropdown-item"><Link href='/Dashboard'>Dashboard</Link></div>
                    <div className="dropdown-item"><Link href='/Announcement'>Announcement</Link></div>    
                    <div className="dropdown-item"><Link href='/Excuseletter'>Excuse Letter</Link></div>
                    <div className="dropdown-item"><Link href='/Setting'>Setting</Link></div>
                    <div className="dropdown-item"><Link href='/Logout' onClick={handleLogout}>Logout</Link></div>
                </>
            );
        }
    }

    return(
        <>
        <div style = {{display: 'flex', width: '100vw', height: '100vh'}}>
            <div className = 'sidebar'>
                <Sidebar/>
            </div>

            <div style = {{display: 'flex', flexDirection: 'column', flex: 1}}>
                <div className = 'topbar'>
                    <h1>{pageTitle}</h1>
                        <div style = {{display: 'flex', gap: '0.5vw', justifyContent: 'center', alignItems: 'center'}}>
                            <img src = {user?.profile_photo_path ? `/storage/${user.profile_photo_path}` : profileimg} alt="Profile"></img>
                            <div style = {{display: 'flex', flexDirection: 'column', lineHeight: '0.3rem', paddingTop: '1vw'}}>
                                <h2 id = 'adminname'>{user?.name || 'User'}</h2>
                                <p id = 'userrole'>{user?.role ? user.role.toUpperCase() : 'Guest'}</p>
                            </div>
                            <div>
                                <img src = {Dropdownimg} id = 'dropdown' onClick={() => setOpen(!open)}></img>

                                {open && (
                                    <div className="dropdown">
                                        {isMobile ? <MobileDropdown /> : <DesktopDropdown />}
                                    </div>
                                )}
                            </div>
                        </div>         
                </div>  
                <div style = {{flex: 1, width: '100%', overflowY: 'auto'}}>
                    {children}
                </div>
            </div>
        </div>
        </>
    );

}