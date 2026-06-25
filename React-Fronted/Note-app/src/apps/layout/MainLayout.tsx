import { useEffect, useRef, useState } from "react";
import styles from './mainLayout.module.css'
import { Outlet } from "react-router-dom";
import Sidebar from "../../shared/components/Sidebar";
import { AuthContextProvider } from "../../features/Auth/context/AuthContext";
import { AuthUiContextProvider } from "../../features/Auth/context/AuthUiContext";
import PageHeader from "../../shared/components/Header";


// export const supabase = createClient(
//     import.meta.env.VITE_PUBLIC_SUPABASE_URL,
//     import.meta.env.VITE_PUBLIC_SUPABASE_PUBLISHABLE_KEY)


const MainLayout = () => {
    const [sample, setSample] = useState(false);
    const hasRun = useRef(false);


    return (


        <div className={styles.mainLayout}>


            <PageHeader handleLogout={function (): void {
                throw new Error("Function not implemented.");
            } } user={{displayName:"John Vincent", email: "sample@gmail.com"}}/>   
            <div className={styles.lowerContent}>
                <Sidebar />
                <main className={styles.mainContent}>


                    <div className={styles.contentWrapper}>
                        <Outlet />

                    </div>
                </main>
            </div>

        </div>



    )




}


export default MainLayout;