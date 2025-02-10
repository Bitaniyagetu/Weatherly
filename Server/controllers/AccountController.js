const bcrypt = require('bcrypt');
const connection = require('../models/database'); // Import the db connection

exports.addUser = async (req, res) => {
    const saltRounds = 10;
    const { firstName, lastName, birthD, phone, email, password } = req.body;

    // Check if all fields are provided
    if (!firstName || !lastName || !birthD || !phone || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Hash the password using bcrypt
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }

        // Insert the user data into the database
        const query = `
            INSERT INTO Users (first_name, last_name, date_of_birth, phone_number, email, password) 
            VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [firstName, lastName, birthD, phone, email, hashedPassword];

        connection.query(query, values, (err, result) => {
            if (err) {
                console.error('Error inserting data:', err.message);
                return res.status(500).json({ error: 'Error registering user' });
            }

            // Redirect to the login page
            return res.redirect('/login'); // Send only the redirect response
        });
        return res.status(201).json({
            message: "User successfully registered",
            userId: result.insertId
        });
    });
};

//get all users 

exports.getAllUsers = (req, res) => {
    const query = "SELECT * FROM Users";

    connection.query(query, (err, result) => {
        if (err) {
            console.error('Error retrieving users:', err.message);
            return res.status(500).json({ error: "Error retrieving users" });

        }
        return res.status(200).json(result);
    });

};

//get user by id 
exports.getUserById = (req, res) => {
    const { id } = req.params;

    const query = 'SELECT * FROM Users WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error retrieving user:', err.message);
            return res.status(500).json({ error: 'Error retrieving user' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json(result[0]);
    });
};

//update user by id 
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, birthD, phone, email, password } = req.body;

    // Hash new password if provided
    let hashedPassword = null;
    if (password) {
        const saltRounds = 10;
        try {
            hashedPassword = await bcrypt.hash(password, saltRounds);
        } catch (error) {
            return res.status(500).json({ error: 'Error hashing password' });
        }
    }

    const query = `
    UPDATE Users SET first_name = ?, last_name = ?, date_of_birth = ?, phone_number = ?, email = ?, 
    password = COALESCE(?, password) WHERE id = ?`;
    const values = [firstName, lastName, birthD, phone, email, hashedPassword, id];

    connection.query(query, values, (err, result) => {
        if (err) {
            console.error('Error updating user:', err.message);
            return res.status(500).json({ error: 'Error updating user' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ message: 'User updated successfully' });
    });
};


//delete user by id 

exports.deleteUser = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM Users WHERE id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting user:', err.message);
            return res.status(500).json({ error: 'Error deleting user' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    });
};
