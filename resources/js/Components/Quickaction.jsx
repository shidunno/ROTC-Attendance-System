import Announcementimg from '../assets/announcementimg.svg';
import Reportimg from '../assets/reportimg.svg';
import Letterimg from '../assets/letterimg.svg';
import Manageuserimg from '../assets/manageuserimg.svg';
import { router, usePage } from '@inertiajs/react';

export default function Quickaction({user: propUser}) {

    const { auth } = usePage().props;
    const user = propUser || auth?.user;

    if (!user) {
        return null;
    }

    if (user.role === 'leader') {
        return (
            <>
                <div>
                        <h1 id = 'quickactionheader'>Quick Action</h1>
                        <div className = 'defcontainer' id = 'quickaction'>
                            <div id = 'quickactionside'> 
                                <img src = {Announcementimg}/>
                                <img src = {Reportimg}/>
                                <img src = {Letterimg}/>
                                <img src = {Manageuserimg}/>
                            </div>

                            <div id = 'quickactionbuttoncontainer'>
                                <button className = 'quickactionbutton' onClick = {() => router.visit('/Announcement')} type = 'submit'>View Announcement</button>
                                <button className = 'quickactionbutton' onClick = {() => router.visit('/Reports')} type = 'submit'>View Daily Report</button>
                                <button className = 'quickactionbutton' onClick = {() => router.visit('/Excuseletter')} type = 'submit'>View Excuse Letters</button>
                                <button className = 'quickactionbutton' onClick = {() => router.visit('/Platoon')} type = 'submit'>Manage Cadets</button>
                            </div>
                        </div>
                    </div>
            </>
        );
    }

    if (user.role === 'cadet') {
        return (
            <>
                <div>
                        <h1 id = 'quickactionheader'>Quick Action</h1>
                        <div className = 'defcontainer' id = 'quickaction'>
                            <div id = 'quickactionside'> 
                                <img src = {Announcementimg}/>
                                <img src = {Reportimg}/>
                                <img src = {Letterimg}/>
                                <img src = {Manageuserimg}/>
                            </div>

                            <div id = 'quickactionbuttoncontainer'>
                                <button className = 'quickactionbutton' onClick = {() => router.visit('/Announcement')} type = 'submit'>View Announcement</button>
                                <button className = 'quickactionbutton' onClick = {() => router.visit('/Reports')} type = 'submit'>Generate QR</button>
                                <button className = 'quickactionbutton' onClick = {() => router.visit('/Excuseletter')} type = 'submit'>View Excuse Letters</button>
                                <button className = 'quickactionbutton' onClick = {() => router.visit('/Platoon')} type = 'submit'>Edit Profile</button>
                            </div>
                        </div>
                    </div>
            </>
        );
    }

    if (user.role === 'admin') {
        return (
            <>
                <div>
                        <h1 id = 'quickactionheader'>Quick Action</h1>
                        <div className = 'defcontainer' id = 'quickaction'>
                            <div id = 'quickactionside'> 
                                <img src = {Announcementimg}/>
                                <img src = {Reportimg}/>
                                <img src = {Letterimg}/>
                                <img src = {Manageuserimg}/>
                            </div>

                            <div id = 'quickactionbuttoncontainer'>
                                <button className = 'quickactionbutton' onClick = {() => router.visit('/Announcement')} type = 'submit'>Create Announcement</button>
                                <button className = 'quickactionbutton' onClick = {() => router.visit('/Reports')} type = 'submit'>View Daily Report</button>
                                <button className = 'quickactionbutton' onClick = {() => router.visit('/Excuseletter')} type = 'submit'>View Excuse Letters</button>
                                <button className = 'quickactionbutton' onClick = {() => router.visit('/Usermanagement')} type = 'submit'>Manage Users</button>
                            </div>
                        </div>
                    </div>
            </>
        );
    }
}