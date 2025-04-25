// config.js

// Optional: Define initial learned set if needed
const userLearnedListOnInit = new Set([
    // 'ModuleName-Stars' keys, e.g., 'Антирадиационная-1'
]);

const columnConfig = [
    { id: 'learned', label: '💡', defaultWidth: 60, isVisibilityToggleable: false, isWidthAdjustable: false, isSortable: true, type: 'boolean' },
    { id: 'ruName', label: 'Название', defaultWidth: 200, minWidth: 100, maxWidth: 400, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'string' },
    { id: 'enName', label: 'Editor ID', defaultWidth: 200, minWidth: 100, maxWidth: 400, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'string' },
    { id: 'stars', label: 'Звёзды', defaultWidth: 100, minWidth: 50, maxWidth: 200, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'number' },
    { id: 'effect', label: 'Эффект', defaultWidth: 300, minWidth: 150, maxWidth: 600, isVisibilityToggleable: true, isWidthAdjustable: true, isSortable: true, type: 'string' },
    { id: 'actions', label: 'Действие', defaultWidth: 70, isVisibilityToggleable: false, isWidthAdjustable: false, isSortable: false, type: 'actions' }
];

const defaultColumnVisibility = columnConfig.reduce((acc, col) => {
    acc[col.id] = true; // Default all to visible
    return acc;
}, {});

const defaultColumnWidths = columnConfig.reduce((acc, col) => {
    acc[col.id] = col.defaultWidth;
    return acc;
}, {}); 