// config.js

// Initial set of learned modules (used if no saved data exists or during merge)
// Format: 'ModuleName-Stars', e.g., 'Антирадиационная-1'
const userLearnedListOnInit = new Set([
    // Add keys here if needed
]);

// Configuration for table columns
window.columnConfig = [
    // Use labelKey for translation
    { id: 'learned', labelKey: 'columnLabelLearned', defaultWidth: 60, isVisibilityToggleable: false, isWidthAdjustable: false, isSortable: true, type: 'boolean' },
    { id: 'ruName', labelKey: 'columnLabelRuName', defaultWidth: 200, minWidth: 100, maxWidth: 400, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'string' },
    { id: 'enName', labelKey: 'columnLabelEnName', defaultWidth: 200, minWidth: 100, maxWidth: 400, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'string' },
    { id: 'stars', labelKey: 'columnLabelStars', defaultWidth: 100, minWidth: 50, maxWidth: 200, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'number' },
    { id: 'effect', labelKey: 'columnLabelEffect', defaultWidth: 300, minWidth: 150, maxWidth: 600, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'string' },
    { id: 'actions', labelKey: 'columnLabelActions', defaultWidth: 70, isVisibilityToggleable: false, isWidthAdjustable: false, isSortable: false, type: 'actions' }
];

// Default visibility state based on columnConfig
window.defaultColumnVisibility = window.columnConfig.reduce((acc, col) => {
    acc[col.id] = true; // Default all columns to visible
    return acc;
}, {});
// Ensure 'actions' column is not in default visibility if it's handled separately or always visible
// delete window.defaultColumnVisibility.actions;


// Default width state based on columnConfig
window.defaultColumnWidths = window.columnConfig.reduce((acc, col) => {
    if (col.defaultWidth) { // Only add if defaultWidth is defined
        acc[col.id] = col.defaultWidth;
    }
    return acc;
}, {});

// Holo-Hub Pages Configuration
window.holoHubPagesConfig = [
    { id: 'xpFarming', labelKey: 'holoHubPageXPFarming', icon: '📖' },
    { id: 'critCalculator', labelKey: 'holoHubPageCritCalculator', icon: '∑' },
    { id: 'weaponTierList', labelKey: 'holoHubPageWeaponTierList', icon: '🔫' },
    { id: 'armorTierList', labelKey: 'holoHubPageArmorTierList', icon: '🛡️' },
];