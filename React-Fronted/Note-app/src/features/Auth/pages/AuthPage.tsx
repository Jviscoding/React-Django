import React, { useEffect, useState } from 'react';
import { Layers, User, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import styles from './authPage.module.css';

interface UserSession {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthCardProps {
  onAuthSuccess: (user: UserSession) => void;
  triggerNotification: (message: string, type: 'success' | 'error') => void;
}

export const AuthPage: React.FC<AuthCardProps> = ({ 
  onAuthSuccess, 
  triggerNotification 
}) => {
  

  




  // --- Form Hooks / States ---
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [authName, setAuthName] = useState<string>("");
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // --- Real Form Submission handler ---
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    // Mocking an async token handshake delay
    setTimeout(() => {
      if (authEmail === "fail@company.com") {
        setAuthError("Authentication handshake failed. Key signature rejected.");
        setAuthLoading(false);
        return;
      }

      const verifiedUser: UserSession = {
        uid: isSignUp ? "usr-gen-" + crypto.randomUUID().slice(0, 8) : "usr-existing",
        email: authEmail,
        displayName: isSignUp ? authName : authEmail.split('@')[0],
      };

      localStorage.setItem('synergy_user', JSON.stringify(verifiedUser));
      onAuthSuccess(verifiedUser);
      triggerNotification(isSignUp ? "Account setup completed!" : "Session authorized successfully.", "success");
      setAuthLoading(false);
    }, 1500);
  };

  
  // --- Sandbox Fast-pass handler ---
  const handleDemoBypass = () => {
    const dummy: UserSession = {
      uid: "guest-dev-" + Math.floor(Math.random() * 1000),
      email: "developer@taskmanager.io",
      displayName: "Demo Developer"
    };
    // v.setItem('synergy_user', JSON.stringify(dummy));
    onAuthSuccess(dummy);
    triggerNotification("Quick simulation bypass active!", "success");
  };

  return (
    <div className={styles.screenWrapper}>
      {/* Decorative Grid Background */}
      <div className={styles.decorativeGrid}></div>
      
      {/* Glow Effects */}
      <div className={styles.glowIndigo}></div>
      <div className={styles.glowPurple}></div>

      {/* Brand Header */}
      <div className={styles.brandHeader}>
        <div className={styles.brandLogoBox}>
          <Layers className={styles.brandLogoIcon} />
        </div>
        <div>
          <h1 className={styles.brandTitle}>
            SynergyTask Pro
          </h1>
          <p className={styles.brandSubtitle}>
            Enterprise Task Management & Interactive REST Engine Console
          </p>
        </div>
      </div>

      {/* Authentication Card Container */}
      <div className={styles.authCard}>
        



        {/* Sign In / Sign Up Toggles */}
        <div className={styles.toggleTrack}>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setAuthError("");
            }}
            className={`${styles.toggleButton} ${!isSignUp ? styles.toggleActive : ''}`}
          >
            Sign In Account
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setAuthError("");
            }}
            className={`${styles.toggleButton} ${isSignUp ? styles.toggleActive : ''}`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className={styles.formElement}>


          {isSignUp && (
            <div className={`${styles.inputGroup} ${styles.animateFade}`}>
              <label className={styles.fieldLabel}>Full Name</label>
              <div className={styles.inputIconWrapper}>
                <User className={styles.fieldIcon} />
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Alexis Dev"
                  className={styles.inputField}
                />
              </div>
            </div>
          )}

          <div className={styles.inputGroup}>
            <label className={styles.fieldLabel}>Email Address</label>
            <div className={styles.inputIconWrapper}>
              <span className={styles.fieldStringIcon}>@</span>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="name@company.com"
                className={styles.inputField}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.fieldLabel}>Secret Key Password</label>
            <div className={styles.inputIconWrapper}>
              <Lock className={styles.fieldIcon} />
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                className={styles.inputField}
              />
            </div>
          </div>

          {isSignUp && (
            <div className={`${styles.inputGroup} ${styles.animateFade}`}>
              <label className={styles.fieldLabel}>Full Name</label>
              <div className={styles.inputIconWrapper}>
                <User className={styles.fieldIcon} />
                <input
                  type="text"
                  required
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="e.g. Alexis Dev"
                  className={styles.inputField}
                />
              </div>
            </div>
          )}




          {/* Error Message Box */}
          {authError && (
            <div className={styles.errorBanner}>
              <AlertCircle className={styles.errorIcon} />
              <span>{authError}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={authLoading}
            className={styles.submitButton}
          >
            {authLoading ? (
              <>
                <Loader2 className={styles.spinner} />
                Generating session token...
              </>
            ) : (
              <>
                <span>{isSignUp ? "Register Account" : "Access Console"}</span>
                <ArrowRight className={styles.buttonArrow} />
              </>
            )}
          </button>
        </form>




        {/* Quick Demo Bypass Access Option */}
        <div className={styles.sandboxDivider}>
          <p className={styles.sandboxLabel}>Or Sandbox evaluation bypass</p>
          <button
            type="button"
            onClick={handleDemoBypass}
            className={styles.sandboxBypassButton}
          >
            Sign In with Instant Demo Account
          </button>
        </div>

      </div>

      {/* Footer Credit */}
      <p className={styles.footerCredits}>
        Enterprise Session Core Version 5.2.0 • SynergyTask Pro Sandbox Suite
      </p>
    </div>
  );
};