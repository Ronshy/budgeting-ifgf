'use client';

import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Clipboard,
  User,
  Users,
  Shield,
  Settings,
  ChevronRight,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'po', label: 'PO', icon: FileText },
  { id: 'lpj', label: 'LPJ', icon: Clipboard },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'role', label: 'Role Setting', icon: Shield },
  { id: 'settings', label: 'General Setting', icon: Settings },
];

export function Sidebar() {
  const { activeMenu, setActiveMenu, isSidebarOpen, setIsSidebarOpen, userProfile, handleLogout } =
    useApp();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1001,
          background: '#2563eb',
          border: 'none',
          borderRadius: '8px',
          padding: '10px',
          color: 'white',
          cursor: 'pointer',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
          transition: 'all 0.2s ease',
        }}
        className="mobile-toggle"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="mobile-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.3)',
            backdropFilter: 'blur(4px)',
            zIndex: 998,
            animation: 'fadeIn 0.2s ease-out',
          }}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`sidebar-panel${isSidebarOpen ? ' sidebar-open' : ''}`}
        style={{
          width: '260px',
          flexShrink: 0,
          position: 'sticky',
          top: '20px',
          height: 'calc(100vh - 40px)',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px 16px',
          animation: 'slideUp 0.4s ease-out',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Logo */}
        <div
          style={{
            marginBottom: '32px',
            paddingBottom: '16px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={18} color="#ffffff" />
          </div>
          <div>
            <h2
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#0f172a',
                lineHeight: '1.2',
              }}
            >
              Budget Pro
            </h2>
            <p style={{ fontSize: '11px', color: '#64748b' }}>
              Corporate Finance
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <div
                key={item.id}
                className="menu-item"
                onClick={() => {
                  setActiveMenu(item.id);
                  setIsSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  marginBottom: '6px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: isActive ? '#f0f5ff' : 'transparent',
                  border: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.background = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                  }
                }}
              >
                <Icon size={18} color={isActive ? '#2563eb' : '#64748b'} style={{ flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    color: isActive ? '#2563eb' : '#334155',
                  }}
                >
                  {item.label}
                </span>
                {isActive && (
                  <ChevronRight size={16} color="#2563eb" style={{ marginLeft: 'auto' }} />
                )}
              </div>
            );
          })}
        </nav>

        {/* User Info + Logout */}
        <div
          style={{
            marginTop: '32px',
            paddingTop: '16px',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: '#334155',
                flexShrink: 0,
              }}
            >
              {userProfile.nama.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#0f172a',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {userProfile.nama}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#64748b',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {userProfile.email}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: '#fff1f2',
              border: '1px solid #ffe4e6',
              borderRadius: '8px',
              color: '#e11d48',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#ffe4e6';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#fff1f2';
            }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
