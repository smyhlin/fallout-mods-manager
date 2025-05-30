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
        <div className="sidebar-section filter-buttons-container">
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
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <rect x="15" y="15" width="25" height="25" rx="3" ry="3" fill="currentColor"/>
                        <rect x="60" y="15" width="25" height="25" rx="3" ry="3" fill="currentColor"/>
                        <rect x="15" y="60" width="25" height="25" rx="3" ry="3" fill="currentColor"/>
                        <rect x="60" y="60" width="25" height="25" rx="3" ry="3" fill="currentColor"/>
                    </svg>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-card-content">
                    <span className="stat-card-title">{t('bannerModulesLearned')}</span>
                    <span className="stat-card-value">{stats.learnedCount}</span>
                </div>
                <div className="stat-card-icon">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <rect x="10" y="10" width="80" height="80" rx="10" ry="10" fill="none" stroke="currentColor" stroke-width="8"/>
                        <polyline points="30,55 45,70 70,35" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
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
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="28" cy="28" r="10" fill="currentColor"/>
                        <line x1="20" y1="80" x2="80" y2="20" stroke="currentColor" stroke-width="8"/>
                        <circle cx="72" cy="72" r="10" fill="currentColor"/>
                    </svg>
                </div>
            </div>
            <div className="stat-card">
                <div className="stat-card-content">
                    <span className="stat-card-title">{t('bannerVisibleModules')}</span>
                    <span className="stat-card-value">{stats.visibleCount}</span>
                    {stats.visibleCount > 0 && stats.visibleModuleSamples && stats.visibleModuleSamples.length > 0}
                </div>
                <div className="stat-card-icon">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 50 Q50 10 90 50 Q50 90 10 50 Z" fill="none" stroke="currentColor" stroke-width="8"/>
                        <circle cx="50" cy="50" r="15" fill="currentColor"/>
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
        visibleModuleSamples: PropTypes.arrayOf(PropTypes.string).isRequired,
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
        mutationObserver.observe(el, { childList: true, subtree: true, characterData: true, attributes: true });
        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);
        checkScroll();

        const observerTimeout = setTimeout(checkScroll, 50);

        return () => {
            clearTimeout(observerTimeout);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
            if (el) {
               el.removeEventListener('scroll', checkScroll);
            }
            window.removeEventListener('resize', checkScroll);
        };
    }, [checkScroll, children]);

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
            <h3 className="settings-label settings-title" style={{ textAlign: 'center' }}>{t('starFilterTitle')}</h3>
            <div className="star-filter-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                    className={`sidebar-button ${!selectedStars ? 'active' : ''}`}
                    onClick={() => onStarFilterChange(null)}
                    style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        padding: '8px',
                        textAlign: 'center',
                        width: '100%'
                    }}
                >
                    <span style={{ textAlign: 'center', width: '100%', display: 'block', marginTop: '4px', marginBottom: '4px' }}>
                        {t('starFilterAll')}
                    </span>
                </button>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '8px',
                    marginTop: '4px'
                }}>
                    {stars.map(star => (
                        <button
                            key={star}
                            className={`sidebar-button ${selectedStars === star ? 'active' : ''}`}
                            onClick={() => onStarFilterChange(star)}
                            aria-label={t('starFilterButtonLabel', { count: star })}
                            style={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px',
                                padding: '8px',
                                textAlign: 'center',
                                width: '100%'
                            }}
                        >
                            <span style={{ textAlign: 'center', width: '100%', display: 'block' }}>
                                {'⭐'.repeat(star)}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
});
StarFilter.propTypes = {
    selectedStars: PropTypes.number,
    onStarFilterChange: PropTypes.func.isRequired,
};

// New Compatibility Filter component
const CompatibilityFilter = React.memo(({ selectedCompatibility, onCompatibilityFilterChange, compatibilityOptions }) => {
    const { t } = window.useTranslation();
    
    // Helper function to get icon path (reused from CompatibilityIcons)
    const getIconPath = (type) => {
        const typeLower = type.toLowerCase();
        if (typeLower.includes("power armor")) return "images/power_armor.png";
        if (typeLower.includes("armor")) return "images/armor.png";
        if (typeLower.includes("melee")) return "images/melee_weapon.png"; // Changed from "Weapon: Melee" to "Melee" based on options
        if (typeLower.includes("range")) return "images/range_weapon.png"; // Changed from "Weapon: Ranged" to "Range" based on options
        // Add more specific checks if needed, or a default
        return null; // Return null if no specific icon is found
    };

    // Handler for image load errors
    const handleImageError = React.useCallback((e) => {
        console.error("Failed to load image:", e.target.src);
        // Optionally, you could hide the image or replace it with alt text here
        // e.target.style.display = 'none';
    }, []);


    return (
        <div className="sidebar-section compatibility-filter-section">
            <h3 className="settings-label settings-title" style={{ textAlign: 'center' }}>{t('compatibilityFilterTitle')}</h3>
            <div className="compatibility-filter-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                    className={`sidebar-button ${!selectedCompatibility ? 'active' : ''}`}
                    onClick={() => onCompatibilityFilterChange(null)}
                    style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        padding: '8px',
                        textAlign: 'center',
                        width: '100%'
                    }}
                >
                    <span style={{ textAlign: 'center', width: '100%', display: 'block', marginTop: '4px', marginBottom: '4px' }}>
                        {t('compatibilityFilterAll')}
                    </span>
                </button>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '8px',
                    marginTop: '4px'
                }}>
                    {Array.isArray(compatibilityOptions) && compatibilityOptions.map(option => {
                        const iconPath = getIconPath(option);
                        return (
                            <button
                                key={option}
                                className={`sidebar-button ${selectedCompatibility === option ? 'active' : ''}`}
                                onClick={() => onCompatibilityFilterChange(option)}
                                aria-label={t('compatibilityFilterButtonLabel', { type: option })}
                                title={option}
                                style={{ 
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '4px',
                                    padding: '8px',
                                    textAlign: 'center',
                                    width: '100%'
                                }}
                            >
                                {iconPath ? (
                                    <>
                                        <img
                                            src={iconPath}
                                            alt={option}
                                            style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                                            onError={handleImageError}
                                        />
                                        <span style={{ textAlign: 'center', width: '100%', display: 'block' }}>{option}</span>
                                    </>
                                ) : (
                                    <span style={{ textAlign: 'center', width: '100%', display: 'block' }}>{option}</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});
CompatibilityFilter.propTypes = {
    selectedCompatibility: PropTypes.string,
    onCompatibilityFilterChange: PropTypes.func.isRequired,
    compatibilityOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
};


const HoloHubNavigation = React.memo(({ activeHoloHubPage, onHoloHubPageChange, onSidebarClose }) => {
    const { t } = window.useTranslation();
    return (
        <div className="sidebar-section">
            <h3 className="settings-label settings-title">{t('holoHubNavTitle')}</h3>
            {holoHubPagesConfig.map(page => (
                <button
                    key={page.id}
                    className={`sidebar-button ${activeHoloHubPage === page.id ? 'active' : ''}`}
                    onClick={() => { onHoloHubPageChange(page.id); onSidebarClose?.(); }}
                >
                    {page.icon && <span className="sidebar-button-icon">{page.icon}</span>}
                    {t(page.labelKey)}
                </button>
            ))}
        </div>
    );
});
HoloHubNavigation.propTypes = {
    activeHoloHubPage: PropTypes.string.isRequired,
    onHoloHubPageChange: PropTypes.func.isRequired,
    onSidebarClose: PropTypes.func,
};


const Sidebar = React.memo(({
    isMobileOpen, isDesktopCollapsed, onMobileClose,
    activeView,
    currentFilter, onFilterChange, columnConfig, columnVisibility,
    tempWidths, onVisibilityChange, onTempWidthChange,
    onResetSettings, searchTerm, onSearchChange,
    currentLanguage, onLanguageChange, selectedStars, onStarFilterChange,
    selectedCompatibility, onCompatibilityFilterChange, compatibilityOptions, // Add new props
    activeHoloHubPage, onHoloHubPageChange
}) => {
    const { t } = window.useTranslation();

    return (
        <div className={`pipboy-sidebar ${isDesktopCollapsed ? 'sidebar-collapsed' : ''} ${isMobileOpen ? 'mobile-sidebar-open' : ''}`}>
            <button className="mobile-close-button" onClick={onMobileClose} aria-label={t('mobileCloseButtonLabel')}>×</button>
            <ScrollableContainer className="sidebar-content-wrapper">
                <h2>{activeView === 'modules' ? t('sidebarTitleControls') : t('sidebarTitleHoloHub')}</h2>

                {activeView === 'modules' && (
                    <React.Fragment>
                        <SearchInput searchTerm={searchTerm} onSearchChange={onSearchChange} />
                        <FilterControls currentFilter={currentFilter} onFilterChange={onFilterChange} onSidebarClose={onMobileClose} />
                        <StarFilter selectedStars={selectedStars} onStarFilterChange={onStarFilterChange} />
                        {/* Replace StarFilter1 with CompatibilityFilter */}
                        <CompatibilityFilter
                            selectedCompatibility={selectedCompatibility}
                            onCompatibilityFilterChange={onCompatibilityFilterChange}
                            compatibilityOptions={compatibilityOptions}
                        />
                        <hr className="dotted-separator" />
                        <SettingsSection
                            columnConfig={columnConfig}
                            columnVisibility={columnVisibility}
                            tempWidths={tempWidths}
                            onVisibilityChange={onVisibilityChange}
                            onTempWidthChange={onTempWidthChange}
                            onResetSettings={onResetSettings}
                        />
                    </React.Fragment>
                )}

                {activeView === 'holohub' && (
                    <HoloHubNavigation
                        activeHoloHubPage={activeHoloHubPage}
                        onHoloHubPageChange={onHoloHubPageChange}
                        onSidebarClose={onMobileClose}
                    />
                )}

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
    activeView: PropTypes.oneOf(['modules', 'holohub']).isRequired,
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
    selectedCompatibility: PropTypes.string, // Add prop type
    onCompatibilityFilterChange: PropTypes.func.isRequired, // Add prop type
    compatibilityOptions: PropTypes.arrayOf(PropTypes.string).isRequired, // Add prop type
    activeHoloHubPage: PropTypes.string.isRequired,
    onHoloHubPageChange: PropTypes.func.isRequired,
};


const ModuleActions = React.memo(({ module, onEdit, onDelete }) => {
    const { t } = window.useTranslation();
    const displayName = module.module_name || module.ruName;
    const displayStars = module.module_star || module.stars;

    return (
        <div className="module-actions">
            <button onClick={() => onEdit(module)} className="action-button edit-button" aria-label={t('moduleActionsEditLabel', { moduleName: displayName })}>
                <svg viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
            </button>
            <button onClick={() => onDelete(module)} className="action-button delete-button" aria-label={t('moduleActionsDeleteLabel', { moduleName: displayName })}>
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

const CompatibilityIcons = React.memo(({ compatibility }) => {
    if (!compatibility || compatibility.length === 0) return '-';

    const getIconPath = (type) => {
        const typeLower = type.toLowerCase();
        if (typeLower.includes("armor") && typeLower.includes("power")) return "images/power_armor.png";
        if (typeLower.includes("armor")) return "images/armor.png";
        if (typeLower.includes("weapon: melee")) return "images/melee_weapon.png";
        if (typeLower.includes("weapon: ranged")) return "images/range_weapon.png";
        if (typeLower.includes("weapon")) return "images/range_weapon.png";
        return null;
    };

    return (
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
            {compatibility.map((type, index) => {
                const iconPath = getIconPath(type);
                return iconPath ? (
                    <img key={index} src={iconPath} alt={type} title={type} style={{ width: '25px', height: '25px', objectFit: 'contain' }} />
                ) : (
                    <span key={index} style={{ fontSize: '0.8em', backgroundColor: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '3px', marginRight: '4px' }}>{type}</span>
                );
            })}
        </div>
    );
});
CompatibilityIcons.propTypes = {
    compatibility: PropTypes.arrayOf(PropTypes.string),
};


const ModuleTableRow = React.memo(({ module, columnVisibility, dataLabels, onLearnedChange, onEdit, onDelete, highlightTerm }) => {
    const { t } = window.useTranslation();

    const displayName = module.module_name || module.ruName || '';
    const displayStars = module.module_star || module.stars || 0;
    const displayEffect = module.module_description || module.effect || '';
    const displayCompatibility = module.module_compatibility || (module.isCustom && module.compatibility ? module.compatibility.split(',').map(s=>s.trim()) : []);
    const displayMaterials = module.module_materials || (module.isCustom && module.materials) || '';


    const moduleKey = module.module_editor_id || `${displayName}-${displayStars}`;
    const learnedStatusText = module.learned ? t('learnedStatusLearned') : t('learnedStatusNotLearned');

    return (
     <tr key={moduleKey}>
        <td style={{ width: '60px', textAlign: 'center', verticalAlign: 'middle' }}>
            <input
                type="checkbox"
                className="learned-checkbox"
                checked={!!module.learned}
                onChange={() => onLearnedChange(module)}
                aria-label={t('learnedCheckboxLabel', { moduleName: displayName, status: learnedStatusText })} />
        </td>
        {columnVisibility.name && <td>{highlightText(displayName, highlightTerm)}</td>}
        {columnVisibility.stars && <td style={{ textAlign: 'center' }}>{getStars(displayStars)}</td>}
        {columnVisibility.module_compatibility && <td><CompatibilityIcons compatibility={displayCompatibility} /></td>}
        {columnVisibility.module_materials && <td>{highlightText(displayMaterials, highlightTerm)}</td>}
        {columnVisibility.effect && <td className="effect-cell">{highlightText(formatEffectText(displayEffect), highlightTerm)}</td>}
        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
            <ModuleActions module={module} onEdit={onEdit} onDelete={onDelete} />
        </td>
        <div className="card-header">
             <input
                type="checkbox"
                className="learned-checkbox"
                checked={!!module.learned}
                onChange={() => onLearnedChange(module)}
                aria-label={t('learnedCheckboxLabel', { moduleName: displayName, status: learnedStatusText })} />
             <ModuleActions module={module} onEdit={onEdit} onDelete={onDelete} />
        </div>
        <div className="card-body">
            {columnVisibility.name && <div className="data-row" data-label={dataLabels.name}><span>{highlightText(displayName, highlightTerm)}</span></div>}
            {columnVisibility.stars && <div className="data-row" data-label={dataLabels.stars}><span>{getStars(displayStars)}</span></div>}
            {columnVisibility.module_compatibility && <div className="data-row" data-label={dataLabels.module_compatibility}><span><CompatibilityIcons compatibility={displayCompatibility} /></span></div>}
            {columnVisibility.module_materials && <div className="data-row" data-label={dataLabels.module_materials}><span>{highlightText(displayMaterials, highlightTerm)}</span></div>}
            {columnVisibility.effect && <div className="data-row" data-label={dataLabels.effect}><span className="effect-cell">{highlightText(formatEffectText(displayEffect), highlightTerm)}</span></div>}
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
    const visibleColumnCount = columnConfig.filter(c => columnVisibility[c.id]).length + 1;
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
                modules.map((module) => {
                    const key = module.module_editor_id || `${module.module_name || module.ruName}-${module.module_star || module.stars}`;
                    return (
                        <ModuleTableRow
                            key={key}
                            module={module}
                            columnVisibility={columnVisibility}
                            dataLabels={dataLabels}
                            onLearnedChange={onLearnedChange}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            highlightTerm={highlightTerm}
                        />
                    );
                })
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

    let nameValue = formData.name;
    let nameDisabled = false;
    if (isPredefined) {
        nameValue = moduleBeingEdited.module_name || '';
        nameDisabled = true;
    }

    let starsValue = formData.stars;
    let starsDisabled = false;
    if (isPredefined) {
        starsValue = moduleBeingEdited.module_star || 1;
        starsDisabled = true;
    }

    let effectValue = formData.effect;
    let effectDisabled = false;
    if (isPredefined) {
        effectValue = moduleBeingEdited.module_description || '';
        effectDisabled = true;
    }

    let compatibilityValue = formData.compatibility;
    let compatibilityDisabled = false;
    if (isPredefined) {
        compatibilityValue = Array.isArray(moduleBeingEdited.module_compatibility) ? moduleBeingEdited.module_compatibility.join(', ') : '';
        compatibilityDisabled = true;
    }

    let materialsValue = formData.materials;
    let materialsDisabled = false;
    if (isPredefined) {
        materialsValue = moduleBeingEdited.module_materials || '';
        materialsDisabled = true;
    }


    return (
        <form onSubmit={onSubmit} className={`module-form ${isEditMode ? 'modal-form' : ''}`}>
            <div>
                <label htmlFor={isEditMode ? "edit-name" : "add-name"}>{t('formLabelName')}</label>
                <input
                    type="text"
                    id={isEditMode ? "edit-name" : "add-name"}
                    name="name"
                    value={nameValue}
                    onChange={onChange}
                    required
                    disabled={nameDisabled}
                    aria-disabled={nameDisabled}
                    aria-label={t('formLabelName')}
                />
            </div>
            <div>
                <label htmlFor={isEditMode ? "edit-stars" : "add-stars"}>{t('formLabelStars')}</label>
                <select
                    id={isEditMode ? "edit-stars" : "add-stars"}
                    name="stars"
                    value={starsValue}
                    onChange={onChange}
                    required
                    disabled={starsDisabled}
                    aria-disabled={starsDisabled}
                    aria-label={t('formLabelStars')}
                >
                    {[1, 2, 3, 4].map(star => <option key={star} value={star}>{star}</option>)}
                </select>
            </div>
            <div className="form-field-full-width">
                <label htmlFor={isEditMode ? "edit-compatibility" : "add-compatibility"}>{t('formLabelCompatibility')}</label>
                <input
                    type="text"
                    id={isEditMode ? "edit-compatibility" : "add-compatibility"}
                    name="compatibility"
                    value={compatibilityValue}
                    onChange={onChange}
                    disabled={compatibilityDisabled}
                    aria-disabled={compatibilityDisabled}
                    aria-label={t('formLabelCompatibility')}
                    placeholder="e.g., Armor, Weapon: Ranged"
                />
            </div>
             <div className="form-field-full-width">
                <label htmlFor={isEditMode ? "edit-materials" : "add-materials"}>{t('formLabelMaterials')}</label>
                <input
                    type="text"
                    id={isEditMode ? "edit-materials" : "add-materials"}
                    name="materials"
                    value={materialsValue}
                    onChange={onChange}
                    disabled={materialsDisabled}
                    aria-disabled={materialsDisabled}
                    aria-label={t('formLabelMaterials')}
                />
            </div>
            <div className="form-field-full-width">
                <label htmlFor={isEditMode ? "edit-effect" : "add-effect"}>{t('formLabelEffect')}</label>
                <input
                    type="text"
                    id={isEditMode ? "edit-effect" : "add-effect"}
                    name="effect"
                    value={effectValue}
                    onChange={onChange}
                    required
                    disabled={effectDisabled}
                    aria-disabled={effectDisabled}
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
        name: PropTypes.string.isRequired,
        stars: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        effect: PropTypes.string.isRequired,
        compatibility: PropTypes.string,
        materials: PropTypes.string,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool,
    onCancelEdit: PropTypes.func,
    moduleBeingEdited: PropTypes.object,
};

const EditModuleModal = React.memo(({ module, isOpen, onClose, onSave }) => {
    const { t } = window.useTranslation();
    const [formData, setFormData] = React.useState({ name: '', stars: 1, effect: '', compatibility: '', materials: '' });
    const isEditMode = !!module;

    React.useEffect(() => {
        if (module) {
            setFormData({
                name: module.module_name || module.ruName || '',
                stars: module.module_star || module.stars || 1,
                effect: module.module_description || module.effect || '',
                compatibility: module.isCustom ? (module.compatibility || '') : (Array.isArray(module.module_compatibility) ? module.module_compatibility.join(', ') : ''),
                materials: module.isCustom ? (module.materials || '') : (module.module_materials || ''),
            });
        } else {
            setFormData({ name: '', stars: 1, effect: '', compatibility: '', materials: '' });
        }
    }, [module]);

    const handleChange = React.useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'stars' ? parseInt(value, 10) : value }));
    }, []);

    const handleSubmit = React.useCallback((e) => {
        e.preventDefault();
        onSave(module, formData);
    }, [formData, module, onSave]);


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

const TabNavigation = React.memo(({ activeView, onTabChange }) => {
    const { t } = window.useTranslation();
    return (
        <div className="tab-navigation">
            <button
                className={`tab-button ${activeView === 'modules' ? 'active' : ''}`}
                onClick={() => onTabChange('modules')}
                aria-pressed={activeView === 'modules'}
            >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '8px' }}>
                    <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                </svg>
                {t('tabModules')}
            </button>
            <button
                className={`tab-button ${activeView === 'holohub' ? 'active' : ''}`}
                onClick={() => onTabChange('holohub')}
                aria-pressed={activeView === 'holohub'}
            >
                 <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ marginRight: '8px' }}>
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                {t('tabHoloHub')}
            </button>
        </div>
    );
});
TabNavigation.propTypes = {
    activeView: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
};

const ModuleDescriptionModal = React.memo(({ isOpen, onClose, moduleData }) => {
    const { t } = window.useTranslation();

    if (!isOpen || !moduleData) return null;

    const { name, stars, effect, learnedStatus, noteKey } = moduleData;
    const noteText = noteKey ? t(noteKey) : null;
    const learnedStatusText = learnedStatus === 'learned' ? t('learnedStatusLearned') :
                             learnedStatus === 'not-learned' ? t('learnedStatusNotLearned') :
                             t('statusUnknownInCollection');

    return (
        <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="module-desc-title">
            <div className="modal-content module-description-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="modal-close-button" onClick={onClose} aria-label={t('modalCloseButtonLabel')}>×</button>
                    <h3 id="module-desc-title">{name}</h3>
                </div>
                <div className="modal-body">
                    <div className="module-desc-details">
                        {stars && (
                            <p><strong>{t('columnLabelStars')}:</strong> {getStars(stars)}</p>
                        )}
                        <p>
                            <strong>{t('columnLabelLearned')}:</strong>
                            <span className={`desc-modal-status status-${learnedStatus}`}> {learnedStatusText}</span>
                        </p>
                        {noteText && (
                            <p><em>{noteText}</em></p>
                        )}
                        <hr className="dotted-separator" />
                        <p><strong>{t('columnLabelEffect')}:</strong></p>
                        <p className="effect-text-modal">{effect || t('effectNotAvailable')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
});
ModuleDescriptionModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    moduleData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        stars: PropTypes.number,
        effect: PropTypes.string,
        learnedStatus: PropTypes.string,
        noteKey: PropTypes.string,
    }),
};


const ModuleTierCard = React.memo(({ moduleIdFromTierList, moduleNoteKey, allModules, onCardClick }) => {
    const { t } = window.useTranslation();

    const userModule = allModules.find(m =>
        (m.module_editor_id === moduleIdFromTierList) || // Primary match for base modules
        (m.isCustom && (m.ruName === moduleIdFromTierList || m.module_editor_id === moduleIdFromTierList)) // Match custom by ruName or its own editor_id
    );

    let learnedStatus = 'unknown';
    let stars = null;
    let effect = null;
    let displayName = moduleIdFromTierList; // Fallback to the ID if module not found

    if (userModule) {
        learnedStatus = userModule.learned ? 'learned' : 'not-learned';
        stars = userModule.module_star || userModule.stars;
        effect = userModule.module_description || userModule.effect;
        displayName = userModule.module_name || userModule.ruName; // Use the actual module name for display
    } else {
        console.warn(`Tier list module with ID/name "${moduleIdFromTierList}" not found in allModules.`);
    }

    const noteText = moduleNoteKey ? t(moduleNoteKey) : null;

    const handleClick = () => {
        if (userModule) { // Only allow click if module is found, to show details
            onCardClick({
                name: displayName,
                stars,
                effect,
                learnedStatus,
                noteKey: moduleNoteKey
            });
        }
    };

    return (
        <div
            className={`tier-module-card status-${learnedStatus} ${userModule ? 'clickable' : 'not-found'}`}
            onClick={userModule ? handleClick : undefined}
            role={userModule ? "button" : undefined}
            tabIndex={userModule ? "0" : undefined}
            onKeyPress={userModule ? (e) => (e.key === 'Enter' || e.key === ' ') && handleClick() : undefined}
            title={!userModule ? `Module ID: ${moduleIdFromTierList} (Not found in current language data)`: displayName}
        >
            <div className="tier-module-card-content">
                <div className="tier-module-card-header">
                    {learnedStatus === 'learned' && <span className="learned-badge" title={t('learnedStatusLearned')}>✔</span>}
                    {learnedStatus === 'not-learned' && <span className="not-learned-badge" title={t('learnedStatusNotLearned')}>✖</span>}
                    {learnedStatus === 'unknown' && !userModule && <span className="not-learned-badge" title={t('statusUnknownInCollection')}>?</span>}
                </div>
                <div className="tier-module-name">
                    {displayName}
                    {stars && <span className="tier-module-stars"> ({getStars(stars)})</span>}
                </div>
                {noteText && <div className="tier-module-note">{noteText}</div>}
            </div>
        </div>
    );
});
ModuleTierCard.propTypes = {
    moduleIdFromTierList: PropTypes.string.isRequired,
    moduleNoteKey: PropTypes.string,
    allModules: PropTypes.array.isRequired,
    onCardClick: PropTypes.func.isRequired,
};

const TierCategory = React.memo(({ categoryNameKey, modulesInTier, allModules, onCardClick }) => {
    const { t } = window.useTranslation();
    const categoryName = categoryNameKey ? t(categoryNameKey) : null;

    return (
        <div className="tier-category">
            {categoryName && <h4 className="tier-category-name">{categoryName}</h4>}
            <div className="tier-category-modules">
                {modulesInTier.map((modInfo, index) => (
                    <ModuleTierCard
                        key={`${modInfo.id}-${index}`} // Use modInfo.id (which is module_editor_id)
                        moduleIdFromTierList={modInfo.id}
                        moduleNoteKey={modInfo.noteKey}
                        allModules={allModules}
                        onCardClick={onCardClick}
                    />
                ))}
            </div>
        </div>
    );
});
TierCategory.propTypes = {
    categoryNameKey: PropTypes.string,
    modulesInTier: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired, // Changed from name to id
        noteKey: PropTypes.string
    })).isRequired,
    allModules: PropTypes.array.isRequired,
    onCardClick: PropTypes.func.isRequired,
};


const TierRow = React.memo(({ tierNameKey, tierColor, tierBorderColor, textColor, categories, allModules, onCardClick }) => {
    const { t } = window.useTranslation();
    const headerStyle = {
        backgroundColor: tierColor,
        color: textColor,
        borderColor: tierBorderColor
    };
    const contentAreaStyle = {
        '--tier-content-base-color': tierColor
    };

    return (
        <div className="tier-row-horizontal">
            <div className="tier-header-horizontal" style={headerStyle}>
                <span className="tier-label-horizontal">{t(tierNameKey)}</span>
            </div>
            <div className="tier-content-horizontal" style={contentAreaStyle}>
                {categories.map((cat, index) => (
                    <TierCategory
                        key={cat.categoryNameKey || `cat-${index}`}
                        categoryNameKey={cat.categoryNameKey}
                        modulesInTier={cat.modules}
                        allModules={allModules}
                        onCardClick={onCardClick}
                    />
                ))}
            </div>
        </div>
    );
});
TierRow.propTypes = {
    tierNameKey: PropTypes.string.isRequired,
    tierColor: PropTypes.string.isRequired,
    tierBorderColor: PropTypes.string.isRequired,
    textColor: PropTypes.string.isRequired,
    categories: PropTypes.array.isRequired,
    allModules: PropTypes.array.isRequired,
    onCardClick: PropTypes.func.isRequired,
};

const TierListPage = React.memo(({ tierListData, listTitleKey, allModules }) => {
    const { t } = window.useTranslation();
    const [isDescModalOpen, setIsDescModalOpen] = React.useState(false);
    const [selectedModuleData, setSelectedModuleData] = React.useState(null);

    const handleOpenDescriptionModal = React.useCallback((moduleData) => {
        setSelectedModuleData(moduleData);
        setIsDescModalOpen(true);
    }, []);

    const handleCloseDescriptionModal = React.useCallback(() => {
        setIsDescModalOpen(false);
        setSelectedModuleData(null);
    }, []);

    return (
        <div className="tier-list-container holohub-page-content">
            <div className="tier-list">
                {tierListData.map(tier => (
                    <TierRow
                        key={tier.tierNameKey}
                        tierNameKey={tier.tierNameKey}
                        tierColor={tier.tierColor}
                        tierBorderColor={tier.tierBorderColor}
                        textColor={tier.textColor}
                        categories={tier.categories}
                        allModules={allModules}
                        onCardClick={handleOpenDescriptionModal}
                    />
                ))}
            </div>
            <ModuleDescriptionModal
                isOpen={isDescModalOpen}
                onClose={handleCloseDescriptionModal}
                moduleData={selectedModuleData}
            />
        </div>
    );
});
TierListPage.propTypes = {
    tierListData: PropTypes.array.isRequired,
    listTitleKey: PropTypes.string.isRequired,
    allModules: PropTypes.array.isRequired,
};


const StatListItem = React.memo(({ label, value, valueType = 'int', note, isSubtotal = false, isFinalTotal = false }) => {
    const { t } = window.useTranslation();
    let valueClass = 'stat-value';
    if (valueType === 'xp') valueClass = 'xp-bonus';

    const displayLabel = label.startsWith('xpFarming') ? t(label) : label;
    const displayValue = value.startsWith('xpFarming') ? t(value) : value;

    let mainText = displayLabel;
    let statPart = displayValue;

    if (isSubtotal || isFinalTotal) {
        const parts = displayValue.split(':');
        if (parts.length > 1) {
            mainText = parts[0].trim() + ":";
            statPart = parts.slice(1).join(':').trim();
        } else {
            mainText = displayLabel;
            statPart = displayValue;
        }
    }

    return (
        <li className={`stat-list-item ${isSubtotal ? 'subtotal-line' : ''} ${isFinalTotal ? 'final-total-line' : ''}`}>
            <span className="stat-label">{mainText}</span>
            {note && <span className="stat-note"><em>{t(note)}</em></span>}
            <span className={valueClass}>{statPart}</span>
        </li>
    );
});

StatListItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    valueType: PropTypes.oneOf(['int', 'xp', 'generic']),
    note: PropTypes.string,
    isSubtotal: PropTypes.bool,
    isFinalTotal: PropTypes.bool,
};


const HoloHubPageContent = ({ pageId, t, allModules }) => {
    switch (pageId) {
        case 'xpFarming':
            return (
                <div className="holohub-page-content holohub-xp-farming-guide">
                    <p>{t('xpFarmingIntro')}</p>

                    <div className="info-card key-principle-card">
                        <h4>{t('xpFarmingKeyPrincipleTitle')}</h4>
                        <p>{t('xpFarmingKeyPrincipleDesc')}</p>
                    </div>

                     <div className="info-card">
                        <h4>{t('xpFarmingHelpfulResourcesTitle')}</h4>
                        <ul>
                            <li>{t('xpFarmingInteractiveMapsTitle')}</li>
                            <li>{t('xpFarmingResourceFo76Map')}</li>
                            <li>{t('xpFarmingResourceF76MapRu')}</li>
                            <li><em>{t('xpFarmingResourceNote')}</em></li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <h4>{t('xpFarmingBasicsTitle')}</h4>
                        <h5>{t('xpFarmingTeamTitle')}</h5>
                        <ul>
                            <li>{t('xpFarmingTeamAlwaysJoin')}</li>
                            <li>{t('xpFarmingTeamCasualBonus')}</li>
                        </ul>
                        <h5>{t('xpFarmingArmorTitle')}</h5>
                        <ul>
                            <li>{t('xpFarmingArmorUnyieldingTitle')}: {t('xpFarmingArmorUnyieldingDesc')}</li>
                            <li>{t('xpFarmingArmorBonusIntelTitle')}: {t('xpFarmingArmorBonusIntelDesc')}</li>
                            <li><em>{t('xpFarmingArmorThirdStarNote')}</em></li>
                        </ul>
                         <h5>{t('xpFarmingUnderarmorTitle')}</h5>
                        <ul>
                            <li>{t('xpFarmingUnderarmorShieldedCasual')}<br/><em>{t('xpFarmingUnderarmorShieldedCasualObtain')}</em></li>
                            <li>{t('xpFarmingUnderarmorShieldedVault76')}<br/><em>{t('xpFarmingUnderarmorShieldedVault76Obtain')}</em></li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <h4><span className="holohub-icon">🍀</span> {t('xpFarmingTitleSupplementaryPerks')}</h4>
                        <ul>
                            <StatListItem label="xpFarmingPerkStrangeInNumbersNote" value="" valueType="generic" />
                            <StatListItem label="xpFarmingPerkClassFreakNote" value="" valueType="generic" />
                            <StatListItem label="xpFarmingPerkCuratorNote" value="" valueType="generic" />
                            <StatListItem label="xpFarmingPerkChemFiendNote" value="" valueType="generic" />
                        </ul>
                         <em>{t('xpFarmingMutationsPerksNote')}</em>
                    </div>


                    <h3 className="section-title"><span className="holohub-icon">🧠</span> {t('xpFarmingTitleCoreIntelBuild')}</h3>

                    <div className="info-card">
                        <h4><span className="holohub-icon">🛡️</span> {t('xpFarmingTitleEquippedGear')}</h4>
                        <ul>
                            <StatListItem label="xpFarmingGearBaseIntel" value="+15 INT" />
                            <StatListItem label="xpFarmingGearLegendaryIntel" value="+5 INT" />
                            <StatListItem label="xpFarmingGearUnyieldingArmor" value="+15 INT" />
                            <StatListItem label="xpFarmingGearArmorIntel" value="+10 INT" />
                            <StatListItem label="xpFarmingGearWeaponIntel" value="+3 INT" />
                            <StatListItem label="xpFarmingGearUnderarmorShielded" value="+3 INT" />
                            <StatListItem label="xpFarmingGearCasualTeamBase" value="+1 INT" />
                            <StatListItem label="" value="xpFarmingGearSubtotal" isSubtotal={true} />
                        </ul>
                    </div>

                    <div className="info-card">
                        <h4><span className="holohub-icon">🧬</span> {t('xpFarmingTitleMutationsPerks')}</h4>
                        <ul>
                            <StatListItem label="xpFarmingMutationHerdMentalityDetail" value="+3 INT" />
                            <StatListItem label="xpFarmingMutationEggHeadDetail" value="+8 INT" />
                            <StatListItem label="xpFarmingMutationMarsupialDetail" value="-1 INT" />
                            <StatListItem label="xpFarmingPerkInspirationalXPSpecific" value="+22.67% XP" valueType="xp" note="xpFarmingNoteInspirationalCharismaSpecific" />
                            <StatListItem label="" value="xpFarmingMutationsPerksSubtotal" isSubtotal={true} />
                        </ul>
                    </div>

                    <div className="info-card">
                        <h4><span className="holohub-icon">⏱️</span> {t('xpFarmingTitleTimedBuffs')}</h4>
                        <ul>
                            <StatListItem label="xpFarmingBuffBerryMentatsSpecific" value="+5 INT (10 min)" />
                            <StatListItem label="xpFarmingBuffBrainsSpecific" value="+8 INT (0.5 / 1.5 hrs)" />
                            <StatListItem label="xpFarmingBuffCranberryRelishSpecific" value="+25% XP (1 hr)" valueType="xp" />
                            <StatListItem label="xpFarmingBuffLiveLove8Detail" value="+5% XP (1 hr, extended by Curator)" valueType="xp" />
                            <StatListItem label="xpFarmingBuffLeaderBobbleheadSpecific" value="+5% XP (2 hrs, extended by Curator)" valueType="xp" />
                            <StatListItem label="xpFarmingBuffMechanicalDerbySpecific" value="+2 INT (30 min)" />
                            <StatListItem label="xpFarmingBuffMothmanTomeSpecific" value="+5% XP (1 hr)" valueType="xp" />
                            <StatListItem label="xpFarmingBuffWellRestedSpecific" value="+5% XP (lost on death, 2/3 hrs)" valueType="xp" />
                            <StatListItem label="" value="xpFarmingTimedBuffsSubtotal" isSubtotal={true} />
                        </ul>
                    </div>

                    <div className="info-card">
                        <h4><span className="holohub-icon">⚡</span> {t('xpFarmingTitleUnreliableDifficult')}</h4>
                        <ul>
                            <StatListItem label="xpFarmingUDMarsupialSuppressionSpecific" value="+1 INT" />
                            <StatListItem label="xpFarmingUDCasualTeamFullSpecific" value="+4 INT" />
                            <StatListItem label="xpFarmingUDNightPersonSpecific" value="+3 INT (50% of gameplay)" />
                            <StatListItem label="xpFarmingUDNukaTwistSpecific" value="+2 INT (10 min)" />
                            <StatListItem label="xpFarmingUDNukaInspirationSpecific" value="+5% XP (once per day, 1 hr)" valueType="xp" />
                            <StatListItem label="xpFarmingUDLunchboxesDetail" value="+100% XP (1 hr)" valueType="xp" />
                            <StatListItem label="" value="xpFarmingUDSubtotal" isSubtotal={true} />
                        </ul>
                    </div>

                    <div className="info-card">
                        <h4>{t('xpFarmingConsumablesTitle')}</h4>
                        <h5>{t('xpFarmingChemsIntelTitle')}</h5>
                        <ul>
                            <li>{t('xpFarmingChemMentats')}</li>
                            <li>{t('xpFarmingChemBerryMentats')}</li>
                        </ul>
                        <h5>{t('xpFarmingFoodIntelTitle')}</h5>
                        <h6>{t('xpFarmingFoodIntelHerbivoreTitle')}</h6>
                        <ul>
                            <li>{t('xpFarmingFoodBrainBombs')}</li>
                            <li>{t('xpFarmingFoodBrainFungusSoup')}</li>
                            <li>{t('xpFarmingFoodSteepedFernFlowerTea')}</li>
                        </ul>
                         <h6>{t('xpFarmingFoodIntelCarnivoreTitle')}</h6>
                        <ul>
                            <li>{t('xpFarmingFoodScorchbeastBrain')}</li>
                        </ul>
                         <h5>{t('xpFarmingFoodXPTitle')}</h5>
                         <h6>{t('xpFarmingFoodXPHerbivoreTitle')}</h6>
                        <ul>
                            <li>{t('xpFarmingFoodCranberryRelish')}</li>
                            <li>{t('xpFarmingFoodCranberryCobbler')}</li>
                            <li>{t('xpFarmingFoodCranberryJuice')}</li>
                        </ul>
                         <h6>{t('xpFarmingFoodXPCarnivoreTitle')}</h6>
                        <ul>
                            <li>{t('xpFarmingFoodTastySquirrelStew')}</li>
                        </ul>
                         <h6>{t('xpFarmingFoodXPUniversalTitle')}</h6>
                        <ul>
                            <li>{t('xpFarmingFoodCannedMeatStew')}</li>
                        </ul>
                         <h5>{t('xpFarmingBobbleheadsTitle')}</h5>
                        <ul>
                            <li>{t('xpFarmingBobbleheadIntelligence')}</li>
                            <li>{t('xpFarmingBobbleheadLeader')}</li>
                        </ul>
                         <h5>{t('xpFarmingMagazinesTitle')}</h5>
                        <ul>
                            <li>{t('xpFarmingMagazineLiveLove8')}</li>
                            <li>{t('xpFarmingMagazineLiveLove3')}</li>
                        </ul>
                         <h5>{t('xpFarmingLunchboxes')}</h5>
                         <h5>{t('xpFarmingOtherBuffsSubTitle')}</h5>
                        <ul>
                            <li>{t('xpFarmingBuffWellRestedExtended')}</li>
                            <li>{t('xpFarmingBuffMothmanWisdomTrue')}</li>
                            <li>{t('xpFarmingBuffMothmanWisdomRegular')}</li>
                            <li><em>{t('xpFarmingBuffMothmanNote')}</em></li>
                            <li>{t('xpFarmingBuffSacredMothmanTome')}</li>
                            <li>{t('xpFarmingBuffAllySettlerForager')}</li>
                            <li>{t('xpFarmingBuffDerbyGame')}</li>
                            <li>{t('xpFarmingBuffMeatWeekPot')}</li>
                            <li>{t('xpFarmingFoodNukaColaCranberry')}</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <h4>{t('xpFarmingGlobalEventsTitle')}</h4>
                        <ul>
                            <li>{t('xpFarmingEventDoubleXP')}</li>
                            <li>{t('xpFarmingEventMothmanEquinoxEvent')}</li>
                            <li>{t('xpFarmingEventMeatWeekEvent')}</li>
                        </ul>
                        <h4>{t('xpFarmingLocationsTitle')}</h4>
                        <h5>{t('xpFarmingLocationWestTekDetailed')}</h5>
                        <ul>
                            <li><em>{t('xpFarmingLocationWestTekPathNote')}</em></li>
                        </ul>
                        <em>{t('xpFarmingLocationBestOverallNote')}</em>
                        <h5>{t('xpFarmingPublicEventsSubTitle')}</h5>
                        <ul>
                            <li>{t('xpFarmingEventRadRumble')}</li>
                            <li>{t('xpFarmingEventEvictionNotice')}</li>
                            <li>{t('xpFarmingEventMoonshineJamboree')}</li>
                            <li>{t('xpFarmingOtherGoodEventsList')}</li>
                        </ul>
                         <h5>{t('xpFarmingOtherLocationsSubTitle')}</h5>
                        <ul>
                            <li>{t('xpFarmingLocationTheBurrows')}</li>
                            <li>{t('xpFarmingLocationAbandonedBogTown')}</li>
                            <li>{t('xpFarmingLocationWhitespringGolfClub')}</li>
                            <li>{t('xpFarmingLocationCharlestonCapitolFortDefiance')}</li>
                            <li>{t('xpFarmingLocationGraftonSteelEtc')}</li>
                            <li>{t('xpFarmingLocationDailyOpsExpeditions')}</li>
                        </ul>
                    </div>

                    <div className="info-card">
                        <h4>{t('xpFarmingFinalBoostTitle')}</h4>
                        <h5>{t('xpFarmingFinalBoostPrepTitle')}</h5>
                        <ul>
                            {t('xpFarmingFinalBoostPrepSteps').split('\n').map((step, index) => <li key={`prep-step-${index}`}>{step.trim()}</li>)}
                        </ul>
                        <h5>{t('xpFarmingFinalBoostBuffsTitle')}</h5>
                         <ul>
                            {t('xpFarmingFinalBoostBuffsSteps').split('\n').map((step, index) => <li key={`buff-step-${index}`}>{step.trim()}</li>)}
                        </ul>
                        <h5>{t('xpFarmingFinalBoostFarmTitle')}</h5>
                         <ul>
                            {t('xpFarmingFinalBoostFarmSteps').split('\n').map((step, index) => <li key={`farm-step-${index}`}>{step.trim()}</li>)}
                        </ul>
                    </div>


                     <div className="info-card">
                        <h4><span className="holohub-icon">🎯</span> {t('xpFarmingTitleFinalIntelTotals')}</h4>
                        <ul>
                            <StatListItem label="" value="xpFarmingTotalCoreOnlySpecific" isFinalTotal={true} />
                            <StatListItem label="" value="xpFarmingTotalCoreUDDaySpecific" isFinalTotal={true} />
                            <StatListItem label="" value="xpFarmingTotalCoreUDNightSpecific" isFinalTotal={true} />
                            <StatListItem label="" value="xpFarmingTotalXPModifiersSpecific" valueType="xp" isFinalTotal={true} />
                        </ul>
                    </div>


                    <p className="holohub-footer">{t('xpFarmingOutro')}</p>
                </div>
            );
        case 'critCalculator':
            return <CritCalculatorPage />;
        case 'weaponTierList':
            return <TierListPage tierListData={window.weaponTierListData} listTitleKey="holoHubPageWeaponTierList" allModules={allModules} />;
        case 'armorTierList':
            return <TierListPage tierListData={window.armorTierListData} listTitleKey="holoHubPageArmorTierList" allModules={allModules} />;
        default:
            return <div className="holohub-page-content"><h2>{t('unknownPage')}</h2><p>{t('unknownPageMessage')}</p></div>;
    }
};
HoloHubPageContent.propTypes = {
    pageId: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
    allModules: PropTypes.array.isRequired,
};

const HoloHubView = React.memo(({ activePage, allModules }) => {
    const { t } = window.useTranslation();
    return (
        <div className="holohub-view-container">
            <HoloHubPageContent pageId={activePage} t={t} allModules={allModules} />
        </div>
    );
});
HoloHubView.propTypes = {
    activePage: PropTypes.string.isRequired,
    allModules: PropTypes.array.isRequired,
};

const CritCalculatorPage = () => {
    const { t } = window.useTranslation();
    const [critSavvyRank, setCritSavvyRank] = React.useState(0);
    const [LimitBreakingPieces, setLimitBreakingPieces] = React.useState(0);
    const [hasLucky, sethasLucky] = React.useState(0);
    const [luckRequired, setLuckRequired] = React.useState(null);

    React.useEffect(() => {
        const entry = window.critCalculatorData.find(
            (data) =>
                data.critSavvy === critSavvyRank &&
                data.LimitBreaking === LimitBreakingPieces &&
                data.lucky === hasLucky
        );
        setLuckRequired(entry ? entry.luck : t('critCalcValueNotAvailable'));
    }, [critSavvyRank, LimitBreakingPieces, hasLucky, t]);

    const critSavvyOptions = [0, 1, 2, 3];
    const LimitBreakingOptions = [0, 1, 2, 3, 4, 5];

    return (
        <div className="holohub-page-content crit-calculator-page">
            <div className="crit-calculator-grid">
                <div className="info-card crit-input-card">
                    <h4>{t('critCalcLabelCritSavvy')}</h4>
                    <div className="segmented-control">
                        {critSavvyOptions.map((rank) => (
                            <button
                                key={`savvy-${rank}`}
                                className={`segment-button ${critSavvyRank === rank ? 'active' : ''}`}
                                onClick={() => setCritSavvyRank(rank)}
                            >
                                {rank} {'⭐'.repeat(rank) || t('critCalcButtonNo')}
                            </button>
                                               ))}
                    </div>

                    <h4>{t('critCalcLabelLimitBreaking')}</h4>
                    <div className="segmented-control">
                        {LimitBreakingOptions.map((pieces) => (
                            <button
                                key={`uny-${pieces}`}
                                className={`segment-button ${LimitBreakingPieces === pieces ? 'active' : ''}`}
                                onClick={() => setLimitBreakingPieces(pieces)}
                            >
                                {pieces}
                            </button>
                        ))}
                    </div>

                    <h4>{t('critCalcLabel15Fill')}</h4>
                    <div className="toggle-switch">
                        <button
                            className={`toggle-button ${hasLucky === 0 ? 'active' : ''}`}
                            onClick={() => sethasLucky(0)}
                        >
                            {t('critCalcButtonNo')}
                        </button>
                        <button
                            className={`toggle-button ${hasLucky === 1 ? 'active' : ''}`}
                            onClick={() => sethasLucky(1)}
                        >
                            {t('critCalcButtonYes')}
                        </button>
                    </div>
                </div>

                <div className="info-card crit-output-card">
                    <h4>{t('critCalcLabelLuckRequired')}</h4>
                    <div className="luck-display">
                        {luckRequired !== null ? luckRequired : '...'}
                    </div>
                    <p className="luck-context">{t('critCalcLuckContext')}</p>
                </div>
            </div>

           
            <div className="info-card crit-legend-card">
                <h4>{t('critCalcLegendTitle')}</h4>
                <ul>
                    <li>{t('critCalcLegendCritSavvy')}</li>
                    <li>{t('critCalcLegendLimitBreaking')}</li>
                    <li>{t('critCalcLegend15Fill')}</li>
                </ul>
            </div>
        </div>
    );
};