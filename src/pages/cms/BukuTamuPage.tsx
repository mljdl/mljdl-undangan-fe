import { Check, Copy, Plus, Send, Trash2, X } from 'lucide-react'
import type { FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ApiError } from '../../api/client'
import { guestApi } from '../../api/guest'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'
import { useMyWedding } from '../../hooks/useMyWedding'
import type { WeddingGuest } from '../../types'

const UNDGN_FE_URL = import.meta.env.VITE_UNDGN_FE_URL || 'http://localhost:5173'

function buildInviteUrl(slug: string, token: string | null, name: string): string {
  const base = `${UNDGN_FE_URL}/${slug}`
  const params = new URLSearchParams()
  if (token) params.set('token', token)
  if (name) params.set('to', name)
  return `${base}?${params.toString()}`
}

function phoneToWaNumber(phone?: string | null): string {
  if (!phone) return ''
  const trimmed = phone.replace(/[^\d+]/g, '')
  if (trimmed.startsWith('+')) return trimmed.slice(1)
  if (trimmed.startsWith('0')) return '62' + trimmed.slice(1)
  return trimmed
}

export const BukuTamuPage = () => {
  const { wedding } = useMyWedding()
  const [guests, setGuests] = useState<WeddingGuest[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<WeddingGuest | null>(null)
  const toast = useToast()

  const load = useCallback(async () => {
    if (!wedding) return
    setLoading(true)
    try {
      const { items } = await guestApi.list(wedding.id)
      setGuests(items)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Gagal load tamu')
    } finally {
      setLoading(false)
    }
  }, [wedding, toast])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return guests
    return guests.filter((g) => g.name.toLowerCase().includes(q))
  }, [guests, query])

  const stats = useMemo(
    () => ({
      total: guests.length,
      shared: guests.filter((g) => g.sharedAt).length,
      opened: guests.filter((g) => g.openedAt).length,
    }),
    [guests],
  )

  if (!wedding) {
    return (
      <Card className="text-center">
        <p className="text-ink-soft">Belum ada undangan. Pilih template dulu.</p>
      </Card>
    )
  }

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    setSubmitting(true)
    try {
      const guest = await guestApi.add(wedding.id, {
        name: newName.trim(),
        phone: newPhone.trim() || undefined,
      })
      setGuests((prev) => [guest, ...prev])
      setNewName('')
      setNewPhone('')
      setAdding(false)
      toast.success('Tamu ditambahkan')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Gagal tambah')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopyLink = async (g: WeddingGuest) => {
    const url = buildInviteUrl(wedding.slug, g.inviteToken, g.name)
    await navigator.clipboard.writeText(url)
    toast.success('Link tersalin')
  }

  const handleSendWa = async (g: WeddingGuest) => {
    const url = buildInviteUrl(wedding.slug, g.inviteToken, g.name)
    const message = encodeURIComponent(
      `Assalamu'alaikum, ${g.name}.\n\nDengan hormat kami mengundang Anda ke pernikahan kami.\n\nLink undangan:\n${url}\n\nTerima kasih.`,
    )
    const num = phoneToWaNumber(g.phone)
    const waUrl = num ? `https://wa.me/${num}?text=${message}` : `https://wa.me/?text=${message}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')

    // Mark as shared
    try {
      const updated = await guestApi.update(wedding.id, g.id, { markShared: true })
      setGuests((prev) => prev.map((x) => (x.id === g.id ? updated : x)))
    } catch {
      // silent fail
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await guestApi.remove(wedding.id, confirmDelete.id)
      setGuests((prev) => prev.filter((g) => g.id !== confirmDelete.id))
      toast.success('Tamu dihapus')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Gagal hapus')
    } finally {
      setConfirmDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Buku Tamu</p>
          <h1 className="section-title mt-2">Kelola Daftar Tamu</h1>
        </div>
        <Button leftIcon={<Plus size={14} />} onClick={() => setAdding(true)}>
          Tambah Tamu
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Tamu" value={stats.total} />
        <StatCard label="Sudah Dikirim" value={stats.shared} tone="bg-info text-cream" />
        <StatCard label="Sudah Dibuka" value={stats.opened} tone="bg-success text-cream" />
      </div>

      {/* Search */}
      <Card padded={false} className="p-2">
        <Input
          placeholder="Cari nama tamu..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-0 shadow-none focus:ring-0"
        />
      </Card>

      {/* Table */}
      {loading ? (
        <Card className="animate-pulse h-32" />
      ) : filtered.length === 0 ? (
        <Card className="text-center py-10">
          <p className="text-ink-soft">
            {query ? 'Tidak ada tamu yang cocok.' : 'Belum ada tamu. Klik "Tambah Tamu" untuk mulai.'}
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((g) => (
            <Card key={g.id}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-display font-bold text-lg truncate">{g.name}</h4>
                  {g.phone && <p className="text-sm text-ink-soft mt-0.5">{g.phone}</p>}
                </div>
                {g.openedAt ? (
                  <Badge tone="success">Buka</Badge>
                ) : g.sharedAt ? (
                  <Badge tone="info">Terkirim</Badge>
                ) : (
                  <Badge tone="warning">Belum</Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<Copy size={12} />}
                  onClick={() => handleCopyLink(g)}
                >
                  Link
                </Button>
                <Button
                  size="sm"
                  variant="success"
                  leftIcon={<Send size={12} />}
                  onClick={() => handleSendWa(g)}
                >
                  Kirim WA
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  leftIcon={<Trash2 size={12} />}
                  onClick={() => setConfirmDelete(g)}
                >
                  Hapus
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Tambah Tamu Baru"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAdding(false)}>
              Batal
            </Button>
            <Button
              type="submit"
              form="add-guest-form"
              loading={submitting}
              leftIcon={<Check size={14} />}
            >
              Simpan
            </Button>
          </>
        }
      >
        <form id="add-guest-form" onSubmit={handleAdd} className="space-y-3">
          <Input
            label="Nama Lengkap"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
            placeholder="Bapak Andi Wijaya"
            autoFocus
          />
          <Input
            type="tel"
            label="Nomor WhatsApp (opsional)"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            placeholder="081234567890"
            hint="Format Indonesia atau internasional (+62...) keduanya bisa."
          />
        </form>
      </Modal>

      {/* Confirm delete */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Hapus Tamu?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" leftIcon={<X size={14} />} onClick={() => setConfirmDelete(null)}>
              Batal
            </Button>
            <Button variant="danger" leftIcon={<Trash2 size={14} />} onClick={handleDelete}>
              Ya, Hapus
            </Button>
          </>
        }
      >
        <p className="text-ink-soft">
          Anda akan menghapus <strong className="text-ink">{confirmDelete?.name}</strong>. Tidak bisa di-undo.
        </p>
      </Modal>
    </div>
  )
}

const StatCard = ({
  label,
  value,
  tone = 'bg-cream-deep text-ink',
}: {
  label: string
  value: number
  tone?: string
}) => (
  <Card>
    <div className={`w-10 h-10 rounded-lg border-2 border-ink flex items-center justify-center font-bold shadow-brutal-sm ${tone}`}>
      {value}
    </div>
    <p className="mt-3 text-xs font-bold uppercase tracking-widest text-ink-soft">{label}</p>
  </Card>
)
