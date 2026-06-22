import React from 'react';
import { TrendingUp } from 'lucide-react';
import styles from './completionRate.module.css';

interface CompletionCardProps {
  stats: {
    completionRate: number;
  };
  darkMode?: boolean;
}

export const CompletionCard = ({ stats, darkMode = false }: CompletionCardProps) => {
  // Clamp value between 0 and 100 just to be safe for inline styling bounds
  const completionPercentage = Math.min(Math.max(stats.completionRate, 0), 100);

  return (
    <div className={`${styles.card} ${darkMode ? styles.dark : ''}`}>
      {/* Header Container */}
      <div className={styles.header}>
        <span className={styles.label}>Completion Rate</span>
        <TrendingUp size={16} className={styles.trendIcon} />
      </div>
      
      {/* Metrics & Progress Bar Section */}
      <div className={styles.contentBody}>
        <div className={styles.valueContainer}>
          <span className={styles.percentageText}>{completionPercentage}%</span>
        </div>
        
        {/* Progress Track Background */}
        <div className={styles.progressTrack}>
          {/* Animated Fill Meter */}
          <div 
            className={styles.progressFill}
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};