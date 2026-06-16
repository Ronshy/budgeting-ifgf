const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'budgeting_db',
  port: parseInt(process.env.DB_PORT || '3306')
};

const pool = mysql.createPool(dbConfig);

// Helper function to query the database using Promises
function dbQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

// Check database connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err.message);
  } else {
    console.log('Connected to MySQL database budgeting_db successfully.');
    connection.release();
  }
});

// Helper to resolve department name to ID
async function getDepartmentId(deptName) {
  const results = await dbQuery('SELECT id FROM departments WHERE nama = ?', [deptName]);
  if (results.length > 0) {
    return results[0].id;
  }
  // Default to Marketing (ID 1) if not found
  return 1;
}

// ─── API ENDPOINTS ────────────────────────────────────────────────────────────

// 1. GET: Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const sql = `
      SELECT u.id, u.nama, u.email, u.password, u.role, d.nama AS departemen, u.phone, 
             DATE_FORMAT(u.join_date, '%Y-%m-%d') AS joinDate
      FROM users u
      JOIN departments d ON u.departemen_id = d.id
      ORDER BY u.id ASC
    `;
    const users = await dbQuery(sql);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Gagal mengambil data user', error: error.message });
  }
});

// 2. POST: Create a new user
app.post('/api/users', async (req, res) => {
  const { nama, email, password, role, departemen, phone } = req.body;

  if (!nama || !email || !password || !role || !departemen || !phone) {
    return res.status(400).json({ message: 'Semua kolom wajib diisi!' });
  }

  try {
    // Check if email already exists
    const emailCheck = await dbQuery('SELECT id FROM users WHERE email = ?', [email]);
    if (emailCheck.length > 0) {
      return res.status(400).json({ message: 'Email sudah digunakan oleh user lain!' });
    }

    // Resolve department ID from department name
    const departemenId = await getDepartmentId(departemen);
    const joinDate = new Date().toISOString().split('T')[0];

    const insertSql = `
      INSERT INTO users (nama, email, password, role, departemen_id, phone, join_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await dbQuery(insertSql, [nama, email, password, role, departemenId, phone, joinDate]);
    const insertId = result.insertId;

    // Return the newly created user object
    res.status(201).json({
      id: insertId,
      nama,
      email,
      password,
      role,
      departemen,
      phone,
      joinDate
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Gagal menambahkan user baru', error: error.message });
  }
});

// 3. PUT: Update an existing user
app.put('/api/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);
  const { nama, email, password, role, departemen, phone } = req.body;

  if (!nama || !email || !password || !role || !departemen || !phone) {
    return res.status(400).json({ message: 'Semua kolom wajib diisi!' });
  }

  try {
    // Check if email already exists for another user
    const emailCheck = await dbQuery('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId]);
    if (emailCheck.length > 0) {
      return res.status(400).json({ message: 'Email sudah digunakan oleh user lain!' });
    }

    // Resolve department ID
    const departemenId = await getDepartmentId(departemen);

    const updateSql = `
      UPDATE users 
      SET nama = ?, email = ?, password = ?, role = ?, departemen_id = ?, phone = ?
      WHERE id = ?
    `;
    await dbQuery(updateSql, [nama, email, password, role, departemenId, phone, userId]);

    // Retrieve the updated user's joinDate
    const userResult = await dbQuery("SELECT DATE_FORMAT(join_date, '%Y-%m-%d') as joinDate FROM users WHERE id = ?", [userId]);
    const joinDate = userResult.length > 0 ? userResult[0].joinDate : new Date().toISOString().split('T')[0];

    res.json({
      id: userId,
      nama,
      email,
      password,
      role,
      departemen,
      phone,
      joinDate
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Gagal memperbarui data user', error: error.message });
  }
});

// 4. DELETE: Delete a user
app.delete('/api/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    await dbQuery('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: `User dengan ID ${userId} berhasil dihapus.` });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Gagal menghapus user', error: error.message });
  }
});

// 5. GET: Fetch all roles
app.get('/api/roles', async (req, res) => {
  try {
    const roles = await dbQuery('SELECT * FROM roles ORDER BY id ASC');
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ message: 'Gagal mengambil data role', error: error.message });
  }
});

// 6. POST: Create a new role
app.post('/api/roles', async (req, res) => {
  const { nama } = req.body;
  if (!nama) {
    return res.status(400).json({ message: 'Nama role wajib diisi!' });
  }
  try {
    const check = await dbQuery('SELECT id FROM roles WHERE nama = ?', [nama]);
    if (check.length > 0) {
      return res.status(400).json({ message: 'Role dengan nama tersebut sudah ada!' });
    }
    const result = await dbQuery('INSERT INTO roles (nama) VALUES (?)', [nama]);
    res.status(201).json({ id: result.insertId, nama });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ message: 'Gagal menambahkan role baru', error: error.message });
  }
});

// 7. GET: Fetch all user-role mappings
app.get('/api/user-roles', async (req, res) => {
  try {
    const userRoles = await dbQuery('SELECT user_id, role_id FROM user_roles');
    res.json(userRoles);
  } catch (error) {
    console.error('Error fetching user roles:', error);
    res.status(500).json({ message: 'Gagal mengambil data pemetaan user role', error: error.message });
  }
});

// 8. POST: Link a user to a role (check checkbox)
app.post('/api/user-roles', async (req, res) => {
  const { userId, roleId } = req.body;
  if (!userId || !roleId) {
    return res.status(400).json({ message: 'userId dan roleId wajib diisi!' });
  }
  try {
    await dbQuery('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE user_id = user_id', [userId, roleId]);
    res.json({ message: 'Role berhasil dikaitkan ke user.', userId, roleId });
  } catch (error) {
    console.error('Error assigning role:', error);
    res.status(500).json({ message: 'Gagal mengaitkan role ke user', error: error.message });
  }
});

// 9. DELETE: Unlink a user from a role (uncheck checkbox)
app.delete('/api/user-roles', async (req, res) => {
  const userId = parseInt(req.body.userId || req.query.userId);
  const roleId = parseInt(req.body.roleId || req.query.roleId);
  if (!userId || !roleId) {
    return res.status(400).json({ message: 'userId dan roleId wajib diisi!' });
  }
  try {
    await dbQuery('DELETE FROM user_roles WHERE user_id = ? AND role_id = ?', [userId, roleId]);
    res.json({ message: 'Role berhasil dilepas dari user.', userId, roleId });
  } catch (error) {
    console.error('Error removing role:', error);
    res.status(500).json({ message: 'Gagal melepas role dari user', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
