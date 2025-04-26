// app.jsx
// const { useState, useEffect, useMemo, useCallback, useRef, memo, Fragment } = React; // Removed global destructuring

// Constants, Config, Hooks, Utils, Components are now in separate files
// Ensure they are loaded in index.html before this script

// --- Main App Component ---
function App() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [initialModulesData, setInitialModulesData] = React.useState(null);
    const [modules, setModules] = React.useState([]);
    const [filter, setFilter] = React.useState('all');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [notification, showNotification] = useNotification();

    // Use table state hook
    const {
        columnVisibility, columnWidths, sortConfig, tempWidths,
        handleVisibilityChange, handleTempWidthChange, handleSort, handleResetSettings,
        applyImportedSettings,
    } = useTableState(columnConfig, showNotification);

    // Use sidebar state hook
    const {
        isMobileSidebarOpen,
        isDesktopSidebarCollapsed,
        toggleMobileSidebar,
        toggleDesktopSidebar,
    } = useSidebarState();

    // Use modal state hook
    const {
        isModalOpen, // Changed from isEditModalOpen
        itemBeingEdited, // Changed from moduleBeingEdited
        openModal, // Changed from openEditModal
        closeModal, // Changed from closeEditModal
    } = useModalState();

    // Use module management hook
    const {
        handleLearnedChange,
        handleAddNewModule,
        handleSaveChangesInModal,
        handleDeleteModule,
    } = useModuleManagement(modules, setModules, showNotification, closeModal); // Pass the correct closeModal

    const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY.SEARCH);
    const fileInputRef = React.useRef(null);

    // --- Effects ---

    // Initial data load effect
    React.useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('./modules.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const fetchedInitialModules = await response.json();
                setInitialModulesData(fetchedInitialModules);
                setModules(loadModules(fetchedInitialModules));
            } catch (error) {
                console.error("Failed to load initial data:", error);
                showNotification('Ошибка загрузки начальных данных модулей.', 'error');
                setInitialModulesData([]);
                setModules(loadModules([]));
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    // Save modules effect
    React.useEffect(() => {
        if (!isLoading && initialModulesData !== null) {
            saveModules(modules);
        }
    }, [modules, isLoading, initialModulesData]);

    // --- Handlers ---

    // Module CRUD handlers now come from useModuleManagement hook
    // Modal open handlers come from useModalState hook
    const handleOpenEditModal = React.useCallback((module) => {
        openModal(module); // Use openModal
    }, [openModal]);
    const handleOpenAddModal = React.useCallback(() => {
        openModal(); // Use openModal
    }, [openModal]);

    // --- Other handlers (unchanged) ---
    const handleSearchChange = React.useCallback((e) => { setSearchTerm(e.target.value); }, []);
    const handleExport = React.useCallback(() => {
        try {
            const dataToExport = {
                modules: modules.map(({ ruName, stars, learned, enName, effect, isCustom }) => ({ ruName, stars, learned, enName, effect, isCustom })),
                columnSettings: { visibility: columnVisibility, widths: columnWidths }, // Use state from hook
            };
            const jsonString = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fallout76_modules_backup_${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showNotification('Данные успешно экспортированы!', 'success');
        } catch (error) {
            console.error("Export failed:", error);
            showNotification('Ошибка экспорта данных.', 'error');
        }
    }, [modules, columnVisibility, columnWidths, showNotification]);

    const handleImportClick = React.useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleImportFile = React.useCallback((event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (!importedData || typeof importedData !== 'object') throw new Error("Invalid file format.");
                if (!Array.isArray(importedData.modules)) throw new Error("Missing or invalid 'modules' data.");
                if (initialModulesData === null) {
                    showNotification('Начальные данные еще не загружены, попробуйте позже.', 'error');
                    return;
                }
                const hasSettings = importedData.columnSettings &&
                                    typeof importedData.columnSettings === 'object'; // Simplified check

                if (window.confirm('Импортировать данные? Текущие данные будут перезаписаны!')) {
                    let importedModules = [];
                    const initialMap = new Map(initialModulesData.map(m => [`${m.ruName}-${m.stars}`, { ...m, isCustom: false }]));
                    const importedMap = new Map();
                    importedData.modules.forEach(m => { if(m && m.ruName && m.stars) importedMap.set(`${m.ruName}-${m.stars}`, m) });
                    initialMap.forEach((initialModule, key) => {
                        const imported = importedMap.get(key);
                        if (imported) {
                            importedModules.push({ ...initialModule, learned: !!imported.learned, isCustom: typeof imported.isCustom === 'boolean' ? imported.isCustom : !initialMap.has(key) });
                            importedMap.delete(key);
                        } else {
                            importedModules.push({ ...initialModule, learned: false });
                        }
                    });
                    importedMap.forEach(custom => { importedModules.push({ ruName: custom.ruName, enName: custom.enName || '', stars: custom.stars, effect: custom.effect || '', learned: !!custom.learned, isCustom: true }); });
                    setModules(importedModules);

                    if (hasSettings) {
                        applyImportedSettings(importedData.columnSettings);
                    } else {
                        handleResetSettings();
                    }
                    showNotification('Данные успешно импортированы!', 'success');
                }
            } catch (error) {
                console.error("Import failed:", error);
                showNotification(`Ошибка импорта: ${error.message}`, 'error');
            } finally {
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.onerror = () => {
            showNotification('Не удалось считать файл.', 'error');
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    }, [showNotification, initialModulesData, handleResetSettings, applyImportedSettings]);

    // --- Memoized Derived Data ---
    const processedModules = React.useMemo(() => {
        if (isLoading) return [];

        const searchTermLower = debouncedSearchTerm.toLowerCase();
        const searched = !searchTermLower ? modules : modules.filter(m =>
            m.ruName.toLowerCase().includes(searchTermLower) ||
            (m.enName && m.enName.toLowerCase().includes(searchTermLower)) ||
            (m.effect && m.effect.toLowerCase().includes(searchTermLower))
        );
        let filtered = [];
        switch (filter) {
            case 'learned': filtered = searched.filter(m => m.learned); break;
            case 'notLearned': filtered = searched.filter(m => !m.learned); break;
            default: filtered = searched; break;
        }
        const { key: sortKey, direction: sortDirection } = sortConfig;
        const sortMultiplier = sortDirection === 'asc' ? 1 : -1;
        const columnType = columnConfig.find(c => c.id === sortKey)?.type || 'string';

        const sorted = [...filtered];
        sorted.sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];
            if (columnType === 'string') {
                valA = String(valA ?? '').toLowerCase();
                valB = String(valB ?? '').toLowerCase();
                const comp = valA.localeCompare(valB, 'ru');
                if (comp !== 0) return comp * sortMultiplier;
            } else if (columnType === 'number') {
                valA = Number(valA ?? 0);
                valB = Number(valB ?? 0);
                if (valA !== valB) return (valA - valB) * sortMultiplier;
            } else if (columnType === 'boolean') {
                valA = Boolean(valA);
                valB = Boolean(valB);
                if (valA !== valB) return (valA - valB) * sortMultiplier;
            }
            return a.ruName.localeCompare(b.ruName, 'ru');
        });
        return sorted;
    }, [modules, filter, sortConfig, debouncedSearchTerm, isLoading]);

    const dataLabels = React.useMemo(() => {
        return columnConfig.reduce((acc, col) => {
            acc[col.id] = col.label;
            return acc;
        }, {});
    }, []); // Depends only on columnConfig which is static

    const stats = React.useMemo(() => {
        if (isLoading) return { totalCount: 0, learnedCount: 0, percentage: "0.0" };
        const totalCount = modules.length;
        const learnedCount = modules.filter(m => m.learned).length;
        const percentage = totalCount > 0 ? ((learnedCount / totalCount) * 100).toFixed(1) : "0.0";
        return { totalCount, learnedCount, percentage };
    }, [modules, isLoading]);

    // --- Render ---
    if (isLoading || initialModulesData === null) {
        return <div className="loading-indicator">Загрузка модулей...</div>;
    }

    return (
        <React.Fragment>
            <button id="mobile-settings-button" onClick={toggleMobileSidebar} aria-label="Открыть меню">☰</button>
            <div id="sidebar-overlay" className={isMobileSidebarOpen ? 'active' : ''} onClick={toggleMobileSidebar}></div>
            <input type="file" id="file-import-input" ref={fileInputRef} onChange={handleImportFile} accept=".json" style={{ display: 'none' }}/>

            <div className="pipboy-container">
                <Sidebar
                    isMobileOpen={isMobileSidebarOpen}
                    isDesktopCollapsed={isDesktopSidebarCollapsed}
                    onMobileClose={toggleMobileSidebar}
                    currentFilter={filter}
                    onFilterChange={setFilter}
                    stats={stats}
                    columnConfig={columnConfig}
                    columnVisibility={columnVisibility}
                    tempWidths={tempWidths}
                    onVisibilityChange={handleVisibilityChange}
                    onTempWidthChange={handleTempWidthChange}
                    onResetSettings={handleResetSettings}
                    onImportClick={handleImportClick}
                    onExport={handleExport}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    onAddModuleClick={handleOpenAddModal}
                />
                 <button
                     id="desktop-sidebar-toggle"
                     onClick={toggleDesktopSidebar}
                     aria-label={isDesktopSidebarCollapsed ? "Развернуть боковую панель" : "Свернуть боковую панель"}
                     title={isDesktopSidebarCollapsed ? "Развернуть боковую панель" : "Свернуть боковую панель"}
                 >
                     {isDesktopSidebarCollapsed ? '»' : '«'}
                 </button>

                <div className="pipboy-content">
                     <ScrollableContainer className="pipboy-content-wrapper hide-scrollbar">
                        <div className="pipboy-header">Менеджер Легендарных Модулей</div>
                        <ModuleTable
                             modules={processedModules}
                             columnConfig={columnConfig}
                             columnVisibility={columnVisibility}
                             columnWidths={columnWidths}
                             sortConfig={sortConfig}
                             onSort={handleSort}
                             dataLabels={dataLabels}
                             onLearnedChange={handleLearnedChange}
                             onEdit={handleOpenEditModal}
                             onDelete={handleDeleteModule}
                             highlightTerm={debouncedSearchTerm}
                         />
                     </ScrollableContainer>
                </div>
            </div>

             <EditModuleModal
                 isOpen={isModalOpen} // Use isModalOpen
                 module={itemBeingEdited} // Use itemBeingEdited
                 onClose={closeModal} // Use closeModal
                 onSave={itemBeingEdited ? handleSaveChangesInModal : handleAddNewModule} // Use itemBeingEdited
             />
             <Notification {...notification} />
        </React.Fragment>
    );
}

// --- React Initialization ---
const container = document.getElementById('root');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </React.StrictMode>
    );
} else {
    console.error('Root element (#root) not found. React app could not be mounted.');
}