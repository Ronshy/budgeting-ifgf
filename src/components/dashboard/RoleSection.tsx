'use client';

import React from 'react';
import { Shield } from 'lucide-react';

export function RoleSection() {
  return (
    <div style={{ animation: 'slideUp 0.4s ease-out' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>Role Setting</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Kelola hak akses dan peran pengguna dalam sistem</p>
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '40px 32px', maxWidth: '700px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Shield size={28} color="#475569" />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Role Management</h2>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '400px', lineHeight: '1.5' }}>
            Fitur manajemen peran akan segera tersedia. Anda akan dapat mengonfigurasi dan mengelola hak akses untuk seluruh personel organisasi.
          </p>

          <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', width: '100%' }}>
            {['Administrator', 'Budget Manager', 'Requester', 'Approver'].map(role => (
              <div key={role} style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={16} color="#64748b" />
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
