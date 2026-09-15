import Usercountimg from '../assets/usercountimg.svg'
import { Link, usePage } from '@inertiajs/react';
import Announcementprofileimg from '../assets/announcementprofileimg.svg'

export default function Usermanagementnumber({userCounts, recentScans = []}) {

    const { auth } = usePage().props;
    const user = auth.user;

    if (user.role === 'leader') {
        return (
            <>
            <h1 id = 'recentlyscannedheader'>Recently Scanned</h1>
                <div className='logsoutercontainer'> 
                    <div className='logscontainer'> 
                        {recentScans && recentScans.length > 0 ? (
                            recentScans.map((scan, index) => (
                                <div className='logsmaincontainer' key={index}>
                                    <div style={{display: 'flex'}}>
                                        <img src={Announcementprofileimg} alt="Profile" />
                                        <div className='logsinnercontainer1'> 
                                            <span>{scan.user?.name || 'Name'}</span>
                                            <p>{scan.user?.email || 'surname.name@clsu2.edu.ph'}</p>
                                        </div> 
                                    </div> 

                                    <div className='logsinnercontainer2'>  
                                        <p>Signed In: {scan.time_in ?? 'time'}</p>
                                        <p>Signed Out: {scan.time_out ?? 'time'}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ padding: '20px', color: '#666' }}>No recent scans found.</p>
                        )}
                    </div>
                </div>
            </>
        )
    }

    if (user.role === 'admin') {
        return (
            <>
                <div className="usermanagementcontainer">
                    <div className="usermanagementinnercontainer">
                        <div className="usermanagementinnercontainer1">
                            <p>Total users</p> 
                            <img src = {Usercountimg}></img>
                        </div>
                        <h1>{userCounts?.total ?? 0}</h1>
                    </div>

                    <div id ='usercontaineractive' className="usermanagementinnercontainer">
                        <div className="usermanagementinnercontainer1">
                            <p>Active users</p>
                            <img src = {Usercountimg}></img>
                        </div>
                        <h1>{userCounts?.active ?? 0}</h1>
                    </div>

                    <div className="usermanagementinnercontainer">
                        <div className="usermanagementinnercontainer1">
                            <p>Archived users</p>
                            <img src = {Usercountimg}></img>
                        </div>
                        <h1>{userCounts?.archive ?? 0}</h1>
                    </div>
                </div>
            </>
        );
    }   
}