// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("loginButton");
    const resetButton = document.getElementById("resetButton");
    const backButton = document.getElementById("backButton");

    // Handle login form submission
    loginButton.addEventListener("click", (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }

        // Simple email format validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        // Simulate login success (replace with real authentication logic)
        alert("Login successful!");
        // Redirect to the home page or another page
        window.location.href = "/home";
    });

    // Handle reset button
    resetButton.addEventListener("click", () => {
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
    });

    // Handle back button
    backButton.addEventListener("click", () => {
        window.history.back();
    });
});
