import { Link } from "react-router-dom";
import styles from './sidebar.module.css'

import { useContext, useEffect, useRef, useState } from "react";
import {
    HomeIcon,
        ChartBarIcon,
    CurrencyDollarIcon,
    CogIcon,
} from "@heroicons/react/24/outline";
import  {useAuthContext}  from "../../features/Auth/hooks/useAuthContext.ts";



const Sidebar = () => {



    const linkRef = useRef<HTMLAnchorElement>(null);
    const [activePage, setActivePage] = useState("/dashboard");
    const [isNavBarHidden, setNavBarHidden] = useState(() => false)
    const {authManager} = useAuthContext()

    const navItems = [
        {
            to: "/mainpage",
            label: "Dashboard",
            icon: HomeIcon,
            title: "Brand & Products",
            activePath: "/dashboard",
        },
        {
            to: "/mainpage/brandAndProducts",
            label: "Brand & Products",
            icon: HomeIcon,
            title: "Brand & Products",
            activePath: "/",
        },
        {
            to: "/mainpage/analytics",
            label: "Analytics",
            icon: ChartBarIcon,
            title: "Analytics",
            activePath: "/analytics",
        },
        {
            to: "/budgetSetting",
            label: "Budget Settings",
            icon: CurrencyDollarIcon,
            title: "Budget Settings",
            activePath: "/budgetsettings",
        },
        {
            to: "/AccountSettings",
            label: "Account Settings",
            icon: CogIcon,
            title: "Account Settings",
            activePath: "/accountsettings",
        },
    ];
    const logoutItem = {
        label: "Logout",
        icon: "",
        activePath: "/logout",
    };


    useEffect(() => {

        // initial title header - dashboard
        // setTitleHeader("Brand & Products");
        setActivePage("/dashboard")

        // linkRef.current?.classList.add(`${styles.navBarSelected}`);
        // // window.location.pathname = "/"

        // console.log(linkRef.current)
    }, [])

    return (
        <aside className={`${styles.navBarContainer} ${isNavBarHidden ? styles.minNavBar : ""}`}>
         
            <div className={styles.linkContainer}>
                {navItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            draggable={false}
                            onClick={() => {
                                // popupManager.setTitleHeader(item.title);
                                setActivePage(item.activePath);
                            }}
                            className={`${activePage === item.activePath ? styles.navBarSelected : ""} ${isNavBarHidden ? styles.toggleLinkHide : ""}`}
                        >
                            <Icon className={styles.icon} />
                            <p className={`${styles.navBarLabel} ${isNavBarHidden ? styles.hideNavBarLabel : ""}`}>{item.label}</p>
                        </Link>
                    );
                })}
                <button
                    onClick={() => {
                        setActivePage(logoutItem.activePath);
                        authManager.signOut()
                    }}
                    className={`${styles.logoutBtn} ${styles.pushToBottom} ${activePage === logoutItem.activePath ? styles.navBarSelected : ""} ${isNavBarHidden ? styles.toggleLinkHide : ""}`}
                >
                    <div className={styles.icon} />
                    <p className={`${styles.navBarLabel} ${styles.navBarLabel} ${isNavBarHidden ? styles.hideNavBarLabel : ""}`}>Logout</p>
                </button>
            </div>
        </aside>
    )

    function toggleNavBar() {
        setNavBarHidden(!isNavBarHidden)
    }

}








export default Sidebar;



/**
 
    <div className={styles.siteNameContainer}>
                <div className={`${styles.titleContainer} ${isNavBarHidden ? styles.hideNavBarLabel : ""}`}>
                    <p>Stockora</p>

                </div>
                <i onClick={() => { toggleNavBar() }} > </i>
            </div>
 */