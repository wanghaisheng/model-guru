/**
 * i18n.js - Internationalization module
 * Handles language switching and translation
 */

class I18n {
    constructor() {
        this.translations = {};
        this.currentLang = localStorage.getItem('lang') || 'en';
        this.loadedLanguages = new Set();
    }

    /**
     * Load translations for a specific language
     * @param {string} lang - Language code
     * @returns {Promise} - Promise that resolves when translations are loaded
     */
    async loadTranslations(lang) {
        if (this.loadedLanguages.has(lang)) {
            return Promise.resolve();
        }

        try {
            const response = await fetch(`locale/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${lang}`);
            }
            
            this.translations[lang] = await response.json();
            this.loadedLanguages.add(lang);
            return Promise.resolve();
        } catch (error) {
            console.error(`Error loading translations for ${lang}:`, error);
            return Promise.reject(error);
        }
    }

    /**
     * Switch to a different language
     * @param {string} lang - Language code
     * @returns {Promise} - Promise that resolves when language is switched
     */
    async switchLanguage(lang) {
        try {
            await this.loadTranslations(lang);
            this.currentLang = lang;
            localStorage.setItem('lang', lang);
            this.updateContent();
            return Promise.resolve();
        } catch (error) {
            console.error(`Error switching to language ${lang}:`, error);
            return Promise.reject(error);
        }
    }

    /**
     * Get translation for a key
     * @param {string} key - Translation key
     * @param {Object} params - Parameters for interpolation
     * @returns {string} - Translated text
     */
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (!value || !value[k]) {
                console.warn(`Translation key not found: ${key}`);
                return key;
            }
            value = value[k];
        }
        
        // Replace parameters
        return value.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * Update all elements with data-i18n attribute
     */
    updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const params = {};
            
            // Get parameters from data attributes
            Array.from(element.attributes).forEach(attr => {
                if (attr.name.startsWith('data-i18n-param-')) {
                    const paramName = attr.name.replace('data-i18n-param-', '');
                    params[paramName] = attr.value;
                }
            });
            
            if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                element.placeholder = this.t(key, params);
            } else {
                element.textContent = this.t(key, params);
            }
        });
    }
}

// Create and export a singleton instance
const i18n = new I18n();
export default i18n; 