import React, { useState } from 'react';
import { Search, X, AlertCircle, ArrowUpDown } from 'lucide-react';
import styles from './utilityBar.module.css';



export const UtilityBar = () => {
  // --- Internal State Initializations ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('dueDateAsc');

  // --- Mock Data / Helper Functions ---
  const hasActiveFilters = filterStatus !== 'All' || filterCategory !== 'All' || filterPriority !== 'All';

  const getCategoryDetails = (id: string) => {
    // Basic fallback dictionary for visualization
    const mockCategories: Record<string, { name: string }> = {
      '1': { name: 'Work' }, 
      '2': { name: 'Personal' },
      '3': { name: 'Shopping' },
    };
    return mockCategories[id] || { name: id };
  };

  const handleClearAll = () => {
    setFilterStatus('All');
    setFilterCategory('All');
    setFilterPriority('All');
  };

  return (
    <section className={`${styles.container}`}>
      <div className={styles.topRow}>
        
        {/* Search Input Bar */}
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Search tasks by title or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className={styles.clearSearchButton}
              aria-label="Clear search query"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Active Navigation Path Info Display */}
        <div className={styles.tagIndicatorList}>
          <span className={styles.metaLabel}>Active Filters:</span>
          <span className={styles.filterBadge}>
            Status: {filterStatus}
          </span>
          <span className={styles.filterBadge}>
            Category: {filterCategory === 'All' ? 'All' : getCategoryDetails(filterCategory).name}
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className={styles.clearAllLinkButton}
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Advanced Multi-Filters Block */}
      <div className={styles.bottomRow}>
        <div className={styles.selectorsGroup}>
          
          {/* Priority Filter */}
          <div className={styles.controlWrapper}>
            <span className={styles.controlLabel}>
              <AlertCircle size={14} /> Priority
            </span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className={styles.selectDropdown}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Sorting Utility */}
        <div className={styles.controlWrapper}>
          <span className={styles.controlLabel}>
            <ArrowUpDown size={14} /> Sort By
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.selectDropdown}
          >
            <option value="dueDateAsc">Due Date (Earliest First)</option>
            <option value="dueDateDesc">Due Date (Latest First)</option>
            <option value="createdDesc">Date Created (Newest First)</option>
            <option value="priorityHigh">Priority (High to Low)</option>
          </select>
        </div>
      </div>
    </section>
  );
};