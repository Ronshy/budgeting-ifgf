const mysql = require('mysql');
require('dotenv').config({ path: require('fs').existsSync('./backend/.env') ? './backend/.env' : './.env' });

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'budgeting_db',
  port: parseInt(process.env.DB_PORT || '3306')
});

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

async function run() {
  try {
    connection.connect();
    console.log('Connected to database for migration...');

    // 1. Create tables
    console.log('Creating roles and user_roles tables...');
    await query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(50) NOT NULL UNIQUE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Seed Roles
    console.log('Seeding initial roles...');
    const rolesList = [
      'Super', 'Smallgroup', 'Ministry', 'Class', 'Event', 'Campaign',
      'User', 'Prayer Praise', 'Newsfeed', 'Nextgen', 'Devotion', 'Discover'
    ];
    for (const r of rolesList) {
      await query('INSERT INTO roles (nama) VALUES (?) ON DUPLICATE KEY UPDATE nama=VALUES(nama)', [r]);
    }

    // 3. Seed Users
    console.log('Seeding initial screenshot users...');
    const usersList = [
      ['Adevita Nataliani Santoso', 'adevitanataliani@gmail.com', 'pass123', 'Requester', 1, '+62 812-1111-2222', '2026-06-16'],
      ['Adi Nugroho Tjandrasaputra', 'arcguardian90@gmail.com', 'pass123', 'Requester', 1, '+62 812-2222-3333', '2026-06-16'],
      ['Aditya Hindarta', 'adityahindarta@gmail.com', 'pass123', 'Requester', 1, '+62 812-3333-4444', '2026-06-16'],
      ['Andre Saptomo', 'andre.saptomo@ifgfsemarang.org', 'pass123', 'Administrator', 2, '+62 812-4444-5555', '2026-06-16'],
      ['Andrew William', 'andrewwil94@gmail.com', 'pass123', 'Requester', 1, '+62 812-5555-6666', '2026-06-16'],
      ['Aurelia Ivana Melody Ronsumbre', 'aureliaivanaa07@gmail.com', 'pass123', 'Requester', 1, '+62 812-6666-7777', '2026-06-16'],
      ['Clarissa Delina Proboyuwono', 'delinaclarissa@gmail.com', 'pass123', 'Approver', 4, '+62 812-7777-8888', '2026-06-16'],
      ['Gabriella Christie Kartadibrata', 'cyrgaby20@gmail.com', 'pass123', 'Budget Manager', 1, '+62 812-8888-9999', '2026-06-16'],
      ['Hanny Agustina', 'hanny.iun@ifgfsemarang.org', 'pass123', 'Requester', 1, '+62 812-9999-0000', '2026-06-16']
    ];

    for (const u of usersList) {
      await query(`
        INSERT INTO users (nama, email, password, role, departemen_id, phone, join_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE nama=VALUES(nama)
      `, u);
    }

    // Get all user IDs and role IDs
    const dbUsers = await query('SELECT id, email FROM users');
    const dbRoles = await query('SELECT id, nama FROM roles');

    const userMap = {};
    dbUsers.forEach(u => userMap[u.email] = u.id);

    const roleMap = {};
    dbRoles.forEach(r => roleMap[r.nama] = r.id);

    // 4. Map user roles matching screenshot
    console.log('Mapping user_roles according to screenshot...');
    const mapping = [
      // Adevita Nataliani Santoso
      ['adevitanataliani@gmail.com', ['Event']],
      // Adi Nugroho Tjandrasaputra
      ['arcguardian90@gmail.com', ['Ministry']],
      // Aditya Hindarta
      ['adityahindarta@gmail.com', ['Ministry']],
      // Andre Saptomo
      ['andre.saptomo@ifgfsemarang.org', ['Super']],
      // Andrew William
      ['andrewwil94@gmail.com', ['Ministry']],
      // Aurelia Ivana Melody Ronsumbre
      ['aureliaivanaa07@gmail.com', ['Event', 'User']],
      // Clarissa Delina Proboyuwono
      ['delinaclarissa@gmail.com', ['Smallgroup', 'Class', 'Event', 'User']],
      // Gabriella Christie Kartadibrata
      ['cyrgaby20@gmail.com', ['Super', 'Smallgroup', 'Ministry', 'Campaign', 'User', 'Prayer Praise', 'Newsfeed', 'Devotion', 'Discover']],
      // Hanny Agustina
      ['hanny.iun@ifgfsemarang.org', ['Smallgroup', 'Ministry', 'Class', 'Event', 'Campaign', 'User']]
    ];

    // Clear existing mappings for these users to prevent primary key errors on rerun
    for (const [email] of mapping) {
      const userId = userMap[email];
      if (userId) {
        await query('DELETE FROM user_roles WHERE user_id = ?', [userId]);
      }
    }

    for (const [email, roles] of mapping) {
      const userId = userMap[email];
      if (!userId) continue;

      for (const rName of roles) {
        const roleId = roleMap[rName];
        if (!roleId) continue;

        await query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE user_id=user_id', [userId, roleId]);
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    connection.end();
  }
}

run();
