// hooks.js
const { useState, useEffect, useCallback, useRef } = React;

// Custom Hook: useDebounce
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

// Custom Hook: useNotification
function useNotification(timeout = NOTIFICATION_TIMEOUT) { // Use constant
    const [notification, setNotification] = useState({ message: '', type: '', show: false });
    const timerRef = useRef(null);

    const showNotification = useCallback((message, type = 'info') => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setNotification({ message, type, show: true });
        timerRef.current = setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, timeout);
    }, [timeout]);

    // Cleanup timer on unmount
    useEffect(() => () => clearTimeout(timerRef.current), []);

    // Return state and function separately for easier use
    return [notification, showNotification];
}


// Custom Hook: useTableState
// Manages table-related state like columns, sorting, and persistence
function useTableState(columnConfig, showNotification) {
    // Load initial settings from localStorage or defaults
    const [columnSettings, setColumnSettings] = useState(() => loadColumnSettings()); // from utils.js
    const { visibility: columnVisibility, widths: columnWidths } = columnSettings;

    // Temporary widths state for debouncing slider updates
    const [tempWidths, setTempWidths] = useState(columnWidths);
    const debouncedWidths = useDebounce(tempWidths, DEBOUNCE_DELAY.WIDTH); // from constants.js

    // Sorting state
    const [sortConfig, setSortConfig] = useState({ key: 'stars', direction: 'asc' }); // Default sort

    // Effect to save settings when visibility or (debounced) widths change
    useEffect(() => {
        // Use debouncedWidths for saving to prevent rapid saves during slider drag
        saveColumnSettings(columnVisibility, debouncedWidths); // from utils.js
    }, [columnVisibility, debouncedWidths]);

    // Effect to update the actual column widths state once debouncing is complete
    useEffect(() => {
        // Only update if debounced widths are actually different from current widths
        if (JSON.stringify(debouncedWidths) !== JSON.stringify(columnWidths)) {
            setColumnSettings(prev => ({ ...prev, widths: debouncedWidths }));
        }
    }, [debouncedWidths, columnWidths]);

    // Effect to sync temp widths when actual widths change (e.g., on reset or initial load)
    useEffect(() => {
        setTempWidths(columnWidths);
    }, [columnWidths]);

    // --- Handlers ---
    const handleVisibilityChange = useCallback((columnId) => {
        setColumnSettings(prev => ({
            ...prev,
            visibility: { ...prev.visibility, [columnId]: !prev.visibility[columnId] }
        }));
    }, []);

    // Updates temporary width state immediately for responsive slider UI
    const handleTempWidthChange = useCallback((columnId, newWidth) => {
        setTempWidths(prev => ({ ...prev, [columnId]: parseInt(newWidth, 10) }));
    }, []);

    const handleSort = useCallback((columnId) => {
        setSortConfig(prev => ({
            key: columnId,
            direction: prev.key === columnId && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    }, []);

    const handleResetSettings = useCallback(() => {
        const newSettings = {
            visibility: defaultColumnVisibility, // from config.js
            widths: defaultColumnWidths // from config.js
        };
        setColumnSettings(newSettings);
        // tempWidths will update via useEffect syncing with columnWidths
        showNotification('Настройки таблицы сброшены.', 'success');
    }, [showNotification]);

    // Function to apply settings loaded from an import file
    const applyImportedSettings = useCallback((importedSettings) => {
        if (!importedSettings || typeof importedSettings !== 'object') return;

        const newVisibility = { ...defaultColumnVisibility };
        const newWidths = { ...defaultColumnWidths };

        if (importedSettings.visibility && typeof importedSettings.visibility === 'object') {
            columnConfig.forEach(col => {
                if (col.isVisibilityToggleable && typeof importedSettings.visibility[col.id] === 'boolean') {
                    newVisibility[col.id] = importedSettings.visibility[col.id];
                } else if (!col.isVisibilityToggleable) {
                    newVisibility[col.id] = true; // Ensure non-toggleable columns remain visible
                }
            });
        }

        if (importedSettings.widths && typeof importedSettings.widths === 'object') {
            columnConfig.forEach(col => {
                if (col.isWidthAdjustable && typeof importedSettings.widths[col.id] === 'number') {
                    // Clamp imported width within defined min/max
                    newWidths[col.id] = Math.max(
                        col.minWidth || 50, // Use a default min if not specified
                        Math.min(col.maxWidth || 600, importedSettings.widths[col.id]) // Use a default max
                    );
                } else if (!col.isWidthAdjustable) {
                    newWidths[col.id] = col.defaultWidth; // Use default width if not adjustable
                }
            });
        }

        setColumnSettings({ visibility: newVisibility, widths: newWidths });
        // tempWidths will sync via useEffect
    }, [columnConfig]); // Depends on columnConfig

    return {
        columnSettings,
        columnVisibility,
        columnWidths,
        sortConfig,
        tempWidths,
        handleVisibilityChange,
        handleTempWidthChange,
        handleSort,
        handleResetSettings,
        applyImportedSettings, // Expose the new function
    };
}

// Custom Hook: useSidebarState
// Manages sidebar open/closed state and related effects
function useSidebarState() {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    // Initialize desktop sidebar based on initial window width
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(
        () => window.innerWidth <= 1024
    );

    // Toggle handlers
    const toggleMobileSidebar = useCallback(() => setIsMobileSidebarOpen(prev => !prev), []);
    const toggleDesktopSidebar = useCallback(() => setIsDesktopSidebarCollapsed(prev => !prev), []);

    // Effect to handle window resize - closes mobile sidebar if window becomes desktop-sized
    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth > 1024;
            if (isDesktop && isMobileSidebarOpen) {
                setIsMobileSidebarOpen(false); // Close mobile sidebar if resizing to desktop
            }
            // We might also want to set initial collapse state based on resize
            // setIsDesktopSidebarCollapsed(window.innerWidth <= 1024);
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileSidebarOpen]); // Re-run only if mobile sidebar state changes

    // Effect to lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (isMobileSidebarOpen) {
            document.body.classList.add('body-no-scroll');
        } else {
            document.body.classList.remove('body-no-scroll');
        }
        // Cleanup function
        return () => {
            document.body.classList.remove('body-no-scroll');
        };
    }, [isMobileSidebarOpen]);

    return {
        isMobileSidebarOpen,
        isDesktopSidebarCollapsed,
        toggleMobileSidebar,
        toggleDesktopSidebar,
    };
}

// Custom Hook: useModalState
// Manages the state for the Add/Edit modal
function useModalState() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemBeingEdited, setItemBeingEdited] = useState(null);

    const openModal = useCallback((item = null) => {
        setItemBeingEdited(item); // null for adding, item object for editing
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setItemBeingEdited(null); // Clear item on close
    }, []);

    return {
        isModalOpen,
        itemBeingEdited,
        openModal,
        closeModal,
    };
}

// Custom Hook: useModuleManagement
// Manages CRUD operations for the modules list
function useModuleManagement(modules, setModules, showNotification, closeEditModal) {

    const handleLearnedChange = useCallback((ruName, stars) => {
        setModules(prev => prev.map(m =>
            (m.ruName === ruName && m.stars === stars) ? { ...m, learned: !m.learned } : m
        ));
    }, [setModules]);

    const handleAddNewModule = useCallback((_ignoredKey, newModuleData) => {
        const { ruName, stars } = newModuleData;
        const moduleKey = `${ruName}-${stars}`;

        if (!ruName || !stars || !newModuleData.effect) {
            showNotification('Пожалуйста, заполните обязательные поля: Название, Звёзды, Эффект.', 'error');
            return; // Keep modal open
        }

        if (modules.some(m => `${m.ruName}-${m.stars}` === moduleKey)) {
            showNotification('Модуль с таким названием и количеством звезд уже существует!', 'error');
            return; // Keep modal open
        }

        setModules(prev => [
            ...prev,
            { ...newModuleData, learned: true, isCustom: true } // Add the new module
        ]);
        closeEditModal(); // Close modal on success
        showNotification(`Модуль "${ruName}" успешно добавлен!`, 'success');
    }, [modules, setModules, showNotification, closeEditModal]);

    const handleSaveChangesInModal = useCallback((originalKey, updatedData) => {
        const newKey = `${updatedData.ruName}-${updatedData.stars}`;

        if (!updatedData.ruName || !updatedData.stars || !updatedData.effect) {
            showNotification('Пожалуйста, заполните обязательные поля: Название, Звёзды, Эффект.', 'error');
            return; // Keep modal open
        }

        if (originalKey !== newKey && modules.some(m => `${m.ruName}-${m.stars}` === newKey)) {
            showNotification('Модуль с таким новым названием и количеством звезд уже существует!', 'error');
            return; // Keep modal open
        }

        setModules(prevModules =>
            prevModules.map(m =>
                `${m.ruName}-${m.stars}` === originalKey ? { ...m, ...updatedData } : m
            )
        );
        closeEditModal(); // Close modal on success
        showNotification(`Модуль "${updatedData.ruName}" успешно обновлен!`, 'success');
    }, [modules, setModules, closeEditModal, showNotification]);

    const handleDeleteModule = useCallback((ruName, stars) => {
        if (window.confirm(`Вы уверены, что хотите удалить модуль "${ruName}" (${stars}⭐)?`)) {
            setModules(prev => prev.filter(m => !(m.ruName === ruName && m.stars === stars)));
            showNotification(`Модуль "${ruName}" удален.`, 'success');
        }
    }, [setModules, showNotification]);

    return {
        handleLearnedChange,
        handleAddNewModule,
        handleSaveChangesInModal,
        handleDeleteModule,
    };
} 