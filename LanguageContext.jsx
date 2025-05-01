const { createContext, useState, useEffect, useContext, useCallback } = React;

// Create the Language Context as a global object
const LanguageContext = createContext();

// Export the Provider component globally
window.LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
    const [translations, setTranslations] = useState({});

    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const response = await fetch(`./locales/${language}.json`);
                if (!response.ok) {
                    console.error(`Failed to load translations for ${language}. Falling back to English.`);
                    const fallbackResponse = await fetch('./locales/en.json');
                    if (!fallbackResponse.ok) throw new Error("Failed to load fallback English translations.");
                    setTranslations(await fallbackResponse.json());
                    setLanguage('en');
                    localStorage.setItem('language', 'en');
                    return;
                }
                setTranslations(await response.json());
            } catch (error) {
                console.error("Error fetching translations:", error);
                setTranslations({
                    appTitle: "Fallout 76 Legendary Modules Manager",
                    loadingMessage: "Loading...",
                    errorBoundaryTitle: "Error",
                    errorBoundaryMessage: "An error occurred."
                });
                setLanguage('en');
                localStorage.setItem('language', 'en');
            }
        };
        fetchTranslations();
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
            localStorage.setItem('language', newLanguage);
            document.documentElement.lang = newLanguage;
        } else {
            console.warn(`Unsupported language: ${newLanguage}`);
        }
    }, []);

    return React.createElement(LanguageContext.Provider, {
        value: { language, switchLanguage, t },
        children
    });
};

window.LanguageProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// Export the useTranslation hook globally
window.useTranslation = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider');
    }
    return context;
};