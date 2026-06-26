import React, { useEffect, useState } from "react";
import type { Subtask, Task } from "./useMainpage";
import useMainpageUiContext from "./useMainpageUiContenxt";
import { v4 as uuidv4 } from 'uuid'
import useMainpageContext from "./useMainpageContext";

export type UseMainpagePopupType = {
    formTitle: string;
    setFormTitle: React.Dispatch<React.SetStateAction<string>>;

    formDescription: string;
    setFormDescription: React.Dispatch<React.SetStateAction<string>>;

    formStatus: Task['status'];
    setFormStatus: React.Dispatch<React.SetStateAction<Task['status']>>;

    formPriority: Task['priority'];
    setFormPriority: React.Dispatch<React.SetStateAction<Task['priority']>>;

    formCategory: string;
    setFormCategory: React.Dispatch<React.SetStateAction<string>>;

    formDueDate: string;
    setFormDueDate: React.Dispatch<React.SetStateAction<string>>;

    formSubtasks: Subtask[];
    setFormSubtasks: React.Dispatch<React.SetStateAction<Subtask[]>>;

    newSubtaskInput: string;
    setNewSubtaskInput: React.Dispatch<React.SetStateAction<string>>;

    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    formId: string;
    setFormId: React.Dispatch<React.SetStateAction<string>>;

    addFormSubtask: () => void;
    removeFormSubtask: (id: string) => void;
    toggleFormSubtaskState: (id: string) => void;
    handleSaveTask: (e: React.SubmitEvent) =>void;

}


export default function useMainpagePopup(): UseMainpagePopupType {

    // --- Form Local States ---
    const [formTitle, setFormTitle] = useState('');
    const [formDescription, setFormDescription] = useState('');
    const [formStatus, setFormStatus] = useState<Task['status']>('Pending');
    const [formPriority, setFormPriority] = useState<Task['priority']>('Medium');
    const [formCategory, setFormCategory] = useState('');
    const [formDueDate, setFormDueDate] = useState('');
    const [formSubtasks, setFormSubtasks] = useState<Subtask[]>([]);
    const [newSubtaskInput, setNewSubtaskInput] = useState('');
    const [isOpen, setOpen] = useState<boolean>(false);
    const [formId, setFormId] = useState<string>("");


    const { mainpageUiManager } = useMainpageUiContext();
    const { mainpageManager} = useMainpageContext();


    // Sync state with editingTask on open/change
    useEffect(() => {
        if (mainpageUiManager.editingTask) {
            setFormTitle(mainpageUiManager.editingTask.title);
            setFormDescription(mainpageUiManager.editingTask.description || '');
            setFormStatus(mainpageUiManager.editingTask.status);
            setFormPriority(mainpageUiManager.editingTask.priority);
            setFormCategory(mainpageUiManager.editingTask.category);
            setFormDueDate(mainpageUiManager.editingTask.dueDate || '');
            setFormSubtasks(mainpageUiManager.editingTask.subtasks || []);
            setFormId(mainpageUiManager.editingTask.id);
        } else {
            // Reset form for clean creation
            setFormTitle('');
            setFormDescription('');
            setFormStatus('Pending');
            setFormPriority('Medium');
            // setFormCategory(categories[0]?.id || '');
            setFormDueDate('');
            setFormSubtasks([]);
        }

        setNewSubtaskInput('');
    }, [mainpageUiManager.editingTask, isOpen]);



    // --- Subtask Action Handlers ---
    const addFormSubtask = () => {
        if (!newSubtaskInput.trim()) return;
        const newSub: Subtask = {
            id: uuidv4(),
            text: newSubtaskInput.trim(),
            completed: false,
        };
        setFormSubtasks((prev) => [...prev, newSub]);
        setNewSubtaskInput('');
    };

    const removeFormSubtask = (id: string) => {
        setFormSubtasks((prev) => prev.filter((st) => st.id !== id));
    };

    const toggleFormSubtaskState = (id: string) => {
        setFormSubtasks((prev) =>
            prev.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
        );
    };



    // --- Form Submit Handler ---
    const handleSaveTask = (e: React.SubmitEvent) => {
        e.preventDefault();

        const finalTask: Task = {
            id: mainpageUiManager.editingTask?.id || crypto.randomUUID(),
            title: formTitle,
            description:formDescription,
            status: formStatus,
            priority: formPriority,
            category: formCategory,
            dueDate: formDueDate,
            subtasks: formSubtasks,
        };


        // when updating/editing existing task
        if (mainpageUiManager.editingTask) {

            mainpageManager.setTasks((prev) => {
                if (!prev) return prev;

                return prev.map((task: Task) => {
                    const isFound = task.id === finalTask.id;

                    if (!isFound) return task;

                    return {
                        ...task,
                        title: finalTask.title,
                        description: finalTask.description,
                        status: finalTask.status,
                        priority: finalTask.priority,
                        category: finalTask.category,
                        dueDate: finalTask.dueDate,
                        subtasks: finalTask.subtasks
                        // update properties here
                    };
                });
            });


            mainpageUiManager.setEditingTask(null);

            // when creating a new task
        } else {

            mainpageManager.createNewTask(finalTask);

            mainpageManager.setTasks((prev) => {
                if (!prev) return prev;

                return [...prev, finalTask]

            })
        }

        setOpen(false)
    }



    return {
        formTitle,
        formDescription,
        formStatus,
        formPriority,
        formCategory,
        formDueDate,
        formSubtasks,
        newSubtaskInput,
        isOpen,
        formId,
        setFormId,
        setOpen,
        setFormTitle,
        setFormDescription,
        setFormCategory,
        setFormDueDate,
        setFormPriority,
        setFormStatus,
        setFormSubtasks,
        setNewSubtaskInput,
        addFormSubtask,
        removeFormSubtask,
        toggleFormSubtaskState,
        handleSaveTask
    }
}