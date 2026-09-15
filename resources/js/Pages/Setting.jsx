import Layout from "@/Layouts/AuthenticatedLayout";
import Announcementprofileimg from '../assets/announcementprofileimg.svg';
import Arrowimg from '../assets/arrowimg.svg';
import Lockimg from '../assets/lockimg.svg';
import Systemimg from '../assets/systemimg.svg';
import Attendanceimg from '../assets/attendanceimg.svg';
import Statusimg from '../assets/statusimg.svg';
import Profileinformation from "@/Components/Profileinformation";
import { useState } from 'react';
import Changepassword from "@/Components/Changepassword";
import Systeminformation from "@/Components/Systeminformation";
import Attendancerules from "@/Components/Attendancerules";
import Attendancestatus from "@/Components/Attendancestatus";

export default function Setting() {
    const [showProfile, setShowProfile] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showSysteminformation, setShowSysteminformation] = useState(false);
    const [showAttendancerules, setShowAttendancerules] = useState(false);
    const [showAttendancestatus, setShowAttendancestatus] = useState(false);

    // Determine the page title dynamically
    const getPageTitle = () => {
        if (showProfile) return 'Profile Information';
        if (showChangePassword) return 'Change Password';
        if (showSysteminformation) return 'System Information';
        if (showAttendancerules) return 'Attendance Rules';
        if (showAttendancestatus) return 'Attendance Status';
        return 'Setting';
    };

    return (
        <Layout pageTitle={getPageTitle()}>
            {showProfile ? (
                <Profileinformation onBack={() => setShowProfile(false)} />
            ) : showChangePassword ? ( 
                <Changepassword onBack={() => setShowChangePassword(false)} />
            ) : showSysteminformation ? (
                <Systeminformation onBack={() => setShowSysteminformation(false)} />
            ) : showAttendancerules ? (
                <Attendancerules onBack={() => setShowAttendancerules(false)} />
            ) : showAttendancestatus ? (
                <Attendancestatus onBack={() => setShowAttendancestatus(false)} />
            ) : (
                <div className="settingcontainer">
                    <div className="settingcontainer1">
                        <h1>Account Settings</h1>
                        <p>Manage account</p>

                        <div className="settinginnercontainer">
                            <div className="settingmaincontainer">
                                <img src={Announcementprofileimg} alt="Profile Icon" />
                                <div className="settingerinnercontainer1">
                                    <h1 id="h1s">Profile Information</h1>
                                    <p id="h2s">Update your name, email and display photo</p>
                                </div>
                            </div>
                            <img src={Arrowimg} onClick={() => setShowProfile(true)} style={{ cursor: 'pointer' }} alt="Navigate" />
                        </div>

                        <div className="settinginnercontainer">
                            <div className="settingmaincontainer">
                                <img src={Lockimg} alt="Lock Icon" />
                                <div className="settingerinnercontainer1">
                                    <h1 id="h1s">Change Password</h1>
                                    <p id="h2s">Update your password</p>
                                </div>
                            </div>
                            <img src={Arrowimg} onClick={() => setShowChangePassword(true)} style={{ cursor: 'pointer' }} alt="Navigate" />
                        </div>
                    </div>

                    <div className="settingcontainer1">
                        <h1>System Settings</h1>
                        <p>Manage general system information</p>

                        <div className="settinginnercontainer">
                            <div className="settingmaincontainer">
                                <img src={Systemimg} alt="System Icon" />
                                <div className="settingerinnercontainer1">
                                    <h1 id="h1s">System Information</h1>
                                    <p id="h2s">Manage system and information details</p>
                                </div>
                            </div>
                            <img src={Arrowimg} onClick={() => setShowSysteminformation(true)} style={{ cursor: 'pointer' }} alt="Navigate" />
                        </div>
                    </div>

                    <div className="settingcontainer1">
                        <h1>Attendance Settings</h1>
                        <p>Manage attendance preferences</p>

                        <div className="settinginnercontainer">
                            <div className="settingmaincontainer">
                                <img src={Attendanceimg} alt="Attendance Icon" />
                                <div className="settingerinnercontainer1">
                                    <h1 id="h1s">Attendance Rules</h1>
                                    <p id="h2s">Manage time-in, time-out, and late rules</p>
                                </div>
                            </div>
                            <img src={Arrowimg} onClick={() => setShowAttendancerules(true)} style={{ cursor: 'pointer' }} alt="Navigate" />
                        </div>

                        <div className="settinginnercontainer">
                            <div className="settingmaincontainer">
                                <img src={Statusimg} alt="Status Icon" />
                                <div className="settingerinnercontainer1">
                                    <h1 id="h1s">Attendance Status</h1>
                                    <p id="h2s">Manage available attendance statuses</p>
                                </div>
                            </div>
                            <img src={Arrowimg} onClick={() => setShowAttendancestatus(true)} style={{ cursor: 'pointer' }} alt="Navigate" />
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}