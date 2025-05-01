// components.jsx
const PropTypes = window.PropTypes;

// --- Error Boundary ---
class ErrorBoundaryClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    const { t } = this.props;
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#f56565', border: '2px dashed #f56565', margin: '20px' }}>
          <h2>{t('errorBoundaryTitle')}</h2>
          <p>{t('errorBoundaryMessage')}</p>
          {this.state.error && <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{this.state.error.toString()}</pre>}
        </div>
      );
    }
    return this.props.children;
  }
}
ErrorBoundaryClass.propTypes = {
    children: PropTypes.node.isRequired,
    t: PropTypes.func.isRequired,
};

// Wrapper functional component to use the hook
const ErrorBoundary = (props) => {
    const { t } = window.useTranslation();
    return <ErrorBoundaryClass {...props} t={t} />;
};

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};


// --- Components ---

const Notification = React.memo(({ message, type, show }) => (
    <div className={`notification ${type} ${show ? 'show' : ''}`} role="alert">{message}</div>
));
Notification.propTypes = {
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
};

const SearchInput = React.memo(({ searchTerm, onSearchChange }) => {
    const { t } = window.useTranslation();
    return (
        <div className="sidebar-section search-section">
            <label htmlFor="search-input" className="settings-label">{t('searchLabel')}</label>
            <div className="search-input-wrapper">
                <input
                    type="search"
                    id="search-input"
                    className="search-input"
                    placeholder={t('searchInputPlaceholder')}
                    value={searchTerm}
                    onChange={onSearchChange}
                    aria-label={t('searchLabel')}
                />
                {searchTerm && (
                    <button
                        type="button"
                        className="clear-search-button"
                        onClick={() => onSearchChange({ target: { value: '' } })}
                        aria-label={t('searchClearButtonLabel')}
                    >
                        ×
                    </button>
                )}
            </div>
        </div>
    );
});
SearchInput.propTypes = {
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
};

// onSidebarClose is used to close the mobile sidebar after filter selection
const FilterControls = React.memo(({ currentFilter, onFilterChange, onSidebarClose }) => {
    const { t } = window.useTranslation();
    return (
        <div className="sidebar-section">
            <button className={`sidebar-button ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => { onFilterChange('all'); onSidebarClose?.(); }}>{t('filterAll')}</button>
            <button className={`sidebar-button ${currentFilter === 'learned' ? 'active' : ''}`} onClick={() => { onFilterChange('learned'); onSidebarClose?.(); }}>{t('filterLearned')}</button>
            <button className={`sidebar-button ${currentFilter === 'notLearned' ? 'active' : ''}`} onClick={() => { onFilterChange('notLearned'); onSidebarClose?.(); }}>{t('filterNotLearned')}</button>
        </div>
    );
});
FilterControls.propTypes = {
    currentFilter: PropTypes.oneOf(['all', 'learned', 'notLearned']).isRequired,
    onFilterChange: PropTypes.func.isRequired,
    onSidebarClose: PropTypes.func, // Optional callback for mobile
};

const StatsDisplay = React.memo(({ stats }) => {
    const { t } = window.useTranslation();
    return (
        <div className="stats-display">
            {t('statsTotal')} <strong>{stats.totalCount}</strong>
            <span style={{ margin: '0 0.5em' }}>|</span>
            {t('statsLearned')} <strong>{stats.learnedCount}</strong> ({stats.percentage}{t('statsPercentage')})
        </div>
    );
});
StatsDisplay.propTypes = {
    stats: PropTypes.shape({
        totalCount: PropTypes.number.isRequired,
        learnedCount: PropTypes.number.isRequired,
        percentage: PropTypes.string.isRequired,
    }).isRequired,
};

const SettingsSection = React.memo(({ columnConfig, columnVisibility, tempWidths, onVisibilityChange, onTempWidthChange, onResetSettings }) => {
    const { t } = window.useTranslation();
    return (
        <div className="sidebar-section">
            <h3 className="settings-label settings-title">{t('settingsTitle')}</h3>
            <h4 className="settings-label">{t('settingsColumnVisibility')}</h4>
            {columnConfig.map(col => (
                col.isVisibilityToggleable && (
                    <div key={`vis-toggle-${col.id}`} className="settings-control">
                        <label htmlFor={`vis-${col.id}`}>
                            <input
                                type="checkbox"
                                id={`vis-${col.id}`}
                                checked={!!columnVisibility[col.id]}
                                onChange={() => onVisibilityChange(col.id)}
                                className="learned-checkbox" // Add this class
                            />
                            {t(col.labelKey)}
                        </label>
                    </div>
                )
            ))}
            {/* Width settings only shown on desktop where table is visible */}
            <div className="column-width-settings">
                <h4 className="settings-label">{t('settingsColumnWidth')}</h4>
                {columnConfig.map(col => (
                    columnVisibility[col.id] && col.isWidthAdjustable && (
                        <div key={`width-slider-${col.id}`} className="settings-control">
                            <label htmlFor={`width-${col.id}`}>
                                {t(col.labelKey)}: <span className="width-value">({tempWidths[col.id] || col.defaultWidth}px)</span>
                            </label>
                            <input
                                type="range"
                                id={`width-${col.id}`}
                                min={col.minWidth || 50}
                                max={col.maxWidth || 600}
                                value={tempWidths[col.id] || col.defaultWidth}
                                onChange={(e) => onTempWidthChange(col.id, e.target.value)}
                                aria-label={t('settingsSortByLabel', { label: t(col.labelKey) })}
                            />
                        </div>
                    )
                ))}
            </div>
            <button className="sidebar-button reset-button" onClick={onResetSettings} style={{marginTop: '20px'}} aria-label={t('settingsResetButton')}>{t('settingsResetButton')}</button>
        </div>
    );
});
SettingsSection.propTypes = {
    columnConfig: PropTypes.array.isRequired,
    columnVisibility: PropTypes.object.isRequired,
    tempWidths: PropTypes.object.isRequired,
    onVisibilityChange: PropTypes.func.isRequired,
    onTempWidthChange: PropTypes.func.isRequired,
    onResetSettings: PropTypes.func.isRequired,
};

const IOSection = React.memo(({ onImportClick, onExport, onAddModuleClick }) => {
    const { t } = window.useTranslation();
    return (
        <div className="sidebar-section">
            <h3 className="settings-label settings-title">{t('ioTitle')}</h3>
            <button className="sidebar-button io-button add-button" onClick={onAddModuleClick} aria-label={t('ioAddModuleButton')}>{t('ioAddModuleButton')}</button>
            <button className="sidebar-button io-button" onClick={onImportClick} aria-label={t('ioImportButton')}>{t('ioImportButton')}</button>
            <button className="sidebar-button io-button" onClick={onExport} aria-label={t('ioExportButton')}>{t('ioExportButton')}</button>
        </div>
    );
});
IOSection.propTypes = {
    onImportClick: PropTypes.func.isRequired,
    onExport: PropTypes.func.isRequired,
    onAddModuleClick: PropTypes.func.isRequired,
};

const LanguageSwitcher = React.memo(({ currentLanguage, onLanguageChange }) => {
    const { t } = window.useTranslation();
    return (
        <div className="sidebar-section">
            <h3 className="settings-label settings-title">{t('languageSwitcherLabel')}</h3>
            <select 
                value={currentLanguage} 
                onChange={(e) => onLanguageChange(e.target.value)} 
                className="language-selector"
                aria-label={t('languageSwitcherLabel')}
            >
                <option value="en">English</option>
                <option value="ua">Українська</option>
                <option value="ru">Русский</option>
            </select>
        </div>
    );
});
LanguageSwitcher.propTypes = {
    currentLanguage: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
};

// Ensure consistent behavior for scroll arrows in mobile and desktop
const ScrollableContainer = ({ children, className = '' }) => {
    const scrollRef = React.useRef(null);
    const [canScrollUp, setCanScrollUp] = React.useState(false);
    const [canScrollDown, setCanScrollDown] = React.useState(false);
    const { t } = window.useTranslation();

    // Update the checkScroll function to ensure arrows are hidden when no scrolling is possible
    const checkScroll = React.useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;

        const isScrollable = el.scrollHeight > el.clientHeight;
        setCanScrollUp(isScrollable && el.scrollTop > 0);
        setCanScrollDown(isScrollable && el.scrollTop < el.scrollHeight - el.clientHeight);
    }, []);

    React.useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const resizeObserver = new ResizeObserver(checkScroll);
        resizeObserver.observe(el);
        const mutationObserver = new MutationObserver(checkScroll);
        mutationObserver.observe(el, { childList: true, subtree: true, characterData: true });

        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);

        checkScroll();

        return () => {
            resizeObserver.unobserve(el);
            mutationObserver.disconnect();
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [checkScroll]);

    const handleScroll = React.useCallback((direction) => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = direction === 'up' ? -SCROLL_STEP : SCROLL_STEP;
        el.scrollBy({ top: amount, behavior: 'smooth' });
    }, []);

    return (
        <div ref={scrollRef} className={`${className} hide-scrollbar`} onScroll={checkScroll}>
            {children}
            <button
                className={`scroll-arrow scroll-arrow-up ${!canScrollUp ? 'hidden' : ''}`}
                onClick={() => handleScroll('up')}
                aria-label={t('scrollUpLabel')}
                disabled={!canScrollUp}
            >▲</button>
            <button
                className={`scroll-arrow scroll-arrow-down ${!canScrollDown ? 'hidden' : ''}`}
                onClick={() => handleScroll('down')}
                aria-label={t('scrollDownLabel')}
                disabled={!canScrollDown}
            >▼</button>
        </div>
    );
};
ScrollableContainer.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

const Sidebar = React.memo(({
    isMobileOpen, isDesktopCollapsed, onMobileClose,
    currentFilter, onFilterChange, stats, columnConfig, columnVisibility,
    tempWidths, onVisibilityChange, onTempWidthChange,
    onResetSettings, onImportClick, onExport, searchTerm, onSearchChange, onAddModuleClick, currentLanguage, onLanguageChange
 }) => {
    const { t } = window.useTranslation();
    return (
        <div className={`pipboy-sidebar ${isDesktopCollapsed ? 'sidebar-collapsed' : ''} ${isMobileOpen ? 'mobile-sidebar-open' : ''}`}>
         <button className="mobile-close-button" onClick={onMobileClose} aria-label={t('mobileCloseButtonLabel')}>×</button>
         {/* Use ScrollableContainer for sidebar content */}
         <ScrollableContainer className="sidebar-content-wrapper">
            <h2>{t('sidebarTitle')}</h2>
            <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} />
            <FilterControls currentFilter={currentFilter} onFilterChange={onFilterChange} onSidebarClose={onMobileClose} />
            <StatsDisplay stats={stats} />
            <hr className="dotted-separator" />
            <SettingsSection
                columnConfig={columnConfig}
                columnVisibility={columnVisibility}
                tempWidths={tempWidths}
                onVisibilityChange={onVisibilityChange}
                onTempWidthChange={onTempWidthChange}
                onResetSettings={onResetSettings}
            />
             <IOSection
                 onImportClick={onImportClick}
                 onExport={onExport}
                 onAddModuleClick={onAddModuleClick}
             />
             <LanguageSwitcher 
                currentLanguage={currentLanguage} 
                onLanguageChange={onLanguageChange} 
            />
         </ScrollableContainer>
    </div>
    );
});
Sidebar.propTypes = {
    isMobileOpen: PropTypes.bool.isRequired,
    isDesktopCollapsed: PropTypes.bool.isRequired,
    onMobileClose: PropTypes.func.isRequired,
    currentFilter: PropTypes.string.isRequired,
    onFilterChange: PropTypes.func.isRequired,
    stats: PropTypes.object.isRequired,
    columnConfig: PropTypes.array.isRequired,
    columnVisibility: PropTypes.object.isRequired,
    tempWidths: PropTypes.object.isRequired,
    onVisibilityChange: PropTypes.func.isRequired,
    onTempWidthChange: PropTypes.func.isRequired,
    onResetSettings: PropTypes.func.isRequired,
    onImportClick: PropTypes.func.isRequired,
    onExport: PropTypes.func.isRequired,
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onAddModuleClick: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
};


const ModuleActions = React.memo(({ module, onEdit, onDelete }) => {
    const { t } = window.useTranslation();
    return (
        <div className="module-actions">
            <button onClick={() => onEdit(module)} className="action-button edit-button" aria-label={t('moduleActionsEditLabel', { moduleName: module.ruName })}>🔧</button>
            <button onClick={() => onDelete(module.ruName, module.stars)} className="action-button delete-button" aria-label={t('moduleActionsDeleteLabel', { moduleName: module.ruName })}>💀</button>
        </div>
    );
});
ModuleActions.propTypes = {
    module: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

// Represents a single row in the table (desktop) or a card (mobile)
const ModuleTableRow = React.memo(({ module, columnVisibility, dataLabels, onLearnedChange, onEdit, onDelete, highlightTerm }) => {
    const moduleKey = `${module.ruName}-${module.stars}`;
    const { t } = window.useTranslation();
    const learnedStatusText = module.learned ? t('learnedStatusLearned') : t('learnedStatusNotLearned');
    return (
     // The TR element acts as the container for both table cells and mobile card elements
     <tr key={moduleKey}>
        {/* --- Desktop Table Cells (hidden on mobile via CSS) --- */}
        <td style={{ width: '60px', textAlign: 'center', verticalAlign: 'middle' }}>
            <input
                type="checkbox"
                className="learned-checkbox"
                checked={!!module.learned}
                onChange={() => onLearnedChange(module.ruName, module.stars)}
                aria-label={t('learnedCheckboxLabel', { moduleName: module.ruName, status: learnedStatusText })} />
        </td>
        {columnVisibility.ruName && <td>{highlightText(module.ruName, highlightTerm)}</td>}
        {columnVisibility.enName && <td>{highlightText(module.enName || '-', highlightTerm)}</td>}
        {columnVisibility.stars && <td style={{ textAlign: 'center' }}>{getStars(module.stars)}</td>}
        {columnVisibility.effect && <td className="effect-cell">{highlightText(formatEffectText(module.effect), highlightTerm)}</td>}
        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            <ModuleActions module={module} onEdit={onEdit} onDelete={onDelete} />
        </td>

        {/* --- Mobile Card Elements (display: block on mobile via CSS) --- */}
        <div className="card-header">
             <input
                type="checkbox"
                className="learned-checkbox"
                checked={!!module.learned}
                onChange={() => onLearnedChange(module.ruName, module.stars)}
                aria-label={t('learnedCheckboxLabel', { moduleName: module.ruName, status: learnedStatusText })} />
             <ModuleActions module={module} onEdit={onEdit} onDelete={onDelete} />
        </div>
        <div className="card-body">
            {/* Render data rows only if the corresponding column is visible */}
            {columnVisibility.ruName && <div className="data-row" data-label={dataLabels.ruName}><span>{highlightText(module.ruName, highlightTerm)}</span></div>}
            {columnVisibility.enName && <div className="data-row" data-label={dataLabels.enName}><span>{highlightText(module.enName || '-', highlightTerm)}</span></div>}
            {columnVisibility.stars && <div className="data-row" data-label={dataLabels.stars}><span>{getStars(module.stars)}</span></div>}
            {columnVisibility.effect && <div className="data-row" data-label={dataLabels.effect}><span className="effect-cell">{highlightText(formatEffectText(module.effect), highlightTerm)}</span></div>}
        </div>
    </tr>
    );
});
ModuleTableRow.propTypes = {
    module: PropTypes.object.isRequired,
    columnVisibility: PropTypes.object.isRequired,
    dataLabels: PropTypes.object.isRequired,
    onLearnedChange: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    highlightTerm: PropTypes.string,
};


const ModuleTable = React.memo(({ modules, columnConfig, columnVisibility, columnWidths, sortConfig, onSort, dataLabels, onLearnedChange, onEdit, onDelete, highlightTerm }) => {
    const { t } = window.useTranslation();
    // Calculate visible columns for colSpan in empty message
    const visibleColumnCount = columnConfig.filter(c => columnVisibility[c.id]).length;
    return (
    <table className="module-table">
        <thead>
            <tr>
                {columnConfig.map(col => (
                    // Render header cell only if column is visible
                    columnVisibility[col.id] && (
                        <th
                            key={col.id}
                            className={col.isSortable ? 'sortable' : ''}
                            // Apply width from state if adjustable, otherwise use default
                            style={col.isWidthAdjustable && columnWidths[col.id] ? { width: `${columnWidths[col.id]}px` } : { width: col.defaultWidth ? `${col.defaultWidth}px` : undefined }}
                            onClick={col.isSortable ? () => onSort(col.id) : undefined}
                            aria-label={col.isSortable ? t('settingsSortByLabel', { label: t(col.labelKey) }) : t(col.labelKey)}
                            title={col.isSortable ? t('settingsSortByLabel', { label: t(col.labelKey) }) : undefined}
                        >
                            {t(col.labelKey)}
                            {/* Show sort indicator if this column is the active sort key */}
                            {col.isSortable && sortConfig.key === col.id && (
                                <span className="sort-indicator">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                            )}
                        </th>
                    )
                ))}
            </tr>
        </thead>
        <tbody>
            {modules.length > 0 ? (
                modules.map((module) => (
                    <ModuleTableRow
                        key={`${module.ruName}-${module.stars}`} // Unique key for each row
                        module={module}
                        columnVisibility={columnVisibility}
                        dataLabels={dataLabels}
                        onLearnedChange={onLearnedChange}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        highlightTerm={highlightTerm}
                    />
                ))
            ) : (
                // Display message when no modules match filters/search
                <tr>
                    <td colSpan={visibleColumnCount} className="no-modules-message">
                        {highlightTerm ? t('tableEmptySearch') : t('tableEmptyFilter')}
                    </td>
                </tr>
            )}
        </tbody>
    </table>
    );
});
ModuleTable.propTypes = {
    modules: PropTypes.array.isRequired,
    columnConfig: PropTypes.array.isRequired,
    columnVisibility: PropTypes.object.isRequired,
    columnWidths: PropTypes.object.isRequired,
    sortConfig: PropTypes.object.isRequired,
    onSort: PropTypes.func.isRequired,
    dataLabels: PropTypes.object.isRequired,
    onLearnedChange: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    highlightTerm: PropTypes.string,
};


// Form used for adding or editing modules (inside modal)
const ModuleForm = React.memo(({ formData, onChange, onSubmit, isEditMode = false, onCancelEdit = null, moduleBeingEdited = null }) => {
    const { t } = window.useTranslation();
    // Predefined modules (from initial JSON) cannot have their name/stars edited
    const isPredefined = isEditMode && moduleBeingEdited && !moduleBeingEdited.isCustom;
    const submitButtonText = isEditMode ? t('formButtonSaveEdit') : t('formButtonAddModule');
    return (
        <form onSubmit={onSubmit} className={`module-form ${isEditMode ? 'modal-form' : ''}`}>
            <div>
                <label htmlFor={isEditMode ? "edit-ruName" : "add-ruName"}>{t('formLabelRuName')}</label>
                <input
                    type="text"
                    id={isEditMode ? "edit-ruName" : "add-ruName"}
                    name="ruName"
                    value={formData.ruName}
                    onChange={onChange}
                    required
                    disabled={isPredefined} // Disable if predefined
                    aria-disabled={isPredefined}
                    aria-label={t('formLabelRuName')}
                />
            </div>
            <div>
                <label htmlFor={isEditMode ? "edit-enName" : "add-enName"}>{t('formLabelEnName')}</label>
                <input
                    type="text"
                    id={isEditMode ? "edit-enName" : "add-enName"}
                    name="enName"
                    value={formData.enName}
                    onChange={onChange}
                    aria-label={t('formLabelEnName')}
                 />
            </div>
            <div>
                <label htmlFor={isEditMode ? "edit-stars" : "add-stars"}>{t('formLabelStars')}</label>
                <select
                    id={isEditMode ? "edit-stars" : "add-stars"}
                    name="stars"
                    value={formData.stars}
                    onChange={onChange}
                    required
                    disabled={isPredefined} // Disable if predefined
                    aria-disabled={isPredefined}
                    aria-label={t('formLabelStars')}
                >
                    {/* Generate options dynamically or list them */}
                    {[1, 2, 3, 4].map(star => <option key={star} value={star}>{star}</option>)}
                </select>
            </div>
            <div className="form-field-full-width">
                <label htmlFor={isEditMode ? "edit-effect" : "add-effect"}>{t('formLabelEffect')}</label>
                <input
                    type="text"
                    id={isEditMode ? "edit-effect" : "add-effect"}
                    name="effect"
                    value={formData.effect}
                    onChange={onChange}
                    required
                    aria-label={t('formLabelEffect')}
                />
            </div>
            <div className="module-form-buttons form-field-full-width">
                {/* Show Cancel button only in edit mode */}
                {isEditMode && onCancelEdit && (
                    <button type="button" onClick={onCancelEdit}>{t('formButtonCancel')}</button>
                )}
                <button type="submit">{submitButtonText}</button>
            </div>
        </form>
    );
});
ModuleForm.propTypes = {
    formData: PropTypes.shape({
        ruName: PropTypes.string.isRequired,
        enName: PropTypes.string,
        stars: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        effect: PropTypes.string.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool,
    onCancelEdit: PropTypes.func,
    moduleBeingEdited: PropTypes.object,
};


// Modal for adding or editing modules
const EditModuleModal = React.memo(({ module, isOpen, onClose, onSave }) => {
    const { t } = window.useTranslation();
    // Initialize form state based on whether editing or adding
    const [formData, setFormData] = React.useState({ ruName: '', enName: '', stars: 1, effect: '' });
    const [originalKey, setOriginalKey] = React.useState(null); // Store the original key for comparison on save
    const isEditMode = !!module; // True if a module object is passed

    // Update form data when the module prop changes (e.g., opening modal for edit)
    React.useEffect(() => {
        if (module) {
            setFormData({
                ruName: module.ruName || '',
                enName: module.enName || '',
                stars: module.stars || 1,
                effect: module.effect || '',
                isCustom: module.isCustom // Keep track if it's custom
            });
            setOriginalKey(`${module.ruName}-${module.stars}`);
        } else {
            // Reset form for adding a new module
            setFormData({ ruName: '', enName: '', stars: 1, effect: '' });
            setOriginalKey(null);
        }
    }, [module]);

    // Handle form input changes
    const handleChange = React.useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'stars' ? parseInt(value, 10) : value }));
    }, []);

    // Handle form submission
    const handleSubmit = React.useCallback((e) => {
        e.preventDefault();
        onSave(originalKey, formData); // Pass original key and new data
    }, [formData, originalKey, onSave]);

    // Close modal if overlay is clicked
    const handleOverlayClick = React.useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    if (!isOpen) return null; // Don't render if not open

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
            {/* Stop propagation to prevent overlay click when clicking inside content */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="modal-close-button" onClick={onClose} aria-label={t('modalCloseButtonLabel')}>×</button>
                    <h3 id="edit-modal-title">{isEditMode ? t('modalTitleEdit') : t('modalTitleAdd')}</h3>
                </div>
                <div className="modal-body">
                    <ModuleForm
                        formData={formData}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        isEditMode={isEditMode}
                        onCancelEdit={onClose} // Pass close handler as cancel handler
                        moduleBeingEdited={module} // Pass the module being edited for form logic
                    />
                </div>
            </div>
        </div>
    );
});
EditModuleModal.propTypes = {
    module: PropTypes.object, // Null when adding
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};