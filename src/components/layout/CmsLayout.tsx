import {
  Bell,
  Eye,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/Button'

interface NavItem {
  to: string
  label: string
  icon: ReactNode
}

const NAV: NavItem[] = [
  { to: '/cms/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { to: '/cms/konten', label: 'Konten Undangan', icon: <FileText size={18} /> },
  { to: '/cms/buku-tamu', label: 'Buku Tamu', icon: <Users size={18} /> },
  { to: '/cms/preview', label: 'Preview', icon: <Eye size={18} /> },
  { to: '/cms/settings', label: 'Pengaturan', icon: <Settings size={18} /> },
]

export const CmsLayout = () => {
  const { user } = useAuth()

  return (
    <div className="glass-app-bg min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/45 backdrop-blur-2xl border-r border-white/50 flex flex-col">
        <div className="px-5 py-5 border-b border-white/40">
          <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-lg">
            <span className="w-8 h-8 rounded-xl bg-accent/90 text-cream border border-white/40 flex items-center justify-center text-sm shadow-[0_6px_18px_rgba(255,139,94,0.35)]">
              U
            </span>
            <span>MLJDL Undgn</span>
          </Link>
          <p className="text-xs text-ink-soft mt-1 font-medium">CMS - Couple Area</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all',
                  isActive
                    ? 'bg-accent/90 text-cream shadow-[0_4px_14px_rgba(255,139,94,0.3)]'
                    : 'text-ink-soft hover:bg-white/55 hover:text-ink',
                ].join(' ')
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-white/40">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-ink-soft hover:bg-white/55"
          >
            <Home size={14} />
            Kembali ke Public
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/40 backdrop-blur-xl border-b border-white/50">
          <div className="px-6 py-3 flex items-center justify-end gap-2">
            <button
              type="button"
              className="w-9 h-9 rounded-xl border border-white/50 bg-white/50 backdrop-blur-md hover:bg-white/70 flex items-center justify-center transition-colors"
              aria-label="Notifications"
            >
              <Bell size={16} />
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/50 backdrop-blur-md border border-white/50">
              <div className="w-7 h-7 rounded-full bg-accent/90 text-cream font-bold flex items-center justify-center text-xs">
                {(user?.name ?? 'U')[0]}
              </div>
              <span className="text-sm font-semibold max-w-[160px] truncate">{user?.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<LogOut size={14} />}
              onClick={() => authApi.logout()}
              aria-label="Logout"
            />
          </div>
        </header>

        <main className="flex-1 px-6 py-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
