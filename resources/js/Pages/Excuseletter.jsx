import Searchuser from "@/Components/Searchuser";
import Layout from "@/Layouts/AuthenticatedLayout";
import Excuselettertab from "@/Components/Exuselettertab";
import { usePage } from '@inertiajs/react'; // 1. Import usePage

export default function Excuseletter() {
    // 2. Grab the letters prop sent from your Laravel controller
    const { letters } = usePage().props;

    return (
        <>
            <Layout pageTitle={'Excuse Letter'}>
                <Searchuser />
                
                {/* 3. Loop through the letters array and pass each one as a prop */}
                <div style={{ marginTop: '20px' }}>
                    {letters && letters.length > 0 ? (
                        letters.map((letter) => (
                            <Excuselettertab key={letter.id} letter={letter} />
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#666' }}>No excuse letters found.</p>
                    )}
                </div>
            </Layout>
        </>
    );
}