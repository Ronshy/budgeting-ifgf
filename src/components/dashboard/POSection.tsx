'use client';

import React from 'react';
import { FileText, File, Trash2, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatRupiah } from '@/lib/utils';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', fontSize: '14px',
  background: '#ffffff', border: '1px solid #cbd5e1',
  borderRadius: '8px', color: '#0f172a', outline: 'none',
  transition: 'all 0.2s ease', boxSizing: 'border-box',
};
const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.target.style.border = '1px solid #2563eb';
  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
};
const blurBorder = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  e.target.style.border = '1px solid #cbd5e1';
  e.target.style.boxShadow = 'none';
};

export function POSection() {
  const {
    poForm, handlePOFormChange,
    newItem, handleNewItemChange,
    addItemToPO, deleteItemFromPO,
    calculateTotalPO, handlePOSubmit,
    handleRejectPO,
    submittedPOs,
    departmentsData,
  } = useApp();

  const deptAllocation = departmentsData[poForm.departemen]?.allocation ?? [];

  return (
    <div style={{ animation: 'slideUp 0.4s ease-out' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.02em' }}>Purchase Order</h1>
        <p style={{ fontSize: '15px', color: '#64748b' }}>Buat permintaan pembelian baru untuk departemen Anda</p>
      </div>

      {/* Form Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', maxWidth: '800px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        <form onSubmit={handlePOSubmit}>
          {/* Nama Kegiatan */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Nama Kegiatan <span style={{ color: '#dc2626' }}>*</span></label>
            <input type="text" required value={poForm.nama} onChange={e => handlePOFormChange('nama', e.target.value)} placeholder="Contoh: Kampanye Digital Q2" style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
          </div>

          {/* Departemen */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Departemen <span style={{ color: '#dc2626' }}>*</span></label>
            <select required value={poForm.departemen} onChange={e => handlePOFormChange('departemen', e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={focusBorder} onBlur={blurBorder}>
              {Object.keys(departmentsData).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Kategori Budget */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Kategori Budget <span style={{ color: '#dc2626' }}>*</span></label>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>Pilih alokasi anggaran yang sesuai dari departemen {poForm.departemen}.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
              {deptAllocation.map((item) => {
                const isSelected = poForm.budgetCategory === item.name;
                return (
                  <div key={item.name} onClick={() => handlePOFormChange('budgetCategory', item.name)}
                    style={{ padding: '14px', background: isSelected ? '#f0f5ff' : '#ffffff', border: isSelected ? '1px solid #bfdbfe' : '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = '#f8fafc'; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = '#ffffff'; }}
                  >
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: isSelected ? '4px solid #2563eb' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', background: '#ffffff' }} />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>{item.name}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>{formatRupiah(item.amount)}</div>
                        <span style={{ fontSize: '10px', padding: '1px 5px', background: '#e2f0d9', borderRadius: '4px', color: '#385723', fontWeight: '600' }}>On Budget</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {/* Off Budget option */}
              <div onClick={() => handlePOFormChange('budgetCategory', 'off_budget')}
                style={{ padding: '14px', background: poForm.budgetCategory === 'off_budget' ? '#fef2f2' : '#ffffff', border: poForm.budgetCategory === 'off_budget' ? '1px solid #fecaca' : '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { if (poForm.budgetCategory !== 'off_budget') (e.currentTarget as HTMLDivElement).style.background = '#f8fafc'; }}
                onMouseLeave={e => { if (poForm.budgetCategory !== 'off_budget') (e.currentTarget as HTMLDivElement).style.background = '#ffffff'; }}
              >
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: poForm.budgetCategory === 'off_budget' ? '4px solid #dc2626' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', background: '#ffffff' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>Off Budget</div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Tidak masuk alokasi di atas</div>
                    <span style={{ fontSize: '10px', padding: '1px 5px', background: '#fee2e2', borderRadius: '4px', color: '#991b1b', fontWeight: '600' }}>Off Budget</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Keterangan */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Keterangan / Detail <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea required value={poForm.keterangan} onChange={e => handlePOFormChange('keterangan', e.target.value)} placeholder="Jelaskan kebutuhan dan justifikasi pembelian..." rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5' } as React.CSSProperties}
              onFocus={focusBorder as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
              onBlur={blurBorder as unknown as React.FocusEventHandler<HTMLTextAreaElement>}
            />
          </div>

          {/* Items */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>Daftar Barang/Jasa <span style={{ color: '#dc2626' }}>*</span></label>
            {/* Add Item Box */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '12px' }}>Tambah Item</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '12px' }}>
                {[
                  { field: 'namaBarang' as const, placeholder: 'Nama Barang/Jasa', type: 'text' },
                  { field: 'jumlah' as const, placeholder: 'Jumlah', type: 'number' },
                  { field: 'hargaSatuan' as const, placeholder: 'Harga Satuan (Rp)', type: 'number' },
                  { field: 'rekeningSupplier' as const, placeholder: 'Info Rekening Supplier', type: 'text' },
                ].map(({ field, placeholder, type }) => (
                  <input key={field} type={type} min={type === 'number' ? '0' : undefined} value={newItem[field]} onChange={e => handleNewItemChange(field, e.target.value)} placeholder={placeholder}
                    style={{ padding: '8px 12px', fontSize: '13px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#0f172a', outline: 'none', boxSizing: 'border-box' } as React.CSSProperties}
                    onFocus={e => { e.target.style.border = '1px solid #2563eb'; }}
                    onBlur={e => { e.target.style.border = '1px solid #cbd5e1'; }}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                {newItem.jumlah && newItem.hargaSatuan && (
                  <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: '600' }}>
                    Estimasi: {formatRupiah(parseInt(newItem.jumlah || '0') * parseInt(newItem.hargaSatuan || '0'))}
                  </div>
                )}
                <button type="button" onClick={addItemToPO}
                  style={{ background: '#2563eb', border: 'none', borderRadius: '6px', padding: '8px 14px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1d4ed8'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563eb'; }}
                >
                  <Plus size={14} /> Tambahkan
                </button>
              </div>
            </div>

            {/* Items Table */}
            {poForm.items.length > 0 ? (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      {['No', 'Barang/Jasa', 'Qty', 'Harga Satuan', 'Subtotal', 'Supplier', 'Aksi'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: h === 'Aksi' ? 'center' : h === 'Qty' ? 'center' : ['Harga Satuan','Subtotal'].includes(h) ? 'right' : 'left', color: '#475569', fontWeight: '600', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {poForm.items.map((item, idx) => (
                      <tr key={item.id} style={{ borderBottom: idx < poForm.items.length - 1 ? '1px solid #f1f5f9' : 'none', background: '#ffffff' }}>
                        <td style={{ padding: '10px 12px', color: '#64748b' }}>{idx + 1}</td>
                        <td style={{ padding: '10px 12px', color: '#0f172a', fontWeight: '500' }}>{item.namaBarang}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748b' }}>{item.jumlah}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#64748b' }}>{formatRupiah(item.hargaSatuan)}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0f172a', fontWeight: '600' }}>{formatRupiah(item.totalHarga)}</td>
                        <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '11px' }}>{item.rekeningSupplier}</td>
                        <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                          <button type="button" onClick={() => deleteItemFromPO(item.id)}
                            style={{ background: '#fff1f2', border: '1px solid #ffe4e6', borderRadius: '4px', padding: '4px', color: '#e11d48', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#ffe4e6'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#fff1f2'; }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0' }}>
                      <td colSpan={4} style={{ padding: '12px', textAlign: 'right', color: '#334155', fontWeight: '600' }}>Total Keseluruhan:</td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#2563eb', fontWeight: '700', fontSize: '15px' }}>{formatRupiah(calculateTotalPO())}</td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div style={{ padding: '32px 16px', textAlign: 'center', background: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#64748b' }}>
                <File size={32} style={{ margin: '0 auto 8px', opacity: 0.4 }} />
                <p style={{ fontSize: '13px' }}>Belum ada item ditambahkan.</p>
              </div>
            )}
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" style={{ flex: 1, background: '#2563eb', border: 'none', borderRadius: '8px', padding: '12px 24px', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1d4ed8'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563eb'; }}
            >Ajukan Purchase Order</button>
            <button type="button" style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 24px', color: '#475569', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => { handlePOFormChange('nama', ''); handlePOFormChange('keterangan', ''); handlePOFormChange('budgetCategory', ''); }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#e2e8f0'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f1f5f9'; }}
            >Batal</button>
          </div>
        </form>
      </div>

      {/* Submitted POs List */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '32px', marginTop: '32px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>Daftar Pengajuan PO</h3>
          <div style={{ fontSize: '12px', padding: '4px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#475569', fontWeight: '600' }}>{submittedPOs.length} Pengajuan</div>
        </div>
        {submittedPOs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
            <FileText size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ fontSize: '14px' }}>Belum ada pengajuan PO</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {submittedPOs.map((po) => {
              const statusColor = po.status === 'approved' ? '#16a34a' : po.status === 'rejected' ? '#dc2626' : '#d97706';
              const statusBg = po.status === 'approved' ? '#f0fdf4' : po.status === 'rejected' ? '#fef2f2' : '#fffbeb';
              const statusBorder = po.status === 'approved' ? '#bbf7d0' : po.status === 'rejected' ? '#fecaca' : '#fef3c7';
              const statusLabel = po.status === 'approved' ? 'Disetujui' : po.status === 'rejected' ? 'Ditolak' : 'Menunggu';
              return (
                <div key={po.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px', textTransform: 'uppercase', fontWeight: '600' }}>Nomor PO</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#2563eb', marginBottom: '6px' }}>{po.nomorPO}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '2px' }}>{po.namaKegiatan}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{po.keterangan}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ padding: '3px 8px', background: statusBg, border: `1px solid ${statusBorder}`, borderRadius: '4px', fontSize: '11px', fontWeight: '600', color: statusColor }}>{statusLabel}</div>
                      <div style={{ padding: '3px 8px', background: po.isOffBudget ? '#fef2f2' : '#f0fdf4', border: `1px solid ${po.isOffBudget ? '#fecaca' : '#bbf7d0'}`, borderRadius: '4px', fontSize: '11px', fontWeight: '600', color: po.isOffBudget ? '#dc2626' : '#16a34a' }}>
                        {po.isOffBudget ? 'Off Budget' : 'On Budget'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', marginBottom: '12px', padding: '12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    {[
                      { label: 'Departemen', value: po.departemen },
                      { label: 'Pemohon', value: po.submittedBy },
                      { label: 'Tanggal', value: new Date(po.submittedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }) },
                      { label: 'Rincian', value: `${po.items.length} Item` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px', textTransform: 'uppercase', fontWeight: '600' }}>{label}</div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: '#334155' }}>{value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#475569' }}>Total Nilai PO</span>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>{formatRupiah(po.totalNilai)}</span>
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
