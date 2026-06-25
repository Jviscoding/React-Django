import React, { useState } from "react";


export type UseMainpageUiType = {

    viewMode: 'board' | 'list'
    setViewMode: React.Dispatch<React.SetStateAction<'board' | 'list'>>;



}



// --- TS Interfaces ---
export interface Subtask {
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


export default function useMainpageUi(): UseMainpageUiType {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');





    return {
        viewMode,
        setViewMode
    }
}