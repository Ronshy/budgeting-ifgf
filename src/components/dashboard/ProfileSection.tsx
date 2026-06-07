'use client';

import React from 'react';
import { Building2, Mail, Phone, Calendar, Shield, FileText, Clipboard, Briefcase } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { departments } from '@/lib/data';
import { formatRupiah } from '@/lib/utils';

export function ProfileSection() {
  const { userProfile, lpjFiles, submittedPOs } = useApp();

  const infoItems = [
    { icon: <Building2 size={18} color="#475569" />, bg: '#f1f5f9', border: '#e2e8f0', label: 'Departemen', value: userProfile.departemen },
    { icon: <Mail size={18} color="#475569" />, bg: '#f1f5f9', border: '#e2e8f0', label: 'Email', value: userProfile.email },
    { icon: <Phone size={18} color="#475569" />, bg: '#f1f5f9', border: '#e2e8f0', label: 'Telepon', value: userProfile.phone },
    { icon: <Calendar size={18} color="#475569" />, bg: '#f1f5f9', border: '#e2e8f0', label: 'Bergabung Sejak', value: new Date(userProfile.joinDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) },
  ];

  return (
    <div style={{ animation: 'slideUp 0.4s ease-out' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>Profile</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Informasi akun dan data personal Anda</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', maxWidth: '1000px' }}>
        {/* Profile Card */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f5f9', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#334155', marginBottom: '16px' }}>
              {userProfile.nama.charAt(0)}
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', textAlign: 'center' }}>{userProfile.nama}</h2>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', background: '#f0f5ff', border: '1px solid #bfdbfe', borderRadius: '16px', fontSize: '12px', fontWeight: '600', color: '#2563eb' }}>
              <Shield size={14} />{userProfile.role}
            </div>
          </div>

          {/* Info List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {infoItems.map(({ icon, bg, border, label, value }) => (
              <div key={label} style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: bg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px', textTransform: 'uppercase', fontWeight: '600' }}>{label}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Card */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '20px' }}>Statistik Aktivitas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Total PO Dibuat', value: String(submittedPOs.length), color: '#2563eb', bg: '#f8fafc', border: '#e2e8f0', icon: <FileText size={18} color="#2563eb" /> },
              { label: 'Total LPJ Diupload', value: String(lpjFiles.length), color: '#16a34a', bg: '#f8fafc', border: '#e2e8f0', icon: <Clipboard size={18} color="#16a34a" /> },
              { label: 'Budget Departemen', value: formatRupiah(departments[userProfile.departemen]?.total ?? 0), color: '#334155', bg: '#f8fafc', border: '#e2e8f0', icon: <Briefcase size={18} color="#475569" /> },
            ].map(({ label, value, color, bg, border, icon }) => (
              <div key={label} style={{ padding: '16px', background: bg, border: `1px solid ${border}`, borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>{label}</span>
                  {icon}
                </div>
                <div style={{ fontSize: '20px', fontWeight: '700', color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
