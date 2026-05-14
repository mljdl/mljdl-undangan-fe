import { UserPlus } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { ApiError } from '../../api/client'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'
import { onboardingStore, type OnboardingRole } from '../../store/onboarding.store'

export const RegisterPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [role, setRole] = useState<OnboardingRole>('pria')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('Password minimal 8 karakter')
      return
    }
    setLoading(true)
    try {
      // Persist field tambahan ke localStorage. Akan di-prefill saat user
      // pertama edit konten wedding.
      onboardingStore.set({
        phone: phone.trim() || undefined,
        partnerName: partnerName.trim() || undefined,
        weddingDate: weddingDate || undefined,
        role,
      })

      await authApi.register({ name: name.trim(), email: email.trim(), password })
      toast.success(`Akun dibuat, selamat datang ${name}`)
      navigate('/cms/dashboard')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Pendaftaran gagal'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="eyebrow">Mulai gratis</p>
          <h1 className="section-title mt-2">Daftar akun baru</h1>
          <p className="text-ink-soft mt-3 max-w-md mx-auto">
            Data ini akan jadi default isi undangan Anda. Bisa diubah kapan saja di CMS.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Akun */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink-soft mb-3">
                Info Akun
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  name="name"
                  label="Nama Lengkap Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  placeholder="Mochammad Rizki, S.Pd"
                />
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
                  type="tel"
                  name="phone"
                  label="Nomor WhatsApp"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                  placeholder="+62 812 3456 7890"
                  hint="Untuk admin MLJDL kontak Anda"
                />
                <Input
                  type="password"
                  name="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="********"
                  hint="Min. 8 karakter"
                />
              </div>
            </div>

            {/* Mempelai */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink-soft mb-3">
                Info Mempelai
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="brutal-label">Anda adalah</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('pria')}
                      className={[
                        'px-3 py-2.5 rounded-lg border-2 border-ink font-bold text-sm transition-all',
                        role === 'pria'
                          ? 'bg-accent text-cream shadow-brutal-sm'
                          : 'bg-cream-soft hover:bg-cream-deep',
                      ].join(' ')}
                    >
                      Mempelai Pria
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('wanita')}
                      className={[
                        'px-3 py-2.5 rounded-lg border-2 border-ink font-bold text-sm transition-all',
                        role === 'wanita'
                          ? 'bg-accent text-cream shadow-brutal-sm'
                          : 'bg-cream-soft hover:bg-cream-deep',
                      ].join(' ')}
                    >
                      Mempelai Wanita
                    </button>
                  </div>
                </div>
                <Input
                  name="partnerName"
                  label="Nama Pasangan"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder={role === 'pria' ? 'Nama calon istri' : 'Nama calon suami'}
                  hint="Boleh diisi nanti"
                />
                <Input
                  type="date"
                  name="weddingDate"
                  label="Estimasi Tanggal Nikah"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  hint="Bisa diubah nanti"
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              leftIcon={<UserPlus size={16} />}
            >
              Daftar &amp; Mulai
            </Button>
          </form>

          <p className="text-sm text-center text-ink-soft mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-bold text-accent-deep hover:underline">
              Masuk di sini
            </Link>
          </p>
        </Card>
      </div>
    </section>
  )
}
