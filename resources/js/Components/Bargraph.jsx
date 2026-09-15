import React from 'react';
import * as Recharts from 'recharts';

const STATUS_COLORS = {
    Present: '#16a34a',
    Late: '#f59e0b',   
    Absent: '#dc2626',  
    Excused: '#F8E700',
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
                    
                    <Recharts.XAxis dataKey="platoon" axisLine={false} tickLine={false}/>
                    <Recharts.YAxis allowDecimals={false} axisLine={false} tickLine={false}/>
                    
                    <Recharts.Tooltip />
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