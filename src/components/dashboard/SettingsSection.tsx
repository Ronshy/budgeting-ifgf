'use client';

import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function SettingsSection() {
  const { userProfile, handleLogout } = useApp();

  return (
    <div style={{ animation: 'slideUp 0.4s ease-out' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>General Settings</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Pengaturan umum aplikasi dan akun</p>
      </div>

      <div style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Account Info */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="#2563eb" /> Akun
          </h3>
          <div style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Nama', value: userProfile.nama },
              { label: 'Email', value: userProfile.email },
              { label: 'Role', value: userProfile.role },
              { label: 'Departemen', value: userProfile.departemen },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{label}</span>
                <span style={{ fontSize: '13px', color: '#64748b' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences placeholder */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} color="#64748b" /> Preferensi
          </h3>
          <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
            <Settings size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
            <p style={{ fontSize: '13px' }}>Pengaturan preferensi akan segera tersedia</p>
          </div>
        </div>

        {/* Logout */}
        <div style={{ background: '#ffffff', border: '1px solid #fecaca', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#991b1b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogOut size={20} color="#dc2626" /> Keluar Aplikasi
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>Anda akan keluar dari sesi ini. Data yang belum dikirim ke server akan disetel ulang.</p>
          <button onClick={handleLogout}
            style={{ background: '#dc2626', border: 'none', borderRadius: '8px', padding: '10px 20px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#b91c1c'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#dc2626'; }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
