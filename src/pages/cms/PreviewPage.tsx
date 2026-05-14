import { ExternalLink, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useMyWedding } from '../../hooks/useMyWedding'

const UNDGN_FE_URL = import.meta.env.VITE_UNDGN_FE_URL || 'http://localhost:5173'

export const PreviewPage = () => {
  const { wedding, loading } = useMyWedding()
  const [iframeKey, setIframeKey] = useState(0)

  if (loading || !wedding) {
    return <Card className="animate-pulse h-96" />
  }

  const previewUrl = `${UNDGN_FE_URL}/preview/${wedding.templateSlug ?? 'floral-watercolor'}?wid=${wedding.id}`
  const publicUrl =
    wedding.status === 'published' ? `${UNDGN_FE_URL}/${wedding.slug}` : null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Preview</p>
          <h1 className="section-title mt-2">Live Preview</h1>
          <p className="text-ink-soft mt-1">
            Render real-time dari data Anda. Update setelah simpan konten.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={wedding.status}>{wedding.status.replace('_', ' ')}</Badge>
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<RefreshCw size={14} />}
            onClick={() => setIframeKey((k) => k + 1)}
          >
            Reload
          </Button>
          {publicUrl && (
            <a href={publicUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" rightIcon={<ExternalLink size={14} />}>
                Buka Public URL
              </Button>
            </a>
          )}
        </div>
      </div>

      <Card padded={false} className="p-0 overflow-hidden">
        <iframe
          key={iframeKey}
          src={previewUrl}
          title="Wedding preview"
          className="w-full h-[800px] border-0"
        />
      </Card>

      <p className="text-xs text-ink-soft text-center">
        Preview URL: <code className="font-mono">{previewUrl}</code>
      </p>
    </div>
  )
}
