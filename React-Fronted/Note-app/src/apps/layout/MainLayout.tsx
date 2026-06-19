import { Outlet } from 'react-router-dom'
import styles from './mainLayout.module.css'

export default function Mainlayout(){



    return(
        <div className={styles.mainLayout}>
            <Outlet/>
        </div>
    )
}