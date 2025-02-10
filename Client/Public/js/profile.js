document.addEventListener('DOMContentLoaded', () => {
    // Get the current page name from the URL
    const currentPage = window.location.pathname.split('/').pop().split('.').shift(); // e.g., "registration" from "registration.html"
    const links = document.querySelectorAll('.menu-option');

    // Loop through each link and add the 'active' class to the current page link
    links.forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active'); // Add 'active' class to highlight the link
        } else {
            link.classList.remove('active'); // Ensure other links are not highlighted
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.getElementById('backButton');
    
    // Add click event listener to the Back button
    backButton.addEventListener('click', () => {
        window.history.back(); // Navigates one step back in the browsing history
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('saveButton');
    
    saveButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent any default form behavior
        window.location.href = 'http://localhost:3000/home'; // Replace '/home.html' with your actual home page URL
    });
});
