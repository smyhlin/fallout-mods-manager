// app.jsx

// --- Main App Component ---
function App() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [initialModulesData, setInitialModulesData] = React.useState(null);
    const [modules, setModules] = React.useState([]);
    const [filter, setFilter] = React.useState('all');
    const [selectedStars, setSelectedStars] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [notification, showNotification] = useNotification();
    const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = React.useState(false);
    
    const [activeView, setActiveView] = React.useState('modules'); // 'modules' or 'holohub'
    const [activeHoloHubPage, setActiveHoloHubPage] = React.useState(holoHubPagesConfig[0].id); // Default to first Holo-Hub page

    const fileInputRef = React.useRef(null);

    const { t, language, switchLanguage } = useTranslation();

    const {
        columnSettings, columnVisibility, columnWidths, sortConfig, tempWidths,
        handleVisibilityChange, handleTempWidthChange, handleSort,
        handleResetSettings, applyImportedSettings,
    } = useTableState(columnConfig, showNotification);

    const { isMobileSidebarOpen, toggleMobileSidebar } = useSidebarState();
    const { isModalOpen, itemBeingEdited, openModal, closeModal } = useModalState();
    const {
        handleLearnedChange, handleAddNewModule, handleSaveChangesInModal, handleDeleteModule,
    } = useModuleManagement(modules, setModules, showNotification, closeModal, t);

    const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY.SEARCH);

    React.useEffect(() => {
        document.title = t('appTitle');
        document.documentElement.lang = language;
        document.querySelectorAll('noscript[lang]').forEach(tag => {
            tag.style.display = tag.getAttribute('lang') === language ? 'block' : 'none';
        });
    }, [language, t]);

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
                showNotification(t('notificationErrorInitialData'), 'error');
                setInitialModulesData([]);
                setModules(loadModules([]));
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [showNotification, t]);

    React.useEffect(() => {
        if (!isLoading && initialModulesData !== null && activeView === 'modules') {
            saveModules(modules);
        }
    }, [modules, isLoading, initialModulesData, activeView]);

    const handleOpenEditModal = React.useCallback((module) => openModal(module), [openModal]);
    const handleOpenAddModal = React.useCallback(() => openModal(), [openModal]);
    const handleSearchChange = React.useCallback((e) => setSearchTerm(e.target.value), []);
    
    const handleExport = React.useCallback(() => {
        try {
            const dataToExport = {
                modules: modules.map(({ ruName, stars, learned, enName, effect, isCustom }) => 
                    ({ ruName, stars, learned, enName, effect, isCustom })),
                columnSettings: { visibility: columnVisibility, widths: columnWidths },
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
            showNotification(t('notificationExportSuccess'), 'success');
        } catch (error) {
            console.error("Export failed:", error);
            showNotification(t('notificationExportError'), 'error');
        }
    }, [modules, columnVisibility, columnWidths, showNotification, t]);

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
                if (!importedData || typeof importedData !== 'object') throw new Error(t('notificationImportErrorInvalidFormat'));
                if (!Array.isArray(importedData.modules)) throw new Error(t('notificationImportErrorMissingModules'));
                
                if (initialModulesData === null) {
                    showNotification(t('notificationImportInitialDataNotLoaded'), 'error');
                    return;
                }

                const hasSettings = importedData.columnSettings && 
                                 typeof importedData.columnSettings === 'object';

                if (window.confirm(t('confirmImport'))) {
                    let importedModules = [];
                    const initialMap = new Map(initialModulesData.map(m => [`${m.ruName}-${m.stars}`, { ...m, isCustom: false }]));
                    const importedMap = new Map();
                    
                    importedData.modules.forEach(m => {
                        if(m && m.ruName && m.stars) importedMap.set(`${m.ruName}-${m.stars}`, m);
                    });

                    initialMap.forEach((initialModule, key) => {
                        const imported = importedMap.get(key);
                        if (imported) {
                            importedModules.push({
                                ...initialModule,
                                learned: !!imported.learned,
                                isCustom: typeof imported.isCustom === 'boolean' ? imported.isCustom : !initialMap.has(key)
                            });
                            importedMap.delete(key);
                        } else {
                            importedModules.push({ ...initialModule, learned: false });
                        }
                    });

                    importedMap.forEach(custom => {
                        importedModules.push({
                            ruName: custom.ruName,
                            enName: custom.enName || '',
                            stars: custom.stars,
                            effect: custom.effect || '',
                            learned: !!custom.learned,
                            isCustom: true
                        });
                    });

                    setModules(importedModules);

                    if (hasSettings) {
                        applyImportedSettings(importedData.columnSettings);
                    } else {
                        handleResetSettings();
                    }
                    
                    showNotification(t('notificationImportSuccess'), 'success');
                }
            } catch (error) {
                console.error("Import failed:", error);
                const errorMessage = error.message || t('notificationImportErrorUnknown');
                showNotification(t('notificationImportError', { message: errorMessage }), 'error');
            } finally {
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.onerror = () => {
            showNotification(t('notificationImportError', { message: t('notificationImportErrorReadFile') }), 'error');
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    }, [showNotification, initialModulesData, applyImportedSettings, handleResetSettings, setModules, t]);
    
    const toggleDesktopSidebar = React.useCallback(() => setIsDesktopSidebarCollapsed(prev => !prev), []);
    
    const overallAppTitle = React.useMemo(() => t('pageTitleApp'), [t]);

    const currentViewDisplayTitle = React.useMemo(() => {
        // This is the H2 title for the current tab/view content area
        if (activeView === 'modules') return t('headerTitleModules');
        if (activeView === 'holohub') {
            const pageConfig = holoHubPagesConfig.find(p => p.id === activeHoloHubPage);
            return pageConfig ? t(pageConfig.labelKey) : t('headerTitleHoloHub');
        }
        return ''; 
    }, [activeView, activeHoloHubPage, t]);

    const processedModules = React.useMemo(() => {
        if (isLoading || activeView !== 'modules') return [];
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
        if (selectedStars !== null) filtered = filtered.filter(m => m.stars === selectedStars);
        const { key: sortKey, direction: sortDirection } = sortConfig;
        const sortMultiplier = sortDirection === 'asc' ? 1 : -1;
        const columnType = columnConfig.find(c => c.id === sortKey)?.type || 'string';
        const sorted = [...filtered];
        sorted.sort((a, b) => {
            let valA = a[sortKey]; let valB = b[sortKey];
            if (columnType === 'string') {
                valA = String(valA ?? '').toLowerCase(); valB = String(valB ?? '').toLowerCase();
                const comp = valA.localeCompare(valB, language);
                if (comp !== 0) return comp * sortMultiplier;
            } else if (columnType === 'number') {
                valA = Number(valA ?? 0); valB = Number(valB ?? 0);
                if (valA !== valB) return (valA - valB) * sortMultiplier;
            } else if (columnType === 'boolean') {
                valA = Boolean(valA); valB = Boolean(valB);
                if (valA !== valB) return (valA - valB) * sortMultiplier;
            }
            const compName = a.ruName.localeCompare(b.ruName, language);
            if (compName !== 0) return compName;
            return (a.stars - b.stars);
        });
        return sorted;
    }, [modules, filter, selectedStars, sortConfig, debouncedSearchTerm, isLoading, language, activeView]);
    
    const dataLabels = React.useMemo(() => columnConfig.reduce((acc, col) => { acc[col.id] = t(col.labelKey); return acc; }, {}), [columnConfig, t]);
    
    const stats = React.useMemo(() => {
        if (isLoading || activeView !== 'modules') return { totalCount: 0, learnedCount: 0, percentage: "0.0", visibleCount: 0, visibleModuleSamples: [] };
        const totalCount = modules.length;
        const learnedCount = modules.filter(m => m.learned).length;
        const percentage = totalCount > 0 ? ((learnedCount / totalCount) * 100).toFixed(1) : "0.0";
        const visibleCount = processedModules.length;
        const visibleModuleSamples = processedModules.slice(0, MAX_VISIBLE_MODULE_SAMPLES_IN_BANNER).map(m => m.ruName);
        return { totalCount, learnedCount, percentage, visibleCount, visibleModuleSamples };
    }, [modules, isLoading, processedModules, activeView]); 

    if (isLoading && initialModulesData === null) return <div className="loading-indicator">{t('loadingMessage')}</div>;

    return (
        <React.Fragment>
            <button id="mobile-settings-button" onClick={toggleMobileSidebar} aria-label={t('mobileMenuButtonLabel')}>☰</button>
            <div id="sidebar-overlay" className={isMobileSidebarOpen ? 'active' : ''} onClick={toggleMobileSidebar}></div>
            <input 
                type="file" 
                id="file-import-input" 
                ref={fileInputRef} 
                onChange={handleImportFile} 
                accept=".json" 
                style={{ display: 'none' }}
            />

            <div className={`pipboy-container ${isDesktopSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                <Sidebar
                    isMobileOpen={isMobileSidebarOpen}
                    isDesktopCollapsed={isDesktopSidebarCollapsed}
                    onMobileClose={toggleMobileSidebar}
                    activeView={activeView} // Pass activeView
                    currentFilter={filter}
                    onFilterChange={setFilter}
                    columnConfig={columnConfig}
                    columnVisibility={columnVisibility}
                    tempWidths={tempWidths}
                    onVisibilityChange={handleVisibilityChange}
                    onTempWidthChange={handleTempWidthChange}
                    onResetSettings={handleResetSettings}
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    currentLanguage={language}
                    onLanguageChange={switchLanguage}
                    selectedStars={selectedStars}
                    onStarFilterChange={setSelectedStars}
                    activeHoloHubPage={activeHoloHubPage} // Pass HoloHub page state
                    onHoloHubPageChange={setActiveHoloHubPage} // Pass HoloHub page handler
                />
                
                <div className="pipboy-content">
                    <div className="app-main-header">
                        <div className="app-main-header-title-area">
                            <h1 className="app-main-header-title">{overallAppTitle}</h1>
                        </div>
                        <div className="app-main-header-actions"></div>
                    </div>

                    <TabNavigation activeView={activeView} onTabChange={setActiveView} />

                    <div className="pipboy-header">
                        <div className="pipboy-header-main">
                            <h2 className="pipboy-view-title">{currentViewDisplayTitle}</h2>
                        </div>
                        <div className="header-actions">
                            {activeView === 'modules' && (
                                <React.Fragment>
                                    <button onClick={handleOpenAddModal} className="header-action-button" title={t('ioAddModuleButton')}>
                                        <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"/></svg>
                                    </button>
                                    <button onClick={handleImportClick} className="header-action-button" title={t('ioImportButton')}>
                                        <svg viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/></svg>
                                    </button>
                                    <button onClick={handleExport} className="header-action-button" title={t('ioExportButton')}>
                                        <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18h14v2H5v-2z"/></svg>
                                    </button>
                                </React.Fragment>
                            )}
                            <button
                                id="desktop-sidebar-toggle-header"
                                onClick={toggleDesktopSidebar}
                                className="header-action-button"
                                title={isDesktopSidebarCollapsed ? t('desktopSidebarToggleExpandLabel') : t('desktopSidebarToggleCollapseLabel')}
                            >
                                <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="1" ry="1"/>
                                    <line x1="10" y1="3" x2="10" y2="21"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <ScrollableContainer className="pipboy-content-wrapper hide-scrollbar">
                        {activeView === 'modules' && (
                            <React.Fragment>
                                <StatsBanner stats={stats} /> 
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
                            </React.Fragment>
                        )}
                        {activeView === 'holohub' && (
                            <HoloHubView activePage={activeHoloHubPage} />
                        )}
                    </ScrollableContainer>
                </div>
            </div>

            {activeView === 'modules' && (
                <EditModuleModal isOpen={isModalOpen} module={itemBeingEdited} onClose={closeModal} onSave={itemBeingEdited ? handleSaveChangesInModal : handleAddNewModule} />
            )}
            <Notification {...notification} />
        </React.Fragment>
    );
}

const container = document.getElementById('root');
if (container) {
    const root = ReactDOM.createRoot(container);
    root.render(
        <React.StrictMode>
            <window.LanguageProvider>
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </window.LanguageProvider>
        </React.StrictMode>
    );
} else {
    console.error('Root element (#root) not found. React app could not be mounted.');
}