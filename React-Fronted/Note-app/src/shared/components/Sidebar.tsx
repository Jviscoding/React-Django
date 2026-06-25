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

  const toggleNavBar = useCallback(() => {
    setNavBarHidden((prev) => !prev);
  }, []);

  const navItems = [
    { to: "/mainpage", label: "Dashboard", icon: Home },
    { to: "/mainpage/brandAndProducts", label: "Calendar", icon: Calendar }
  ];

  const isRouteActive = (itemToPath: string) => {
    if (itemToPath === "/mainpage") {
      return location.pathname === "/mainpage" || location.pathname === "/mainpage/";
    }
    return location.pathname.startsWith(itemToPath);
  };

  return (
    <aside className={`${styles.navBarContainer} ${isNavBarHidden ? styles.minNavBar : ""}`}>
      
      {/* Brand Header with dynamic layout continuity */}
      <div className={styles.siteNameContainer}>
        {isNavBarHidden ? (
          /* Animated Initial/Logo Token when minimized so it looks intentional */
          <div className={styles.brandMinToken}>S</div>
        ) : (
          /* Full typography identity layout */
          <div className={styles.titleContainer}>
            <p>Stockora</p>
          </div>
        )}
        
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

      {/* Main Navigation Track */}
      <div className={styles.linkContainer}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isRouteActive(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              draggable={false}
              className={`${isActive ? styles.navBarSelected : ""} ${
                isNavBarHidden ? styles.toggleLinkHide : ""
              }`}
            >
              <Icon className={styles.icon} />
              <p className={`${styles.navBarLabel} ${isNavBarHidden ? styles.hideNavBarLabel : ""}`}>
                {item.label}
              </p>
            </Link>
          );
        })}

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