import { useState } from "react";

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


    editingTask: Task | null
    setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;

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
    const [editingTask, setEditingTask] = useState<Task | null>(null)


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
        editingTask,
        setEditingTask,
        setOpen,
        setFormTitle,
        setFormDescription,
        setFormCategory,
        setFormDueDate,
        setFormPriority,
        setFormStatus,
        setFormSubtasks,
        setNewSubtaskInput
    }
}