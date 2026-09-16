import React, { useState } from 'react';
import Excelimg from '../assets/excelimg.svg';
import Downloadimg from '../assets/downloadimg.svg';
import { Link } from '@inertiajs/react';

export default function Reportstab() {
    const [selectedMonth, setSelectedMonth] = useState('09');
    const [selectedYear, setSelectedYear] = useState('2026');

    const monthNames = {
        '01': 'January', '02': 'February', '03': 'March', '04': 'April',
        '05': 'May', '06': 'June', '07': 'July', '08': 'August',
        '09': 'September', '10': 'October', '11': 'November', '12': 'December'
    };

    // List of active years where your system has records
    const availableYears = ['2026'];

    const handleDownload = () => {
        // Optional safety check: prevent invalid future years
        if (parseInt(selectedYear) > 2026) {
            alert("No records available for future years.");
            return;
        }

        window.location.href = `/reports/export-excel?month=${selectedMonth}&year=${selectedYear}`;
    };

    return (
        <>
            {/* Month and Year Dropdowns */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2vh', marginBottom: '15px', gap: '10px' }}>
                <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{ 
                        padding: '8px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid #ccc', 
                        backgroundColor: '#fff', 
                        color: '#333',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>

                <select 
                    value={selectedYear} 
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{ 
                        padding: '8px 12px', 
                        borderRadius: '6px', 
                        border: '1px solid #ccc', 
                        backgroundColor: '#fff', 
                        color: '#333',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    {availableYears.map((yr) => (
                        <option key={yr} value={yr}>{yr}</option>
                    ))}
                </select>
            </div>

            {/* Original container layout */}
            <div style = {{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div id = 'excuselettercontainer'>
                    <div id = 'excuseletterinnercontainer'>
                        <div id = 'excuseletterinnercontainer1'>
                            <img src = {Excelimg} alt="Excel" />
                            <div className='excuseletterinnercontainer3'> 
                                <Link style = {{textDecoration: 'none', color: '#467646'}}>
                                    {monthNames[selectedMonth]} {selectedYear} Report
                                </Link>
                                <p>Excel File</p>
                            </div>
                        </div>
                        <div id = 'excuseletterinnercontainer2' onClick={handleDownload} style={{ cursor: 'pointer' }}>
                            <img src = {Downloadimg} alt="Download" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}