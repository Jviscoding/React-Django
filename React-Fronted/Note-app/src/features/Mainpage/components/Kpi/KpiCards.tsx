import React from 'react';
import styles from './kpiCard.module.css';

interface StatsCardProps {
  
  darkMode?: boolean;
  title: string;
  subMessage: string;
  total: number
}

export const StatsCard = ({ title,subMessage,total, darkMode = false }: StatsCardProps) => {
  return (
    <div className={`${styles.card} ${darkMode ? styles.dark : ''} ${styles.group}`}>
      {/* Decorative Blur Background Blob */}
      <div className={styles.blurBlob}></div>
      
      {/* Card Header Label */}
      <span className={styles.label}>{title}</span>
      
      {/* Values Wrapper */}
      <div className={styles.valueContainer}>
        <span className={styles.count}>{total}</span>
        <span className={styles.subtitle}>{subMessage}</span>
      </div>
    </div>
  );
};