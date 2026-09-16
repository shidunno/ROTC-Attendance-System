import Reportstab from "@/Components/Reportstab";
import Searchuser from "@/Components/Searchuser";
import Layout from "@/Layouts/AuthenticatedLayout";

export default function Reports() {

    return(
        <>  
            <Layout pageTitle={'Reports'}>
               <Reportstab/>
            </Layout>
        </>
    );

}

