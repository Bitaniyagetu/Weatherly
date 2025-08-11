// ===== Navigation =====
function navigateToPage(page) {
    const url = `/${page}`;
    window.location.href = url;
}

// Add click listeners to nav menu options
document.querySelectorAll('.menu-option').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault(); // prevent default so we can highlight before navigating
        const page = this.getAttribute('data-page');
        setActiveMenu(page);
        navigateToPage(page);
    });
});

// ===== Active menu highlighting =====
function setActiveMenu(page) {
    document.querySelectorAll('.menu-option').forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-page') === page);
    });
}

// On page load, highlight based on current URL
(function highlightCurrentMenu() {
    const currentPath = window.location.pathname.replace('/', '') || 'home';
    setActiveMenu(currentPath);
})();

// ===== OPTIONAL: Dark Mode Toggle =====
// Create toggle button if not already in HTML
(function setupDarkMode() {
    const toggle = document.createElement('button');
    toggle.textContent = '🌙';
    toggle.style.marginLeft = '10px';
    toggle.style.cursor = 'pointer';
    document.querySelector('nav').appendChild(toggle);

    // Load preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });
})();
