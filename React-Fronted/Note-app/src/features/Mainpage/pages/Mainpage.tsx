import { useEffect } from 'react';
import TaskApi from '../api/TaskApi';
import styles from './mainpage.module.css'
import { MeterContainer } from '../components/Meter/MeterContainer';
import KpiContainer from '../components/Kpi/KpiContainer';
import { StatsCard } from '../components/Kpi/KpiCards';
import { CompletionCard } from '../components/Meter/CompletionRate';
import { UtilityBar } from '../components/TaskNav/UtilityBar';
import { TaskView } from '../components/TaskView/TaskView';
import { TaskModal, type Task } from '../components/TaskModal';

export default function Mainpage() {

    const getData = TaskApi();

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

            <KpiContainer>
                <StatsCard title='Active Tasks' total={4} subMessage='total loaded'></StatsCard>
                <StatsCard title='Completed' total={4} subMessage='archived'></StatsCard>
                <StatsCard title='In Progress' total={4} subMessage='underway'></StatsCard>
                <StatsCard title='pending' total={4} subMessage='in queue'></StatsCard>
                <CompletionCard stats={{
                    completionRate: 100
                }} />

            </KpiContainer>
            <MeterContainer />
            <UtilityBar />
            <TaskView />

            <TaskModal isOpen={false} onClose={function (): void {
                throw new Error('Function not implemented.');
            }} editingTask={null} onSave={function (task: Task): void {
                throw new Error('Function not implemented.');
            }} />

        </div>


    )

}