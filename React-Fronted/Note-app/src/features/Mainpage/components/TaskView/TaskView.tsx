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

interface TaskViewProps {
  initialTasks?: Task[];
  initialViewMode?: 'board' | 'list';
  darkMode?: boolean;
  getCategoryDetails?: (categoryId: string) => CategoryDetails;
}

// Dummy default category fallback if none is provided via props
const defaultCategoryDetails = (categoryId: string): CategoryDetails => ({
  name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
  bg: 'bg-gray-100',
  text: 'text-gray-800',
  border: 'border-gray-200'
});

export const TaskView = ({
  initialTasks = [],
  initialViewMode = 'board',
  darkMode = false,
  getCategoryDetails = defaultCategoryDetails,
}: TaskViewProps) => {
  
  // --- Local States ---
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [viewMode, setViewMode] = useState<'board' | 'list'>(initialViewMode);
  
  // Modal states (For localized UI handling)
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // --- Local Action Handlers ---
  const openCreateModal = () => {
    // Add your localized prompt/modal logic here. 
    // Example placeholder adding a generic task:
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: 'New Dynamic Task',
      description: 'Created using local component state.',
      status: 'Pending',
      priority: 'Medium',
      category: 'work',
      dueDate: new Date().toISOString().split('T')[0],
      subtasks: []
    };
    setTasks(prev => [...prev, newTask]);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    // Trigger modal visibility/overlay logic here if needed
    alert(`Editing task: ${task.title}`);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const nextStatusMap: Record<Task['status'], Task['status']> = {
          'Pending': 'In Progress',
          'In Progress': 'Completed',
          'Completed': 'Pending'
        };
        return { ...task, status: nextStatusMap[task.status] };
      }
      return task;
    }));
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks?.map(sub => 
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          )
        };
      }
      return task;
    }));
  };

  // --- HTML5 Drag and Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: targetStatus } : task
    ));
  };

  // --- Badge Color Style Utility Helpers ---
  const getPriorityStyle = (priority: Task['priority']): string => {
    switch (priority) {
      case 'High': return styles.priorityHigh;
      case 'Medium': return styles.priorityMedium;
      case 'Low': return styles.priorityLow;
      default: return '';
    }
  };

  const getStatusStyle = (status: Task['status']): string => {
    switch (status) {
      case 'Completed': return styles.statusCompleted;
      case 'In Progress': return styles.statusInProgress;
      case 'Pending': return styles.statusPending;
      default: return '';
    }
  };

  const themeClass = darkMode ? styles.dark : '';

  // 1. EMPTY STATE VIEW
  if (tasks.length === 0) {
    return (
      <div className={`${styles.emptyCard} ${themeClass}`}>
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
  if (viewMode === 'board') {
    const statuses: Task['status'][] = ['Pending', 'In Progress', 'Completed'];
    
    return (
      <div className={`${styles.boardGrid} ${themeClass}`}>
        {/* Quick View Switcher Ribbon added for contextual ease */}
        <div style={{gridColumn: '1 / -1', marginBottom: '10px'}}>
          <button onClick={() => setViewMode('list')} className={styles.emptyButton} style={{padding: '4px 12px'}}>
            Switch to List View
          </button>
        </div>

        {statuses.map((status) => {
          const columnTasks = tasks.filter(t => t.status === status);
          
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
                  <span className={`${styles.statusDot} ${
                    status === 'Completed' ? styles.dotGreen : status === 'In Progress' ? styles.dotBlue : styles.dotGray
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

              {/* Tasks list within column */}
              <div className={styles.columnCardsScrollableArea}>
                {columnTasks.map((task) => {
                  const cat = getCategoryDetails(task.category);
                  const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
                  const totalSubtasks = task.subtasks?.length || 0;
                  
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={styles.taskCard}
                    >
                      {/* Priority and Category Badges */}
                      <div className={styles.cardBadgesRow}>
                        <span className={`${styles.badgeBase} ${getPriorityStyle(task.priority)}`}>
                          {task.priority} Priority
                        </span>
                        <span className={`${styles.badgeBase} ${cat.bg} ${cat.text} ${cat.border}`}>
                          {cat.name}
                        </span>
                      </div>

                      {/* Task Content */}
                      <div className={styles.cardContentLayout}>
                        <h4 className={`${styles.cardHeadingTitle} ${task.status === 'Completed' ? styles.lineThrough : ''}`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className={styles.cardParagraphDescription}>
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Checklist Subtasks rendering */}
                      {totalSubtasks > 0 && (
                        <div className={styles.cardChecklistContainer}>
                          <div className={styles.checklistMetricsMetaText}>
                            <span className={styles.checklistTitleLabel}>
                              <ListTodo size={11} /> checklist progress
                            </span>
                            <span>{completedSubtasks}/{totalSubtasks}</span>
                          </div>
                          <div className={styles.cardProgressTrackBackground}>
                            <div 
                              className={styles.cardProgressFillIndicator}
                              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                            ></div>
                          </div>
                          
                          {/* Collapsible checklist preview in Board mode */}
                          <div className={styles.boardChecklistInteractiveList}>
                            {task.subtasks?.map(sub => (
                              <label key={sub.id} className={styles.checklistRowCheckboxLabel}>
                                <input 
                                  type="checkbox" 
                                  checked={sub.completed}
                                  onChange={() => handleToggleSubtask(task.id, sub.id)}
                                  className={styles.nativeInputElementCheckbox}
                                />
                                <span className={sub.completed ? styles.lineThroughColorMuted : ''}>
                                  {sub.text}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Task Footer Meta Data */}
                      <div className={styles.cardFooterContainer}>
                        <div className={styles.cardFooterDateGroup}>
                          <Calendar size={12} />
                          <span>{task.dueDate ? task.dueDate : 'No due date'}</span>
                        </div>

                        {/* Actions Group */}
                        <div className={styles.cardActionsGroup}>
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className={`${styles.actionButtonCircleIcon} ${task.status === 'Completed' ? styles.actionCircleCheckedActive : ''}`}
                            title={task.status === 'Completed' ? "Mark Incomplete" : "Mark Completed"}
                          >
                            {task.status === 'Completed' ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                          </button>
                          <button
                            onClick={() => openEditModal(task)}
                            className={styles.actionButtonCircleIcon}
                            title="Edit Task"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className={`${styles.actionButtonCircleIcon} ${styles.dangerHoverColorStyles}`}
                            title="Delete Task"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
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
    <div className={`${styles.listContainerTableCard} ${themeClass}`}>
      <div className={styles.tableElementFakeWrapper}>
        
        {/* Quick View Switcher Ribbon */}
        <div style={{marginBottom: '15px'}}>
          <button onClick={() => setViewMode('board')} className={styles.emptyButton} style={{padding: '4px 12px'}}>
             Switch to Board View
          </button>
        </div>

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
          {tasks.map((task) => {
            const cat = getCategoryDetails(task.category);
            const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
            const totalSubtasks = task.subtasks?.length || 0;

            return (
              <div key={task.id} className={styles.tableRowInteractiveItemGrid}>
                
                {/* Task Info Column */}
                <div className={styles.colSpan5FlexibleRowAlignment}>
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`${styles.rowStatusTriggerActionButton} ${task.status === 'Completed' ? styles.rowStatusCheckedColor : ''}`}
                  >
                    {task.status === 'Completed' ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </button>
                  <div className={styles.textContainerTruncatedLayout}>
                    <h4 className={`${styles.listRowItemTitle} ${task.status === 'Completed' ? styles.lineThrough : ''}`}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className={styles.listRowItemDescriptionTruncatedText}>
                        {task.description}
                      </p>
                    )}

                    {/* Subtask list inline in List Mode */}
                    {totalSubtasks > 0 && (
                      <div className={styles.listModeInlineChecklistRootContainer}>
                        <div className={styles.listInlineChecklistHeaderMeta}>
                          <span>Checklist: {completedSubtasks}/{totalSubtasks} completed</span>
                        </div>
                        <div className={styles.listInlineChecklistFlexibleFlexWrapTrack}>
                          {task.subtasks?.map(sub => (
                            <label key={sub.id} className={styles.listInlineSubtaskRowItemCheckboxLabel}>
                              <input 
                                type="checkbox" 
                                checked={sub.completed}
                                onChange={() => handleToggleSubtask(task.id, sub.id)}
                                className={styles.nativeInputElementCheckbox}
                              />
                              <span className={sub.completed ? styles.opacityMutedStrikethrough : ''}>
                                {sub.text}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Column */}
                <div className={styles.colSpan2FlexibleRowAlignment}>
                  <span className={`${styles.pillBadgeLayoutBase} ${getStatusStyle(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                {/* Priority Column */}
                <div className={styles.colSpan2FlexibleRowAlignment}>
                  <span className={`${styles.pillBadgeLayoutBase} ${getPriorityStyle(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>

                {/* Due Date & Category Column */}
                <div className={styles.colSpan2VerticalFlexStackMobileAlign}>
                  <div className={styles.listRowDateTimeFooterLabel}>
                    <Calendar size={12} />
                    <span>{task.dueDate ? task.dueDate : 'No due date'}</span>
                  </div>
                  <span className={`${styles.badgeBase} ${cat.bg} ${cat.text} ${cat.border}`}>
                    {cat.name}
                  </span>
                </div>

                {/* Actions Column */}
                <div className={`${styles.colSpan1FlexibleRowAlignment} ${styles.justifyFlexEndHorizontalRowItems}`}>
                  <button
                    onClick={() => openEditModal(task)}
                    className={styles.listRowActionButtonCircle}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className={`${styles.listRowActionButtonCircle} ${styles.listRowDangerButtonHover}`}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};