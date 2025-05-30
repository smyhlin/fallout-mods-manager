// hooks.js
const { useState, useEffect, useCallback, useRef, useMemo } = React;

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

    useEffect(() => () => clearTimeout(timerRef.current), []);

    return [notification, showNotification];
}

// Custom Hook: useTableState
function useTableState(columnConfig, showNotification) {
    const { t } = window.useTranslation();
    const [columnSettings, setColumnSettings] = useState(() => loadColumnSettings());
    const { visibility: columnVisibility, widths: columnWidths } = columnSettings;

    const [tempWidths, setTempWidths] = useState(columnWidths);
    const debouncedWidths = useDebounce(tempWidths, DEBOUNCE_DELAY.WIDTH);

    const [sortConfig, setSortConfig] = useState({ key: 'stars', direction: 'asc' });

    useEffect(() => {
        saveColumnSettings(columnVisibility, debouncedWidths);
    }, [columnVisibility, debouncedWidths]);

    useEffect(() => {
        if (JSON.stringify(debouncedWidths) !== JSON.stringify(columnWidths)) {
            setColumnSettings(prev => ({ ...prev, widths: debouncedWidths }));
        }
    }, [debouncedWidths, columnWidths]);

    useEffect(() => {
        setTempWidths(columnWidths);
    }, [columnWidths]);

    const handleVisibilityChange = useCallback((columnId) => {
        setColumnSettings(prev => ({
            ...prev,
            visibility: { ...prev.visibility, [columnId]: !prev.visibility[columnId] }
        }));
    }, []);

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
        showNotification(t('settingsResetButton'), 'success');
    }, [showNotification, t]);

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
                }
            });
        }
        setColumnSettings({ visibility: newVisibility, widths: newWidths });
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
        () => window.innerWidth <= 1024
    );

    const toggleMobileSidebar = useCallback(() => setIsMobileSidebarOpen(prev => !prev), []);
    const toggleDesktopSidebar = useCallback(() => setIsDesktopSidebarCollapsed(prev => !prev), []);

    useEffect(() => {
        const handleResize = () => {
            const isDesktop = window.innerWidth > 1024;
            if (isDesktop && isMobileSidebarOpen) {
                setIsMobileSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileSidebarOpen]);

    useEffect(() => {
        if (isMobileSidebarOpen) {
            document.body.classList.add('body-no-scroll');
        } else {
            document.body.classList.remove('body-no-scroll');
        }
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
function useModalState() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemBeingEdited, setItemBeingEdited] = useState(null);

    const openModal = useCallback((item = null) => {
        setItemBeingEdited(item);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setItemBeingEdited(null);
    }, []);

    return {
        isModalOpen,
        itemBeingEdited,
        openModal,
        closeModal,
    };
}

// Custom Hook: useModuleManagement (Modified to work with global `modules` state)
function useModuleManagement(modules, setModules, showNotification, closeModal) {
    const { t } = useTranslation();

    const getModuleKey = (module) => module.module_editor_id || `${module.ruName}-${module.stars}`;

    const handleLearnedChange = useCallback((moduleToToggle) => {
        const keyToUpdate = getModuleKey(moduleToToggle);
        setModules(prevModules =>
            prevModules.map(m =>
                getModuleKey(m) === keyToUpdate ? { ...m, learned: !m.learned } : m
            )
        );
    }, [setModules]);

    const handleAddNewModule = useCallback((_ignoredKey, newModuleData) => {
        const { ruName, stars, effect } = newModuleData;
        if (!ruName || !stars || !effect) {
            showNotification(t('notificationRequiredFields'), 'error');
            return;
        }
        const newModuleKey = `custom-${Date.now()}-${ruName}-${stars}`; // Ensure unique key for custom
        
        if (modules.some(m => getModuleKey(m) === `${ruName}-${stars}` && !m.isCustom) ||
            modules.some(m => m.isCustom && m.ruName === ruName && m.stars === stars)) {
            showNotification(t('notificationModuleExists'), 'error');
            return;
        }

        const newCustomModule = {
            ...newModuleData,
            learned: true,
            isCustom: true,
            module_editor_id: newModuleKey, // Assign a unique ID
            // Ensure all fields from the language files are present, even if empty
            module_name: newModuleData.ruName, // Assuming ruName is the primary name for custom
            module_description: newModuleData.effect,
            module_compatibility: [], // Default or allow user to set
            module_materials: "", // Default or allow user to set
            module_form_id: "" // Default or allow user to set
        };
        setModules(prev => [...prev, newCustomModule]);
        closeModal();
        showNotification(t('notificationModuleAdded', { moduleName: ruName }), 'success');
    }, [modules, setModules, showNotification, closeModal, t]);

    const handleSaveChangesInModal = useCallback((originalModule, updatedData) => {
        const originalKey = getModuleKey(originalModule);
        const newProposedKey = updatedData.module_editor_id || `${updatedData.ruName}-${updatedData.stars}`;

        if (!updatedData.ruName || !updatedData.stars || !updatedData.effect) {
            showNotification(t('notificationRequiredFields'), 'error');
            return;
        }

        if (originalKey !== newProposedKey && modules.some(m => getModuleKey(m) === newProposedKey)) {
             showNotification(t('notificationModuleExists'), 'error');
             return;
        }
        
        setModules(prevModules =>
            prevModules.map(m =>
                getModuleKey(m) === originalKey
                ? {
                    ...m, // Preserve original fields like module_editor_id if it's a base module
                    ...updatedData,
                    // If it was a base module, its module_editor_id should not change.
                    // If it's custom, its module_editor_id might be part of updatedData or remain.
                    module_editor_id: originalModule.isCustom ? (updatedData.module_editor_id || originalModule.module_editor_id) : originalModule.module_editor_id,
                    isCustom: originalModule.isCustom // Preserve custom status
                  }
                : m
            )
        );
        closeModal();
        showNotification(t('notificationModuleUpdated', { moduleName: updatedData.ruName }), 'success');
    }, [modules, setModules, closeModal, showNotification, t]);

    const handleDeleteModule = useCallback((moduleToDelete) => {
        if (!moduleToDelete.isCustom) {
            showNotification(t('notificationCannotDeleteNonCustom'), 'error'); // Add this translation
            return;
        }
        if (window.confirm(t('confirmDeleteModule', { moduleName: moduleToDelete.ruName, stars: moduleToDelete.stars }))) {
            const keyToDelete = getModuleKey(moduleToDelete);
            setModules(prev => prev.filter(m => getModuleKey(m) !== keyToDelete));
            showNotification(t('notificationModuleDeleted', { moduleName: moduleToDelete.ruName }), 'success');
        }
    }, [setModules, showNotification, t]);

    return {
        handleLearnedChange,
        handleAddNewModule,
        handleSaveChangesInModal,
        handleDeleteModule,
    };
}