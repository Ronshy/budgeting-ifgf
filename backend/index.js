const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
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

// ─── Email Transporter ────────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify email config on startup (non-blocking)
transporter.verify((err) => {
  if (err) {
    console.warn('⚠ Email transporter not configured:', err.message);
    console.warn('  → Set SMTP_USER and SMTP_PASS in .env to enable email notifications.');
  } else {
    console.log('✓ Email transporter ready (' + process.env.SMTP_USER + ')');
  }
});

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

/**
 * Send approval notification email to a list of approvers.
 * @param {Array<{nama: string, email: string}>} approvers
 * @param {object} poData - { nomorPO, namaKegiatan, departemen, submittedBy }
 */
async function sendApproverEmails(approvers, poData) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠ Skipping emails: SMTP credentials not configured.');
    return { sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const approver of approvers) {
    try {
      await transporter.sendMail({
        from: `"Budgeting IFGF" <${process.env.SMTP_USER}>`,
        to: approver.email,
        subject: 'Notifikasi Approval Baru',
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
            <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 28px 32px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">Budgeting IFGF</h1>
            </div>
            <div style="padding: 32px;">
              <p style="font-size: 16px; color: #0f172a; margin: 0 0 8px;">Halo, <strong>${approver.nama}</strong></p>
              <p style="font-size: 15px; color: #334155; line-height: 1.6; margin: 0 0 24px;">
                Anda memiliki lembar approval baru.
              </p>
              <div style="text-align: center; margin: 24px 0;">
                <a href="${APP_URL}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-size: 14px; font-weight: 600;">Buka Aplikasi</a>
              </div>
              <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 24px 0 0;">Email ini dikirim otomatis oleh sistem Budgeting IFGF.</p>
            </div>
          </div>
        `,
      });
      console.log(`  ✓ Email sent to ${approver.email}`);
      sent++;
    } catch (err) {
      console.error(`  ✗ Failed to send email to ${approver.email}:`, err.message);
      failed++;
    }
  }

  return { sent, failed };
}

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

// ─── Purchase Order Endpoints ─────────────────────────────────────────────────

// 10. GET: Fetch all purchase orders with items
app.get('/api/purchase-orders', async (req, res) => {
  try {
    const poSql = `
      SELECT po.id, po.nomor_po AS nomorPO, po.nama_kegiatan AS namaKegiatan,
             d.nama AS departemen, COALESCE(ba.name, 'off_budget') AS budgetCategory,
             po.is_off_budget AS isOffBudget, po.keterangan,
             po.total_nilai AS totalNilai, u.nama AS submittedBy,
             po.submitted_at AS submittedAt, po.status, po.rejection_reason AS rejectionReason
      FROM purchase_orders po
      JOIN departments d ON po.department_id = d.id
      JOIN users u ON po.submitted_by = u.id
      LEFT JOIN budget_allocations ba ON po.budget_allocation_id = ba.id
      ORDER BY po.submitted_at DESC
    `;
    const pos = await dbQuery(poSql);

    // Fetch items for each PO
    for (const po of pos) {
      const itemsSql = `
        SELECT id, nama_barang AS namaBarang, jumlah, harga_satuan AS hargaSatuan,
               total_harga AS totalHarga, rekening_supplier AS rekeningSupplier
        FROM po_items WHERE po_id = ?
      `;
      po.items = await dbQuery(itemsSql, [po.id]);
      po.isOffBudget = !!po.isOffBudget;
    }

    res.json(pos);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    res.status(500).json({ message: 'Gagal mengambil data PO', error: error.message });
  }
});

// 11. POST: Create a purchase order + send email to approvers
app.post('/api/purchase-orders', async (req, res) => {
  const { namaKegiatan, departemen, budgetCategory, isOffBudget, keterangan, items, submittedBy } = req.body;

  if (!namaKegiatan || !departemen || !keterangan || !items || items.length === 0 || !submittedBy) {
    return res.status(400).json({ message: 'Semua kolom wajib diisi dan minimal 1 item!' });
  }

  try {
    // Resolve department ID
    const departemenId = await getDepartmentId(departemen);

    // Resolve budget allocation ID (null if off-budget)
    let budgetAllocationId = null;
    if (!isOffBudget && budgetCategory && budgetCategory !== 'off_budget') {
      const baResult = await dbQuery(
        'SELECT id FROM budget_allocations WHERE department_id = ? AND name = ?',
        [departemenId, budgetCategory]
      );
      if (baResult.length > 0) budgetAllocationId = baResult[0].id;
    }

    // Generate PO number
    const year = new Date().getFullYear();
    const countResult = await dbQuery('SELECT COUNT(*) AS total FROM purchase_orders');
    const poNumber = `PO-${year}-${String((countResult[0].total || 0) + 1).padStart(3, '0')}`;

    // Calculate total
    const totalNilai = items.reduce((sum, item) => sum + (item.jumlah * item.hargaSatuan), 0);

    // Resolve submittedBy user ID
    const userResult = await dbQuery('SELECT id FROM users WHERE nama = ?', [submittedBy]);
    if (userResult.length === 0) {
      return res.status(400).json({ message: 'User pengirim tidak ditemukan!' });
    }
    const submittedById = userResult[0].id;

    const submittedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Insert PO
    const insertPO = `
      INSERT INTO purchase_orders (nomor_po, nama_kegiatan, department_id, budget_allocation_id, is_off_budget, keterangan, total_nilai, submitted_by, submitted_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
    const poResult = await dbQuery(insertPO, [
      poNumber, namaKegiatan, departemenId, budgetAllocationId,
      isOffBudget ? 1 : 0, keterangan, totalNilai, submittedById, submittedAt
    ]);
    const poId = poResult.insertId;

    // Insert PO items
    for (const item of items) {
      const totalHarga = item.jumlah * item.hargaSatuan;
      await dbQuery(
        'INSERT INTO po_items (po_id, nama_barang, jumlah, harga_satuan, total_harga, rekening_supplier) VALUES (?, ?, ?, ?, ?, ?)',
        [poId, item.namaBarang, item.jumlah, item.hargaSatuan, totalHarga, item.rekeningSupplier]
      );
    }

    console.log(`✓ PO ${poNumber} created (ID: ${poId})`);

    // Find approvers in the same department (matches Approver, Approver 1, Approver 2, or Approver 3)
    const approversSql = `
      SELECT u.nama, u.email FROM users u
      WHERE u.departemen_id = ? AND u.role IN ('Approver', 'Approver 1', 'Approver 2', 'Approver 3')
    `;
    const approvers = await dbQuery(approversSql, [departemenId]);
    console.log(`  Found ${approvers.length} approver(s) in department "${departemen}"`);

    // Send email notifications
    const emailResult = await sendApproverEmails(approvers, {
      nomorPO: poNumber,
      namaKegiatan,
      departemen,
      submittedBy,
    });

    // Return created PO
    res.status(201).json({
      id: poId,
      nomorPO: poNumber,
      namaKegiatan,
      departemen,
      budgetCategory: isOffBudget ? 'off_budget' : budgetCategory,
      isOffBudget: !!isOffBudget,
      keterangan,
      items: items.map((item, idx) => ({
        id: idx + 1,
        namaBarang: item.namaBarang,
        jumlah: item.jumlah,
        hargaSatuan: item.hargaSatuan,
        totalHarga: item.jumlah * item.hargaSatuan,
        rekeningSupplier: item.rekeningSupplier,
      })),
      totalNilai,
      submittedBy,
      submittedAt,
      status: 'pending',
      emailNotification: {
        approversFound: approvers.length,
        ...emailResult,
      },
    });
  } catch (error) {
    console.error('Error creating purchase order:', error);
    res.status(500).json({ message: 'Gagal membuat Purchase Order', error: error.message });
  }
});

// 12. PUT: Update PO status (approve / reject)
app.put('/api/purchase-orders/:id/status', async (req, res) => {
  const poId = parseInt(req.params.id);
  const { status, rejectionReason } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status harus "approved" atau "rejected"' });
  }

  try {
    if (status === 'rejected' && rejectionReason) {
      await dbQuery('UPDATE purchase_orders SET status = ?, rejection_reason = ? WHERE id = ?', [status, rejectionReason, poId]);
    } else {
      await dbQuery('UPDATE purchase_orders SET status = ? WHERE id = ?', [status, poId]);
    }

    res.json({ message: `PO berhasil di-${status === 'approved' ? 'setujui' : 'tolak'}.`, poId, status });
  } catch (error) {
    console.error('Error updating PO status:', error);
    res.status(500).json({ message: 'Gagal mengubah status PO', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
