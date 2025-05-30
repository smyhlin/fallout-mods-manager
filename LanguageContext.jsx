// LanguageContext.jsx
const { createContext, useState, useEffect, useContext, useCallback } = React;

const LanguageContext = createContext();

window.LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => localStorage.getItem(LS_KEYS.LANGUAGE) || 'en');
    const [translations, setTranslations] = useState({});
    const [languageModules, setLanguageModules] = useState([]);
    const [isLoadingContext, setIsLoadingContext] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoadingContext(true);
            let fetchedTranslations = {};
            let fetchedModules = [];
            let finalLanguage = language;

            try {
                // Fetch UI translations
                const transResponse = await fetch(`./locales/${language}.json`);
                if (!transResponse.ok) {
                    console.warn(`Failed to load UI translations for ${language}. Falling back to English.`);
                    const fallbackTransResponse = await fetch('./locales/en.json');
                    if (!fallbackTransResponse.ok) throw new Error("Failed to load fallback English UI translations.");
                    fetchedTranslations = await fallbackTransResponse.json();
                    finalLanguage = 'en';
                } else {
                    fetchedTranslations = await transResponse.json();
                }

                // Fetch module data for the (potentially fallback) language
                const modulesResponse = await fetch(`./locales/${finalLanguage}_modules.json`);
                if (!modulesResponse.ok) {
                    console.warn(`Failed to load modules for ${finalLanguage}. Using empty module list.`);
                    // If even English modules fail, we'll have an empty array, which is handled.
                } else {
                    fetchedModules = await modulesResponse.json();
                }

            } catch (error) {
                console.error("Error fetching context data:", error);
                // Try to load English as a last resort if primary fails badly
                try {
                    if (finalLanguage !== 'en') { // if primary wasn't 'en' and failed
                        const enTrans = await fetch('./locales/en.json');
                        fetchedTranslations = await enTrans.json();
                        const enMods = await fetch('./locales/en_modules.json');
                        fetchedModules = await enMods.json();
                        finalLanguage = 'en';
                    }
                } catch (finalError) {
                    console.error("Critical error loading fallback English data:", finalError);
                    fetchedTranslations = {
                        appTitle: "Fallout 76 Legendary Mods Manager",
                        loadingMessage: "Loading Error. Please refresh.",
                        errorBoundaryTitle: "Error",
                        errorBoundaryMessage: "A critical error occurred loading application data."
                    };
                }
            } finally {
                setTranslations(fetchedTranslations);
                setLanguageModules(fetchedModules);
                if (language !== finalLanguage) {
                    setLanguage(finalLanguage);
                    localStorage.setItem(LS_KEYS.LANGUAGE, finalLanguage);
                    document.documentElement.lang = finalLanguage;
                }
                setIsLoadingContext(false);
            }
        };
        fetchAllData();
    }, [language]);

    const t = useCallback((key, params = {}) => {
        let text = translations[key] || key;
        for (const param in params) {
            const regex = new RegExp(`{{${param}}}`, 'g');
            text = text.replace(regex, params[param]);
        }
        return text;
    }, [translations]);

    const switchLanguage = useCallback((newLanguage) => {
        if (['en', 'ua', 'ru'].includes(newLanguage)) {
            setLanguage(newLanguage);
            localStorage.setItem(LS_KEYS.LANGUAGE, newLanguage);
            document.documentElement.lang = newLanguage;
        } else {
            console.warn(`Unsupported language: ${newLanguage}`);
        }
    }, []);

    return React.createElement(LanguageContext.Provider, {
        value: { language, switchLanguage, t, languageModules, isLoadingContext },
        children
    });
};

window.LanguageProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

window.useTranslation = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};