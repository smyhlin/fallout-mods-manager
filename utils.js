// utils.js

// --- Helper Functions ---
function formatEffectText(text) {
    return text ? text.trim() : '';
}

function getStars(count) {
    return '⭐'.repeat(count);
}

function highlightText(text, searchTerm) {
    if (!searchTerm || !text) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return React.createElement(React.Fragment, null,
        parts.map((part, i) =>
            part.toLowerCase() === searchTerm.toLowerCase()
                ? React.createElement('mark', { key: i }, part)
                : part
        )
    );
}

// --- Storage Functions for Learned Status ---
function saveLearnedStatus(learnedStatusMap) {
    try {
        localStorage.setItem(LS_KEYS.LEARNED_STATUS, JSON.stringify(learnedStatusMap));
    } catch (error) {
        console.error('Error saving learned status:', error);
    }
}

function loadLearnedStatus() {
    try {
        const saved = localStorage.getItem(LS_KEYS.LEARNED_STATUS);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error loading learned status:', error);
        return {};
    }
}

// --- Storage Functions for Custom Modules ---
function saveCustomModules(customModulesArray) {
    try {
        localStorage.setItem(LS_KEYS.CUSTOM_MODULES, JSON.stringify(customModulesArray));
    } catch (error) {
        console.error('Error saving custom modules:', error);
    }
}

function loadCustomModules() {
    try {
        const saved = localStorage.getItem(LS_KEYS.CUSTOM_MODULES);
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Error loading custom modules:', error);
        return [];
    }
}


// --- Storage Functions for Column Settings (Unchanged from original logic) ---
function saveColumnSettings(visibility, widths) {
    localStorage.setItem(LS_KEYS.COLUMN_SETTINGS, JSON.stringify({ visibility, widths }));
}

function loadColumnSettings() {
    try {
        const saved = localStorage.getItem(LS_KEYS.COLUMN_SETTINGS);
        if (!saved) return { visibility: defaultColumnVisibility, widths: defaultColumnWidths };

        const { visibility: savedVisibility, widths: savedWidths } = JSON.parse(saved);
        
        const mergedVisibility = { ...defaultColumnVisibility };
        Object.keys(mergedVisibility).forEach(key => {
            const col = columnConfig.find(c => c.id === key);
            if (col && !col.isVisibilityToggleable) {
                mergedVisibility[key] = true;
            } else if (typeof savedVisibility[key] === 'boolean') {
                mergedVisibility[key] = savedVisibility[key];
            }
        });

        const mergedWidths = { ...defaultColumnWidths };
        Object.keys(mergedWidths).forEach(key => {
            const col = columnConfig.find(c => c.id === key);
            if (col && typeof savedWidths[key] === 'number') {
                mergedWidths[key] = Math.max(
                    col.minWidth || 50,
                    Math.min(col.maxWidth || 600, savedWidths[key])
                );
            }
        });

        return { visibility: mergedVisibility, widths: mergedWidths };
    } catch (error) {
        console.error('Error loading column settings:', error);
        return { visibility: defaultColumnVisibility, widths: defaultColumnWidths };
    }
}