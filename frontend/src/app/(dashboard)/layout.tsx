'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden selection:bg-emerald-500/30">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
          <MobileNav />
        </div>
      </div>
    </ProtectedRoute>
  );
}
