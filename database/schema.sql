-- ─────────────────────────────────────────────────────────────────────────────
-- DATABASE SCHEMA: budgeting_db
-- DBMS: MySQL / MariaDB
-- ─────────────────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS budgeting_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE budgeting_db;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. TABLE: departments
-- Menyimpan daftar departemen beserta pagu anggarannya.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(50) NOT NULL UNIQUE,
    total_budget DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    on_budget DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    off_budget DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. TABLE: users
-- Menyimpan informasi akun pengguna untuk autentikasi dan manajemen user.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Disarankan menggunakan hashing bcrypt/argon2 pada tingkat aplikasi
    role VARCHAR(50) NOT NULL,     -- Administrator, Budget Manager, Requester, Approver
    departemen_id INT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    join_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (departemen_id) REFERENCES departments(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. TABLE: budget_allocations
-- Rincian alokasi anggaran (On Budget) per kategori di setiap departemen.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS budget_allocations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    color VARCHAR(10) NOT NULL, -- HEX code untuk grafik UI
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. TABLE: purchase_orders
-- Dokumen pengajuan Purchase Order (PO).
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS purchase_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomor_po VARCHAR(50) NOT NULL UNIQUE,
    nama_kegiatan VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    budget_allocation_id INT NULL, -- Bernilai NULL jika 'Off Budget'
    is_off_budget BOOLEAN NOT NULL DEFAULT FALSE,
    keterangan TEXT NOT NULL,
    total_nilai DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    submitted_by INT NOT NULL,
    submitted_at DATETIME NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    rejection_reason TEXT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON UPDATE CASCADE,
    FOREIGN KEY (budget_allocation_id) REFERENCES budget_allocations(id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (submitted_by) REFERENCES users(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. TABLE: po_items
-- Detail barang/jasa yang diajukan di dalam satu Purchase Order.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS po_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT NOT NULL,
    nama_barang VARCHAR(255) NOT NULL,
    jumlah INT NOT NULL,
    harga_satuan DECIMAL(15, 2) NOT NULL,
    total_harga DECIMAL(15, 2) NOT NULL,
    rekening_supplier VARCHAR(255) NOT NULL,
    FOREIGN KEY (po_id) REFERENCES purchase_orders(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. TABLE: lpj_files
-- Pengarsipan dokumen Laporan Pertanggungjawaban (LPJ).
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lpj_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(10) NOT NULL, -- pdf, doc, docx
    file_size VARCHAR(50) NOT NULL,  -- misal: "2.4 MB"
    upload_date DATE NOT NULL,
    uploader_id INT NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (uploader_id) REFERENCES users(id) ON UPDATE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. TABLE: transactions
-- Histori transaksi realisasi pengeluaran budget.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    detail TEXT NOT NULL,
    type ENUM('on', 'off') NOT NULL,
    date DATE NOT NULL,
    department_id INT NOT NULL,
    category_name VARCHAR(100) NOT NULL, -- Nama kategori alokasi budget
    FOREIGN KEY (department_id) REFERENCES departments(id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────────────────────
-- SEED DATA (DATA AWAL)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Seed Departments
INSERT INTO departments (id, nama, total_budget, on_budget, off_budget) VALUES
(1, 'Marketing', 500000000.00, 320000000.00, 180000000.00),
(2, 'IT', 750000000.00, 680000000.00, 70000000.00),
(3, 'HR', 300000000.00, 245000000.00, 55000000.00),
(4, 'Finance', 400000000.00, 380000000.00, 20000000.00),
(5, 'Operations', 850000000.00, 720000000.00, 130000000.00);

-- 2. Seed Users
INSERT INTO users (id, nama, email, password, role, departemen_id, phone, join_date) VALUES
(1, 'Admin Budgeting', 'admin@company.com', 'admin123', 'Budget Manager', 1, '+62 812-3456-7890', '2024-01-15'),
(2, 'Michael IT Specialist', 'michael@company.com', 'password123', 'Administrator', 2, '+62 899-8888-7777', '2025-03-10'),
(3, 'Clara Finance', 'clara@company.com', 'clara456', 'Approver', 4, '+62 855-4433-2211', '2024-11-20');

-- 3. Seed Budget Allocations
INSERT INTO budget_allocations (department_id, name, amount, color) VALUES
-- Marketing
(1, 'Digital Advertising', 150000000.00, '#8b5cf6'),
(1, 'Event & Sponsorship', 120000000.00, '#6366f1'),
(1, 'Content Production', 90000000.00, '#a78bfa'),
(1, 'Brand Development', 80000000.00, '#c4b5fd'),
(1, 'Market Research', 60000000.00, '#ddd6fe'),
-- IT
(2, 'Software License', 250000000.00, '#3b82f6'),
(2, 'Hardware & Equipment', 200000000.00, '#60a5fa'),
(2, 'Cloud Services', 150000000.00, '#93c5fd'),
(2, 'IT Maintenance', 100000000.00, '#bfdbfe'),
(2, 'Cybersecurity', 50000000.00, '#dbeafe'),
-- HR
(3, 'Makan Siang Karyawan', 90000000.00, '#10b981'),
(3, 'Pelatihan & Training', 70000000.00, '#34d399'),
(3, 'Pembelian ATK', 50000000.00, '#6ee7b7'),
(3, 'Employee Benefits', 45000000.00, '#a7f3d0'),
(3, 'Recruitment', 25000000.00, '#d1fae5'),
(3, 'Team Building', 20000000.00, '#d1fae5'),
-- Finance
(4, 'Audit & Compliance', 150000000.00, '#f59e0b'),
(4, 'Accounting Software', 100000000.00, '#fbbf24'),
(4, 'Tax Consultation', 80000000.00, '#fcd34d'),
(4, 'Financial Reporting', 50000000.00, '#fde68a'),
(4, 'Banking Fees', 20000000.00, '#fef3c7'),
-- Operations
(5, 'Logistik & Pengiriman', 300000000.00, '#ec4899'),
(5, 'Inventori & Gudang', 200000000.00, '#f472b6'),
(5, 'Utilitas & Fasilitas', 150000000.00, '#f9a8d4'),
(5, 'Maintenance & Perbaikan', 120000000.00, '#fbcfe8'),
(5, 'Keamanan', 80000000.00, '#fce7f3');

-- 4. Seed Transactions
INSERT INTO transactions (name, amount, detail, type, date, department_id, category_name) VALUES
('Kampanye Digital Q1', 125000000.00, 'Iklan Facebook, Instagram, dan Google Ads untuk produk baru', 'on', '2026-02-08', 1, 'Digital Advertising'),
('Event Launching Produk', 85000000.00, 'Sewa venue, catering, dekorasi, dan entertainment', 'off', '2026-02-07', 1, 'Event & Sponsorship'),
('Branding Material', 45000000.00, 'Cetak banner, brosur, merchandise, dan packaging', 'on', '2026-02-06', 1, 'Brand Development'),
('Konsultan Branding', 95000000.00, 'Jasa konsultasi rebranding dan strategi positioning', 'on', '2026-02-05', 1, 'Brand Development'),
('Sponsorship Event', 55000000.00, 'Sponsorship tech conference dan business expo', 'off', '2026-02-03', 1, 'Event & Sponsorship'),
('Video Production', 70000000.00, 'Produksi video company profile dan video marketing', 'on', '2026-02-01', 1, 'Content Production');

-- 5. Seed LPJ Files
INSERT INTO lpj_files (id, file_name, file_type, file_size, upload_date, uploader_id, department_id) VALUES
(1, 'LPJ_Marketing_Kampanye_Q1_2026.pdf', 'pdf', '2.4 MB', '2026-02-15', 1, 1),
(2, 'LPJ_Event_Launching_Produk.docx', 'docx', '1.8 MB', '2026-02-10', 1, 1),
(3, 'LPJ_IT_Infrastructure_Jan2026.pdf', 'pdf', '3.1 MB', '2026-02-05', 2, 2);

-- 6. Seed Purchase Orders
INSERT INTO purchase_orders (id, nomor_po, nama_kegiatan, department_id, budget_allocation_id, is_off_budget, keterangan, total_nilai, submitted_by, submitted_at, status) VALUES
(1, 'PO-2026-001', 'Kampanye Digital Q1', 1, 1, FALSE, 'Kampanye iklan digital untuk peluncuran produk baru di platform sosial media', 85000000.00, 1, '2026-02-18 10:30:00', 'pending');

-- 7. Seed PO Items
INSERT INTO po_items (po_id, nama_barang, jumlah, harga_satuan, total_harga, rekening_supplier) VALUES
(1, 'Google Ads Campaign', 1, 50000000.00, 50000000.00, 'BCA 1234567890'),
(1, 'Facebook & Instagram Ads', 1, 35000000.00, 35000000.00, 'BCA 1234567890');
