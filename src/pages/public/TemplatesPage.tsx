import { ArrowRight, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError } from '../../api/client'
import { templateApi } from '../../api/template'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import type { WeddingTemplate } from '../../types'

const UNDGN_FE_URL = import.meta.env.VITE_UNDGN_FE_URL || 'http://localhost:5173'

export const TemplatesPage = () => {
  const [templates, setTemplates] = useState<WeddingTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<WeddingTemplate | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    templateApi
      .list()
      .then((res) => {
        if (cancelled) return
        setTemplates(res.items)
        setError(null)
      })
      .catch((err: ApiError) => {
        if (cancelled) return
        setError(err.message ?? 'Gagal memuat template')
      })
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="eyebrow">Template Gallery</p>
          <h2 className="section-title mt-2">Pilih template kesukaan Anda</h2>
          <p className="text-ink-soft mt-3 max-w-xl mx-auto">
            Klik &quot;Preview Live&quot; untuk lihat animasi penuh, lalu &quot;Pilih Template&quot; untuk lanjut.
          </p>
        </div>

        {loading && (
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
          >
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-cream-deep rounded-lg" />
                <div className="h-5 bg-cream-deep rounded mt-4 w-2/3" />
                <div className="h-3 bg-cream-deep rounded mt-2 w-full" />
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card className="border-error text-center">
            <p className="text-error font-bold">{error}</p>
            <p className="text-ink-soft text-sm mt-2">
              Pastikan backend `mljdl-undangan-core` berjalan di port 3000.
            </p>
          </Card>
        )}

        {!loading && !error && templates.length === 0 && (
          <Card className="text-center">
            <p className="text-ink-soft">Belum ada template aktif. Tunggu dulu ya.</p>
          </Card>
        )}

        {!loading && !error && templates.length > 0 && (
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
          >
            {templates.map((t) => (
              <Card key={t.id} hoverable>
                <TemplateThumbnail template={t} />

                <h3 className="font-display text-xl font-bold">{t.name}</h3>
                {t.description && (
                  <p className="text-sm text-ink-soft mt-1 line-clamp-2">{t.description}</p>
                )}

                <div className="flex items-center justify-between mt-5 gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Eye size={14} />}
                    onClick={() => setPreview(t)}
                  >
                    Preview
                  </Button>
                  <Link to={`/templates/${t.slug}`} className="flex-1">
                    <Button size="sm" fullWidth rightIcon={<ArrowRight size={14} />}>
                      Detail
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={!!preview}
        onClose={() => setPreview(null)}
        title={preview?.name}
        description={preview?.description ?? undefined}
        size="full"
      >
        {preview && (
          <iframe
            src={`${UNDGN_FE_URL}/preview/${preview.slug}`}
            className="w-full h-full border-2 border-ink rounded-lg"
            title={`Preview ${preview.name}`}
          />
        )}
      </Modal>
    </section>
  )
}

/**
 * Thumbnail dengan fallback: kalau image-nya ga ke-load (mis. file thumb belum
 * ada di /public/templates/...), kita render mini live preview iframe (scaled
 * down) sehingga user tetap lihat template aslinya, bukan icon broken-image.
 */
function TemplateThumbnail({ template }: { template: WeddingTemplate }) {
  const [imgFailed, setImgFailed] = useState(false)
  const showImg = template.thumbnailUrl && !imgFailed

  return (
    <div className="aspect-[4/3] bg-cream-deep rounded-lg border-2 border-ink overflow-hidden mb-4 relative">
      {showImg ? (
        <img
          src={`${UNDGN_FE_URL}${template.thumbnailUrl}`}
          alt={template.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      ) : (
        // Live mini-preview via iframe. Scale 0.4 supaya muat full undangan
        // di dalam thumbnail 280×210ish.
        <div className="absolute inset-0 overflow-hidden pointer-events-none bg-cream-warm">
          <iframe
            src={`${UNDGN_FE_URL}/preview/${template.slug}`}
            title={`${template.name} preview`}
            className="border-0"
            style={{
              width: '250%',
              height: '250%',
              transform: 'scale(0.4)',
              transformOrigin: 'top left',
            }}
            scrolling="no"
            tabIndex={-1}
          />
        </div>
      )}
      {template.isPremium && (
        <div className="absolute top-2 right-2">
          <Badge tone="warning">Premium</Badge>
        </div>
      )}
    </div>
  )
}
