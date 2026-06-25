import React, { useCallback } from 'react';
import { Kanban, List, Plus } from 'lucide-react';
import styles from './mainpageHeader.module.css';
import { useMainpagePopupContext } from '../hooks/useMainpagePopupContext';
import useMainpageUi from '../hooks/useMainpageUi';
import useMainpageUiContext from '../hooks/useMainpageUiContenxt';

export type ViewMode = 'board' | 'list';

interface WorkspaceHeaderProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    openCreateModal: () => void;
}

export const MainPageHeader =() => {

    const {mainPagePopupManager} = useMainpagePopupContext()
    const {mainpageUiManager} = useMainpageUiContext();


    return (
        <div className={styles.headerContainer}>
            {/* Title block */}
            <div>
                <h2 className={styles.title}>Project Workspaces</h2>
                <p className={styles.subtitle}>
                    Visualize, monitor, and configure running engineering sprints
                </p>
            </div>

            {/* Action Toolbar */}
            <div className={styles.toolbarActions}>
                {/* View Mode Toggle Segment */}
                <div className={styles.toggleSegmentTrack}>
                    <button
                        type="button"
                        onClick={()=>{mainpageUiManager.setViewMode('board')}}
                        className={`${styles.toggleButton} ${mainpageUiManager.viewMode === 'board' ? styles.toggleActive : styles.toggleInactive
                            }`}
                        aria-pressed={mainpageUiManager.viewMode === 'board'}
                    >
                        <Kanban className={styles.toggleIcon} />
                        <span>Kanban Board</span>
                    </button>

                    <button
                        type="button"
                        onClick={()=>mainpageUiManager.setViewMode('list')}
                        className={`${styles.toggleButton} ${mainpageUiManager.viewMode === 'list' ? styles.toggleActive : styles.toggleInactive
                            }`}
                        aria-pressed={mainpageUiManager.viewMode === 'list'}
                    >
                        <List className={styles.toggleIcon} />
                        <span>Sprint List</span>
                    </button>   
                </div>

                {/* Global Action Trigger */}
                <button
                    type="button"
                    onClick={()=>{mainPagePopupManager.setOpen(true)}}
                    className={styles.createActionButton}
                >
                    <Plus className={styles.createActionIcon} />
                    <span>Create Task</span>
                </button>
            </div>
        </div>
    );
};