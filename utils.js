// utils.js

// --- Helper Functions ---
const getStars = (count) => '⭐'.repeat(count);

const formatEffectText = (text) => {
    if (typeof text !== 'string') return '';
    // Add newline for better readability if both weapon and armor effects exist
    if (text.includes('[Оружие]') && text.includes('[Броня]')) {
        return text.replace('[Броня]', '\n[Броня]');
    }
    return text;
};

const highlightText = (text, highlight) => {
    if (!highlight || !text) return text;
    try {
        // Escape regex special characters in the highlight term
        const escapedHighlight = highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedHighlight})`, 'gi');
        const parts = String(text).split(regex); // Ensure text is a string
        return parts.map((part, i) =>
            regex.test(part) ? React.createElement('mark', { key: i }, part) : part
        );
    } catch (e) {
        console.error("Error highlighting text:", e);
        return text; // Return original text on error
    }
};

// --- LocalStorage Utils ---
const loadModules = (initialModulesData = []) => {
    const savedModulesJSON = localStorage.getItem(LS_KEYS.MODULES);
    let finalModules = [];

    // Handle case where initial data might not be loaded (e.g., fetch error)
    if (!initialModulesData || initialModulesData.length === 0) {
        console.warn("Initial module data is empty or not provided. Loading from saved data only or returning empty.");
        try {
            const saved = JSON.parse(savedModulesJSON || '[]');
            return Array.isArray(saved) ? saved : [];
        } catch {
            return []; // Return empty array on parsing error
        }
    }

    // Use the passed initialModulesData as the base
    const initialModulesMap = new Map(initialModulesData.map(m => [`${m.ruName}-${m.stars}`, { ...m, isCustom: false }]));

    if (savedModulesJSON) {
        try {
            const savedModules = JSON.parse(savedModulesJSON);
            if (!Array.isArray(savedModules)) throw new Error("Saved data is not an array.");

            const savedModulesMap = new Map();
            // Process saved modules, ensuring required fields and types
            savedModules.forEach(m => {
                if (m && typeof m.ruName === 'string' && typeof m.stars === 'number') {
                    savedModulesMap.set(`${m.ruName}-${m.stars}`, {
                         ruName: m.ruName,
                         stars: m.stars,
                         enName: m.enName || '',
                         effect: m.effect || '',
                         learned: typeof m.learned === 'boolean' ? m.learned : false,
                         // Determine if custom based on saved flag or if not present in initial data
                         isCustom: typeof m.isCustom === 'boolean' ? m.isCustom : !initialModulesMap.has(`${m.ruName}-${m.stars}`)
                     });
                }
            });

            // Merge initial data with saved data
            initialModulesMap.forEach((initialModule, key) => {
                const savedModule = savedModulesMap.get(key);
                if (savedModule) {
                    // If found in saved data, merge properties (saved takes precedence for learned status)
                    finalModules.push({ ...initialModule, ...savedModule });
                    savedModulesMap.delete(key); // Remove from saved map to track remaining custom modules
                } else {
                    // If not found in saved data, use initial module (learned status from config)
                    finalModules.push({ ...initialModule, learned: userLearnedListOnInit.has(key) });
                }
            });
            // Add any remaining modules from saved data (these are custom modules not in initial list)
            savedModulesMap.forEach(customModule => finalModules.push(customModule));

        } catch (e) {
            console.error("Failed to load or parse modules:", e);
            // Fallback: Use only the initial data if parsing fails
            finalModules = initialModulesData.map(module => ({ ...module, learned: userLearnedListOnInit.has(`${module.ruName}-${module.stars}`) }));
        }
    } else {
        // Fallback: Use only the initial data if nothing is saved
        finalModules = initialModulesData.map(module => ({ ...module, learned: userLearnedListOnInit.has(`${module.ruName}-${module.stars}`) }));
    }
    return finalModules;
};

const saveModules = (modules) => {
    try {
        // Save only necessary fields to localStorage
        const dataToSave = modules.map(({ ruName, stars, learned, enName, effect, isCustom }) => ({
            ruName, stars, learned: !!learned, enName: enName || '', effect: effect || '', isCustom: !!isCustom
        }));
        localStorage.setItem(LS_KEYS.MODULES, JSON.stringify(dataToSave));
    } catch (e) {
        console.error("Failed to save modules:", e);
    }
};

const loadColumnSettings = () => {
    const savedSettingsJSON = localStorage.getItem(LS_KEYS.COLUMN_SETTINGS);
    if (savedSettingsJSON) {
        try {
            const savedSettings = JSON.parse(savedSettingsJSON);
            // Start with default settings
            const visibility = { ...defaultColumnVisibility };
            const widths = { ...defaultColumnWidths };

            // Apply saved visibility if valid
            if (savedSettings?.visibility && typeof savedSettings.visibility === 'object') {
                columnConfig.forEach(col => {
                    if (col.isVisibilityToggleable && typeof savedSettings.visibility[col.id] === 'boolean') {
                        visibility[col.id] = savedSettings.visibility[col.id];
                    } else if (!col.isVisibilityToggleable) {
                        visibility[col.id] = true; // Ensure non-toggleable columns are always visible
                    }
                });
            }
            // Apply saved widths if valid and within bounds
             if (savedSettings?.widths && typeof savedSettings.widths === 'object') {
                columnConfig.forEach(col => {
                    if (col.isWidthAdjustable && typeof savedSettings.widths[col.id] === 'number') {
                        // Clamp width between min and max defined in config
                        widths[col.id] = Math.max(col.minWidth || 0, Math.min(col.maxWidth || Infinity, savedSettings.widths[col.id]));
                    } else if (!col.isWidthAdjustable) {
                        widths[col.id] = col.defaultWidth; // Use default if not adjustable
                    }
                });
            }
            return { visibility, widths };
        } catch (e) { console.error("Failed to load column settings:", e); }
    }
    // Return defaults if no saved settings or parsing failed
    return { visibility: { ...defaultColumnVisibility }, widths: { ...defaultColumnWidths } };
};

const saveColumnSettings = (visibility, widths) => {
    try {
        const settings = { visibility, widths };
        localStorage.setItem(LS_KEYS.COLUMN_SETTINGS, JSON.stringify(settings));
    } catch (e) {
        console.error("Failed to save column settings:", e);
    }
};