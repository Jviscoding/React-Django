import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Square, CheckSquare } from 'lucide-react';
import styles from './taskModal.module.css';
import { v4 as uuidv4 } from 'uuid'
import { useMainpagePopupContext } from '../hooks/useMainpagePopupContext';

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

interface CategoryOption {
  id: string;
  name: string;
}

interface TaskModalProps {
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

export const TaskModal = () => {

  const { mainPagePopupManager } = useMainpagePopupContext()
  // Simulated AI loading state
  const [isAiGeneratingSteps, setIsAiGeneratingSteps] = useState(false);

  // Sync state with editingTask on open/change
  useEffect(() => {
    if (mainPagePopupManager.editingTask) {
      mainPagePopupManager.setFormTitle(mainPagePopupManager.editingTask.title);
      mainPagePopupManager.setFormDescription(mainPagePopupManager.editingTask.description || '');
      mainPagePopupManager.setFormStatus(mainPagePopupManager.editingTask.status);
      mainPagePopupManager.setFormPriority(mainPagePopupManager.editingTask.priority);
      mainPagePopupManager.setFormCategory(mainPagePopupManager.editingTask.category);
      mainPagePopupManager.setFormDueDate(mainPagePopupManager.editingTask.dueDate || '');
      mainPagePopupManager.setFormSubtasks(mainPagePopupManager.editingTask.subtasks || []);
    } else {
      // Reset form for clean creation
      mainPagePopupManager.setFormTitle('');
      mainPagePopupManager.setFormDescription('');
      mainPagePopupManager.setFormStatus('Pending');
      mainPagePopupManager.setFormPriority('Medium');
      // mainPagePopupManager.setFormCategory(categories[0]?.id || '');
      mainPagePopupManager.setFormDueDate('');
      mainPagePopupManager.setFormSubtasks([]);
    }
    mainPagePopupManager.setNewSubtaskInput('');
  }, [mainPagePopupManager.editingTask, mainPagePopupManager.isOpen]);


  // useEffect(() => {
  //   console.log(formDueDate)
  // }, [formDueDate])
  // if (!isOpen) return null;

  // --- Subtask Action Handlers ---
  const addFormSubtask = () => {
    if (!mainPagePopupManager.newSubtaskInput.trim()) return;
    const newSub: Subtask = {
      id: uuidv4(),
      text: mainPagePopupManager.newSubtaskInput.trim(),
      completed: false,
    };
    mainPagePopupManager.setFormSubtasks((prev) => [...prev, newSub]);
    mainPagePopupManager.setNewSubtaskInput('');
  };

  const removeFormSubtask = (id: string) => {
    mainPagePopupManager.setFormSubtasks((prev) => prev.filter((st) => st.id !== id));
  };

  const toggleFormSubtaskState = (id: string) => {
    mainPagePopupManager.setFormSubtasks((prev) =>
      prev.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  // --- AI Subtask Generation Simulator ---
  const handleAiBreakdown = () => {
    if (!mainPagePopupManager.formTitle.trim()) {
      alert('Please enter a task title first so the AI has context!');
      return;
    }
    setIsAiGeneratingSteps(true);

    // Simulating API latency response
    setTimeout(() => {
      const generatedSteps: Subtask[] = [
        { id: crypto.randomUUID(), text: `Initial research regarding "${mainPagePopupManager.formTitle}"`, completed: false },
        { id: crypto.randomUUID(), text: 'Draft primary project requirements', completed: false },
        { id: crypto.randomUUID(), text: 'Review milestones with core stakeholders', completed: false },
      ];
      mainPagePopupManager.setFormSubtasks((prev) => [...prev, ...generatedSteps]);
      setIsAiGeneratingSteps(false);
    }, 1200);
  };

  // --- Form Submit Handler ---
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTask: Task = {
      id: mainPagePopupManager.editingTask?.id || crypto.randomUUID(),
      title: mainPagePopupManager.formTitle,
      description: mainPagePopupManager.formDescription,
      status: mainPagePopupManager.formStatus,
      priority: mainPagePopupManager.formPriority,
      category: mainPagePopupManager.formCategory,
      dueDate: mainPagePopupManager.formDueDate,
      subtasks: mainPagePopupManager.formSubtasks,
    };

  };


  return (mainPagePopupManager.isOpen && <div className={`${styles.modalFixedContainer}`}>
    {/* Backdrop blur overlay */}
    <div onClick={() => { mainPagePopupManager.setOpen(false) }} className={styles.backdropOverlay}></div>

    {/* Modal Card */}
    <div className={styles.modalCard}>
      {/* Header */}
      <div className={styles.modalHeader}>
        <h3 className={styles.modalHeaderTitle}>
          {mainPagePopupManager.editingTask ? 'Edit Task Settings' : 'Create New Apex Task'}
        </h3>
        <button onClick={() => { mainPagePopupManager.setOpen(false) }} className={styles.closeHeaderButton}>
          <X size={18} />
        </button>
      </div>

      {/* Body Form */}
      <form onSubmit={handleSaveTask} className={styles.formScrollableContainer}>
        <div className={styles.formWrapperSpace}>

          {/* Title */}
          <div className={styles.inputGroupStack}>
            <div className={styles.flexSpaceBetweenAlignment}>
              <label className={styles.formLabelBase}>
                Task Title <span className={styles.requiredAsterisk}>*</span>
              </label>
              <button
                type="button"
                onClick={handleAiBreakdown}
                disabled={isAiGeneratingSteps}
                className={styles.aiGenerateButton}
              >
                {isAiGeneratingSteps ? (
                  <>
                    <Loader2 className={styles.animateSpinner} size={12} />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={12} />
                    <span>✨ Auto-Generate Steps</span>
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              required
              placeholder="e.g., Update marketing presentation deck"
              value={mainPagePopupManager.formTitle}
              onChange={(e) => mainPagePopupManager.setFormTitle(e.target.value)}
              className={styles.inputElementText}
            />
          </div>

          {/* Description */}
          <div className={styles.inputGroupStack}>
            <label className={styles.formLabelBase}>Description</label>
            <textarea
              required={true}
              placeholder="Provide a detailed brief or outline milestones..."
              value={mainPagePopupManager.formDescription}
              rows={2}
              onChange={(e) => mainPagePopupManager.setFormDescription(e.target.value)}
              className={styles.textareaElement}
            ></textarea>
          </div>

          {/* Status, Priority & Category Grid */}
          <div className={styles.responsiveThreeColumnGrid}>
            {/* Status */}
            <div className={styles.inputGroupStack}>
              <label className={styles.formLabelBase}>Status</label>
              <select
                value={mainPagePopupManager.formStatus}
                onChange={(e) => mainPagePopupManager.setFormStatus(e.target.value as Task['status'])}
                className={styles.selectInputElement}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div className={styles.inputGroupStack}>
              <label className={styles.formLabelBase}>Priority</label>
              <select
                value={mainPagePopupManager.formPriority}
                onChange={(e) => mainPagePopupManager.setFormPriority(e.target.value as Task['priority'])}
                className={styles.selectInputElement}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>


          </div>

          <div className={styles.inputGroupStack}>
            <label className={styles.formLabelBase}>Tags / Labels (Comma Separated)</label>
            <input
              required
              value={mainPagePopupManager.formCategory}
              onChange={(e) => mainPagePopupManager.setFormCategory(e.target.value)}
              className={styles.selectInputElement}
              type='text'
              placeholder='e.g., Household, Food, Job'
            >
            </input>
          </div>
          {/* Due Date */}
          <div className={styles.inputGroupStack}>
            <label className={styles.formLabelBase}>Due Date</label>
            <div className={styles.relativePositionWrapper}>
              <input
                type="date"
                required
                value={mainPagePopupManager.formDueDate}
                onChange={(e) => mainPagePopupManager.setFormDueDate(e.target.value)}
                className={styles.inputElementText}
              />
            </div>
          </div>

          {/* Checklist Subtasks Form Builder */}
          <div className={styles.checklistSectionRoot}>
            <label className={styles.checklistSectionLabel}>
              Task Steps / Checklist Items
            </label>

            {/* Current subtask rows in state */}
            {mainPagePopupManager.formSubtasks.length > 0 && (
              <div className={styles.subtaskScrollArea}>
                {mainPagePopupManager.formSubtasks.map((st) => (
                  <div key={st.id} className={styles.subtaskRowContainer}>
                    <label
                      className={styles.subtaskInteractiveLabel}
                      onClick={() => toggleFormSubtaskState(st.id)}
                    >
                      {st.completed ? (
                        <CheckSquare
                          size={16}
                          className={`${styles.subtaskIcon} ${styles.subtaskIconComplete}`}
                        />
                      ) : (
                        <Square
                          size={16}
                          className={`${styles.subtaskIcon} ${styles.subtaskIconPending}`}
                        />
                      )}

                      <span className={st.completed ? styles.strikethroughMutedText : ''}>
                        {st.text}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => removeFormSubtask(st.id)}
                      className={styles.deleteSubbutton}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add raw subtask input row */}
            <div className={styles.flexGapAlignmentRow}>
              <input
                type="text"
                placeholder="Add a custom manual step..."
                value={mainPagePopupManager.newSubtaskInput}
                onChange={(e) => mainPagePopupManager.setNewSubtaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFormSubtask();
                  }
                }}
                className={styles.inputElementTextInline}
              />
              <button
                type="button"
                onClick={addFormSubtask}
                className={styles.addManualStepButton}
              >
                Add Step
              </button>
            </div>
          </div>
        </div>

        {/* Form Footer Action buttons */}
        <div className={styles.modalFooter}>
          <button
            type="button"
            onClick={() => { mainPagePopupManager.setOpen(false) }}
            className={styles.cancelActionButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitActionButton}
          >
            Save Task
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};