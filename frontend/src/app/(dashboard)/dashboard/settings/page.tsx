'use client'

import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { User, LogOut, Settings, Palette, Shield } from 'lucide-react'

export default function SettingsPage() {
  const { user, logout } = useAuth()

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account preferences and settings</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
          <div className="flex items-center gap-3 mb-4 text-zinc-100">
            <User className="h-5 w-5 text-emerald-500" />
            <h2 className="text-xl font-semibold">Profile Information</h2>
          </div>
          <Separator className="mb-6 bg-zinc-800" />
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-400">Full Name</label>
              <p className="mt-1 text-zinc-100 p-2.5 rounded-md border border-zinc-800 bg-zinc-900/50">
                {user?.name || 'Loading...'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400">Email Address</label>
              <p className="mt-1 text-zinc-100 p-2.5 rounded-md border border-zinc-800 bg-zinc-900/50">
                {user?.email || 'Loading...'}
              </p>
            </div>
          </div>
          <p className="text-sm text-zinc-500 mt-4">
            * Note: Profile information cannot be changed at this time.
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
          <div className="flex items-center gap-3 mb-4 text-zinc-100">
            <Palette className="h-5 w-5 text-emerald-500" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>
          <Separator className="mb-6 bg-zinc-800" />
          
          <div>
            <h3 className="text-zinc-100 font-medium">Theme</h3>
            <p className="text-sm text-zinc-400 mb-4">TaskFlow uses a premium dark theme by default to reduce eye strain.</p>
            <div className="inline-flex p-1 border border-zinc-800 rounded-lg bg-zinc-900/50">
              <div className="px-4 py-2 rounded-md bg-zinc-800 text-zinc-100 text-sm font-medium">
                Dark Mode (Default)
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6">
          <div className="flex items-center gap-3 mb-4 text-rose-500">
            <Shield className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Danger Zone</h2>
          </div>
          <Separator className="mb-6 bg-rose-500/20" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-zinc-100 font-medium">Log out of your account</h3>
              <p className="text-sm text-zinc-400">You will need to log back in to access your tasks.</p>
            </div>
            <Button variant="destructive" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
