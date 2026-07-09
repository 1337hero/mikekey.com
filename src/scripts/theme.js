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
    if (!button || button.dataset.init === 'true') return;
    button.dataset.init = 'true';

    // Switch click sound (simple HTMLAudioElement for minimal overhead)
    let clickAudio = null;
    const soundSrc = button.getAttribute('data-sound');
    if (soundSrc) {
        try {
            clickAudio = new Audio(soundSrc);
            clickAudio.preload = 'auto';
        } catch (_) {}
    }

    const updateButton = () => {
        const isDark = getCurrentTheme() === 'dark';
        button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
        button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    };

    const onClick = () => {
        const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
        setTheme(next);
        updateButton();
        if (clickAudio) {
            try {
                clickAudio.currentTime = 0;
                clickAudio.play();
            } catch (_) {}
        }
    };

    updateButton();
    button.addEventListener('click', onClick);
}