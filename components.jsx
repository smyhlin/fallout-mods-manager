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
    onSidebarClose: PropTypes.func, 
};

const StatsBanner = React.memo(({ stats }) => {
    const { t } = window.useTranslation();
    const percentage = parseFloat(stats.percentage);

    return (
        <div className="stats-banner-container">
            <div className="stat-card">
                <div className="stat-card-content">
                    <span className="stat-card-title">{t('bannerTotalModules')}</span>
                    <span className="stat-card-value">{stats.totalCount}</span>
                </div>
                <div className="stat-card-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor"> {/* Layers icon */}
                        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zm0-10h14V7H7v2z"/>
                    </svg>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-card-content">
                    <span className="stat-card-title">{t('bannerModulesLearned')}</span>
                    <span className="stat-card-value">{stats.learnedCount}</span>
                </div>
                <div className="stat-card-icon">
                     <svg viewBox="0 0 24 24" fill="currentColor"> {/* Checkbox/list icon */}
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17zM19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                    </svg>
                </div>
            </div>
            {/* Percentage Learned Card - MOVED TO BE THIRD */}
            <div className="stat-card">
                <div className="stat-card-content">
                    <span className="stat-card-title">{t('bannerPercentageLearned')}</span>
                    <span className="stat-card-value">{stats.percentage}%</span>
                    <div className="stat-progress-bar-container">
                        <div 
                            className="stat-progress-bar-filled" 
                            style={{ width: `${percentage}%` }}
                            aria-valuenow={percentage}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            role="progressbar"
                        ></div>
                    </div>
                </div>
                <div className="stat-card-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor"> {/* Percent icon */}
                        <path d="M7.5 11C8.33 11 9 10.33 9 9.5S8.33 8 7.5 8 6 8.67 6 9.5 6.67 11 7.5 11zm9 4c.83 0 1.5-.67 1.5-1.5S17.33 12 16.5 12s-1.5.67-1.5 1.5.67 1.5 1.5 1.5zm-9.95-5.71L17.29 19.04c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L7.96 6.88a.9959.9959 0 00-1.41 0c-.39.39-.39 1.03 0 1.41z"/>
                    </svg>
                </div>
            </div>
            {/* Visible Modules Card - NOW FOURTH */}
            <div className="stat-card">
                <div className="stat-card-content">
                    <span className="stat-card-title">{t('bannerVisibleModules')}</span>
                    <span className="stat-card-value">{stats.visibleCount}</span>
                    {stats.visibleCount > 0 && stats.visibleModuleSamples && stats.visibleModuleSamples.length > 0}
                </div>
                <div className="stat-card-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor"> {/* Filter icon */}
                        <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
});
StatsBanner.propTypes = {
    stats: PropTypes.shape({
        totalCount: PropTypes.number.isRequired,
        learnedCount: PropTypes.number.isRequired,
        percentage: PropTypes.string.isRequired,
        visibleCount: PropTypes.number.isRequired,
        visibleModuleSamples: PropTypes.arrayOf(PropTypes.string).isRequired, // Added visibleModuleSamples
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
                                className="learned-checkbox"
                            />
                            {t(col.labelKey)}
                        </label>
                    </div>
                )
            ))}
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

const ScrollableContainer = ({ children, className = '' }) => {
    const scrollRef = React.useRef(null);
    const [canScrollUp, setCanScrollUp] = React.useState(false);
    const [canScrollDown, setCanScrollDown] = React.useState(false);
    const { t } = window.useTranslation();

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
        mutationObserver.observe(el, { childList: true, subtree: true, characterData: true, attributes: true }); // Added attributes
        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);
        checkScroll(); // Initial check
        
        // Re-check on children update might be too frequent, but let's try with MutationObserver
        const observerTimeout = setTimeout(checkScroll, 50); // Small delay after potential DOM changes

        return () => {
            clearTimeout(observerTimeout);
            resizeObserver.disconnect(); // Use disconnect instead of unobserve for multiple elements
            mutationObserver.disconnect();
            if (el) { // Check if el still exists
               el.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, [checkScroll, children]); // Re-run if children change to re-evaluate scroll state

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

const StarFilter = React.memo(({ selectedStars, onStarFilterChange }) => {
    const { t } = window.useTranslation();
    const stars = [1, 2, 3, 4];

    return (
        <div className="sidebar-section star-filter-section">
            <h3 className="settings-label settings-title">{t('starFilterTitle')}</h3>
            <div className="star-filter-buttons">
                <button
                    className={`sidebar-button ${!selectedStars ? 'active' : ''}`}
                    onClick={() => onStarFilterChange(null)}
                >
                    {t('starFilterAll')}
                </button>
                {stars.map(star => (
                    <button
                        key={star}
                        className={`sidebar-button ${selectedStars === star ? 'active' : ''}`}
                        onClick={() => onStarFilterChange(star)}
                        aria-label={t('starFilterButtonLabel', { count: star })}
                    >
                        {'⭐'.repeat(star)}
                    </button>
                ))}
            </div>
        </div>
    );
});
StarFilter.propTypes = {
    selectedStars: PropTypes.number,
    onStarFilterChange: PropTypes.func.isRequired,
};

const Sidebar = React.memo(({
    isMobileOpen, isDesktopCollapsed, onMobileClose,
    currentFilter, onFilterChange, columnConfig, columnVisibility,
    tempWidths, onVisibilityChange, onTempWidthChange,
    onResetSettings, searchTerm, onSearchChange, 
    currentLanguage, onLanguageChange, selectedStars, onStarFilterChange
}) => {
    const { t } = window.useTranslation();
    return (
        <div className={`pipboy-sidebar ${isDesktopCollapsed ? 'sidebar-collapsed' : ''} ${isMobileOpen ? 'mobile-sidebar-open' : ''}`}>
            <button className="mobile-close-button" onClick={onMobileClose} aria-label={t('mobileCloseButtonLabel')}>×</button>
            <ScrollableContainer className="sidebar-content-wrapper">
                <h2>{t('sidebarTitle')}</h2>
                <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} />
                <FilterControls currentFilter={currentFilter} onFilterChange={onFilterChange} onSidebarClose={onMobileClose} />
                <StarFilter selectedStars={selectedStars} onStarFilterChange={onStarFilterChange} />
                <hr className="dotted-separator" />
                <SettingsSection
                    columnConfig={columnConfig}
                    columnVisibility={columnVisibility}
                    tempWidths={tempWidths}
                    onVisibilityChange={onVisibilityChange}
                    onTempWidthChange={onTempWidthChange}
                    onResetSettings={onResetSettings}
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
    columnConfig: PropTypes.array.isRequired,
    columnVisibility: PropTypes.object.isRequired,
    tempWidths: PropTypes.object.isRequired,
    onVisibilityChange: PropTypes.func.isRequired,
    onTempWidthChange: PropTypes.func.isRequired,
    onResetSettings: PropTypes.func.isRequired,
    searchTerm: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    currentLanguage: PropTypes.string.isRequired,
    onLanguageChange: PropTypes.func.isRequired,
    selectedStars: PropTypes.number,
    onStarFilterChange: PropTypes.func.isRequired,
};


const ModuleActions = React.memo(({ module, onEdit, onDelete }) => {
    const { t } = window.useTranslation();
    return (
        <div className="module-actions">
            <button onClick={() => onEdit(module)} className="action-button edit-button" aria-label={t('moduleActionsEditLabel', { moduleName: module.ruName })}>
                <svg viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
            </button>
            <button onClick={() => onDelete(module.ruName, module.stars)} className="action-button delete-button" aria-label={t('moduleActionsDeleteLabel', { moduleName: module.ruName })}>
                <svg viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
        </div>
    );
});
ModuleActions.propTypes = {
    module: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

const ModuleTableRow = React.memo(({ module, columnVisibility, dataLabels, onLearnedChange, onEdit, onDelete, highlightTerm }) => {
    const moduleKey = `${module.ruName}-${module.stars}`;
    const { t } = window.useTranslation();
    const learnedStatusText = module.learned ? t('learnedStatusLearned') : t('learnedStatusNotLearned');
    return (
     <tr key={moduleKey}>
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
    const visibleColumnCount = columnConfig.filter(c => columnVisibility[c.id]).length;
    return (
    <table className="module-table">
        <thead>
            <tr>
                {columnConfig.map(col => (
                    columnVisibility[col.id] && (
                        <th
                            key={col.id}
                            className={col.isSortable ? 'sortable' : ''}
                            style={col.isWidthAdjustable && columnWidths[col.id] ? { width: `${columnWidths[col.id]}px` } : { width: col.defaultWidth ? `${col.defaultWidth}px` : undefined }}
                            onClick={col.isSortable ? () => onSort(col.id) : undefined}
                            aria-label={col.isSortable ? t('settingsSortByLabel', { label: t(col.labelKey) }) : t(col.labelKey)}
                            title={col.isSortable ? t('settingsSortByLabel', { label: t(col.labelKey) }) : undefined}
                        >
                            {t(col.labelKey)}
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
                        key={`${module.ruName}-${module.stars}`}
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

const ModuleForm = React.memo(({ formData, onChange, onSubmit, isEditMode = false, onCancelEdit = null, moduleBeingEdited = null }) => {
    const { t } = window.useTranslation();
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
                    disabled={isPredefined}
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
                    disabled={isPredefined}
                    aria-disabled={isPredefined}
                    aria-label={t('formLabelStars')}
                >
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

const EditModuleModal = React.memo(({ module, isOpen, onClose, onSave }) => {
    const { t } = window.useTranslation();
    const [formData, setFormData] = React.useState({ ruName: '', enName: '', stars: 1, effect: '' });
    const [originalKey, setOriginalKey] = React.useState(null);
    const isEditMode = !!module;

    React.useEffect(() => {
        if (module) {
            setFormData({
                ruName: module.ruName || '',
                enName: module.enName || '',
                stars: module.stars || 1,
                effect: module.effect || '',
                isCustom: module.isCustom
            });
            setOriginalKey(`${module.ruName}-${module.stars}`);
        } else {
            setFormData({ ruName: '', enName: '', stars: 1, effect: '' });
            setOriginalKey(null);
        }
    }, [module]);

    const handleChange = React.useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'stars' ? parseInt(value, 10) : value }));
    }, []);

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault();
        onSave(originalKey, formData); 
    }, [formData, originalKey, onSave]);

    const handleOverlayClick = React.useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby="edit-modal-title">
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
                        onCancelEdit={onClose}
                        moduleBeingEdited={module}
                    />
                </div>
            </div>
        </div>
    );
});
EditModuleModal.propTypes = {
    module: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};