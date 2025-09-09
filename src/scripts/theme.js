const STORAGE_KEY = 'theme-preference';

export function getCurrentTheme() {
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function setTheme(mode) {
    const root = document.documentElement;
    
    if (mode === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
    
    try {
        localStorage.setItem(STORAGE_KEY, mode);
    } catch (_) {}
}

export function initThemeToggle() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;
    
    const updateButton = () => {
        const isDark = getCurrentTheme() === 'dark';
        button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    };
    
    const onClick = () => {
        const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
        setTheme(next);
        updateButton();
    };
    
    updateButton();
    button.addEventListener('click', onClick);
}