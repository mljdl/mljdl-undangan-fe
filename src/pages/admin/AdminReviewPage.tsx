import { ArrowLeft, Check, ExternalLink, Send, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import { ApiError } from '../../api/client'
import { rsvpApi } from '../../api/rsvp'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { Textarea } from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'
import type { Wedding, WeddingRsvp } from '../../types'

const UNDGN_FE_URL = import.meta.env.VITE_UNDGN_FE_URL || 'http://localhost:5173'

export const AdminReviewPage = () => {
  const { id } = useParams<{ id: string }>()
  const [wedding, setWedding] = useState<Wedding | null>(null)
  const [rsvp, setRsvp] = useState<WeddingRsvp[]>([])
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectComment, setRejectComment] = useState('')
  const toast = useToast()

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const [w, r] = await Promise.all([
        adminApi.detail(id),
        adminApi.listRsvp(id).catch(() => ({ items: [] })),
      ])
      setWedding(w)
      setRsvp(r.items)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Gagal load')
    } finally {
      setLoading(false)
    }
  }, [id, toast])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) return <Card className="animate-pulse h-96" />

  if (!wedding) {
    return (
      <Card>
        <p className="text-ink-soft">Wedding tidak ditemukan.</p>
        <Link to="/admin/dashboard" className="inline-block mt-3">
          <Button variant="secondary" size="sm" leftIcon={<ArrowLeft size={14} />}>
            Kembali ke dashboard
          </Button>
        </Link>
      </Card>
    )
  }

  const handleApprove = async (publish: boolean) => {
    setWorking(true)
    try {
      const updated = await adminApi.approve(wedding.id, {
        publish,
        comment: publish ? 'Approved & published.' : 'Approved sebagai final draft.',
      })
      setWedding(updated)
      toast.success(publish ? 'Wedding di-publish' : 'Di-approve sebagai final draft')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Gagal approve')
    } finally {
      setWorking(false)
    }
  }

  const handleReject = async () => {
    if (!rejectComment.trim()) {
      toast.error('Comment wajib diisi untuk reject')
      return
    }
    setWorking(true)
    try {
      const updated = await adminApi.reject(wedding.id, rejectComment.trim())
      setWedding(updated)
      setRejectOpen(false)
      setRejectComment('')
      toast.success('Wedding di-reject. Couple akan dapat notif.')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Gagal reject')
    } finally {
      setWorking(false)
    }
  }

  const handlePublish = async () => {
    setWorking(true)
    try {
      const updated = await adminApi.publish(wedding.id)
      setWedding(updated)
      toast.success('Wedding live!')
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Gagal publish')
    } finally {
      setWorking(false)
    }
  }

  const previewUrl = `${UNDGN_FE_URL}/preview/${wedding.templateSlug ?? 'floral-watercolor'}?wid=${wedding.id}`
  const publicUrl =
    wedding.status === 'published' ? `${UNDGN_FE_URL}/${wedding.slug}` : null

  return (
    <div className="space-y-4">
      <Link to="/admin/dashboard" className="inline-flex items-center gap-1 text-sm text-ink-soft hover:text-ink">
        <ArrowLeft size={14} /> Kembali ke daftar
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Review</p>
          <h1 className="font-display text-3xl font-extrabold text-ink mt-1">
            {wedding.ownerName ?? 'Anonymous'}
          </h1>
          <p className="text-ink-soft mt-1 text-sm">
            <span className="font-mono">/{wedding.slug}</span> &middot; template {wedding.templateSlug}
          </p>
        </div>
        <Badge tone={wedding.status}>{wedding.status.replace('_', ' ')}</Badge>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-4">
        {/* Preview */}
        <Card padded={false} className="p-0 overflow-hidden">
          <div className="px-4 py-2 border-b-2 border-ink bg-cream-soft flex items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-widest">Live Preview</span>
            {publicUrl && (
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="ghost" rightIcon={<ExternalLink size={12} />}>
                  Public URL
                </Button>
              </a>
            )}
          </div>
          <iframe src={previewUrl} title="Preview" className="w-full h-[640px] border-0" />
        </Card>

        {/* Actions + meta */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-display text-lg font-bold mb-3">Action</h3>
            <div className="space-y-2">
              {wedding.status === 'in_review' && (
                <>
                  <Button
                    fullWidth
                    variant="success"
                    leftIcon={<Check size={14} />}
                    loading={working}
                    onClick={() => handleApprove(false)}
                  >
                    Approve (Final Draft)
                  </Button>
                  <Button
                    fullWidth
                    leftIcon={<Send size={14} />}
                    loading={working}
                    onClick={() => handleApprove(true)}
                  >
                    Approve &amp; Publish
                  </Button>
                  <Button
                    fullWidth
                    variant="danger"
                    leftIcon={<X size={14} />}
                    onClick={() => setRejectOpen(true)}
                  >
                    Reject dengan Komen
                  </Button>
                </>
              )}

              {wedding.status === 'final_draft' && (
                <Button
                  fullWidth
                  leftIcon={<Send size={14} />}
                  loading={working}
                  onClick={handlePublish}
                >
                  Publish Sekarang
                </Button>
              )}

              {wedding.status === 'published' && (
                <p className="text-sm text-success font-medium">Sudah live. Tamu bisa akses.</p>
              )}

              {(wedding.status === 'draft' || wedding.status === 'on_progress') && (
                <p className="text-sm text-ink-soft">
                  Wedding belum di-submit oleh couple. Tidak ada action.
                </p>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="font-display text-lg font-bold mb-3">RSVP Masuk</h3>
            {rsvp.length === 0 ? (
              <p className="text-sm text-ink-soft">Belum ada RSVP.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-auto">
                {rsvp.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-lg border-2 border-ink bg-cream-soft"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{r.name}</span>
                      <Badge
                        tone={
                          r.attend === 'hadir' ? 'success' : r.attend === 'ragu' ? 'warning' : 'error'
                        }
                      >
                        {r.attend}
                      </Badge>
                    </div>
                    {r.message && (
                      <p className="text-xs text-ink-soft mt-1 italic line-clamp-2">{r.message}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h3 className="font-display text-lg font-bold mb-3">Meta</h3>
            <dl className="text-sm space-y-1.5">
              <Row label="Owner" value={wedding.ownerName} />
              <Row label="Email" value={wedding.ownerEmail} />
              <Row label="Template" value={wedding.templateSlug} />
              <Row label="Created" value={new Date(wedding.createdAt).toLocaleString('id-ID')} />
              <Row label="Updated" value={new Date(wedding.updatedAt).toLocaleString('id-ID')} />
              {wedding.publishedAt && (
                <Row label="Published" value={new Date(wedding.publishedAt).toLocaleString('id-ID')} />
              )}
            </dl>
          </Card>
        </div>
      </div>

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject Submission"
        description="Berikan komen agar couple tahu apa yang harus diperbaiki."
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejectOpen(false)}>
              Batal
            </Button>
            <Button variant="danger" loading={working} onClick={handleReject}>
              Reject
            </Button>
          </>
        }
      >
        <Textarea
          label="Komen (wajib)"
          rows={5}
          value={rejectComment}
          onChange={(e) => setRejectComment(e.target.value)}
          placeholder="Contoh: Foto couple kurang resolusi tinggi. Mohon di-upload ulang."
        />
      </Modal>
    </div>
  )
}

const Row = ({ label, value }: { label: string; value: string | null | undefined }) => (
  <div className="flex justify-between gap-2 text-sm">
    <dt className="text-ink-soft">{label}</dt>
    <dd className="font-medium text-ink truncate max-w-[60%]" title={value ?? ''}>
      {value ?? '-'}
    </dd>
  </div>
)
