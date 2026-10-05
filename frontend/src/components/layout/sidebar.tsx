'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: CheckSquare, label: 'My Tasks', href: '/dashboard/tasks' },
  { icon: Calendar, label: 'Calendar', href: '/dashboard/calendar' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 280 }}
      className="hidden md:flex flex-col h-screen bg-zinc-950 border-r border-zinc-800 shrink-0 sticky top-0"
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800 shrink-0">
        <Link
          href="/dashboard"
          className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}
        >
          <div className="bg-emerald-500/10 p-1.5 rounded-lg shrink-0">
            <CheckSquare className="w-5 h-5 text-emerald-500" />
          </div>
          {!collapsed && (
            <span className="font-semibold text-zinc-100 truncate">TaskFlow</span>
          )}
        </Link>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-zinc-100"
            onClick={() => setCollapsed(true)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="mb-4 mx-auto text-zinc-400 hover:text-zinc-100"
            onClick={() => setCollapsed(false)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50',
                collapsed && 'justify-center px-0'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn('w-5 h-5 shrink-0', isActive && 'text-emerald-500')} />
              {!collapsed && <span className="font-medium truncate">{item.label}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-3 border-t border-zinc-800 shrink-0">
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg',
            !collapsed && 'p-2 bg-zinc-900/50'
          )}
        >
          <Avatar className="h-9 w-9 shrink-0 border border-zinc-800">
            <AvatarImage src={""} />
            <AvatarFallback className="bg-zinc-800 text-zinc-300">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-200 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-zinc-500 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-zinc-400 hover:text-red-400 shrink-0"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
