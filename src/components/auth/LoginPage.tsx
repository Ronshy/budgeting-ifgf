'use client';

import React from 'react';
import { Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function LoginPage() {
  const {
    loginForm,
    showPassword,
    setShowPassword,
    handleLoginFormChange,
    handleLogin,
  } = useApp();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
        backgroundColor: '#f8fafc',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          animation: 'slideUp 0.4s ease-out',
        }}
      >
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 16px',
              borderRadius: '12px',
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
            }}
          >
            <Shield size={28} color="#ffffff" />
          </div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a',
              marginBottom: '6px',
              letterSpacing: '-0.02em',
            }}
          >
            Budget Pro
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Financial Management System
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>
            Sign In
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
            Masukkan kredensial akun Anda
          </p>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#334155',
                  marginBottom: '8px',
                }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => handleLoginFormChange('email', e.target.value)}
                  placeholder="name@company.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    fontSize: '14px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    color: '#0f172a',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid #2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #cbd5e1';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#334155',
                  marginBottom: '8px',
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginForm.password}
                  onChange={(e) => handleLoginFormChange('password', e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 40px',
                    fontSize: '14px',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    color: '#0f172a',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid #2563eb';
                    e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid #cbd5e1';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#2563eb'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#2563eb',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1d4ed8';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#2563eb';
              }}
            >
              Sign In
            </button>
          </form>

          {/* Demo Credentials */}
          <div
            style={{
              marginTop: '20px',
              padding: '12px 14px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
            }}
          >
            <p style={{ fontSize: '12px', color: '#166534', lineHeight: '1.5', margin: 0 }}>
              <strong>Demo Login:</strong>
              <br />
              Email: <code>admin@company.com</code>
              <br />
              Password: <code>admin123</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#94a3b8' }}>
          © 2026 Budget Pro. All rights reserved.
        </div>
      </div>
    </div>
  );
}
