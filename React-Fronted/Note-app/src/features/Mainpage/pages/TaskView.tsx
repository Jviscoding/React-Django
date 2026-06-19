import { useEffect } from 'react';
import TaskApi from '../api/TaskApi';
import styles from './taskView.module.css'

export default function TaskView(){

    const getData = TaskApi();

    useEffect(()=>{
        
        const fetchData = async() =>{
            try{
                const response = await getData.getTasks();

                console.log('Fetched tasks:', response);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        }

        fetchData();
        
    }, [])

    return(
        <div>
            HHAHAHAHAHHA
        </div>
    )

}