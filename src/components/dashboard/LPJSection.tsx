'use client';

import React from 'react';
import { Upload, File, Download, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function LPJSection() {
  const { lpjFiles, handleLPJUpload, handleDeleteLPJ, handleDownloadLPJ } = useApp();

  return (
    <div style={{ animation: 'slideUp 0.4s ease-out' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>
          Laporan Pertanggungjawaban
        </h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Upload dan kelola dokumen LPJ untuk setiap kegiatan</p>
      </div>

      {/* Upload Section */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', marginBottom: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Upload Dokumen LPJ</h3>
        <div
          style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s ease' }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#2563eb'; (e.currentTarget as HTMLDivElement).style.background = '#f0f5ff'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#cbd5e1'; (e.currentTarget as HTMLDivElement).style.background = '#f8fafc'; }}
          onClick={() => document.getElementById('lpj-file-input')?.click()}
        >
          <input id="lpj-file-input" type="file" accept=".pdf,.doc,.docx" onChange={handleLPJUpload} style={{ display: 'none' }} />
          <div style={{ width: '56px', height: '56px', margin: '0 auto 16px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Upload size={24} color="#475569" />
          </div>
          <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>Pilih file dari komputer Anda</h4>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>atau seret dan lepas berkas di sini</p>
          <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[{ label: 'PDF', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' }, { label: 'DOC', color: '#2563eb', bg: '#f0f5ff', border: '#bfdbfe' }, { label: 'DOCX', color: '#2563eb', bg: '#f0f5ff', border: '#bfdbfe' }].map(t => (
              <span key={t.label} style={{ fontSize: '11px', padding: '2px 8px', background: t.bg, border: `1px solid ${t.border}`, borderRadius: '4px', color: t.color, fontWeight: '600' }}>{t.label}</span>
            ))}
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>Maksimum ukuran file: 10 MB</p>
        </div>
      </div>

      {/* File List */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Arsip Dokumen LPJ</h3>
          <div style={{ fontSize: '12px', padding: '4px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#475569', fontWeight: '600' }}>{lpjFiles.length} File</div>
        </div>

        {lpjFiles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
            <File size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ fontSize: '14px' }}>Belum ada dokumen yang diupload</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {lpjFiles.map((file) => {
              const isPDF = file.type === 'pdf';
              return (
                <div key={file.id} style={{ padding: '14px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '16px', alignItems: 'center' }}>
                  {/* Icon */}
                  <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: isPDF ? '#fef2f2' : '#f0f5ff', border: `1px solid ${isPDF ? '#fecaca' : '#bfdbfe'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <File size={18} color={isPDF ? '#dc2626' : '#2563eb'} />
                  </div>
                  {/* Info */}
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</h4>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#64748b', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span>{file.size}</span><span style={{ color: '#cbd5e1' }}>•</span><span>{file.departemen}</span><span style={{ color: '#cbd5e1' }}>•</span>
                      <span>Oleh {file.uploader}</span><span style={{ color: '#cbd5e1' }}>•</span>
                      <span>{new Date(file.uploadDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {[
                      { icon: <Download size={16} />, color: '#475569', bg: '#ffffff', border: '#cbd5e1', hoverBg: '#f8fafc', onClick: () => handleDownloadLPJ(file), title: 'Download' },
                      { icon: <Trash2 size={16} />, color: '#dc2626', bg: '#fff1f2', border: '#ffe4e6', hoverBg: '#ffe4e6', onClick: () => handleDeleteLPJ(file.id), title: 'Delete' },
                    ].map(btn => (
                      <button key={btn.title} onClick={btn.onClick} title={btn.title}
                        style={{ padding: '8px', background: btn.bg, border: `1px solid ${btn.border}`, borderRadius: '6px', color: btn.color, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = btn.hoverBg; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = btn.bg; }}
                      >{btn.icon}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
