import { LogOut, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../../api/auth'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { useAuth } from '../../hooks/useAuth'

export const SettingsPage = () => {
  const { user } = useAuth()
  const [confirmLogout, setConfirmLogout] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Pengaturan</p>
        <h1 className="section-title mt-2">Akun Saya</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display text-lg font-bold mb-4">Profil</h3>
          <div className="space-y-3">
            <Input label="Nama" value={user?.name ?? ''} readOnly />
            <Input label="Email" value={user?.email ?? ''} readOnly />
            <p className="text-xs text-ink-soft">
              Untuk ubah info ini, hubungi admin MLJDL.
            </p>
          </div>
        </Card>

        <Card className="border-error/40">
          <h3 className="font-display text-lg font-bold mb-2">Zona Berbahaya</h3>
          <p className="text-sm text-ink-soft mb-4">
            Logout dari device ini. Anda akan harus login lagi nanti.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="danger"
              leftIcon={<LogOut size={14} />}
              onClick={() => setConfirmLogout(true)}
            >
              Logout
            </Button>
            <Button
              variant="ghost"
              leftIcon={<Trash2 size={14} />}
              disabled
              title="Coming soon"
            >
              Hapus Akun
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        title="Logout?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmLogout(false)}>
              Batal
            </Button>
            <Button
              variant="danger"
              leftIcon={<LogOut size={14} />}
              onClick={async () => {
                await authApi.logout()
                navigate('/')
              }}
            >
              Ya, Logout
            </Button>
          </>
        }
      >
        <p className="text-ink-soft">Anda akan keluar dari device ini.</p>
      </Modal>
    </div>
  )
}
