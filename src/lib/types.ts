// Budget Allocation per category
export interface BudgetAllocation {
  name: string;
  amount: number;
  color: string;
}

// Department budget data
export interface Department {
  total: number;
  onBudget: number;
  offBudget: number;
  allocation: BudgetAllocation[];
}

export type DepartmentsMap = Record<string, Department>;

// Transaction record
export interface Transaction {
  id: number;
  name: string;
  amount: number;
  detail: string;
  type: 'on' | 'off';
  date: string;
  category: string;
}

// PO Item
export interface POItem {
  id: number;
  namaBarang: string;
  jumlah: number;
  hargaSatuan: number;
  totalHarga: number;
  rekeningSupplier: string;
}

// Purchase Order
export interface PurchaseOrder {
  id: number;
  nomorPO: string;
  namaKegiatan: string;
  departemen: string;
  budgetCategory: string;
  isOffBudget: boolean;
  keterangan: string;
  items: POItem[];
  totalNilai: number;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

// PO Form state
export interface POFormState {
  nama: string;
  departemen: string;
  budgetCategory: string;
  keterangan: string;
  items: POItem[];
}

// New Item input state
export interface NewItemState {
  namaBarang: string;
  jumlah: string;
  hargaSatuan: string;
  rekeningSupplier: string;
}

// LPJ File
export interface LPJFile {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  uploader: string;
  departemen: string;
}

// User Profile
export interface UserProfile {
  nama: string;
  departemen: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
}

// User Account for Login & User Management
export interface UserAccount {
  id: number;
  nama: string;
  email: string;
  password: string;
  role: string;
  departemen: string;
  phone: string;
  joinDate: string;
}

// Sidebar menu item
export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }>;
}

// Login form state
export interface LoginForm {
  email: string;
  password: string;
}
