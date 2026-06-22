import type React from 'react'
import styles from './kpiContainer.module.css'


export default function KpiContainer({children}: {children: React.ReactNode}) {

    return (
        <div className={styles.kpiWrapper}>
            {children}
        </div>
    )
}