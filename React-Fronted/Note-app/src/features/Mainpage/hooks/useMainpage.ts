import React, { useEffect, useState } from "react";
import TaskApi from "../api/TaskApi.js";
import { useAuthContext } from "../../Auth/hooks/useAuthContext.ts.js";


export type UseMainpageType = {

    getAllTaskData: () => Promise<any>
    createNewTask: (task: Task) => Promise<any>
    deleteExistingTask: (taskId: string) => Promise<any>

    tasks: Task[]
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
}





// --- TS Interfaces ---
export type Subtask = {
    id: string;
    text: string;
    completed: boolean;
}

export type Task = {
    id: string;
    title: string;
    description?: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    priority: 'High' | 'Medium' | 'Low';
    category: string;
    dueDate?: string;
    subtasks?: Subtask[];
}

type CategoryOption = {
    id: string;
    name: string;
}

type TaskModalProps = {
    isOpen: boolean;
    onClose: () => void;
    editingTask: Task | null;
    onSave: (task: Task) => void;
    categories?: CategoryOption[];
    darkMode?: boolean;
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
    { id: 'work', name: 'Work' },
    { id: 'personal', name: 'Personal' },
    { id: 'shopping', name: 'Shopping' },
];

export default function useMainpage(): UseMainpageType {

    const [tasks, setTasks] = useState<Task[]>([]);
    const { authManager } = useAuthContext();

    const taskApiManager = TaskApi()

    useEffect(() => {


        if (authManager.userData) {
            const initGetTask = async () => {

                await getAllTaskData();
            }


            initGetTask()
        }




    }, [authManager.userData]);

    useEffect(() => {
        console.log(tasks)
    }, [tasks])





    const convertData = (data: []) => {

        const tasks = data.reduce((prev: Task[], curr: any) => {
            console.log(curr)



            const subtask = curr.subtasks.reduce((prev_subtask: Subtask[], curr_subtask: any) => {



                prev_subtask.push({
                    id: curr_subtask.id,
                    text: curr_subtask.text,
                    completed: curr_subtask.is_done
                })



                return prev_subtask

            }, [])


            prev.push({
                id: curr.id,
                title: curr.title,
                status: curr.status,
                priority: curr.priority,
                category: curr.category,
                dueDate: curr.due_date,
                subtasks: subtask,
                description: curr.description
            })

            return prev
        }, [])


        setTasks(tasks);

    }

    const syncTaskId = (data: any) => {

        console.log("AT SYNC")

        setTasks(prev => {
            if (!prev) return prev;

            return prev.map((task: Task) => {

                if (task.id === data.old_id) {
                    return {
                        ...task, id: data.data.id
                    }
                }
                return task
            })


        })

    }



    const getAllTaskData = async () => {
        try {

            const request = await taskApiManager.getAllTask();

            if (request.success) {
                convertData(request.data)
            }


        } catch (error) {

        }
    }

    const createNewTask = async (task: Task) => {
        try {

            const request = await taskApiManager.createTask(task);

            if (request.success) {

                syncTaskId(request)
            }

        } catch (error) {

        }
    }

    const deleteExistingTask = async (taskId: string) => {

        try {

            const request = taskApiManager.deleteTask(taskId)

        } catch (error) {

        }
    }



    return {
        getAllTaskData,
        createNewTask,
        tasks,
        setTasks,
        deleteExistingTask

    }
}