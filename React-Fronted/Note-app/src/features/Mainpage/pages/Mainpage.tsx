import { useEffect } from 'react';
import TaskApi from '../api/TaskApi';
import styles from './mainpage.module.css'
import { MeterContainer } from '../components/Meter/MeterContainer';
import KpiContainer from '../components/Kpi/KpiContainer';
import { iconStyles, StatsCard } from '../components/Kpi/KpiCards';
import { CompletionCard } from '../components/Meter/CompletionRate';
import { UtilityBar } from '../components/TaskNav/UtilityBar';
import { TaskView } from '../components/TaskView/TaskView';
import { TaskModal, type Task } from '../components/TaskModal';
import { AlertCircle, CheckCircle, Clock, Folder } from 'lucide-react';
import { MainPageHeader, type ViewMode } from '../components/MainpageHeader';

export default function Mainpage() {

    const getData = TaskApi();

    console.log("DADADA")

    document.documentElement.setAttribute(
        "data-theme",
        "dark"
    );
    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await getData.getTasks();

                console.log('Fetched tasks:', response);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        }

        fetchData();

    }, [])

    return (
        <div className={styles.mainWrapper}>

            <MainPageHeader />
            <KpiContainer>
                <StatsCard title='Active Tasks' total={4} subMessage='total loaded' icon={Folder} iconStyle={iconStyles[0]}></StatsCard>
                <StatsCard title='Completed' total={4} subMessage='archived' icon={Clock} iconStyle={iconStyles[1]}></StatsCard>
                <StatsCard title='In Progress' total={4} subMessage='underway' icon={CheckCircle} iconStyle={iconStyles[2]}></StatsCard>
                <StatsCard title='pending' total={4} subMessage='in queue' icon={AlertCircle} iconStyle={iconStyles[3]}></StatsCard>
                <CompletionCard stats={{
                    completionRate: 100
                }} />

            </KpiContainer>
            <UtilityBar />
            <TaskView />

            <TaskModal/>

        </div>


    )

}