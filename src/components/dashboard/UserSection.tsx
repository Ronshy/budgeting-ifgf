'use client';

import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, X, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserAccount } from '@/lib/types';
import { departments } from '@/lib/data';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  fontSize: '14px',
  background: '#ffffff',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  color: '#0f172a',
  outline: 'none',
  transition: 'all 0.2s ease',
  boxSizing: 'border-box',
};

const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.border = '1px solid #2563eb';
  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
};

const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
  e.target.style.border = '1px solid #cbd5e1';
  e.target.style.boxShadow = 'none';
};

export function UserSection() {
  const { users, addUser, updateUser, deleteUser, currentUser } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<number, boolean>>({});

  // Form states
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Requester');
  const [departemen, setDepartemen] = useState('Marketing');
  const [phone, setPhone] = useState('');

  const openAddModal = () => {
    setEditingUser(null);
    setNama('');
    setEmail('');
    setPassword('');
    setRole('Requester');
    setDepartemen('Marketing');
    setPhone('');
    setShowModal(true);
  };

  const openEditModal = (user: UserAccount) => {
    setEditingUser(user);
    setNama(user.nama);
    setEmail(user.email);
    setPassword(user.password);
    setRole(user.role);
    setDepartemen(user.departemen);
    setPhone(user.phone);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama || !email || !password || !departemen || !phone) {
      alert('Mohon isi semua field!');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, {
        nama,
        email,
        password,
        role: editingUser.role, // role tidak berubah dari sini
        departemen,
        phone,
      });
    } else {
      addUser({
        nama,
        email,
        password,
        role: 'Requester', // role default saat tambah user baru
        departemen,
        phone,
      });
    }

    setShowModal(false);
  };

  const togglePasswordVisibility = (userId: number) => {
    setShowPasswordMap((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <div style={{ animation: 'slideUp 0.4s ease-out' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            User Management
          </h1>
          <p style={{ fontSize: '15px', color: '#64748b' }}>
            Kelola data akun pengguna, role akses, dan departemen sistem
          </p>
        </div>
        <button
          onClick={openAddModal}
          style={{
            background: '#2563eb',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1d4ed8'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563eb'; }}
        >
          <Plus size={16} /> Tambah User
        </button>
      </div>

      {/* Users Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="#2563eb" /> Daftar User Terdaftar
          </h3>
          <span style={{ fontSize: '12px', padding: '3px 8px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#475569', fontWeight: '600' }}>
            {users.length} Akun
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Nama / Info', 'Email', 'Password', 'Role', 'Departemen', 'Telepon', 'Tgl Join', 'Aksi'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '12px 24px',
                      textAlign: h === 'Aksi' ? 'center' : 'left',
                      color: '#475569',
                      fontWeight: '600',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => {
                const isSelf = currentUser?.id === u.id;
                const isPasswordShown = !!showPasswordMap[u.id];

                return (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: idx < users.length - 1 ? '1px solid #f1f5f9' : 'none',
                      background: isSelf ? '#f0f5ff' : '#ffffff',
                    }}
                  >
                    {/* Nama / Info */}
                    <td style={{ padding: '16px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isSelf ? '#2563eb' : '#e2e8f0',
                          color: isSelf ? '#ffffff' : '#334155',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}>
                          {u.nama.charAt(0)}
                        </div>
                        <div>
                          <span style={{ fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {u.nama}
                            {isSelf && (
                              <span style={{ fontSize: '10px', background: '#dbeafe', color: '#2563eb', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>
                                Anda
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ padding: '16px 24px', color: '#334155' }}>
                      <code>{u.email}</code>
                    </td>

                    {/* Password */}
                    <td style={{ padding: '16px 24px', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <code>{isPasswordShown ? u.password : '••••••••'}</code>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(u.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#94a3b8',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.2s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#2563eb'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                        >
                          {isPasswordShown ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </td>

                    {/* Role */}
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color:
                          u.role === 'Super Admin' ? '#4c1d95' :
                          u.role === 'Admin' ? '#1e3a8a' :
                          u.role === 'Budget Manager' ? '#14532d' :
                          u.role === 'Requester' ? '#92400e' :
                          u.role === 'Approval 1' || u.role === 'Approval 2' || u.role === 'Approval 3' ? '#1e3a5f' : '#475569',
                        background:
                          u.role === 'Super Admin' ? '#ede9fe' :
                          u.role === 'Admin' ? '#dbeafe' :
                          u.role === 'Budget Manager' ? '#dcfce7' :
                          u.role === 'Requester' ? '#fef3c7' :
                          u.role === 'Approval 1' || u.role === 'Approval 2' || u.role === 'Approval 3' ? '#e0f2fe' : '#f1f5f9',
                        border: `1px solid ${
                          u.role === 'Super Admin' ? '#ddd6fe' :
                          u.role === 'Admin' ? '#bfdbfe' :
                          u.role === 'Budget Manager' ? '#bbf7d0' :
                          u.role === 'Requester' ? '#fde68a' :
                          u.role === 'Approval 1' || u.role === 'Approval 2' || u.role === 'Approval 3' ? '#bae6fd' : '#e2e8f0'
                        }`,
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}>
                        <Shield size={12} />
                        {u.role}
                      </span>
                    </td>

                    {/* Departemen */}
                    <td style={{ padding: '16px 24px', color: '#475569', fontWeight: '500' }}>
                      {u.departemen}
                    </td>

                    {/* Telepon */}
                    <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '13px' }}>
                      {u.phone}
                    </td>

                    {/* Tgl Join */}
                    <td style={{ padding: '16px 24px', color: '#64748b', fontSize: '13px' }}>
                      {new Date(u.joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>

                    {/* Aksi */}
                    <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          onClick={() => openEditModal(u)}
                          title="Edit User"
                          style={{
                            padding: '6px',
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            color: '#475569',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          title="Hapus User"
                          disabled={isSelf}
                          style={{
                            padding: '6px',
                            background: isSelf ? '#f1f5f9' : '#fff1f2',
                            border: `1px solid ${isSelf ? '#e2e8f0' : '#ffe4e6'}`,
                            borderRadius: '6px',
                            color: isSelf ? '#cbd5e1' : '#e11d48',
                            cursor: isSelf ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => { if (!isSelf) e.currentTarget.style.background = '#ffe4e6'; }}
                          onMouseLeave={(e) => { if (!isSelf) e.currentTarget.style.background = '#fff1f2'; }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out',
        }}>
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                {editingUser ? 'Edit User' : 'Tambah User Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSubmit}>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Nama */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Nama Lengkap <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Nama lengkap user"
                    style={inputStyle}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Email Address <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@company.com"
                    style={inputStyle}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Password <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password login minimal 6 karakter"
                    style={inputStyle}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>

                {/* Departemen - full width */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Departemen <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <select
                    value={departemen}
                    onChange={(e) => setDepartemen(e.target.value)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  >
                    {Object.keys(departments).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Info: role diatur di Role Setting */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#0369a1',
                }}>
                  <Shield size={14} color="#0369a1" />
                  <span>
                    {editingUser
                      ? <>Role saat ini: <strong>{editingUser.role}</strong>. Ubah role melalui menu <strong>Role Setting</strong>.</>
                      : <>User baru akan diberi role default <strong>Requester</strong>. Ubah di <strong>Role Setting</strong>.</>
                    }
                  </span>
                </div>

                {/* Telepon */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
                    Nomor Telepon <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 8xx-xxxx-xxxx"
                    style={inputStyle}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '8px', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    background: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    background: '#2563eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1d4ed8'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2563eb'; }}
                >
                  {editingUser ? 'Simpan Perubahan' : 'Tambah User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
