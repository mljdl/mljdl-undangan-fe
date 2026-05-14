import {
  ArrowRight,
  ClipboardCheck,
  Edit3,
  Eye,
  FileText,
  Send,
  Sparkles,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { weddingApi } from '../../api/wedding'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { useToast } from '../../components/ui/Toast'
import { useAuth } from '../../hooks/useAuth'
import { useMyWedding } from '../../hooks/useMyWedding'
import type { WeddingStatus } from '../../types'

export const DashboardPage = () => {
  const { user } = useAuth()
  const { wedding, loading, error, reload } = useMyWedding()
  const [submitting, setSubmitting] = useState(false)
  const toast = useToast()

  const handleSubmitReview = async () => {
    if (!wedding) return
    setSubmitting(true)
    try {
      await weddingApi.submitReview(wedding.id)
      toast.success('Undangan dikirim untuk review. Tim MLJDL akan respon segera.')
      await reload()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Gagal submit')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse h-32" />
        <Card className="animate-pulse h-48" />
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-error">
        <h3 className="font-bold text-error">Gagal load data</h3>
        <p className="text-sm text-ink-soft mt-1">{error}</p>
      </Card>
    )
  }

  // Belum punya wedding -> arahkan pilih template
  if (!wedding) {
    return (
      <div className="space-y-6">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="section-title mt-2">Hai, {user?.name?.split(' ')[0] ?? 'Couple'}</h1>
          <p className="text-ink-soft mt-2">Mari mulai bikin undangan pertama Anda.</p>
        </div>

        <Card>
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-accent text-cream border-2 border-ink flex items-center justify-center shadow-brutal mb-4">
              <Sparkles size={24} />
            </div>
            <h2 className="font-display text-2xl font-bold">Belum ada undangan</h2>
            <p className="text-ink-soft mt-2">
              Pilih template kesukaan Anda untuk mulai. Gratis untuk basic template.
            </p>
            <Link to="/templates" className="inline-block mt-6">
              <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                Browse Template
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const canSubmitReview =
    wedding.status === 'draft' || wedding.status === 'on_progress'

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="section-title mt-2">
            Hai, {user?.name?.split(' ')[0] ?? 'Couple'}
          </h1>
          <p className="text-ink-soft mt-1">
            Wedding slug: <span className="font-mono text-ink">/{wedding.slug}</span>
          </p>
        </div>
        <Badge tone={wedding.status as WeddingStatus}>{wedding.status.replace('_', ' ')}</Badge>
      </div>

      {/* Progress overview */}
      <Card>
        <h2 className="font-display text-xl font-bold mb-5">Progress Anda</h2>
        <ProgressBar current={wedding.progressStep} />
      </Card>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <ActionCard
          to="/cms/konten"
          icon={<FileText size={20} />}
          title="Edit Konten"
          desc="Isi data couple, event, foto, rekening"
          accent="bg-accent text-cream"
        />
        <ActionCard
          to="/cms/buku-tamu"
          icon={<Users size={20} />}
          title="Buku Tamu"
          desc="Kelola daftar tamu + kirim link WA"
          accent="bg-info text-cream"
        />
        <ActionCard
          to="/cms/preview"
          icon={<Eye size={20} />}
          title="Preview"
          desc="Lihat hasil real-time"
          accent="bg-cream-deep text-ink"
        />
      </div>

      {/* Submit for review */}
      {canSubmitReview && (
        <Card>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-bold flex items-center gap-2">
                <ClipboardCheck size={20} />
                Siap di-review?
              </h3>
              <p className="text-sm text-ink-soft mt-1">
                Kalau konten sudah lengkap, submit untuk di-review tim MLJDL.
              </p>
            </div>
            <Button
              size="lg"
              leftIcon={<Send size={16} />}
              loading={submitting}
              onClick={handleSubmitReview}
            >
              Submit untuk Review
            </Button>
          </div>
        </Card>
      )}

      {wedding.status === 'in_review' && (
        <Card className="bg-info/10 border-info">
          <div className="flex items-start gap-3">
            <ClipboardCheck size={20} className="text-info flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold">Sedang di-review</h3>
              <p className="text-sm text-ink-soft mt-1">
                Tim MLJDL sedang cek konten Anda. Estimasi 1-2 hari kerja.
              </p>
            </div>
          </div>
        </Card>
      )}

      {wedding.status === 'final_draft' && (
        <Card className="bg-success/10 border-success">
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="text-success flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold">Final draft siap!</h3>
              <p className="text-sm text-ink-soft mt-1">
                Konten Anda sudah di-approve. Tinggal admin yang publish.
              </p>
            </div>
          </div>
        </Card>
      )}

      {wedding.status === 'published' && (
        <Card className="bg-success/10 border-success">
          <div className="flex items-start gap-3">
            <Sparkles size={20} className="text-success flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-bold">Sudah live!</h3>
              <p className="text-sm text-ink-soft mt-1">
                Bagikan link ke tamu via buku tamu.
              </p>
              <Link to="/cms/buku-tamu" className="inline-block mt-3">
                <Button size="sm" leftIcon={<Users size={14} />}>
                  Kelola Buku Tamu
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

const ActionCard = ({
  to,
  icon,
  title,
  desc,
  accent,
}: {
  to: string
  icon: React.ReactNode
  title: string
  desc: string
  accent: string
}) => (
  <Link to={to} className="block">
    <Card hoverable className="h-full">
      <div className={`w-10 h-10 rounded-lg border-2 border-ink flex items-center justify-center shadow-brutal-sm ${accent}`}>
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold mt-4 flex items-center gap-1">
        {title}
        <Edit3 size={14} className="text-ink-soft" />
      </h3>
      <p className="text-sm text-ink-soft mt-1">{desc}</p>
    </Card>
  </Link>
)
