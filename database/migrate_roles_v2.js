/**
 * migrate_roles_v2.js
 * Ganti semua role lama di database dengan 7 role baru.
 * Jalankan: node database/migrate_roles_v2.js
 */

const mysql = require('mysql');
require('dotenv').config({ path: './backend/.env' });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'budgeting_db',
  port: parseInt(process.env.DB_PORT || '3306'),
});

function dbQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Mapping role lama → role baru
const ROLE_MIGRATION_MAP = {
  'Super':         'Super Admin',
  'Smallgroup':    'Requester',
  'Ministry':      'Requester',
  'Class':         'Requester',
  'Event':         'Requester',
  'Campaign':      'Requester',
  'User':          'Requester',
  'Prayer Praise': 'Requester',
  'Newsfeed':      'Requester',
  'Nextgen':       'Requester',
  'Devotion':      'Requester',
  'Discover':      'Requester',
  'Administrator': 'Admin',
  'Approver':      'Approval 1',
  'Approver 1':    'Approval 1',
  'Approver 2':    'Approval 2',
  'Approver 3':    'Approval 3',
};

// 7 role baru yang akan ada di tabel roles
const NEW_ROLES = [
  'Super Admin',
  'Admin',
  'Budget Manager',
  'Requester',
  'Approval 1',
  'Approval 2',
  'Approval 3',
];

async function migrate() {
  console.log('=== Migrasi Role Database ===\n');

  try {
    // 1. Update kolom role di tabel users (untuk role lama)
    console.log('1. Update role di tabel users...');
    for (const [oldRole, newRole] of Object.entries(ROLE_MIGRATION_MAP)) {
      const result = await dbQuery(
        'UPDATE users SET role = ? WHERE role = ?',
        [newRole, oldRole]
      );
      if (result.affectedRows > 0) {
        console.log(`   ✓ "${oldRole}" → "${newRole}" (${result.affectedRows} user)`);
      }
    }

    // 2. Hapus semua role lama dari tabel roles
    console.log('\n2. Hapus role lama dari tabel roles...');
    await dbQuery('DELETE FROM roles WHERE nama NOT IN (?)', [NEW_ROLES]);
    console.log('   ✓ Role lama dihapus');

    // 3. Insert/update 7 role baru
    console.log('\n3. Insert 7 role baru ke tabel roles...');
    for (let i = 0; i < NEW_ROLES.length; i++) {
      await dbQuery(
        'INSERT INTO roles (id, nama) VALUES (?, ?) ON DUPLICATE KEY UPDATE nama = VALUES(nama)',
        [i + 1, NEW_ROLES[i]]
      );
      console.log(`   ✓ (${i + 1}) ${NEW_ROLES[i]}`);
    }

    // 4. Hapus user_roles yang merujuk ke role yang sudah tidak ada
    console.log('\n4. Bersihkan user_roles yang tidak valid...');
    await dbQuery(
      'DELETE ur FROM user_roles ur LEFT JOIN roles r ON ur.role_id = r.id WHERE r.id IS NULL'
    );
    console.log('   ✓ user_roles lama dibersihkan');

    // 5. Tampilkan hasil akhir
    const roles = await dbQuery('SELECT * FROM roles ORDER BY id');
    const users = await dbQuery('SELECT nama, role FROM users ORDER BY id');

    console.log('\n=== ROLES SEKARANG ===');
    roles.forEach(r => console.log(`  [${r.id}] ${r.nama}`));

    console.log('\n=== USERS & ROLE SEKARANG ===');
    users.forEach(u => console.log(`  ${u.nama.padEnd(40)} → ${u.role}`));

    console.log('\n✅ Migrasi selesai!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    pool.end();
  }
}

migrate();
