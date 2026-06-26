import React, { useState } from "react";
import { useAuthContext } from "../../Auth/hooks/useAuthContext.ts"
import TaskApi from "../api/TaskApi.js";


export type UseMainpageType = {

    getAllTaskData: () => Promise<any>
    createNewTask: (task: Task) => Promise<any>

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

    const taskApiManager = TaskApi()
    const [tasks, setTasks] = useState<Task[]>([]);
    




    const getAllTaskData = async () => {
        try {

            const request = await taskApiManager.getAllTask();

            console.log(request)

        } catch (error) {

        }
    }

    const createNewTask = async (task: Task) => {
        try {

            const request = await taskApiManager.createTask(task);

            console.log(request)

        } catch (error) {

        }
    }




    return {
        getAllTaskData,
        createNewTask,
        tasks,
        setTasks

    }
}