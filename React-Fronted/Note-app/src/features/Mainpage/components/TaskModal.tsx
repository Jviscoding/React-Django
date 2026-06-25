import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Square, CheckSquare } from 'lucide-react';
import styles from './taskModal.module.css';
import { v4 as uuidv4 } from 'uuid'

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

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  editingTask,
  onSave,
  categories = DEFAULT_CATEGORIES,
  darkMode = false,
}) => {
  // --- Form Local States ---
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<Task['status']>('Pending');
  const [formPriority, setFormPriority] = useState<Task['priority']>('Medium');
  const [formCategory, setFormCategory] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formSubtasks, setFormSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  // Simulated AI loading state
  const [isAiGeneratingSteps, setIsAiGeneratingSteps] = useState(false);

  // Sync state with editingTask on open/change
  useEffect(() => {
    if (editingTask) {
      setFormTitle(editingTask.title);
      setFormDescription(editingTask.description || '');
      setFormStatus(editingTask.status);
      setFormPriority(editingTask.priority);
      setFormCategory(editingTask.category);
      setFormDueDate(editingTask.dueDate || '');
      setFormSubtasks(editingTask.subtasks || []);
    } else {
      // Reset form for clean creation
      setFormTitle('');
      setFormDescription('');
      setFormStatus('Pending');
      setFormPriority('Medium');
      setFormCategory(categories[0]?.id || '');
      setFormDueDate('');
      setFormSubtasks([]);
    }
    setNewSubtaskInput('');
  }, [editingTask, isOpen, categories]);


  useEffect(() => {
    console.log(formDueDate)
  }, [formDueDate])
  if (!isOpen) return null;

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

  // --- AI Subtask Generation Simulator ---
  const handleAiBreakdown = () => {
    if (!formTitle.trim()) {
      alert('Please enter a task title first so the AI has context!');
      return;
    }
    setIsAiGeneratingSteps(true);

    // Simulating API latency response
    setTimeout(() => {
      const generatedSteps: Subtask[] = [
        { id: crypto.randomUUID(), text: `Initial research regarding "${formTitle}"`, completed: false },
        { id: crypto.randomUUID(), text: 'Draft primary project requirements', completed: false },
        { id: crypto.randomUUID(), text: 'Review milestones with core stakeholders', completed: false },
      ];
      setFormSubtasks((prev) => [...prev, ...generatedSteps]);
      setIsAiGeneratingSteps(false);
    }, 1200);
  };

  // --- Form Submit Handler ---
  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTask: Task = {
      id: editingTask?.id || crypto.randomUUID(),
      title: formTitle,
      description: formDescription,
      status: formStatus,
      priority: formPriority,
      category: formCategory,
      dueDate: formDueDate,
      subtasks: formSubtasks,
    };

    onSave(finalTask);
    onClose();
  };

  const themeClass = darkMode ? styles.dark : '';

  return (
    <div className={`${styles.modalFixedContainer} ${themeClass}`}>
      {/* Backdrop blur overlay */}
      <div onClick={onClose} className={styles.backdropOverlay}></div>

      {/* Modal Card */}
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h3 className={styles.modalHeaderTitle}>
            {editingTask ? 'Edit Task Settings' : 'Create New Apex Task'}
          </h3>
          <button onClick={onClose} className={styles.closeHeaderButton}>
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
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className={styles.inputElementText}
              />
            </div>

            {/* Description */}
            <div className={styles.inputGroupStack}>
              <label className={styles.formLabelBase}>Description</label>
              <textarea
                placeholder="Provide a detailed brief or outline milestones..."
                value={formDescription}
                rows={2}
                onChange={(e) => setFormDescription(e.target.value)}
                className={styles.textareaElement}
              ></textarea>
            </div>

            {/* Status, Priority & Category Grid */}
            <div className={styles.responsiveThreeColumnGrid}>
              {/* Status */}
              <div className={styles.inputGroupStack}>
                <label className={styles.formLabelBase}>Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as Task['status'])}
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
                  value={formPriority}
                  onChange={(e) => setFormPriority(e.target.value as Task['priority'])}
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
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className={styles.selectInputElement}
                type='text'
              >
              </input>
            </div>
            {/* Due Date */}
            <div className={styles.inputGroupStack}>
              <label className={styles.formLabelBase}>Due Date</label>
              <div className={styles.relativePositionWrapper}>
                <input
                  type="date"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
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
              {formSubtasks.length > 0 && (
                <div className={styles.subtaskScrollArea}>
                  {formSubtasks.map((st) => (
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
                  value={newSubtaskInput}
                  onChange={(e) => setNewSubtaskInput(e.target.value)}
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
              onClick={onClose}
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