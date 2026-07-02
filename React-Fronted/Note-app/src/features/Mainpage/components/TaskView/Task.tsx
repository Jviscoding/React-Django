import { useEffect } from 'react';
import type { Subtask, Task } from '../../hooks/useMainpage';
import useMainpageContext from '../../hooks/useMainpageContext';
import { useMainpagePopupContext } from '../../hooks/useMainpagePopupContext';
import useMainpageUiContext from '../../hooks/useMainpageUiContenxt';
import styles from './task.module.css';
import {
    ListTodo,
    Calendar,
    Circle,
    CheckCircle2,
    Edit2,
    Trash2,
    RefreshCw, // Added for syncing state
    Check      // Added for synced state
} from 'lucide-react';

type props = {
    task: Task;
    viewMode: 'board' | 'list';
    isSyncing?: boolean; // Added sync status prop
}

export default function TaskContent({ task, viewMode}: props) {

    const { mainpageManager } = useMainpageContext();
    const { mainpageUiManager } = useMainpageUiContext();
    const { mainPagePopupManager } = useMainpagePopupContext();

    // --- HTML5 Drag and Drop Handlers ---
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        e.dataTransfer.setData('text/plain', taskId);
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

    const openEditModal = (task: Task) => {
        mainpageUiManager.setEditingTask(task);
        mainPagePopupManager.setOpen(true);
    };

    const toggleTaskStatus = (id: string) => {
        mainpageManager.setTasks(prev => prev.map(task => {
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

    const getStatusStyle = (status: Task['status']): string => {
        switch (status) {
            case 'Completed': return styles.statusCompleted;
            case 'In Progress': return styles.statusInProgress;
            case 'Pending': return styles.statusPending;
            default: return '';
        }
    };

    const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;

    // Reusable Sync Status Badge Component
    const SyncStatusBadge = () => (
        <div 
            className={`${styles.syncBadge} ${mainpageManager.pendingStatus.get(task.id) ?? 0 > 0 ? styles.syncing : styles.synced}`}
            title={mainpageManager.pendingStatus.get(task.id) ?? 0 > 0 ? "Syncing changes..." : "All changes synced"}
        >
            {mainpageManager.pendingStatus.get(task.id) ?? 0 > 0 ? (
                <RefreshCw size={12} className={styles.spinIcon} />
            ) : (
                <Check size={12} />
            )}
        </div>
    );

    if (viewMode === 'board') {
        return (
            <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                className={`${styles.taskCard} ${styles.relativeContainer}`}
            >
                {/* Sync Status Badge */}
                <SyncStatusBadge />

                {/* Priority and Category Badges */}
                <div className={styles.cardBadgesRow}>
                    <span className={`${styles.badgeBase} ${getPriorityStyle(task.priority)}`}>
                        {task.priority} Priority
                    </span>
                    <span className={`${styles.badgeBase}`}>
                        {/* {cat.name} */}
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

                        <div className={styles.boardChecklistInteractiveList}>
                            {task.subtasks?.map((sub: Subtask) => (
                                <label key={sub.id} className={styles.checklistRowCheckboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={sub.completed}
                                        onChange={() => mainpageManager.handleToggleSubtask(task.id, sub.id)}
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
                            onClick={() => mainpageManager.deleteExistingTask(task.id)}
                            className={`${styles.actionButtonCircleIcon} ${styles.dangerHoverColorStyles}`}
                            title="Delete Task"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div key={task.id} className={`${styles.tableRowInteractiveItemGrid} ${styles.relativeContainer}`}>
            
            {/* Sync Status Badge */}
            <SyncStatusBadge />

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
                                            onChange={() => mainpageManager.handleToggleSubtask(task.id, sub.id)}
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
                <span className={`${styles.badgeBase}`}>
                    {/* {cat.name} */}
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
                    onClick={() => mainpageManager.deleteExistingTask(task.id)}
                    className={`${styles.listRowActionButtonCircle} ${styles.listRowDangerButtonHover}`}
                    title="Delete"
                >
                    <Trash2 size={14} />
                </button>
            </div>

        </div>
    );
}