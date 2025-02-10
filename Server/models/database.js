const mysql = require('mysql2');
require('dotenv').config()

mySqlPassword = process.env.mySQL

console.log(`mySqlPass: ${mySqlPassword}`);

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',         // Your MySQL server host (e.g., localhost)
    user: 'root',              // Your MySQL username
    password: "rootroot", // Your MySQL password
    database: 'weatherApp'  // The database name you want to connect to
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database!');
});

module.exports = connection; // Export the connection for use in other files
