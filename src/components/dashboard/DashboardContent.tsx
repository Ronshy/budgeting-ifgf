'use client';

import React from 'react';
import { Building2, Clock, TrendingUp, TrendingDown, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { departments, transactions } from '@/lib/data';
import { formatRupiah, getPercentage } from '@/lib/utils';

export function DashboardContent() {
  const { selectedDepartment, setSelectedDepartment, showDepartmentModal, setShowDepartmentModal } = useApp();
  const currentBudget = departments[selectedDepartment];
  const totalAll = Object.values(departments).reduce((s, d) => s + d.total, 0);
  const onBudgetAll = Object.values(departments).reduce((s, d) => s + d.onBudget, 0);
  const offBudgetAll = Object.values(departments).reduce((s, d) => s + d.offBudget, 0);

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: '32px', animation: 'slideUp 0.4s ease-out' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '8px',
          letterSpacing: '-0.02em',
        }}>Dashboard Budget</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', flexWrap: 'wrap' }}>
          <Building2 size={16} />
          <span style={{ fontWeight: '500' }}>Departemen {selectedDepartment}</span>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <Clock size={16} />
          <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Featured: Total Budget Perusahaan */}
      <div style={{ marginBottom: '32px', animation: 'slideUp 0.4s ease-out 0.05s backwards' }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
            {/* Left: totals */}
            <div style={{ flex: '1', minWidth: '280px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: '600' }}>
                Total Budget Perusahaan
              </div>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#0f172a', marginBottom: '12px', letterSpacing: '-0.02em' }}>
                {formatRupiah(totalAll)}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
                <Building2 size={16} />
                <span>Konsolidasi dari {Object.keys(departments).length} departemen</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#166534', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Total On Budget</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#15803d', marginBottom: '4px' }}>{formatRupiah(onBudgetAll)}</div>
                  <span style={{ background: '#dcfce7', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', color: '#166534' }}>{getPercentage(onBudgetAll, totalAll)}%</span>
                </div>
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#991b1b', marginBottom: '4px', textTransform: 'uppercase', fontWeight: '600' }}>Total Off Budget</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#b91c1c', marginBottom: '4px' }}>{formatRupiah(offBudgetAll)}</div>
                  <span style={{ background: '#fee2e2', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', color: '#991b1b' }}>{getPercentage(offBudgetAll, totalAll)}%</span>
                </div>
              </div>
            </div>
            {/* Right: dept breakdown */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', minWidth: '300px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#334155', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Breakdown Departemen</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(departments).map(([name, budget]) => (
                  <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{getPercentage(budget.total, totalAll)}% porsi</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>{formatRupiah(budget.total)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Cards: Total / On / Off per dept */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px', animation: 'slideUp 0.4s ease-out 0.1s backwards' }}>
        {[
          { label: 'Total Budget', value: currentBudget.total, color: '#2563eb', bg: '#ffffff', border: '#e2e8f0', pct: null },
          { label: 'On Budget', value: currentBudget.onBudget, color: '#16a34a', bg: '#ffffff', border: '#e2e8f0', pct: getPercentage(currentBudget.onBudget, currentBudget.total) },
          { label: 'Off Budget', value: currentBudget.offBudget, color: '#dc2626', bg: '#ffffff', border: '#e2e8f0', pct: getPercentage(currentBudget.offBudget, currentBudget.total) },
        ].map(({ label, value, color, bg, border, pct }) => (
          <div key={label} className="card-hover" style={{ background: bg, border: `1px solid ${border}`, borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: '600' }}>{label}</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color, marginBottom: '8px' }}>{formatRupiah(value)}</div>
            {pct && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                <span style={{ background: label === 'On Budget' ? '#f0fdf4' : '#fef2f2', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', color, border: `1px solid ${label === 'On Budget' ? '#bbf7d0' : '#fecaca'}` }}>{pct}%</span>
                <span>{label === 'On Budget' ? 'Sesuai rencana' : 'Di luar rencana'}</span>
              </div>
            )}
            {!pct && <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /><span>Alokasi departemen {selectedDepartment}</span></div>}
          </div>
        ))}
      </div>

      {/* Button: Lihat Departemen Lain */}
      <div style={{ marginBottom: '32px', animation: 'slideUp 0.4s ease-out 0.15s backwards' }}>
        <button
          onClick={() => setShowDepartmentModal(!showDepartmentModal)}
          style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '10px 16px', color: '#334155', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s ease', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#94a3b8'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#ffffff'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#cbd5e1'; }}
        >
          <Eye size={16} />
          Pilih Departemen Lain
        </button>
      </div>

      {/* Department Modal */}
      {showDepartmentModal && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '32px', animation: 'fadeIn 0.2s ease-out', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#0f172a' }}>Pilih Departemen</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {Object.entries(departments).map(([name, budget]) => (
              <div key={name} onClick={() => { setSelectedDepartment(name); setShowDepartmentModal(false); }}
                style={{ background: selectedDepartment === name ? '#f0f5ff' : '#ffffff', border: selectedDepartment === name ? '1px solid #bfdbfe' : '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { if (selectedDepartment !== name) (e.currentTarget as HTMLDivElement).style.background = '#f8fafc'; }}
                onMouseLeave={(e) => { if (selectedDepartment !== name) (e.currentTarget as HTMLDivElement).style.background = '#ffffff'; }}
              >
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: selectedDepartment === name ? '#2563eb' : '#0f172a' }}>{name}</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>{formatRupiah(budget.total)}</div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                  <span style={{ color: '#16a34a' }}>On: {getPercentage(budget.onBudget, budget.total)}%</span>
                  <span style={{ color: '#dc2626' }}>Off: {getPercentage(budget.offBudget, budget.total)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div style={{ animation: 'slideUp 0.4s ease-out 0.2s backwards' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '3px', height: '16px', background: '#2563eb', borderRadius: '2px' }} />
          Riwayat Transaksi
        </h2>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
          {transactions.map((tx, index) => (
            <div key={tx.id} style={{ padding: '16px 20px', borderBottom: index < transactions.length - 1 ? '1px solid #f1f5f9' : 'none', display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: tx.type === 'on' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${tx.type === 'on' ? '#bbf7d0' : '#fecaca'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {tx.type === 'on' ? <CheckCircle2 size={18} color="#16a34a" /> : <XCircle size={18} color="#dc2626" />}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{tx.name}</h3>
                    <span style={{ background: tx.type === 'on' ? '#f0fdf4' : '#fef2f2', color: tx.type === 'on' ? '#16a34a' : '#dc2626', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', textTransform: 'uppercase', border: `1px solid ${tx.type === 'on' ? '#bbf7d0' : '#fecaca'}` }}>
                      {tx.type === 'on' ? 'On Budget' : 'Off Budget'}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{tx.detail}</p>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(tx.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: tx.type === 'on' ? '#16a34a' : '#dc2626', marginBottom: '2px' }}>{formatRupiah(tx.amount)}</div>
                <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  {tx.type === 'on' ? <TrendingDown size={12} color="#16a34a" /> : <TrendingUp size={12} color="#dc2626" />}
                  <span>{tx.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '20px', padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Total {transactions.length} transaksi</div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%' }} /><span style={{ color: '#64748b' }}>{transactions.filter(t => t.type === 'on').length} On Budget</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', background: '#dc2626', borderRadius: '50%' }} /><span style={{ color: '#64748b' }}>{transactions.filter(t => t.type === 'off').length} Off Budget</span></div>
          </div>
        </div>
      </div>
    </>
  );
}
