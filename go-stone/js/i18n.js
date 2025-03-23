class I18n {
  constructor() {
    this.currentLanguage = this.loadLanguage();
    this.setupEventListeners();
    this.translatePage();
  }

  loadLanguage() {
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (savedLanguage && ['EN', 'KO'].includes(savedLanguage)) {
      return savedLanguage;
    }
    return 'EN'; // Default to English
  }

  saveLanguage(language) {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    this.currentLanguage = language;
  }

  getTranslation(key) {
    return TRANSLATIONS[this.currentLanguage][key] || key;
  }

  translatePage() {
    // Set language dropdown to current language
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
      languageSelect.value = this.currentLanguage;
    }

    // Translate all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      element.textContent = this.getTranslation(key);
    });
  }

  setupEventListeners() {
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
      languageSelect.addEventListener('change', (e) => {
        this.saveLanguage(e.target.value);
        this.translatePage();
      });
    }
  }

  // Helper for date formatting based on current language
  formatDate(date) {
    if (!date) return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(2);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    if (this.currentLanguage === 'KO') {
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } else {
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    }
  }
}
