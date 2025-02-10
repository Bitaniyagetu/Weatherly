// Function to handle navigation
function navigateToPage(page) {
    const url = `/${page}`; // Construct the URL
    window.location.href = url; // Navigate to the new page
}

// Add event listeners to the menu options
document.querySelectorAll('.menu-option').forEach(button => {
    button.addEventListener('click', function() {
        const page = this.getAttribute('data-page'); // Get the corresponding page from the data attribute
        navigateToPage(page); // Call the navigate function
    });
});
