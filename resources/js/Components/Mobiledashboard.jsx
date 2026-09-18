import React, { useState } from "react";
import { router } from "@inertiajs/react";
import Layout from "@/Layouts/AuthenticatedLayout";

import Qrimg from "../assets/qrimg.svg";
import Attendanceimg from "../assets/attendanceimgdashboard.svg";
import Announcementimg from "../assets/announcementimgdashboard.svg";
import Excuseletterimg from "../assets/excuseletterimgdashboard.svg";
import Chatbotimg from "../assets/chatbotimg.svg";
import Settingimg from "../assets/settingimgdashboard.svg";

import Qrdashboard from "./Qrdashboard";

export default function Mobiledashboard({ user }) {
    const [currentView, setCurrentView] = useState("dashboard");

    if (currentView === "qr") {
        return (
            <Qrdashboard
                user={user}
                onBack={() => setCurrentView("dashboard")}
            />
        );
    }

    return (
        <Layout pageTitle={"Dashboard"}>
            <div className="cadet-dashboard-container">

                {/* Header Greeting */}
                <div className="cadet-header">
                    <p className="welcome-text">Welcome back,</p>

                    <h1 className="student-name">
                        {user?.name || "Student Name!"}
                    </h1>
                </div>

                {/* Status Card */}
                <div className="attendance-status-card">
                    <div className="status-left">
                        <span className="status-label">
                            Today's Attendance
                        </span>

                        <h2 className="status-value">
                            {user?.todayStatus || "Present"}
                        </h2>
                    </div>

                    <div className="status-right">
                        <span className="status-label">
                            Time-In
                        </span>

                        <h2 className="status-time">
                            {user?.timeIn || "6:45 AM"}
                        </h2>
                    </div>
                </div>

                {/* Action Grid */}
                <div className="cadet-grid">

                    <div
                        className="cadet-card"
                        onClick={() => setCurrentView("qr")}
                    >
                        <img src={Qrimg} alt="QR Code" />

                        <h3>QR Code</h3>

                        <p>Generate QR Code</p>
                    </div>

                    <div
                        className="cadet-card"
                        onClick={() => router.visit("/my-attendance")}
                    >
                        <img src={Attendanceimg} alt="Attendance" />

                        <h3>Attendance</h3>

                        <p>View attendance records</p>
                    </div>

                    <div
                        className="cadet-card"
                        onClick={() => router.visit("/Announcement")}
                    >
                        <img src={Announcementimg} alt="Announcement" />

                        <h3>Announcement</h3>

                        <p>View announcements</p>
                    </div>

                    {/* FIXED: Uses router.visit so it hits Laravel and loads submission history */}
                    <div
                        className="cadet-card"
                        onClick={() => router.visit("/Excuseletter")}
                    >
                        <img src={Excuseletterimg} alt="Excuse Letter" />

                        <h3>Excuse Letter</h3>

                        <p>Submit an excuse letter</p>
                    </div>

                    <div
                        className="cadet-card"
                        onClick={() => setCurrentView("chatbot")}
                    >
                        <img src={Chatbotimg} alt="ChatBot" />

                        <h3>ChatBot</h3>

                        <p>Ask about ROTC</p>
                    </div>

                    <div
                        className="cadet-card"
                        onClick={() => router.visit("/Setting")}
                    >
                        <img src={Settingimg} alt="Settings" />

                        <h3>Settings</h3>

                        <p>Manage your account</p>
                    </div>

                </div>
            </div>
        </Layout>
    );
}