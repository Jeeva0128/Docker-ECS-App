'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function Topbar() {
  const { user, logout } = useAuth();
  const [hasUnread, setHasUnread] = useState(true);

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
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between px-4 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden text-zinc-400">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="hidden sm:flex md:hidden text-zinc-100 font-semibold items-center gap-2">
          <div className="bg-emerald-500/10 p-1.5 rounded-lg shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-emerald-500"
            >
              <polyline points="9 11 12 14 22 4"></polyline>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
          </div>
          TaskFlow
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-100 bg-zinc-900/50 rounded-full h-9 w-9 border border-zinc-800"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-zinc-400 hover:text-zinc-100 relative h-9 w-9"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {hasUnread && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-zinc-950"></span>
          )}
        </Button>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-950 rounded-full">
              <Avatar className="h-9 w-9 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
                <AvatarImage src={""} />
                <AvatarFallback className="bg-zinc-800 text-zinc-300">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="w-56 bg-zinc-900 border border-zinc-800 rounded-md shadow-lg py-1 z-50 animate-in fade-in-80 zoom-in-95"
            >
              <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                <p className="text-sm font-medium text-zinc-200 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>

              <DropdownMenu.Item className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer outline-none flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </DropdownMenu.Item>
              
              <DropdownMenu.Item className="px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 cursor-pointer outline-none flex items-center gap-2" asChild>
                <Link href="/dashboard/settings">
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-px bg-zinc-800 my-1" />
              
              <DropdownMenu.Item 
                onClick={logout}
                className="px-3 py-2 text-sm text-red-400 hover:bg-red-950/30 hover:text-red-300 cursor-pointer outline-none flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
