import Layout from "@/Layouts/AuthenticatedLayout";
import Quickaction from "@/Components/Quickaction";
import Attendanceoverview from "@/Components/Attendanceoverview";
import Totalstudents from "@/Components/Totalstudents";
import Bargraph from "@/Components/Bargraph";
import Qrtab from "@/Components/Qrtab";
import Mobiledashboard from "@/Components/Mobiledashboard";

export default function Dashboard({ user, attendanceData = {}, platoonData = [] }) {

    if (!user) {
        return null;
    }

    if (user.role === 'admin') {
        return(
            <>
                <Layout pageTitle = {'Dashboard'}>
                    <div className = 'container1'>
                        <Quickaction/>
                        <Attendanceoverview
                            role={user.role}
                            attendanceData={[
                                { status: 'Present', count: attendanceData?.present ?? 0 },
                                { status: 'Late', count: attendanceData?.late ?? 0 },
                                { status: 'Absent', count: attendanceData?.absent ?? 0 },
                                { status: 'Excused', count: attendanceData?.excused ?? 0 },
                            ]}
                        />
                    </div>
                    <div className = 'container2'>
                        <Totalstudents contTitle='Present' count={attendanceData?.present} />
                        <Totalstudents contTitle='Absent' count={attendanceData?.absent} />
                        <Totalstudents contTitle='Late' count={attendanceData?.late} />
                        <Totalstudents contTitle='Excused' count={attendanceData?.excused} />
                    </div>
                    {/* Admin sees all platoons */}
                    <Bargraph platoonData={platoonData} />
                </Layout>
            </>
        );
    }

    if (user.role === 'cadet') {
        return (
            <Mobiledashboard user = {user}/>
        );
    }

    if (user.role === 'leader') {
        // Filter platoonData to only show the leader's specific platoon
        // (Assumes user.platoon matches the 'platoon' string like '1st Platoon')
        const leaderData = platoonData.filter(item => item.platoon === user?.platoon);

        return(
            <>
                <Layout pageTitle={'Dashboard'}>
                    <div className="container1">
                        <Quickaction user = {user}/>
                        <Attendanceoverview role={user.role}/>
                    </div>
                    <div className='container2'>
                        <Totalstudents contTitle='Present' count={attendanceData?.present} />
                        <Totalstudents contTitle='Absent' count={attendanceData?.absent} />
                        <Totalstudents contTitle='Late' count={attendanceData?.late} />
                        <Totalstudents contTitle='Excused' count={attendanceData?.excused} />
                    </div>
                    {/* Leader sees only their filtered platoon data */}
                    <Bargraph platoonData={leaderData} />
                </Layout>
            </>
        );
    }
}