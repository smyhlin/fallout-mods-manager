// app.jsx

// --- Main App Component ---
function App() {
    const { t, language, switchLanguage, languageModules: initialModulesDataFromContext, isLoadingContext } = useTranslation();

    const [modules, setModules] = React.useState([]);
    const [filter, setFilter] = React.useState('all');
    const [selectedStars, setSelectedStars] = React.useState(null);
    const [selectedCompatibility, setSelectedCompatibility] = React.useState(null); // New state for compatibility filter
    const [searchTerm, setSearchTerm] = React.useState('');
    const [notification, showNotification] = useNotification();

    const [activeView, setActiveView] = React.useState('modules');
    const [activeHoloHubPage, setActiveHoloHubPage] = React.useState(holoHubPagesConfig[0].id);

    const fileInputRef = React.useRef(null);

    const {
        columnSettings, columnVisibility, columnWidths, sortConfig, tempWidths,
        handleVisibilityChange, handleTempWidthChange, handleSort,
        handleResetSettings, applyImportedSettings,
    } = useTableState(columnConfig, showNotification);

    const { isMobileSidebarOpen, toggleMobileSidebar, isDesktopSidebarCollapsed, toggleDesktopSidebar } = useSidebarState();
    const { isModalOpen, itemBeingEdited, openModal, closeModal } = useModalState();

    const {
        handleLearnedChange, handleAddNewModule, handleSaveChangesInModal, handleDeleteModule,
    } = useModuleManagement(modules, setModules, showNotification, closeModal);

    const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY.SEARCH);

    React.useEffect(() => {
        document.title = t('appTitle');
        document.documentElement.lang = language;
        document.querySelectorAll('noscript[lang]').forEach(tag => {
            tag.style.display = tag.getAttribute('lang') === language ? 'block' : 'none';
        });
    }, [language, t]);

    React.useEffect(() => {
        if (isLoadingContext) return;

        const loadedLearnedStatus = loadLearnedStatus();
        const loadedCustomModules = loadCustomModules();

        const baseModules = initialModulesDataFromContext.map(m => {
            const key = m.module_editor_id || `${m.module_name}-${m.module_star}`;
            return {
                ...m,
                learned: !!loadedLearnedStatus[key],
                isCustom: false,
            };
        });

        const customModulesWithLearned = loadedCustomModules.map(cm => {
            const key = cm.module_editor_id || `${cm.ruName}-${cm.stars}`;
            return {
                ...cm,
                learned: !!loadedLearnedStatus[key],
            };
        });

        setModules([...baseModules, ...customModulesWithLearned]);

    }, [initialModulesDataFromContext, language, isLoadingContext]);

    // THIS IS THE CORRECTED useEffect for saving data
    React.useEffect(() => {
        if (isLoadingContext || modules.length === 0) return;

        const learnedToSave = {};
        const customToSave = [];

        modules.forEach(m => {
            // Determine the key: module_editor_id for base, or for custom if it exists.
            // Fallback to name-stars for custom modules if module_editor_id is somehow missing.
            const key = m.module_editor_id || 
                        (m.isCustom ? `${m.ruName}-${m.stars}` : `${m.module_name}-${m.module_star}`);
            
            if (typeof m.learned === 'boolean') {
                 learnedToSave[key] = m.learned;
            }
            if (m.isCustom) {
                // Ensure custom modules save with the fields expected by loadCustomModules
                const customModuleToSave = {
                    ruName: m.ruName,
                    enName: m.enName,
                    stars: m.stars,
                    effect: m.effect,
                    compatibility: m.compatibility, // Stored as string
                    materials: m.materials,
                    isCustom: true,
                    module_editor_id: m.module_editor_id, // Persist if it has one
                };
                customToSave.push(customModuleToSave);
            }
        });
        saveLearnedStatus(learnedToSave);
        saveCustomModules(customToSave);
    }, [modules, isLoadingContext]); // End of corrected useEffect


    const handleOpenEditModal = React.useCallback((module) => openModal(module), [openModal]);
    const handleOpenAddModal = React.useCallback(() => openModal(), [openModal]);
    const handleSearchChange = React.useCallback((e) => setSearchTerm(e.target.value), []);
    // New handler for compatibility filter change
    const handleCompatibilityFilterChange = React.useCallback((compatibility) => {
        setSelectedCompatibility(compatibility);
    }, []);

    // Define compatibility options for filtering
    const compatibilityOptions = React.useMemo(() => [
        'Weapon Range',
        'Melee',
        'Armor',
        'Power Armor',
    ], []);

    const handleExport = React.useCallback(() => {
        try {
            const learnedStatusToExport = {};
            const customModulesToExport = [];
            modules.forEach(m => {
                const key = m.module_editor_id || (m.isCustom ? `${m.ruName}-${m.stars}` : `${m.module_name}-${m.module_star}`);
                if (typeof m.learned === 'boolean') learnedStatusToExport[key] = m.learned;
                if (m.isCustom) {
                     const customModuleToExport = {
                        ruName: m.ruName,
                        enName: m.enName,
                        stars: m.stars,
                        effect: m.effect,
                        compatibility: m.compatibility,
                        materials: m.materials,
                        isCustom: true,
                        module_editor_id: m.module_editor_id,
                    };
                    customModulesToExport.push(customModuleToExport);
                }
            });

            const dataToExport = {
                learnedStatus: learnedStatusToExport,
                customModules: customModulesToExport,
                columnSettings: { visibility: columnVisibility, widths: columnWidths },
                languageExportedFrom: language,
            };
            const jsonString = JSON.stringify(dataToExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `fallout76_modules_backup_${language}_${new Date().toISOString().slice(0,10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showNotification(t('notificationExportSuccess'), 'success');
        } catch (error) {
            console.error("Export failed:", error);
            showNotification(t('notificationExportError'), 'error');
        }
    }, [modules, columnVisibility, columnWidths, language, showNotification, t]);

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

                if (isLoadingContext) {
                    showNotification(t('notificationImportInitialDataNotLoaded'), 'error');
                    return;
                }

                if (window.confirm(t('confirmImport'))) {
                    let newLearnedStatus = loadLearnedStatus();
                    if (importedData.learnedStatus && typeof importedData.learnedStatus === 'object') {
                        newLearnedStatus = { ...newLearnedStatus, ...importedData.learnedStatus };
                    }
                    saveLearnedStatus(newLearnedStatus);

                    let newCustomModules = loadCustomModules();
                    if (Array.isArray(importedData.customModules)) {
                        const importedCustomMap = new Map(importedData.customModules.map(m => [m.module_editor_id || `${m.ruName}-${m.stars}`, m]));
                        newCustomModules = newCustomModules.map(existingCm => {
                            const key = existingCm.module_editor_id || `${existingCm.ruName}-${existingCm.stars}`;
                            if (importedCustomMap.has(key)) {
                                const imported = importedCustomMap.get(key);
                                importedCustomMap.delete(key);
                                return imported;
                            }
                            return existingCm;
                        });
                        importedCustomMap.forEach(newCm => newCustomModules.push(newCm));
                    }
                    saveCustomModules(newCustomModules);

                    const currentInitial = initialModulesDataFromContext;
                    const baseModules = currentInitial.map(m => {
                        const key = m.module_editor_id || `${m.module_name}-${m.module_star}`;
                        return { ...m, learned: !!newLearnedStatus[key], isCustom: false };
                    });
                    const customModulesWithLearned = newCustomModules.map(cm => {
                        const key = cm.module_editor_id || `${cm.ruName}-${cm.stars}`;
                        return { ...cm, learned: !!newLearnedStatus[key] };
                    });
                    setModules([...baseModules, ...customModulesWithLearned]);


                    if (importedData.columnSettings && typeof importedData.columnSettings === 'object') {
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
    }, [showNotification, isLoadingContext, initialModulesDataFromContext, applyImportedSettings, handleResetSettings, setModules, t]);

    const overallAppTitle = React.useMemo(() => t('pageTitleApp'), [t]);

    const currentViewDisplayTitle = React.useMemo(() => {
        if (activeView === 'modules') return t('headerTitleModules');
        if (activeView === 'holohub') {
            const pageConfig = holoHubPagesConfig.find(p => p.id === activeHoloHubPage);
            return pageConfig ? t(pageConfig.labelKey) : t('headerTitleHoloHub');
        }
        return '';
    }, [activeView, activeHoloHubPage, t]);

    const processedModules = React.useMemo(() => {
        if (isLoadingContext || activeView !== 'modules') return [];
        const searchTermLower = debouncedSearchTerm.toLowerCase();

        const searched = !searchTermLower ? modules : modules.filter(m => {
            const primaryName = m.module_name || m.ruName || '';
            const effectText = m.module_description || m.effect || '';
            const materialsText = m.module_materials || (m.isCustom && m.materials) || '';
            const compatibilityArray = m.module_compatibility || (m.isCustom && m.compatibility ? m.compatibility.split(',').map(s=>s.trim()) : []);
            const compatibilityText = compatibilityArray.join(' ').toLowerCase();


            return primaryName.toLowerCase().includes(searchTermLower) ||
                   effectText.toLowerCase().includes(searchTermLower) ||
                   materialsText.toLowerCase().includes(searchTermLower) ||
                   compatibilityText.includes(searchTermLower);
        });

        let filtered = [];
        switch (filter) {
            case 'learned': filtered = searched.filter(m => m.learned); break;
            case 'notLearned': filtered = searched.filter(m => !m.learned); break;
            default: filtered = searched; break;
        }
        if (selectedStars !== null) {
            filtered = filtered.filter(m => (m.module_star || m.stars) === selectedStars);
        }
        // New filter for compatibility
        if (selectedCompatibility !== null) {
             filtered = filtered.filter(m => {
                // Get compatibility data, handling both base (array) and custom (string) modules
                const moduleCompatibility = m.module_compatibility || (m.isCustom ? m.compatibility : '');

                // Convert to a consistent array of lowercase, trimmed strings
                const compatibilityItems = Array.isArray(moduleCompatibility)
                    ? moduleCompatibility.map(item => String(item).trim().toLowerCase())
                    : String(moduleCompatibility || '').split(',').map(item => item.trim().toLowerCase()).filter(item => item !== ''); // Split string, trim, lowercase, remove empty

                // Check if any item in the module's compatibility list matches the selected filter option
                const selectedLower = selectedCompatibility.toLowerCase();

                return compatibilityItems.some(item => {
                    // Specific checks for weapon types based on keywords
                    if (selectedLower === 'weapon range') {
                        return item.includes('range'); // Match 'weapon: ranged' or similar
                    } else if (selectedLower === 'melee') {
                        return item.includes('melee'); // Match 'weapon: melee' or similar
                    } else {
                        // For Armor and Power Armor, assume exact match is intended
                        return item === selectedLower;
                    }
                });
             });
        }


        const { key: sortKey, direction: sortDirection } = sortConfig;
        const sortMultiplier = sortDirection === 'asc' ? 1 : -1;
        const columnType = columnConfig.find(c => c.id === sortKey)?.type || 'string';

        const sorted = [...filtered];
        sorted.sort((a, b) => {
            let valA, valB;
            if (sortKey === 'name') {
                valA = a.module_name || a.ruName || '';
                valB = b.module_name || b.ruName || '';
            } else if (sortKey === 'stars') {
                valA = a.module_star || a.stars || 0;
                valB = b.module_star || b.stars || 0;
            } else if (sortKey === 'effect') {
                valA = a.module_description || a.effect || '';
                valB = b.module_description || b.effect || '';
            } else if (sortKey === 'module_materials') {
                valA = a.module_materials || (a.isCustom && a.materials) || '';
                valB = b.module_materials || (b.isCustom && b.materials) || '';
            }
            else {
                valA = a[sortKey];
                valB = b[sortKey];
            }


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

            const nameA = a.module_name || a.ruName || '';
            const nameB = b.module_name || b.ruName || '';
            const compName = nameA.localeCompare(nameB, language);
            if (compName !== 0) return compName;

            const starsA = a.module_star || a.stars || 0;
            const starsB = b.module_star || b.stars || 0;
            return (starsA - starsB);
        });
        return sorted;
    }, [modules, filter, selectedStars, selectedCompatibility, sortConfig, debouncedSearchTerm, isLoadingContext, language, activeView]);

    const dataLabels = React.useMemo(() => columnConfig.reduce((acc, col) => { acc[col.id] = t(col.labelKey); return acc; }, {}), [t]);

    const stats = React.useMemo(() => {
        if (isLoadingContext || activeView !== 'modules') return { totalCount: 0, learnedCount: 0, percentage: "0.0", visibleCount: 0, visibleModuleSamples: [] };

        const totalDisplayableModules = modules.length;
        const learnedCount = modules.filter(m => m.learned).length;
        const percentage = totalDisplayableModules > 0 ? ((learnedCount / totalDisplayableModules) * 100).toFixed(1) : "0.0";
        const visibleCount = processedModules.length;
        const visibleModuleSamples = processedModules.slice(0, MAX_VISIBLE_MODULE_SAMPLES_IN_BANNER).map(m => m.module_name || m.ruName);

        return { totalCount: totalDisplayableModules, learnedCount, percentage, visibleCount, visibleModuleSamples };
    }, [modules, isLoadingContext, processedModules, activeView]);

    if (isLoadingContext && !initialModulesDataFromContext.length && !loadCustomModules().length) {
        return <div className="loading-indicator">{t('loadingMessage')}</div>;
    }


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
                    activeView={activeView}
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
                    selectedCompatibility={selectedCompatibility} // Pass new state
                    onCompatibilityFilterChange={handleCompatibilityFilterChange} // Pass new handler
                    compatibilityOptions={compatibilityOptions} // Pass compatibility options
                    activeHoloHubPage={activeHoloHubPage}
                    onHoloHubPageChange={setActiveHoloHubPage}
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
                            <HoloHubView activePage={activeHoloHubPage} allModules={modules} />
                        )}
                    </ScrollableContainer>
                </div>
            </div>

            {activeView === 'modules' && (
                 <EditModuleModal
                    isOpen={isModalOpen}
                    module={itemBeingEdited}
                    onClose={closeModal}
                    onSave={itemBeingEdited ? (originalModule, updatedData) => handleSaveChangesInModal(itemBeingEdited, updatedData) : handleAddNewModule}
                />
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