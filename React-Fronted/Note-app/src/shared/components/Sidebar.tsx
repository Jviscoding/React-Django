import React, { useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Calendar,
  LogOut,
  Menu
} from "lucide-react";
import { useAuthContext } from "../../features/Auth/hooks/useAuthContext.ts";
import styles from './sidebar.module.css';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { authManager } = useAuthContext();
  const [isNavBarHidden, setNavBarHidden] = useState<boolean>(false);
  const [selectedNav, setSelectedNav] = useState<string>("Calendar");

  const toggleNavBar = useCallback(() => {
    setNavBarHidden((prev) => !prev);
  }, []);

  const navItems = [
    { to: "/mainpage", label: "Dashboard", icon: Home },
    { to: "/mainpage/calendar", label: "Calendar", icon: Calendar }
  ];



  return (
    <aside className={`${styles.navBarContainer} ${isNavBarHidden ? styles.minNavBar : ""}`}>

      {isNavBarHidden ?
        <div className={styles.collapsedMenuBtn}>
          <i
            onClick={toggleNavBar}
            className={`${styles.menuBtnContainer}`}
            role="button"
            aria-label="Toggle Navigation Control Menu"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && toggleNavBar()}
          >
            <Menu className={styles.icon} />
          </i>
        </div> :
        ""
      }

      {/* Main Navigation Track */}
      <div className={styles.linkContainer}>
        {navItems.map((item) => {
          const Icon = item.icon;

          return item.label === "Dashboard" ?


            <div
              className={styles.dashboardMenu}
              key={item.to}
            >

              <Link
                onClick={() => setSelectedNav(item.label)}
                key={item.to}
                to={item.to}
                draggable={false}
                className={`${selectedNav === item.label ? styles.navBarSelected : ""} ${isNavBarHidden ? styles.toggleLinkHide : ""
                  }`}
              >
                <Icon className={styles.icon} />
                <p className={`${styles.navBarLabel} ${isNavBarHidden ? styles.hideNavBarLabel : ""}`}>
                  {item.label}
                </p>
              </Link>
              {isNavBarHidden ? ""
                :
                <i
                  onClick={toggleNavBar}
                  className={`${styles.menuBtnContainer} ${styles.showMenu}`}
                  role="button"
                  aria-label="Toggle Navigation Control Menu"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleNavBar()}
                >
                  <Menu className={styles.icon} />
                </i>
              }


            </div>

            :

            // when dashboard button was not set
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSelectedNav(item.label)}
              draggable={false}
              className={`${selectedNav === item.label ? styles.navBarSelected : ""} ${isNavBarHidden ? styles.toggleLinkHide : ""
                }`}
            >
              <Icon className={styles.icon} />
              <p className={`${styles.navBarLabel} ${isNavBarHidden ? styles.hideNavBarLabel : ""}`}>
                {item.label}
              </p>
            </Link>

        }


        )}

        {/* Global Security Logout Interface */}
        <button
          type="button"
          onClick={() => authManager.signOut()}
          className={`${styles.logoutBtn} ${isNavBarHidden ? styles.toggleLinkHide : ""}`}
        >
          <LogOut className={styles.icon} />
          <p className={`${styles.navBarLabel} ${isNavBarHidden ? styles.hideNavBarLabel : ""}`}>
            Logout
          </p>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


/***
 * 
      <div className={styles.siteNameContainer}>
        
        <i
          onClick={toggleNavBar}
          role="button"
          aria-label="Toggle Navigation Control Menu"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && toggleNavBar()}
        >
          <Menu className={styles.icon} />
        </i>
      </div>
 */