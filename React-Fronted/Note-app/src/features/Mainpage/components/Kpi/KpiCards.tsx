import React from 'react';
import styles from './kpiCard.module.css';
import { AlertCircle, CheckCircle, Clock, Folder } from 'lucide-react';


const icons = [Folder, Clock, CheckCircle, AlertCircle] as const

interface StatsCardProps {

  darkMode?: boolean;
  title: string;
  subMessage: string;
  total: number;
  icon: (typeof icons)[number]
  iconStyle: IconStyle
}

export const iconStyles = [
    styles.statIconIndigo,
    styles.statIconAmber,
    styles.statIconGreen,
    styles.statIconRed,
] as const;

type IconStyle = (typeof iconStyles)[number];



export const StatsCard = ({ title, subMessage, total, icon: Icon, iconStyle }: StatsCardProps) => {


  return (
    <div className={`${styles.card}`}>
      {/* Decorative Blur Background Blob */}
      <div className={styles.blurBlob}></div>

      {/* Card Header Label */}
      <div className={`${styles.statIcon} ${iconStyle}`}>
        <Icon className={styles.statIconSvg} />
      </div>

      {/* Values Wrapper */}
      <div className={styles.valueContainer}>

        <span className={styles.label}>{title}</span>
        <span className={styles.count}>{total}</span>
      </div>
    </div>
  );
};