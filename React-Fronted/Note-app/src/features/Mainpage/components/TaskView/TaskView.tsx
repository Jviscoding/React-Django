import React, { useState } from 'react';
import {
  BrainCircuit,
  ListTodo,
  Calendar,
  Circle,
  CheckCircle2,
  Edit2,
  Trash2
} from 'lucide-react';
import styles from './taskView.module.css';
import { v4 as uuidv4 } from "uuid";
import useMainpageUiContext from '../../hooks/useMainpageUiContenxt';
import { useMainpagePopupContext } from '../../hooks/useMainpagePopupContext';
import useMainpageContext from '../../hooks/useMainpageContext';
import TaskContent from './Task';

// --- TS Interfaces ---
export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  category: string;
  dueDate?: string;
  subtasks?: Subtask[];
}

interface CategoryDetails {
  name: string;
  bg: string;
  text: string;
  border: string;
}

export type TaskViewProps = {
  getCategoryDetails?: (categoryId: string) => CategoryDetails;
}


export const TaskView = () => {


  // --- Local States ---
  const { mainpageUiManager } = useMainpageUiContext()
  const { mainPagePopupManager } = useMainpagePopupContext()
  const { mainpageManager } = useMainpageContext()

  // Modal states (For localized UI handling)

  // --- Local Action Handlers ---
  const openCreateModal = () => {
    mainPagePopupManager.setOpen(true)
  };



  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');

    mainpageManager.setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: targetStatus } : task
    ));
  };






  // 1. EMPTY STATE VIEW
  if (mainpageManager.tasks.length === 0) {
    return (
      <div className={`${styles.emptyCard}`}>
        <div className={styles.emptyIconWrapper}>
          <BrainCircuit size={28} />
        </div>
        <h3 className={styles.emptyTitle}>No tasks found</h3>
        <p className={styles.emptyDescription}>
          We couldn't find any tasks matching your current query or filter selections. Try relaxing your parameters or add a new task.
        </p>
        <button onClick={openCreateModal} className={styles.emptyButton}>
          Add New Task
        </button>
      </div>
    );
  }

  // 2. KANBAN BOARD VIEW
  if (mainpageUiManager.viewMode === 'board') {
    const statuses: Task['status'][] = ['Pending', 'In Progress', 'Completed'];

    return (
      <div className={`${styles.boardGrid}`}>

        {statuses.map((status) => {
          const columnTasks = mainpageManager.tasks.filter(t => t.status === status);

          return (
            <div
              key={status}
              className={styles.boardColumn}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Column Header */}
              <div className={styles.columnHeader}>
                <div className={styles.columnHeaderTitleGroup}>
                  <span className={`${styles.statusDot} ${status === 'Completed' ? styles.dotGreen : status === 'In Progress' ? styles.dotBlue : styles.dotGray
                    }`}></span>
                  <h3 className={styles.columnTitleText}>{status}</h3>
                  <span className={styles.columnCounterCount}>
                    {columnTasks.length}
                  </span>
                </div>
              </div>

              {/* Drag-and-Drop Area Help text */}
              {columnTasks.length === 0 && (
                <div className={styles.columnDropZonePlaceholder}>
                  <p>Drop tasks here</p>
                </div>
              )}

              {/* Tasks list within column ---------------------------------------------------------------------------------- */}
              <div className={styles.columnCardsScrollableArea}>
                {columnTasks.map((task) => {

                  return (
                    <TaskContent task={task} viewMode={mainpageUiManager.viewMode} />
                  )
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // 3. LIST VIEW
  return (
    <div className={`${styles.listContainerTableCard}`}>
      <div className={styles.tableElementFakeWrapper}>


        {/* List Header HeaderRow */}
        <div className={styles.tableHeaderColumnsGridRow}>
          <div className={styles.colSpan5}>Task & Description</div>
          <div className={styles.colSpan2}>Status</div>
          <div className={styles.colSpan2}>Priority</div>
          <div className={styles.colSpan2}>Due Date & Category</div>
          <div className={`${styles.colSpan1} ${styles.textAlignmentRight}`}>Actions</div>
        </div>

        {/* List Body Entries */}
        <div className={styles.tableBodyDivideContainers}>
          {mainpageManager.tasks.map((task: Task) => {

            return (
              <TaskContent task={task} viewMode={mainpageUiManager.viewMode} />
            )

          })}
        </div>

      </div>
    </div>
  );
};