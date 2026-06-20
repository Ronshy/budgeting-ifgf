'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { PurchaseOrder, LPJFile, UserProfile, POFormState, NewItemState, UserAccount, Role, UserRoleMapping } from '@/lib/types';
import { initialLPJFiles, initialUsers, departments } from '@/lib/data';
import { formatRupiah } from '@/lib/utils';

// ─── Context Shape ────────────────────────────────────────────────────────────

interface AppContextValue {
  // Auth
  isLoggedIn: boolean;
  loginForm: { email: string; password: string };
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  handleLoginFormChange: (field: 'email' | 'password', value: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleLogout: () => void;
  currentUser: UserAccount | null;

  // Navigation
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;

  // Dashboard
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  showDepartmentModal: boolean;
  setShowDepartmentModal: (v: boolean) => void;

  // PO
  poForm: POFormState;
  handlePOFormChange: (field: keyof POFormState, value: string) => void;
  newItem: NewItemState;
  handleNewItemChange: (field: keyof NewItemState, value: string) => void;
  addItemToPO: () => void;
  deleteItemFromPO: (itemId: number) => void;
  calculateTotalPO: () => number;
  handlePOSubmit: (e: React.FormEvent) => void;
  submittedPOs: PurchaseOrder[];
  handleApprovePO: (poId: number) => void;
  handleRejectPO: (poId: number) => void;

  // LPJ
  lpjFiles: LPJFile[];
  handleLPJUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteLPJ: (fileId: number) => void;
  handleDownloadLPJ: (file: LPJFile) => void;

  // Profile
  userProfile: UserProfile;

  // User Management
  users: UserAccount[];
  addUser: (user: Omit<UserAccount, 'id' | 'joinDate'>) => void;
  updateUser: (userId: number, updatedUser: Partial<UserAccount>) => void;
  deleteUser: (userId: number) => void;

  // Role Setting
  roles: Role[];
  userRoles: UserRoleMapping[];
  addRole: (nama: string) => Promise<boolean>;
  toggleUserRole: (userId: number, roleId: number) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const API_BASE_URL = 'http://localhost:5000/api';

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  // User Management State
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);

  // Role Setting State
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRoleMapping[]>([]);

  // Load users, roles, user_roles, and purchase orders from database
  useEffect(() => {
    // Fetch users
    fetch(`${API_BASE_URL}/users`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => console.error('Error fetching users:', err));

    // Fetch roles
    fetch(`${API_BASE_URL}/roles`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch roles');
        return res.json();
      })
      .then((data) => setRoles(data))
      .catch((err) => console.error('Error fetching roles:', err));

    // Fetch user-roles mappings
    fetch(`${API_BASE_URL}/user-roles`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch user roles');
        return res.json();
      })
      .then((data) => setUserRoles(data))
      .catch((err) => console.error('Error fetching user roles:', err));

    // Fetch purchase orders
    fetch(`${API_BASE_URL}/purchase-orders`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch purchase orders');
        return res.json();
      })
      .then((data) => setSubmittedPOs(data))
      .catch((err) => console.error('Error fetching purchase orders:', err));
  }, []);

  // Auth
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  // Navigation
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dashboard
  const [selectedDepartment, setSelectedDepartment] = useState('Marketing');
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);

  // PO
  const [poForm, setPoForm] = useState<POFormState>({
    nama: '',
    departemen: 'Marketing',
    budgetCategory: '',
    keterangan: '',
    items: [],
  });
  const [newItem, setNewItem] = useState<NewItemState>({
    namaBarang: '',
    jumlah: '',
    hargaSatuan: '',
    rekeningSupplier: '',
  });
  const [submittedPOs, setSubmittedPOs] = useState<PurchaseOrder[]>([]);

  // LPJ
  const [lpjFiles, setLpjFiles] = useState<LPJFile[]>(initialLPJFiles);

  // Real-time Dynamic Profile based on currentUser
  const userProfile: UserProfile = {
    nama: currentUser?.nama ?? 'Guest',
    departemen: currentUser?.departemen ?? 'Marketing',
    email: currentUser?.email ?? '',
    phone: currentUser?.phone ?? '',
    role: currentUser?.role ?? 'Viewer',
    joinDate: currentUser?.joinDate ?? new Date().toISOString().split('T')[0],
  };

  // ── Auth Handlers ──────────────────────────────────────────────────────────

  const handleLoginFormChange = useCallback(
    (field: 'email' | 'password', value: string) => {
      setLoginForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const matchedUser = users.find(
        (u) => u.email === loginForm.email && u.password === loginForm.password
      );

      if (matchedUser) {
        setCurrentUser(matchedUser);
        setIsLoggedIn(true);
        setSelectedDepartment(matchedUser.departemen);
        setLoginForm({ email: '', password: '' });
      } else {
        alert(
          'Email atau password salah!\n\nSilakan cek kembali email & password Anda, atau hubungi administrator.'
        );
      }
    },
    [loginForm, users]
  );

  const handleLogout = useCallback(() => {
    if (confirm('Apakah Anda yakin ingin keluar dari aplikasi?')) {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setLoginForm({ email: '', password: '' });
      setActiveMenu('dashboard');
    }
  }, []);

  // ── PO Handlers ───────────────────────────────────────────────────────────

  const handlePOFormChange = useCallback(
    (field: keyof POFormState, value: string) => {
      setPoForm((prev) => ({
        ...prev,
        [field]: value,
        ...(field === 'departemen' && { budgetCategory: '' }),
      }));
    },
    []
  );

  const handleNewItemChange = useCallback(
    (field: keyof NewItemState, value: string) => {
      setNewItem((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const addItemToPO = useCallback(() => {
    if (
      !newItem.namaBarang ||
      !newItem.jumlah ||
      !newItem.hargaSatuan ||
      !newItem.rekeningSupplier
    ) {
      alert('Mohon lengkapi semua field item!');
      return;
    }
    const jumlah = parseInt(newItem.jumlah);
    const hargaSatuan = parseInt(newItem.hargaSatuan);
    const totalHarga = jumlah * hargaSatuan;
    setPoForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: Date.now(),
          namaBarang: newItem.namaBarang,
          jumlah,
          hargaSatuan,
          totalHarga,
          rekeningSupplier: newItem.rekeningSupplier,
        },
      ],
    }));
    setNewItem({ namaBarang: '', jumlah: '', hargaSatuan: '', rekeningSupplier: '' });
  }, [newItem]);

  const deleteItemFromPO = useCallback((itemId: number) => {
    setPoForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  }, []);

  const calculateTotalPO = useCallback(() => {
    return poForm.items.reduce((sum, item) => sum + item.totalHarga, 0);
  }, [poForm.items]);

  const handlePOSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (poForm.items.length === 0) {
        alert('Mohon tambahkan minimal 1 item ke PO!');
        return;
      }
      const isOffBudget = poForm.budgetCategory === 'off_budget';

      try {
        const response = await fetch(`${API_BASE_URL}/purchase-orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            namaKegiatan: poForm.nama,
            departemen: poForm.departemen,
            budgetCategory: poForm.budgetCategory,
            isOffBudget,
            keterangan: poForm.keterangan,
            items: poForm.items,
            submittedBy: userProfile.nama,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          alert(result.message || 'Gagal membuat Purchase Order');
          return;
        }

        setSubmittedPOs((prev) => [result, ...prev]);

        const emailInfo = result.emailNotification;
        let emailMsg = '';
        if (emailInfo && emailInfo.approversFound > 0) {
          emailMsg = `\n\nNotifikasi email terkirim ke ${emailInfo.sent} approver.`;
          if (emailInfo.failed > 0) emailMsg += ` (${emailInfo.failed} gagal)`;
        } else {
          emailMsg = '\n\nTidak ada approver di departemen ini.';
        }

        alert(
          `PO berhasil dibuat!\n\nNomor PO: ${result.nomorPO}\nNama Kegiatan: ${poForm.nama}\nDepartemen: ${poForm.departemen}\nDiajukan oleh: ${userProfile.nama}\n\nTotal Nilai PO: ${formatRupiah(result.totalNilai)}\n\nPO Anda telah disimpan dan menunggu persetujuan.${emailMsg}`
        );
        setPoForm({ nama: '', departemen: 'Marketing', budgetCategory: '', keterangan: '', items: [] });
      } catch (err) {
        console.error('Error submitting PO:', err);
        alert('Terjadi kesalahan koneksi ke backend database.');
      }
    },
    [poForm, userProfile.nama]
  );

  const handleApprovePO = useCallback(async (poId: number) => {
    if (confirm('Apakah Anda yakin ingin menyetujui PO ini?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/purchase-orders/${poId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' }),
        });
        if (!response.ok) {
          const result = await response.json();
          alert(result.message || 'Gagal menyetujui PO');
          return;
        }
        setSubmittedPOs((prev) =>
          prev.map((po) => (po.id === poId ? { ...po, status: 'approved' } : po))
        );
        alert('PO berhasil disetujui!');
      } catch (err) {
        console.error('Error approving PO:', err);
        alert('Terjadi kesalahan koneksi ke backend database.');
      }
    }
  }, []);

  const handleRejectPO = useCallback(async (poId: number) => {
    const reason = prompt('Masukkan alasan penolakan:');
    if (reason) {
      try {
        const response = await fetch(`${API_BASE_URL}/purchase-orders/${poId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'rejected', rejectionReason: reason }),
        });
        if (!response.ok) {
          const result = await response.json();
          alert(result.message || 'Gagal menolak PO');
          return;
        }
        setSubmittedPOs((prev) =>
          prev.map((po) =>
            po.id === poId ? { ...po, status: 'rejected', rejectionReason: reason } : po
          )
        );
        alert('PO berhasil ditolak!');
      } catch (err) {
        console.error('Error rejecting PO:', err);
        alert('Terjadi kesalahan koneksi ke backend database.');
      }
    }
  }, []);

  // ── LPJ Handlers ──────────────────────────────────────────────────────────

  const handleLPJUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      if (!['pdf', 'doc', 'docx'].includes(ext)) {
        alert('Hanya file PDF atau Word (.doc, .docx) yang diperbolehkan!');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran file maksimal 10 MB!');
        return;
      }
      const newFile: LPJFile = {
        id: Date.now(),
        name: file.name,
        type: ext,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        uploadDate: new Date().toISOString().split('T')[0],
        uploader: userProfile.nama,
        departemen: selectedDepartment,
      };
      setLpjFiles((prev) => [newFile, ...prev]);
      alert(`File "${file.name}" berhasil diupload!`);
      e.target.value = '';
    },
    [selectedDepartment, userProfile.nama]
  );

  const handleDeleteLPJ = useCallback((fileId: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus file ini?')) {
      setLpjFiles((prev) => prev.filter((f) => f.id !== fileId));
      alert('File berhasil dihapus!');
    }
  }, []);

  const handleDownloadLPJ = useCallback((file: LPJFile) => {
    alert(
      `Mengunduh file: ${file.name}\n\nDalam implementasi sebenarnya, file akan didownload dari server.`
    );
  }, []);

  // ── User Management Handlers ──────────────────────────────────────────────

  const addUser = useCallback(async (userData: Omit<UserAccount, 'id' | 'joinDate'>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.message || 'Gagal menambahkan user baru');
        return;
      }

      setUsers((prev) => [...prev, result]);
      alert(`User "${result.nama}" berhasil ditambahkan!`);
    } catch (err) {
      console.error('Error adding user:', err);
      alert('Terjadi kesalahan koneksi ke backend database.');
    }
  }, []);

  const updateUser = useCallback(async (userId: number, updatedData: Partial<UserAccount>) => {
    try {
      const existingUser = users.find((u) => u.id === userId);
      if (!existingUser) {
        alert('User tidak ditemukan!');
        return;
      }

      const fullUpdatedUser = { ...existingUser, ...updatedData };

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullUpdatedUser),
      });

      const result = await response.json();
      if (!response.ok) {
        alert(result.message || 'Gagal memperbarui data user');
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? result : u))
      );

      // If updating current logged in user, refresh their session state
      if (currentUser?.id === userId) {
        setCurrentUser(result);
      }

      alert('Data user berhasil diperbarui!');
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Terjadi kesalahan koneksi ke backend database.');
    }
  }, [users, currentUser]);

  const deleteUser = useCallback(async (userId: number) => {
    if (currentUser?.id === userId) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan!');
      return;
    }

    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
          method: 'DELETE',
        });

        const result = await response.json();
        if (!response.ok) {
          alert(result.message || 'Gagal menghapus user');
          return;
        }

        setUsers((prev) => prev.filter((u) => u.id !== userId));
        alert('User berhasil dihapus!');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Terjadi kesalahan koneksi ke backend database.');
      }
    }
  }, [currentUser]);

  // ── Role Management Handlers ──────────────────────────────────────────────

  const addRole = useCallback(async (nama: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama }),
      });
      const result = await response.json();
      if (!response.ok) {
        alert(result.message || 'Gagal menambahkan role baru');
        return false;
      }
      setRoles((prev) => [...prev, result]);
      alert(`Role "${result.nama}" berhasil ditambahkan!`);
      return true;
    } catch (err) {
      console.error('Error adding role:', err);
      alert('Terjadi kesalahan koneksi ke backend database.');
      return false;
    }
  }, []);

  const toggleUserRole = useCallback(async (userId: number, roleId: number) => {
    const isAssigned = userRoles.some(
      (mapping) => mapping.user_id === userId && mapping.role_id === roleId
    );

    try {
      if (isAssigned) {
        // Delete assignment
        const response = await fetch(`${API_BASE_URL}/user-roles`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, roleId }),
        });
        if (!response.ok) {
          const result = await response.json();
          alert(result.message || 'Gagal menghapus role');
          return;
        }
        setUserRoles((prev) =>
          prev.filter((mapping) => !(mapping.user_id === userId && mapping.role_id === roleId))
        );
      } else {
        // Create assignment
        const response = await fetch(`${API_BASE_URL}/user-roles`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, roleId }),
        });
        if (!response.ok) {
          const result = await response.json();
          alert(result.message || 'Gagal menambahkan role');
          return;
        }
        setUserRoles((prev) => [...prev, { user_id: userId, role_id: roleId }]);
      }
    } catch (err) {
      console.error('Error toggling user role:', err);
      alert('Terjadi kesalahan koneksi ke backend database.');
    }
  }, [userRoles]);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        loginForm,
        showPassword,
        setShowPassword,
        handleLoginFormChange,
        handleLogin,
        handleLogout,
        currentUser,
        activeMenu,
        setActiveMenu,
        isSidebarOpen,
        setIsSidebarOpen,
        selectedDepartment,
        setSelectedDepartment,
        showDepartmentModal,
        setShowDepartmentModal,
        poForm,
        handlePOFormChange,
        newItem,
        handleNewItemChange,
        addItemToPO,
        deleteItemFromPO,
        calculateTotalPO,
        handlePOSubmit,
        submittedPOs,
        handleApprovePO,
        handleRejectPO,
        lpjFiles,
        handleLPJUpload,
        handleDeleteLPJ,
        handleDownloadLPJ,
        userProfile,
        users,
        addUser,
        updateUser,
        deleteUser,
        roles,
        userRoles,
        addRole,
        toggleUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
