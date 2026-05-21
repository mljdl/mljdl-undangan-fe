import { Heart, LogOut, Sparkles } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { authApi } from '../../api/auth'
import { ADMIN_ROLES } from '../../constants/roles'
import { Button } from '../ui/Button'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/templates', label: 'Template' },
]

export const PublicLayout = () => {
  const { isAuthenticated, user, hasAnyRole } = useAuth()
  const goToDashboard = hasAnyRole(ADMIN_ROLES) ? '/admin/dashboard' : '/cms/dashboard'

  return (
    <div className="glass-app-bg min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-xl border-b border-white/50">
        <nav className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-display font-extrabold text-xl">
            <span className="w-9 h-9 rounded-xl bg-accent/90 text-cream border border-white/40 flex items-center justify-center shadow-[0_6px_18px_rgba(255,139,94,0.35)]">
              <Heart size={16} strokeWidth={2.5} />
            </span>
            <span className="hidden sm:inline">MLJDL Undangan</span>
          </Link>

          <div className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  [
                    'px-4 py-2 rounded-xl font-bold text-sm tracking-wide transition-all',
                    isActive
                      ? 'bg-accent/90 text-cream shadow-[0_4px_14px_rgba(255,139,94,0.3)]'
                      : 'text-ink hover:bg-white/50',
                  ].join(' ')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to={goToDashboard}>
                  <Button variant="secondary" size="sm" leftIcon={<Sparkles size={14} />}>
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">{user?.name?.split(' ')[0]}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<LogOut size={14} />}
                  onClick={() => authApi.logout()}
                  aria-label="Logout"
                />
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-ink text-cream py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <p>
            Crafted with <span className="text-accent">&hearts;</span> by MLJDL Agency
          </p>
          <p className="text-cream/60">
            &copy; {new Date().getFullYear()} MLJDL Undangan. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
