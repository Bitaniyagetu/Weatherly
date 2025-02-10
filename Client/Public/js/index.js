document.addEventListener('DOMContentLoaded', function () {
    // Function to fade the button in and out
    function fadeMessage() {
        const message = document.getElementById('Click');
        let opacity = 1;
        let fadingOut = true;

        setInterval(() => {
            if (fadingOut) {
                opacity -= 0.02;
            } else {
                opacity += 0.02;
            }

            // Reverse fading direction at boundaries
            if (opacity <= 0) {
                fadingOut = false;
            } else if (opacity >= 1) {
                fadingOut = true;
            }

            // Apply the opacity to the button
            message.style.opacity = opacity;
        }, 50); // Adjust the speed as needed
    }

    // Function to handle spacebar press
    function PressSpacebar() {
        window.location.href = 'http://localhost:3000/home'; // Navigate to /home page
    }

    // Event listener for spacebar press
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            PressSpacebar(); // Navigate on spacebar press
        }
    });

    // Event listener for button click
    document.getElementById('Click').addEventListener('click', PressSpacebar);

    // Start the fading animation
    fadeMessage();
});
