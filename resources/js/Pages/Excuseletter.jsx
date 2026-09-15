import Searchuser from "@/Components/Searchuser";
import Layout from "@/Layouts/AuthenticatedLayout";
import Excuselettertab from "@/Components/Exuselettertab";

export default function Excuseletter() {

    return (
        <>
            <Layout pageTitle={'Excuse Letter'}>
                <Searchuser/>
                <Excuselettertab/>
            </Layout>
        </>
    );

}