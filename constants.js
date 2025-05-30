// constants.js
// LS_KEYS: Define keys for localStorage items
const LS_KEYS = {
    LEARNED_STATUS: 'fallout76LearnedStatus_v3', // Stores { moduleId: boolean }
    CUSTOM_MODULES: 'fallout76CustomModules_v3', // Stores array of custom module objects
    COLUMN_SETTINGS: 'fallout76ColumnSettings_v2',
    LANGUAGE: 'fallout76Language_v1' // Added for storing selected language
};

// DEBOUNCE_DELAY: Delays for debouncing functions (e.g., search, width adjustments)
const DEBOUNCE_DELAY = {
    SEARCH: 300, // ms delay for search input
    WIDTH: 300, // ms delay for width slider changes
};

// NOTIFICATION_TIMEOUT: Duration for notifications to be visible (in milliseconds)
const NOTIFICATION_TIMEOUT = 3000; // 3 seconds

// SCROLL_STEP: Pixels to scroll with arrow buttons in scrollable containers
const SCROLL_STEP = 100; // pixels to scroll with arrows

// MAX_VISIBLE_MODULE_SAMPLES_IN_BANNER: Max number of module names to show in stats banner
const MAX_VISIBLE_MODULE_SAMPLES_IN_BANNER = 3;