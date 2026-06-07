'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { PurchaseOrder, LPJFile, UserProfile, POFormState, NewItemState, UserAccount } from '@/lib/types';
import { initialPOs, initialLPJFiles, initialUsers, departments } from '@/lib/data';
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
}

const AppContext = createContext<AppContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  // User Management State
  const [users, setUsers] = useState<UserAccount[]>(initialUsers);

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
  const [submittedPOs, setSubmittedPOs] = useState<PurchaseOrder[]>(initialPOs);

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
    (e: React.FormEvent) => {
      e.preventDefault();
      if (poForm.items.length === 0) {
        alert('Mohon tambahkan minimal 1 item ke PO!');
        return;
      }
      const isOffBudget = poForm.budgetCategory === 'off_budget';
      const totalPO = calculateTotalPO();
      const year = new Date().getFullYear();
      const nomorPO = `PO-${year}-${String(submittedPOs.length + 1).padStart(3, '0')}`;
      const newPO: PurchaseOrder = {
        id: Date.now(),
        nomorPO,
        namaKegiatan: poForm.nama,
        departemen: poForm.departemen,
        budgetCategory: poForm.budgetCategory,
        isOffBudget,
        keterangan: poForm.keterangan,
        items: [...poForm.items],
        totalNilai: totalPO,
        submittedBy: userProfile.nama,
        submittedAt: new Date().toISOString(),
        status: 'pending',
      };
      setSubmittedPOs((prev) => [newPO, ...prev]);
      alert(
        `PO berhasil dibuat!\n\nNomor PO: ${nomorPO}\nNama Kegiatan: ${poForm.nama}\nDepartemen: ${poForm.departemen}\nDiajukan oleh: ${userProfile.nama}\n\nTotal Nilai PO: ${formatRupiah(totalPO)}\n\nPO Anda telah disimpan dan menunggu persetujuan.`
      );
      setPoForm({ nama: '', departemen: 'Marketing', budgetCategory: '', keterangan: '', items: [] });
    },
    [poForm, submittedPOs.length, userProfile.nama, calculateTotalPO]
  );

  const handleApprovePO = useCallback((poId: number) => {
    if (confirm('Apakah Anda yakin ingin menyetujui PO ini?')) {
      setSubmittedPOs((prev) =>
        prev.map((po) => (po.id === poId ? { ...po, status: 'approved' } : po))
      );
      alert('PO berhasil disetujui!');
    }
  }, []);

  const handleRejectPO = useCallback((poId: number) => {
    const reason = prompt('Masukkan alasan penolakan:');
    if (reason) {
      setSubmittedPOs((prev) =>
        prev.map((po) =>
          po.id === poId ? { ...po, status: 'rejected', rejectionReason: reason } : po
        )
      );
      alert('PO berhasil ditolak!');
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

  const addUser = useCallback((userData: Omit<UserAccount, 'id' | 'joinDate'>) => {
    const isEmailTaken = users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (isEmailTaken) {
      alert('Email sudah digunakan oleh user lain!');
      return;
    }

    const newUser: UserAccount = {
      ...userData,
      id: Date.now(),
      joinDate: new Date().toISOString().split('T')[0],
    };

    setUsers((prev) => [...prev, newUser]);
    alert(`User "${userData.nama}" berhasil ditambahkan!`);
  }, [users]);

  const updateUser = useCallback((userId: number, updatedData: Partial<UserAccount>) => {
    if (updatedData.email) {
      const isEmailTaken = users.some(
        (u) => u.id !== userId && u.email.toLowerCase() === updatedData.email!.toLowerCase()
      );
      if (isEmailTaken) {
        alert('Email sudah digunakan oleh user lain!');
        return;
      }
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updatedData } : u))
    );

    // If updating current logged in user, refresh their session state
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updatedData } : null));
    }

    alert('Data user berhasil diperbarui!');
  }, [users, currentUser]);

  const deleteUser = useCallback((userId: number) => {
    if (currentUser?.id === userId) {
      alert('Anda tidak dapat menghapus akun Anda sendiri yang sedang aktif digunakan!');
      return;
    }

    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      alert('User berhasil dihapus!');
    }
  }, [currentUser]);

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
