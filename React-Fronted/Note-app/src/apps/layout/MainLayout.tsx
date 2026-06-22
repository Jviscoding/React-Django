import { useEffect, useRef, useState } from "react";
import styles from './mainLayout.module.css'
import { Outlet } from "react-router-dom";
import Sidebar from "../../shared/components/Sidebar";


// export const supabase = createClient(
//     import.meta.env.VITE_PUBLIC_SUPABASE_URL,
//     import.meta.env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY)


const MainLayout = () => {
    const [sample, setSample] = useState(false);
    const hasRun = useRef(false);


    return (



        <div className={styles.mainLayout}>


            <Sidebar/>  
            <main className={styles.mainContent}>

                
 
                <div className={styles.contentWrapper}>
                        <Outlet />

                </div>
            </main>


        </div>

    )




}


export default MainLayout;