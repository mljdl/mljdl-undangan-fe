import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { templateApi } from '../../api/template'
import { weddingApi } from '../../api/wedding'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useToast } from '../../components/ui/Toast'
import { useAuth } from '../../hooks/useAuth'
import type { WeddingTemplate } from '../../types'

const UNDGN_FE_URL = import.meta.env.VITE_UNDGN_FE_URL || 'http://localhost:5173'

export const TemplateDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [template, setTemplate] = useState<WeddingTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [picking, setPicking] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    templateApi
      .detail(slug)
      .then(setTemplate)
      .catch((err: ApiError) => toast.error(err.message ?? 'Template tidak ditemukan'))
      .finally(() => setLoading(false))
  }, [slug, toast])

  const handlePick = async () => {
    if (!template) return
    if (!isAuthenticated) {
      navigate('/login', { state: { redirectTo: `/templates/${template.slug}` } })
      return
    }
    setPicking(true)
    try {
      const wedding = await weddingApi.create({ templateId: template.id })
      toast.success(`Wedding draft dibuat: ${wedding.slug}`)
      navigate('/cms/dashboard')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Gagal pilih template'
      toast.error(msg)
    } finally {
      setPicking(false)
    }
  }

  if (loading) {
    return (
      <div className="px-6 py-16 max-w-5xl mx-auto">
        <Card className="animate-pulse h-96" />
      </div>
    )
  }

  if (!template) {
    return (
      <div className="px-6 py-16 max-w-5xl mx-auto">
        <Card className="text-center">
          <p className="text-ink-soft">Template tidak ditemukan.</p>
          <Link to="/templates" className="inline-block mt-4">
            <Button variant="secondary" leftIcon={<ArrowLeft size={14} />}>
              Kembali ke gallery
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <Link to="/templates" className="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink mb-6">
          <ArrowLeft size={14} />
          Kembali ke semua template
        </Link>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* Preview iframe */}
          <div className="brutal-card overflow-hidden p-0">
            <iframe
              src={`${UNDGN_FE_URL}/preview/${template.slug}`}
              className="w-full h-[600px] border-0"
              title={`Preview ${template.name}`}
            />
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <p className="eyebrow">Template</p>
              <h1 className="font-display text-4xl font-extrabold text-ink mt-2">{template.name}</h1>
              {template.description && (
                <p className="text-ink-soft mt-3">{template.description}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {template.isPremium ? (
                <Badge tone="warning">Premium</Badge>
              ) : (
                <Badge tone="success">Free</Badge>
              )}
              {template.configSchema?.allowAudio && <Badge tone="info">Audio</Badge>}
              {template.configSchema?.allowCustomColors?.length ? (
                <Badge tone="info">Custom Colors</Badge>
              ) : null}
            </div>

            <Card>
              <h3 className="font-display font-bold text-lg mb-3">Section yang didukung</h3>
              <ul className="grid grid-cols-2 gap-1.5">
                {(template.configSchema?.supportedSections ?? []).map((s) => (
                  <li key={s} className="flex items-center gap-1.5 text-sm text-ink-soft capitalize">
                    <Check size={14} className="text-success flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </Card>

            <Button
              fullWidth
              size="lg"
              loading={picking}
              leftIcon={<Sparkles size={16} />}
              onClick={handlePick}
            >
              Pilih Template Ini
            </Button>
            {!isAuthenticated && (
              <p className="text-xs text-ink-soft text-center">
                Anda akan diarahkan ke halaman login dulu.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
