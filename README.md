# Fallout 76 Legendary Modules Manager ☢️

**A Pip-Boy themed web application to track your learned legendary modules in Fallout 76.**

Tired of losing track of which legendary modules you've learned across your characters or forgetting the effects of that obscure 4-star mod? This tool provides a simple, efficient, and thematic way to manage your known legendary modules directly in your browser.

---

## ✨ Live Demo

You can access the live version of this manager hosted via GitHub Pages here:

**[➡️ Live Application](https://s_myhlin.github.io/fallout-mods-manager/)**


---

## 🚀 Features

*   **Comprehensive Module List:** Pre-populated with a wide range of 1-star, 2-star, 3-star, and 4-star legendary modules, including their Russian names, Editor IDs, and effects.
*   **Learned Status Tracking:** Easily mark modules as "learned" or "not learned" using checkboxes (💡).
*   **Custom Module Management:**
    *   **Add:** Add your own custom modules that might not be in the default list.
    *   **Edit:** Modify the Editor ID and Effect of any module (Name and Stars are locked for predefined modules to maintain data integrity). Edits are performed via a convenient modal window.
    *   **Delete:** Remove any module (predefined or custom) with a confirmation prompt.
*   **Filtering & Sorting:**
    *   **Filter:** View "All", "Learned", or "Not Learned" modules.
    *   **Sort:** Click on column headers (💡, Русское Название, Editor ID, Звёзды, Эффект) to sort the list ascending or descending.
*   **Text Search:** Instantly filter modules by typing parts of the Russian Name, Editor ID, or Effect text. Matching text is highlighted.
*   **Responsive Design:**
    *   **Desktop:** Classic table view with customizable column visibility and width.
    *   **Mobile:** Adapts to a user-friendly "Card View" for easy readability and interaction on smaller screens.
*   **Customizable View (Desktop):**
    *   Toggle visibility for most columns.
    *   Adjust the width of resizable columns using sliders in the sidebar.
    *   Settings are saved locally.
*   **Collapsible Sidebar (Desktop):** Hide the sidebar on larger screens to maximize space for the module list.
*   **Data Persistence:** Your module list (learned status, custom modules) and view settings (column visibility/width) are automatically saved in your browser's `localStorage`.
*   **Import/Export:** Backup your data (modules and settings) to a JSON file or import data from a previously exported file. Useful for transferring data or keeping backups.
*   **Statistics:** See a quick overview of total modules, learned count, and percentage learned in the sidebar.
*   **Pip-Boy Theme:** Styled to resemble the iconic Fallout Pip-Boy interface.

---

## 📸 Screenshots (Optional)

**Desktop View:**
![Desktop Screenshot](images/desktop_screenshot.png) <!-- Replace with link to your screenshot -->

**Mobile Card View:**
![Mobile Screenshot](images/mobile_screenshot.png) <!-- Replace with link to your screenshot -->

**Edit Modal:**
![Edit Modal Screenshot](images/edit_modal_screenshot.png) <!-- Replace with link to your screenshot -->

---

## 🛠️ Technology Stack

*   **HTML5**
*   **CSS3:** Custom styling for the Pip-Boy theme, responsive design (Flexbox, Grid, Media Queries), and animations.
*   **JavaScript (ES6+):** Core application logic.
*   **React (v18):** UI library (loaded via CDN).
*   **Babel Standalone:** Used to transpile JSX directly in the browser (loaded via CDN).
*   **Browser `localStorage`:** For client-side data persistence.

---

## 💡 How to Use

1.  **Access the application:** Simply open the [Live Demo link](https://s_myhlin.github.io/fallout-mods-manager/) provided above.
2.  **Mark modules:** Use the checkbox (💡) in the first column (or at the top of the card on mobile) to mark modules as learned.
3.  **Filter/Sort/Search:** Use the controls in the sidebar (accessible via the ⚙️ button on mobile) to filter, sort, and search the module list.
4.  **Customize View:** Adjust column visibility and width (on desktop) via the sidebar settings.
5.  **Add/Edit/Delete:** Use the form at the bottom to add new modules, or use the ✏️/🗑️ icons next to each module (in the "Дії" column on desktop, or top-right on mobile cards) to edit or delete.
6.  **Import/Export:** Use the buttons in the sidebar to save your data to a file or load data from a backup.

**Important Note:** All data is stored **locally in your browser's `localStorage`**. Clearing your browser data will erase your saved modules and settings. Use the Export feature to create backups. Data is not shared between different browsers or devices.

---

## 🔮 Future Improvements (Ideas)

*   User accounts and cloud synchronization (would require a backend).
*   Ability to track modules per character.
*   More detailed filtering options (e.g., by weapon/armor type if data allows).
*   Improved accessibility audit.
*   Refactoring into separate JS/CSS files and adding a build step (Vite, Parcel).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/s_myhlin/fallout-mods-manager/issues).

---

## 📄 License

*(Optional: Choose a license if you want)*
This project is open source and available under the [MIT License](LICENSE.md). <!-- Create a LICENSE.md file if you choose one -->
