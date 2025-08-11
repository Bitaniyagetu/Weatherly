// Server/controllers/AccountController.js
const bcrypt = require('bcryptjs');
const connection = require('../models/database'); // DB pool/conn

// Helper: promisify a query
function q(sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// POST /api/user -> create
exports.addUser = async (req, res) => {
  try {
    const { firstName, lastName, birthD, phone, email, password } = req.body;

    if (!firstName || !lastName || !birthD || !phone || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Ensure unique email
    const existing = await q('SELECT id FROM Users WHERE email = ? LIMIT 1', [email]);
    if (existing.length) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    const result = await q(
      `INSERT INTO Users (first_name, last_name, date_of_birth, phone_number, email, password)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, birthD, phone, email, hashed]
    );

    // Return JSON; let the client decide to redirect to /login
    return res.status(201).json({
      message: 'User successfully registered',
      userId: result.insertId
    });
  } catch (err) {
    console.error('addUser error:', err.message);
    return res.status(500).json({ error: 'Error registering user' });
  }
};

// GET /api/user -> all users
exports.getAllUsers = async (_req, res) => {
  try {
    const rows = await q('SELECT * FROM Users ORDER BY id DESC');
    return res.status(200).json(rows);
  } catch (err) {
    console.error('getAllUsers error:', err.message);
    return res.status(500).json({ error: 'Error retrieving users' });
  }
};

// GET /api/user/:id -> one user
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await q('SELECT * FROM Users WHERE id = ? LIMIT 1', [id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(rows[0]);
  } catch (err) {
    console.error('getUserById error:', err.message);
    return res.status(500).json({ error: 'Error retrieving user' });
  }
};

// PATCH /api/user/:id -> update
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, birthD, phone, email, password } = req.body;

    let hashed = null;
    if (password) {
      const saltRounds = 10;
      hashed = await bcrypt.hash(password, saltRounds);
    }

    const result = await q(
      `UPDATE Users
         SET first_name = ?, last_name = ?, date_of_birth = ?, phone_number = ?, email = ?,
             password = COALESCE(?, password)
       WHERE id = ?`,
      [firstName, lastName, birthD, phone, email, hashed, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    console.error('updateUser error:', err.message);
    return res.status(500).json({ error: 'Error updating user' });
  }
};

// DELETE /api/user/:id -> delete
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await q('DELETE FROM Users WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('deleteUser error:', err.message);
    return res.status(500).json({ error: 'Error deleting user' });
  }
};
