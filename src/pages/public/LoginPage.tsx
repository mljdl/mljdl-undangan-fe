import { LogIn } from 'lucide-react'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { ApiError } from '../../api/client'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'
import { ADMIN_ROLES } from '../../constants/roles'

interface LocationState {
  redirectTo?: string
  from?: string
}

export const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const session = await authApi.login(email.trim(), password)
      toast.success(`Selamat datang, ${session.user.name}`)
      const state = location.state as LocationState | null
      const dest = state?.redirectTo ?? state?.from
      if (dest) {
        navigate(dest)
        return
      }
      const isAdmin = session.user.roles.some((r) => ADMIN_ROLES.includes(r))
      navigate(isAdmin ? '/admin/dashboard' : '/cms/dashboard')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Login gagal'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="px-6 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <p className="eyebrow">Welcome back</p>
          <h1 className="section-title mt-2">Masuk ke akun Anda</h1>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              name="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              placeholder="kamu@example.com"
            />
            <Input
              type="password"
              name="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="Min. 8 karakter"
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              leftIcon={<LogIn size={16} />}
            >
              Masuk
            </Button>
          </form>

          <p className="text-sm text-center text-ink-soft mt-6">
            Belum punya akun?{' '}
            <Link to="/register" className="font-bold text-accent-deep hover:underline">
              Daftar di sini
            </Link>
          </p>
        </Card>
      </div>
    </section>
  )
}
