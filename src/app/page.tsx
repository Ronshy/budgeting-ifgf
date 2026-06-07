'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { LoginPage } from '@/components/auth/LoginPage';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { POSection } from '@/components/dashboard/POSection';
import { LPJSection } from '@/components/dashboard/LPJSection';
import { ProfileSection } from '@/components/dashboard/ProfileSection';
import { SettingsSection } from '@/components/dashboard/SettingsSection';
import { RoleSection } from '@/components/dashboard/RoleSection';
import { UserSection } from '@/components/dashboard/UserSection';

function AppContent() {
  const { isLoggedIn, activeMenu } = useApp();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const sections: Record<string, React.ReactNode> = {
    dashboard: <DashboardContent />,
    po:        <POSection />,
    lpj:       <LPJSection />,
    profile:   <ProfileSection />,
    users:     <UserSection />,
    role:      <RoleSection />,
    settings:  <SettingsSection />,
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '40px', position: 'relative', alignItems: 'flex-start' }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, paddingTop: '0' }}>
          {sections[activeMenu] ?? <DashboardContent />}
        </main>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
