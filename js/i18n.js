/**
 * i18n.js - Internationalization module
 * Handles language switching and translation
 */

// Internationalization module
export const translations = {
    en: {
        meta: {
            title: 'Model Guru - AI Model Discovery & Analytics',
            description: 'Discover, compare, and track AI models across multiple platforms with real-time analytics and insights.'
        },
        nav: {
            home: 'Home',
            models: 'All Models',
            platforms: 'Platforms',
            reports: 'Reports',
            about: 'About',
            testimonials: 'Testimonials',
            faq: 'FAQ',
            blog: 'Blog'
        },
        hero: {
            title: 'Discover AI Models',
            subtitle: 'Find the perfect model for your needs'
        }
    },
    zh: {
        meta: {
            title: 'Model Guru - AI模型发现与分析',
            description: '通过实时分析和洞察，发现、比较和跟踪多个平台上的AI模型。'
        },
        nav: {
            home: '首页',
            models: '所有模型',
            platforms: '平台',
            reports: '报告',
            about: '关于',
            testimonials: '用户评价',
            faq: '常见问题',
            blog: '博客'
        },
        hero: {
            title: '发现AI模型',
            subtitle: '找到适合您需求的完美模型'
        }
    }
};

export let currentLanguage = 'en';

export function updateContent(lang) {
    currentLanguage = lang;
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (!key) return;
        
        const keys = key.split('.');
        let value = translations[lang];
        
        for (const k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                value = undefined;
                break;
            }
        }
        
        if (value !== undefined) {
            if (element.tagName === 'META') {
                element.setAttribute('content', value);
            } else {
                element.textContent = value;
            }
        }
    });
}

export function switchLanguage(lang) {
    if (translations[lang]) {
        updateContent(lang);
        localStorage.setItem('language', lang);
    }
}

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