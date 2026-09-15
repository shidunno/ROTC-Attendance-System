import Layout from "@/Layouts/AuthenticatedLayout";
import Usertab from "@/Components/Usertab";
import { usePage } from "@inertiajs/react";

export default function Cadets() {
    // Grab the users directly from Inertia's shared page data
    const { users } = usePage().props;

    return (
        <Layout pageTitle={'Cadets'}>
            <div className="cadetscontainer">
                <Usertab page={'Cadets'} users={users} />
            </div>
        </Layout>
    );
}