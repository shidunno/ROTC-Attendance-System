import React from 'react';
import * as Recharts from 'recharts';

const STATUS_COLORS = {
    Present: '#16a34a',
    Late: '#f59e0b',   
    Absent: '#dc2626',  
    Excused: '#F8E700',
};

// Custom Tooltip component to format the header cleanly as "Platoon X" using the number column
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ background: '#fff', padding: '10px 14px', border: '1px solid #ccc', borderRadius: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 5px 0', color: '#333' }}>
                    {label !== 'N/A' && label != null ? `Platoon ${label}` : 'Unknown Platoon'}
                </p>
                {payload.map((entry, index) => (
                    <p key={`item-${index}`} style={{ color: entry.color, margin: '3px 0', fontSize: '14px' }}>
                        {entry.name}: <strong>{entry.value}</strong>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Bargraph({ platoonData = [] }) {
    // Ensure data is always a safe array to prevent Recharts .slice() crashes
    const safeData = Array.isArray(platoonData) ? platoonData : [];

    return (
        <div className="bargraphcontainer">
            <h1 id='attendancepercompanyheader'>Attendance per Company</h1>
            <Recharts.ResponsiveContainer width="98%" height="80%">
                <Recharts.BarChart
                    data={safeData}
                    accessibilityLayer={false}
                    style={{ outline: 'none' }}
                >
                    <Recharts.CartesianGrid strokeDasharray="3 3" vertical={false} />
                    
                    {/* Prepends 'Platoon ' dynamically to the numeric value for the X-Axis ticks */}
                    <Recharts.XAxis 
                        dataKey="platoon" 
                        tickFormatter={(val) => val !== 'N/A' && val != null ? `Platoon ${val}` : 'N/A'}
                        axisLine={false} 
                        tickLine={false}
                    />
                    <Recharts.YAxis allowDecimals={false} axisLine={false} tickLine={false}/>
                    
                    <Recharts.Tooltip content={<CustomTooltip />} />
                    <Recharts.Legend verticalAlign="bottom" height={40} wrapperStyle={{ paddingTop: '20px' }}/>

                    {safeData.length > 0 && (
                        <Recharts.Brush
                            dataKey="platoon"
                            height={30}
                            startIndex={0}
                            endIndex={Math.min(5, safeData.length - 1)}
                        />
                    )}

                    <Recharts.Bar dataKey="Present" fill={STATUS_COLORS.Present} radius={[4, 4, 0, 0]} />
                    <Recharts.Bar dataKey="Late" fill={STATUS_COLORS.Late} radius={[4, 4, 0, 0]} />
                    <Recharts.Bar dataKey="Absent" fill={STATUS_COLORS.Absent} radius={[4, 4, 0, 0]} />
                    <Recharts.Bar dataKey="Excused" fill={STATUS_COLORS.Excused} radius={[4, 4, 0, 0]} />
                </Recharts.BarChart>
            </Recharts.ResponsiveContainer>
        </div>
    );
}