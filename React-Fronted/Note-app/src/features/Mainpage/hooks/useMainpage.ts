import React, { useEffect, useState } from "react";
import TaskApi from "../api/TaskApi.js";
import { useAuthContext } from "../../Auth/hooks/useAuthContext.ts.js";
import Debounce from "../../Mainpage/utils/debounce.tsx";

export type UseMainpageType = {

    getAllTaskData: () => Promise<any>
    createNewTask: (task: Task) => Promise<any>
    deleteExistingTask: (taskId: string) => Promise<any>

    tasks: Task[]
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
    handleToggleSubtask: (taskId: string, subtaskId: string) => void,
    pendingStatus: Map<string, number>
    setPendingStatus: React.Dispatch<React.SetStateAction<Map<string, number>>>
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
    const [pendingStatus,setPendingStatus] = useState<Map<string, number>>(new Map<string, number>());


    const { initDebounce } = Debounce(pendingStatus, setPendingStatus)
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



    const handleToggleSubtask = (taskId: string, subtaskId: string) => {

        let updatedSubtasks: Subtask[] | undefined = [];
        setTasks(prev => prev.map(task => {
            if (task.id === taskId) {

                updatedSubtasks = task.subtasks?.map((sub: Subtask) =>
                    sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
                )

                // call inside set
                initDebounce(updateSubTask.bind(null, taskId, updatedSubtasks ?? []), 1000, taskId);

                return {
                    ...task,
                    subtasks: updatedSubtasks
                };
            }
            return task;
        }));
    };

    const updateSubTask = async (taskId: string, subtask: Subtask[]) => {

        let data = await taskApiManager.updateSubTask(taskId, subtask)

        
        setPendingStatus(prev=>{
            if (!prev) return prev

            let next = new Map(prev)
            next.set(data.data.task_id, (prev.get(data.data.task_id) ?? 0) -1)
            return next

        })
    }


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

        setTasks(prev => {
            if (!prev) return prev;

            return prev.map((task: Task) => {

                if (task.id === data.old_id) {
                    return {
                        ...task, id: data.data.id, subtasks: task.subtasks?.map((subtask: Subtask) => {
                            const updatedSubtask = data.old_subtasks_id.find((s: any) => s.old_id === subtask.id);

                            if (updatedSubtask) {

                                console.log(updatedSubtask.new_id)
                                return {
                                    ...subtask, id: updatedSubtask.new_id
                                }
                            }
                            return subtask

                        })
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

            const request =await taskApiManager.deleteTask(taskId)

            if(request.success){
                setTasks(prev => prev.filter(task => task.id !== request.data.deleted_task_id))
            }
        } catch (error) {

        }
    }

    return {
        getAllTaskData,
        createNewTask,
        tasks,
        setTasks,
        deleteExistingTask,
        handleToggleSubtask,
        pendingStatus,
        setPendingStatus

    }
}