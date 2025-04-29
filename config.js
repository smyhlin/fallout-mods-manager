// config.js

// Initial set of learned modules (used if no saved data exists or during merge)
// Format: 'ModuleName-Stars', e.g., 'Антирадиационная-1'
const userLearnedListOnInit = new Set([
    // Add keys here if needed
]);

// Configuration for table columns
const columnConfig = [
    { id: 'learned', label: '💡', defaultWidth: 60, isVisibilityToggleable: false, isWidthAdjustable: false, isSortable: true, type: 'boolean' },
    { id: 'ruName', label: 'Название', defaultWidth: 200, minWidth: 100, maxWidth: 400, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'string' },
    { id: 'enName', label: 'Editor ID', defaultWidth: 200, minWidth: 100, maxWidth: 400, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'string' },
    { id: 'stars', label: 'Звёзды', defaultWidth: 100, minWidth: 50, maxWidth: 200, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'number' },
    { id: 'effect', label: 'Эффект', defaultWidth: 300, minWidth: 150, maxWidth: 600, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'string' },
    { id: 'actions', label: 'Действие', defaultWidth: 70, isVisibilityToggleable: false, isWidthAdjustable: false, isSortable: false, type: 'actions' }
];

// Default visibility state based on columnConfig
const defaultColumnVisibility = columnConfig.reduce((acc, col) => {
    acc[col.id] = true; // Default all columns to visible
    return acc;
}, {});

// Default width state based on columnConfig
const defaultColumnWidths = columnConfig.reduce((acc, col) => {
    acc[col.id] = col.defaultWidth;
    return acc;
}, {});