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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-cream-soft border-r-2 border-ink flex flex-col">
        <div className="px-5 py-5 border-b-2 border-ink">
          <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-lg">
            <span className="w-8 h-8 rounded-lg bg-accent text-cream border-2 border-ink flex items-center justify-center text-sm shadow-brutal-sm">
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
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all',
                  isActive
                    ? 'bg-accent text-cream border-2 border-ink shadow-brutal-sm'
                    : 'text-ink-soft hover:bg-cream-deep hover:text-ink',
                ].join(' ')
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-3 border-t-2 border-ink">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-ink-soft hover:bg-cream-deep"
          >
            <Home size={14} />
            Kembali ke Public
          </Link>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-cream/95 backdrop-blur-md border-b-2 border-ink">
          <div className="px-6 py-3 flex items-center justify-end gap-2">
            <button
              type="button"
              className="w-9 h-9 rounded-lg border-2 border-ink bg-cream-soft hover:bg-cream-deep flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell size={16} />
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-cream-soft border-2 border-ink">
              <div className="w-7 h-7 rounded-full bg-accent text-cream font-bold flex items-center justify-center text-xs">
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
