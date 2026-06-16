'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Shield, Plus, X, Loader2 } from 'lucide-react';

export function RoleSection() {
  const { users, roles, userRoles, addRole, toggleUserRole } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      alert('Nama role tidak boleh kosong!');
      return;
    }
    
    setIsSubmitting(true);
    const success = await addRole(newRoleName.trim());
    setIsSubmitting(false);
    
    if (success) {
      setNewRoleName('');
      setShowModal(false);
    }
  };

  return (
    <div style={{ animation: 'slideUp 0.4s ease-out', position: 'relative' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            Role Setting
          </h1>
          <p style={{ fontSize: '15px', color: '#64748b' }}>
            Kelola hak akses dan peran pengguna dalam sistem
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(37, 99, 235, 0.1)',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          <Plus size={16} />
          Tambah Role Baru
        </button>
      </div>

      {/* Main Table Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th
                  style={{
                    padding: '18px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#475569',
                    minWidth: '280px',
                    position: 'sticky',
                    left: 0,
                    background: '#f8fafc',
                    boxShadow: '2px 0 5px rgba(0,0,0,0.02)',
                    zIndex: 10,
                  }}
                >
                  Fullname
                </th>
                {roles.map((role) => (
                  <th
                    key={role.id}
                    style={{
                      padding: '18px 16px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#475569',
                      textAlign: 'center',
                      minWidth: '100px',
                    }}
                  >
                    {role.nama}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={roles.length + 1} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    Tidak ada data pengguna ditemukan
                  </td>
                </tr>
              ) : (
                users.map((user, uIndex) => (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      background: uIndex % 2 === 0 ? '#ffffff' : '#f8fafc',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#f1f5f9';
                      const firstTd = e.currentTarget.firstElementChild as HTMLElement;
                      if (firstTd) firstTd.style.background = '#f1f5f9';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = uIndex % 2 === 0 ? '#ffffff' : '#f8fafc';
                      const firstTd = e.currentTarget.firstElementChild as HTMLElement;
                      if (firstTd) firstTd.style.background = uIndex % 2 === 0 ? '#ffffff' : '#f8fafc';
                    }}
                  >
                    {/* User Identity Column (Sticky Left) */}
                    <td
                      style={{
                        padding: '14px 24px',
                        position: 'sticky',
                        left: 0,
                        background: uIndex % 2 === 0 ? '#ffffff' : '#f8fafc',
                        boxShadow: '2px 0 5px rgba(0,0,0,0.02)',
                        zIndex: 9,
                        transition: 'background-color 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                          {user.nama}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {user.email}
                        </span>
                      </div>
                    </td>

                    {/* Roles Checkboxes Column */}
                    {roles.map((role) => {
                      const isChecked = userRoles.some(
                        (ur) => ur.user_id === user.id && ur.role_id === role.id
                      );

                      return (
                        <td key={role.id} style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div
                              onClick={() => toggleUserRole(user.id, role.id)}
                              style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '5px',
                                border: isChecked ? '2px solid #2563eb' : '2px solid #cbd5e1',
                                backgroundColor: isChecked ? '#2563eb' : '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#2563eb';
                              }}
                              onMouseOut={(e) => {
                                if (!isChecked) e.currentTarget.style.borderColor = '#cbd5e1';
                              }}
                            >
                              {isChecked && (
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="#ffffff"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Role Modal Overlay */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              width: '90%',
              maxWidth: '440px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              animation: 'scaleUp 0.2s ease-out',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="#2563eb" />
                Tambah Role Baru
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  border: 'none',
                  background: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRoleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  htmlFor="role-name"
                  style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}
                >
                  Nama Role
                </label>
                <input
                  type="text"
                  id="role-name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="Contoh: Volunteer, Supervisor"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2563eb')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : null}
                  Simpan Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
