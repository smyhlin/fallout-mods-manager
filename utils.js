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

// --- Storage Functions ---
function saveModules(modules) {
    localStorage.setItem(LS_KEYS.MODULES, JSON.stringify(modules));
}

function loadModules(initialModules) {
    try {
        const savedModules = localStorage.getItem(LS_KEYS.MODULES);
        if (!savedModules) return initialModules;

        const savedMap = new Map(JSON.parse(savedModules).map(m => [`${m.ruName}-${m.stars}`, m]));
        const mergedModules = [];

        // First add all initial modules, checking if they exist in saved state
        initialModules.forEach(initial => {
            const key = `${initial.ruName}-${initial.stars}`;
            const saved = savedMap.get(key);
            if (saved) {
                // Keep the initial module's data but use saved learned state
                mergedModules.push({ ...initial, learned: !!saved.learned, isCustom: false });
                savedMap.delete(key); // Remove from saved map to track custom modules
            } else {
                mergedModules.push({ ...initial, learned: false, isCustom: false });
            }
        });

        // Then add any remaining saved modules (these are custom ones)
        savedMap.forEach(custom => {
            mergedModules.push({ ...custom, isCustom: true });
        });

        return mergedModules;

    } catch (error) {
        console.error('Error loading modules:', error);
        return initialModules;
    }
}

function saveColumnSettings(visibility, widths) {
    localStorage.setItem(LS_KEYS.COLUMN_SETTINGS, JSON.stringify({ visibility, widths }));
}

function loadColumnSettings() {
    try {
        const saved = localStorage.getItem(LS_KEYS.COLUMN_SETTINGS);
        if (!saved) return { visibility: defaultColumnVisibility, widths: defaultColumnWidths };

        const { visibility: savedVisibility, widths: savedWidths } = JSON.parse(saved);
        
        // Ensure all required columns are visible regardless of saved state
        const mergedVisibility = { ...defaultColumnVisibility };
        Object.keys(mergedVisibility).forEach(key => {
            const col = columnConfig.find(c => c.id === key);
            if (col && !col.isVisibilityToggleable) {
                mergedVisibility[key] = true;
            } else if (typeof savedVisibility[key] === 'boolean') {
                mergedVisibility[key] = savedVisibility[key];
            }
        });

        // Ensure width values are within min/max bounds
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