document.addEventListener('DOMContentLoaded', () => {
    let isLoggedIn = false; // Start with the user not logged in
    const logIn = document.getElementById('logIn');
    const registrationForm = document.querySelector('form'); // Assuming there's only one form

    // Initialize login button text
    logIn.textContent = 'Login';
    logIn.dataset.page = "login";

    // Check local storage for login state
    if (localStorage.getItem('isLoggedIn') === 'true') {
        isLoggedIn = true; // User is logged in
        logIn.textContent = 'Logout'; // Update button text
        logIn.dataset.page = "logout"; // Update page attribute
    }

    // Handle login/logout functionality
    logIn.addEventListener('click', () => {
        if (isLoggedIn) {
            console.log('Logging out...');
            localStorage.removeItem('isLoggedIn'); // Clear login state
            isLoggedIn = false; // Reset the login status
            logIn.textContent = 'Login'; // Reset the button text
            logIn.dataset.page = "login"; // Reset the page attribute
            window.location.href = '/login'; // Redirect to login page
        } else {
            window.location.href = '/login'; // Redirect to login page
        }
    });

    // Handle registration form submission
    registrationForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        console.log('Registration successful!');

        // Set logged-in state in local storage
        localStorage.setItem('isLoggedIn', 'true'); // Use 'true' to indicate the user is logged in

        // Change the login state and update button text
        isLoggedIn = true; // User is now logged in
        logIn.textContent = 'Logout'; // Update button text
        logIn.dataset.page = "logout"; // Update page attribute

        // Redirect to home page after registration
        window.location.href = 'http://localhost:3000/home'; // Adjust this URL as needed for your app
    });

    // Set active class for menu links
    const currentPage = window.location.pathname.split('/').pop().split('.').shift(); // Get current page
    const links = document.querySelectorAll('.menu-option');

    // Loop through each link and add the 'active' class to the current page link
    links.forEach(link => {
        if (link.dataset.page === currentPage) {
            link.classList.add('active'); // Highlight the active link
        } else {
            link.classList.remove('active'); // Ensure other links are not highlighted
        }
    });
});


document.getElementById('submitButton').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
    
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const birthD = document.getElementById('birthD').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Create an object with the user data
    const userData = {
        firstName,
        lastName,
        birthD,
        phone,
        email,
        password
    };

    // Make a POST request to the API
    fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
            //window.location.href('')
        } else if (data.error) {
            alert(data.error);
        }
    })
    .catch(error => console.error('Error:', error));
});

