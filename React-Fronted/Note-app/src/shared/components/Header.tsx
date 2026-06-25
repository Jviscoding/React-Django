import { Layers, LogOut } from 'lucide-react';
import styles from './header.module.css';

interface HeaderProps {
  geminiApiKey?: string;
  user?: {
    displayName: string;
    email: string;
  };
  handleLogout: () => void;
}

export default function PageHeader({
  geminiApiKey,
  user,
  handleLogout,
}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brandGroup}>
        <div className={styles.logoWrapper}>
          <Layers size={20} />
        </div>

        <div>
          <h1 className={styles.brandTitle}>
            SynergyTask

            <span className={styles.brandBadge}>
              Pro Suite
            </span>
          </h1>

          <p className={styles.brandSubtitle}>
            Enterprise Core Task Management & Engine Console
          </p>
        </div>
      </div>

      <div className={styles.rightSection}>
        {geminiApiKey ? (
          <span
            className={`${styles.statusBadge} ${styles.statusSuccess}`}
          >
            <span className={styles.statusDot} />
            Live Gemini AI Connected
          </span>
        ) : (
          <span
            className={`${styles.statusBadge} ${styles.statusDefault}`}
          >
            <span className={styles.statusDot} />
            Offline Smart Copilot
          </span>
        )}

        {user && (
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {user.displayName}
              </span>

              <span className={styles.userEmail}>
                {user.email}
              </span>
            </div>

            <div className={styles.avatar}>
              {user.displayName.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}