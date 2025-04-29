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
function useNotification(timeout = NOTIFICATION_TIMEOUT) {
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

    useEffect(() => () => clearTimeout(timerRef.current), []); // Cleanup timer on unmount

    return [notification, showNotification];
}


// Custom Hook: useTableState
function useTableState(columnConfig, showNotification) {
    const [columnSettings, setColumnSettings] = useState(() => loadColumnSettings());
    const { visibility: columnVisibility, widths: columnWidths } = columnSettings;

    // Temporary widths state for debouncing slider updates during drag
    const [tempWidths, setTempWidths] = useState(columnWidths);
    const debouncedWidths = useDebounce(tempWidths, DEBOUNCE_DELAY.WIDTH);

    const [sortConfig, setSortConfig] = useState({ key: 'stars', direction: 'asc' }); // Default sort

    // Save settings when visibility or debounced widths change
    useEffect(() => {
        saveColumnSettings(columnVisibility, debouncedWidths);
    }, [columnVisibility, debouncedWidths]);

    // Update actual column widths state after debouncing
    useEffect(() => {
        if (JSON.stringify(debouncedWidths) !== JSON.stringify(columnWidths)) {
            setColumnSettings(prev => ({ ...prev, widths: debouncedWidths }));
        }
    }, [debouncedWidths, columnWidths]);

    // Sync temp widths when actual widths change (e.g., on reset or import)
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
            visibility: defaultColumnVisibility,
            widths: defaultColumnWidths
        };
        setColumnSettings(newSettings);
        // tempWidths will update via useEffect sync
        showNotification('Настройки таблицы сброшены.', 'success');
    }, [showNotification]);

    // Apply settings loaded from an import file
    const applyImportedSettings = useCallback((importedSettings) => {
        if (!importedSettings || typeof importedSettings !== 'object') return;

        const newVisibility = { ...defaultColumnVisibility };
        const newWidths = { ...defaultColumnWidths };

        if (importedSettings.visibility && typeof importedSettings.visibility === 'object') {
            columnConfig.forEach(col => {
                if (col.isVisibilityToggleable && typeof importedSettings.visibility[col.id] === 'boolean') {
                    newVisibility[col.id] = importedSettings.visibility[col.id];
                } else if (!col.isVisibilityToggleable) {
                    newVisibility[col.id] = true;
                }
            });
        }

        if (importedSettings.widths && typeof importedSettings.widths === 'object') {
            columnConfig.forEach(col => {
                if (col.isWidthAdjustable && typeof importedSettings.widths[col.id] === 'number') {
                    newWidths[col.id] = Math.max(
                        col.minWidth || 50,
                        Math.min(col.maxWidth || 600, importedSettings.widths[col.id])
                    );
                } else if (!col.isWidthAdjustable) {
                    newWidths[col.id] = col.defaultWidth;
                }
            });
        }

        setColumnSettings({ visibility: newVisibility, widths: newWidths });
        // tempWidths will sync via useEffect
    }, [columnConfig]);

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
        applyImportedSettings,
    };
}

// Custom Hook: useSidebarState
function useSidebarState() {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(
        () => window.innerWidth <= 1024 // Initial state based on width
    );

    const toggleMobileSidebar = useCallback(() => setIsMobileSidebarOpen(prev => !prev), []);
    const toggleDesktopSidebar = useCallback(() => setIsDesktopSidebarCollapsed(prev => !prev), []);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth > 1024;
            if (isDesktop && isMobileSidebarOpen) {
                setIsMobileSidebarOpen(false); // Close mobile sidebar if resizing to desktop
            }
            // Optionally adjust desktop collapse state on resize if needed
            // setIsDesktopSidebarCollapsed(!isDesktop);
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial check
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileSidebarOpen]);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (isMobileSidebarOpen) {
            document.body.classList.add('body-no-scroll');
        } else {
            document.body.classList.remove('body-no-scroll');
        }
        return () => { // Cleanup
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
function useModalState() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemBeingEdited, setItemBeingEdited] = useState(null); // null = Add mode, object = Edit mode

    const openModal = useCallback((item = null) => {
        setItemBeingEdited(item);
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
function useModuleManagement(modules, setModules, showNotification, closeEditModal) {

    const handleLearnedChange = useCallback((ruName, stars) => {
        setModules(prev => prev.map(m =>
            (m.ruName === ruName && m.stars === stars) ? { ...m, learned: !m.learned } : m
        ));
    }, [setModules]);

    const handleAddNewModule = useCallback((_ignoredKey, newModuleData) => {
        const { ruName, stars, effect } = newModuleData;
        const moduleKey = `${ruName}-${stars}`;

        if (!ruName || !stars || !effect) {
            showNotification('Пожалуйста, заполните обязательные поля: Название, Звёзды, Эффект.', 'error');
            return; // Keep modal open
        }

        if (modules.some(m => `${m.ruName}-${m.stars}` === moduleKey)) {
            showNotification('Модуль с таким названием и количеством звезд уже существует!', 'error');
            return; // Keep modal open
        }

        setModules(prev => [
            ...prev,
            { ...newModuleData, learned: true, isCustom: true } // Add new custom module, default to learned
        ]);
        closeEditModal();
        showNotification(`Модуль "${ruName}" успешно добавлен!`, 'success');
    }, [modules, setModules, showNotification, closeEditModal]);

    const handleSaveChangesInModal = useCallback((originalKey, updatedData) => {
        const newKey = `${updatedData.ruName}-${updatedData.stars}`;

        if (!updatedData.ruName || !updatedData.stars || !updatedData.effect) {
            showNotification('Пожалуйста, заполните обязательные поля: Название, Звёзды, Эффект.', 'error');
            return; // Keep modal open
        }

        // Check for key collision only if the key actually changed
        if (originalKey !== newKey && modules.some(m => `${m.ruName}-${m.stars}` === newKey)) {
            showNotification('Модуль с таким новым названием и количеством звезд уже существует!', 'error');
            return; // Keep modal open
        }

        setModules(prevModules =>
            prevModules.map(m =>
                `${m.ruName}-${m.stars}` === originalKey ? { ...m, ...updatedData } : m
            )
        );
        closeEditModal();
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