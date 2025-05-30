// config.js

// Configuration for table columns
window.columnConfig = [
    { id: 'learned', labelKey: 'columnLabelLearned', defaultWidth: 60, isVisibilityToggleable: false, isWidthAdjustable: false, isSortable: true, type: 'boolean' },
    { id: 'name', labelKey: 'columnLabelName', defaultWidth: 220, minWidth: 150, maxWidth: 400, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'string' },
    { id: 'stars', labelKey: 'columnLabelStars', defaultWidth: 80, minWidth: 50, maxWidth: 150, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'number' },
    { id: 'module_compatibility', labelKey: 'columnLabelCompatibility', defaultWidth: 150, minWidth: 80, maxWidth: 250, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: false, type: 'array_icons' }, // New column
    { id: 'module_materials', labelKey: 'columnLabelMaterials', defaultWidth: 200, minWidth: 100, maxWidth: 350, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'string' }, // New column
    { id: 'effect', labelKey: 'columnLabelEffect', defaultWidth: 300, minWidth: 150, maxWidth: 600, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'string' },
    { id: 'actions', labelKey: 'columnLabelActions', defaultWidth: 70, isVisibilityToggleable: false, isWidthAdjustable: false, isSortable: false, type: 'actions' }
];

// Default visibility state based on columnConfig
window.defaultColumnVisibility = window.columnConfig.reduce((acc, col) => {
    acc[col.id] = true;
    return acc;
}, {});


// Default width state based on columnConfig
window.defaultColumnWidths = window.columnConfig.reduce((acc, col) => {
    if (col.defaultWidth) {
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