import type { DepartmentsMap, Transaction, LPJFile, PurchaseOrder } from './types';

// ─── Department Budget Data ───────────────────────────────────────────────────

export const departments: DepartmentsMap = {
  Marketing: {
    total: 500000000,
    onBudget: 320000000,
    offBudget: 180000000,
    allocation: [
      { name: 'Digital Advertising', amount: 150000000, color: '#8b5cf6' },
      { name: 'Event & Sponsorship', amount: 120000000, color: '#6366f1' },
      { name: 'Content Production', amount: 90000000, color: '#a78bfa' },
      { name: 'Brand Development', amount: 80000000, color: '#c4b5fd' },
      { name: 'Market Research', amount: 60000000, color: '#ddd6fe' },
    ],
  },
  IT: {
    total: 750000000,
    onBudget: 680000000,
    offBudget: 70000000,
    allocation: [
      { name: 'Software License', amount: 250000000, color: '#3b82f6' },
      { name: 'Hardware & Equipment', amount: 200000000, color: '#60a5fa' },
      { name: 'Cloud Services', amount: 150000000, color: '#93c5fd' },
      { name: 'IT Maintenance', amount: 100000000, color: '#bfdbfe' },
      { name: 'Cybersecurity', amount: 50000000, color: '#dbeafe' },
    ],
  },
  HR: {
    total: 300000000,
    onBudget: 245000000,
    offBudget: 55000000,
    allocation: [
      { name: 'Makan Siang Karyawan', amount: 90000000, color: '#10b981' },
      { name: 'Pelatihan & Training', amount: 70000000, color: '#34d399' },
      { name: 'Pembelian ATK', amount: 50000000, color: '#6ee7b7' },
      { name: 'Employee Benefits', amount: 45000000, color: '#a7f3d0' },
      { name: 'Recruitment', amount: 25000000, color: '#d1fae5' },
      { name: 'Team Building', amount: 20000000, color: '#d1fae5' },
    ],
  },
  Finance: {
    total: 400000000,
    onBudget: 380000000,
    offBudget: 20000000,
    allocation: [
      { name: 'Audit & Compliance', amount: 150000000, color: '#f59e0b' },
      { name: 'Accounting Software', amount: 100000000, color: '#fbbf24' },
      { name: 'Tax Consultation', amount: 80000000, color: '#fcd34d' },
      { name: 'Financial Reporting', amount: 50000000, color: '#fde68a' },
      { name: 'Banking Fees', amount: 20000000, color: '#fef3c7' },
    ],
  },
  Operations: {
    total: 850000000,
    onBudget: 720000000,
    offBudget: 130000000,
    allocation: [
      { name: 'Logistik & Pengiriman', amount: 300000000, color: '#ec4899' },
      { name: 'Inventori & Gudang', amount: 200000000, color: '#f472b6' },
      { name: 'Utilitas & Fasilitas', amount: 150000000, color: '#f9a8d4' },
      { name: 'Maintenance & Perbaikan', amount: 120000000, color: '#fbcfe8' },
      { name: 'Keamanan', amount: 80000000, color: '#fce7f3' },
    ],
  },
};

// ─── Transaction Data ─────────────────────────────────────────────────────────

export const transactions: Transaction[] = [
  {
    id: 1,
    name: 'Kampanye Digital Q1',
    amount: 125000000,
    detail: 'Iklan Facebook, Instagram, dan Google Ads untuk produk baru',
    type: 'on',
    date: '2026-02-08',
    category: 'Marketing',
  },
  {
    id: 2,
    name: 'Event Launching Produk',
    amount: 85000000,
    detail: 'Sewa venue, catering, dekorasi, dan entertainment',
    type: 'off',
    date: '2026-02-07',
    category: 'Marketing',
  },
  {
    id: 3,
    name: 'Branding Material',
    amount: 45000000,
    detail: 'Cetak banner, brosur, merchandise, dan packaging',
    type: 'on',
    date: '2026-02-06',
    category: 'Marketing',
  },
  {
    id: 4,
    name: 'Konsultan Branding',
    amount: 95000000,
    detail: 'Jasa konsultasi rebranding dan strategi positioning',
    type: 'on',
    date: '2026-02-05',
    category: 'Marketing',
  },
  {
    id: 5,
    name: 'Sponsorship Event',
    amount: 55000000,
    detail: 'Sponsorship tech conference dan business expo',
    type: 'off',
    date: '2026-02-03',
    category: 'Marketing',
  },
  {
    id: 6,
    name: 'Video Production',
    amount: 70000000,
    detail: 'Produksi video company profile dan video marketing',
    type: 'on',
    date: '2026-02-01',
    category: 'Marketing',
  },
];

// ─── Initial LPJ Files ────────────────────────────────────────────────────────

export const initialLPJFiles: LPJFile[] = [
  {
    id: 1,
    name: 'LPJ_Marketing_Kampanye_Q1_2026.pdf',
    type: 'pdf',
    size: '2.4 MB',
    uploadDate: '2026-02-15',
    uploader: 'Admin Marketing',
    departemen: 'Marketing',
  },
  {
    id: 2,
    name: 'LPJ_Event_Launching_Produk.docx',
    type: 'docx',
    size: '1.8 MB',
    uploadDate: '2026-02-10',
    uploader: 'Admin Marketing',
    departemen: 'Marketing',
  },
  {
    id: 3,
    name: 'LPJ_IT_Infrastructure_Jan2026.pdf',
    type: 'pdf',
    size: '3.1 MB',
    uploadDate: '2026-02-05',
    uploader: 'Admin IT',
    departemen: 'IT',
  },
];

// ─── Initial Purchase Orders ──────────────────────────────────────────────────

export const initialPOs: PurchaseOrder[] = [
  {
    id: 1,
    nomorPO: 'PO-2026-001',
    namaKegiatan: 'Kampanye Digital Q1',
    departemen: 'Marketing',
    budgetCategory: 'Digital Advertising',
    isOffBudget: false,
    keterangan: 'Kampanye iklan digital untuk peluncuran produk baru di platform sosial media',
    items: [
      {
        id: 1,
        namaBarang: 'Google Ads Campaign',
        jumlah: 1,
        hargaSatuan: 50000000,
        totalHarga: 50000000,
        rekeningSupplier: 'BCA 1234567890',
      },
      {
        id: 2,
        namaBarang: 'Facebook & Instagram Ads',
        jumlah: 1,
        hargaSatuan: 35000000,
        totalHarga: 35000000,
        rekeningSupplier: 'BCA 1234567890',
      },
    ],
    totalNilai: 85000000,
    submittedBy: 'Admin Budgeting',
    submittedAt: '2026-02-18T10:30:00',
    status: 'pending',
  },
];

// ─── Demo Credentials ─────────────────────────────────────────────────────────

export const demoCredentials = {
  email: 'admin@company.com',
  password: 'admin123',
};

// ─── Initial Users ────────────────────────────────────────────────────────────
import type { UserAccount } from './types';

export const initialUsers: UserAccount[] = [
  {
    id: 1,
    nama: 'Admin Budgeting',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'Budget Manager',
    departemen: 'Marketing',
    phone: '+62 812-3456-7890',
    joinDate: '2024-01-15',
  },
  {
    id: 2,
    nama: 'Michael IT Specialist',
    email: 'michael@company.com',
    password: 'password123',
    role: 'Admin',
    departemen: 'IT',
    phone: '+62 899-8888-7777',
    joinDate: '2025-03-10',
  },
  {
    id: 3,
    nama: 'Clara Finance',
    email: 'clara@company.com',
    password: 'clara456',
    role: 'Approval 1',
    departemen: 'Finance',
    phone: '+62 855-4433-2211',
    joinDate: '2024-11-20',
  },
];
