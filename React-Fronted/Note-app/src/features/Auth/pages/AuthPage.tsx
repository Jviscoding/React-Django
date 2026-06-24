import React, { useEffect, useState } from 'react';
import { Layers, User, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import styles from './authPage.module.css';
import { useUiAuthContext } from '../hooks/useUiContext';

interface UserSession {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthCardProps {
  onAuthSuccess: (user: UserSession) => void;
  triggerNotification: (message: string, type: 'success' | 'error') => void;
}

export const AuthPage = ({ onAuthSuccess, triggerNotification }: AuthCardProps) => {

  const { authUiManager } = useUiAuthContext()

  // --- Real Form Submission handler ---
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (authUiManager.isSignUp) {
      authUiManager.initSendSignUpCred();
    } else {
      authUiManager.initSendSignInCred();
    }

    // authUiManager.setAuthError("");
    // authUiManager.setAuthLoading(true);

  };


  useEffect(() => {


    // when leave this page, reset all states
    return () => {


      authUiManager.setAuthError("");
      authUiManager.setIsSuccess(false);
      authUiManager.setAuthEmail("");
      authUiManager.setAuthPassword("");
      authUiManager.setAuthConfirmPass("");
      authUiManager.setAuthName("");
      authUiManager.setAuthLoading(false);
      authUiManager.setIsSignUp(false);
    }
  }, [])


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
              authUiManager.setIsSignUp(false);
              authUiManager.setAuthError("");
            }}
            className={`${styles.toggleButton} ${!authUiManager.isSignUp ? styles.toggleActive : ''}`}
          >
            Sign In Account
          </button>
          <button
            type="button"
            onClick={() => {
              authUiManager.setIsSignUp(true);
              authUiManager.setAuthError("");
            }}
            className={`${styles.toggleButton} ${authUiManager.isSignUp ? styles.toggleActive : ''}`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleAuthSubmit} className={styles.formElement}>


          <div className={`${styles.animateGroup} ${authUiManager.isSignUp ? styles.open : ""}`}>
            <label className={styles.fieldLabel}>Userame</label>
            <div className={styles.inputIconWrapper}>
              <User className={styles.fieldIcon} />
              <input
                type="text"
                required={authUiManager.isSignUp}
                value={authUiManager.authName}
                onChange={(e) => authUiManager.setAuthName(e.target.value)}
                placeholder="••••••••••••"
                className={styles.inputField}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.fieldLabel}>Email Address</label>
            <div className={styles.inputIconWrapper}>
              <span className={styles.fieldStringIcon}>@</span>
              <input
                type="email"
                required
                value={authUiManager.authEmail}
                onChange={(e) => authUiManager.setAuthEmail(e.target.value)}
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
                value={authUiManager.authPassword}
                onChange={(e) => authUiManager.setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                className={styles.inputField}
              />
            </div>
          </div>

          <div className={`${styles.animateGroup} ${authUiManager.isSignUp ? styles.open : ""}`}>
            <label className={styles.fieldLabel}>Confirm Password</label>
            <div className={styles.inputIconWrapper}>
              <User className={styles.fieldIcon} />
              <input
                type="password"
                required={authUiManager.isSignUp}
                value={authUiManager.authConfirmPass}
                onChange={(e) => authUiManager.setAuthConfirmPass(e.target.value)}
                placeholder="••••••••••••"
                className={styles.inputField}
              />
            </div>
          </div>





          {/* Error Message Box */}
          {authUiManager.authError && (
            <div className={`${styles.errorBanner} ${authUiManager.isSuccess ? styles.success : styles.error}`}>
              <AlertCircle className={styles.errorIcon} />
              <span>{authUiManager.authError}</span>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={authUiManager.authLoading}
            className={styles.submitButton}
          >
            {authUiManager.authLoading ? (
              <>
                <Loader2 className={styles.spinner} />
                Generating session token...
              </>
            ) : (
              <>
                <span>{authUiManager.isSignUp ? "Register Account" : "Access Console"}</span>
                <ArrowRight className={styles.buttonArrow} />
              </>
            )}
          </button>
        </form>

      </div>

      {/* Footer Credit */}
      <p className={styles.footerCredits}>
        Enterprise Session Core Version 5.2.0 • SynergyTask Pro Sandbox Suite
      </p>
    </div>
  );
};