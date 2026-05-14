import { Eye, RefreshCw, Search } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import { ApiError } from '../../api/client'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'
import type { Wedding, WeddingStatus } from '../../types'

const STATUS_FILTERS: { value: WeddingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'draft', label: 'Draft' },
  { value: 'on_progress', label: 'On Progress' },
  { value: 'in_review', label: 'Butuh Review' },
  { value: 'final_draft', label: 'Final Draft' },
  { value: 'published', label: 'Published' },
]

export const AdminDashboardPage = () => {
  const [params, setParams] = useSearchParams()
  const initialStatus = (params.get('status') as WeddingStatus | null) ?? 'all'
  const [statusFilter, setStatusFilter] = useState<WeddingStatus | 'all'>(initialStatus)
  const [search, setSearch] = useState(params.get('search') ?? '')
  const [items, setItems] = useState<Wedding[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminApi.list({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search.trim() || undefined,
      })
      setItems(res.items)
      setTotal(res.total)
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Gagal load')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search, toast])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    const next = new URLSearchParams()
    if (statusFilter !== 'all') next.set('status', statusFilter)
    if (search.trim()) next.set('search', search.trim())
    setParams(next, { replace: true })
  }, [statusFilter, search, setParams])

  const stats = useMemo(() => {
    return {
      total,
      inReview: items.filter((i) => i.status === 'in_review').length,
      published: items.filter((i) => i.status === 'published').length,
    }
  }, [items, total])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1 className="section-title mt-2">Wedding Submissions</h1>
          <p className="text-ink-soft mt-1">Total {total} wedding di-track.</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<RefreshCw size={14} />}
          onClick={() => load()}
        >
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Butuh Review" value={stats.inReview} tone="bg-info text-cream" />
        <StatCard label="Published" value={stats.published} tone="bg-success text-cream" />
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={[
                'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border-2 border-ink transition-colors',
                statusFilter === f.value
                  ? 'bg-accent-warm text-ink'
                  : 'bg-cream-soft hover:bg-cream-deep',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <Input
            placeholder="Cari nama couple / slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <Card className="animate-pulse h-48" />
      ) : items.length === 0 ? (
        <Card className="text-center py-10">
          <Search size={32} className="mx-auto text-ink-soft mb-3" />
          <p className="text-ink-soft">Tidak ada wedding yang cocok.</p>
        </Card>
      ) : (
        <Card padded={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream-soft border-b-2 border-ink">
                <tr className="text-left">
                  <Th>Couple</Th>
                  <Th>Slug</Th>
                  <Th>Template</Th>
                  <Th>Status</Th>
                  <Th>Submitted</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {items.map((w) => (
                  <tr key={w.id} className="border-b border-cream-deep hover:bg-cream-soft/60">
                    <Td>
                      <div className="font-semibold">{w.ownerName ?? '-'}</div>
                      <div className="text-xs text-ink-soft">{w.ownerEmail}</div>
                    </Td>
                    <Td>
                      <span className="font-mono text-xs">/{w.slug}</span>
                    </Td>
                    <Td>
                      <span className="text-xs">{w.templateSlug ?? w.templateId}</span>
                    </Td>
                    <Td>
                      <Badge tone={w.status}>{w.status.replace('_', ' ')}</Badge>
                    </Td>
                    <Td>
                      <span className="text-xs text-ink-soft">
                        {new Date(w.updatedAt).toLocaleString('id-ID')}
                      </span>
                    </Td>
                    <Td>
                      <Link to={`/admin/couple/${w.id}`}>
                        <Button size="sm" leftIcon={<Eye size={12} />}>
                          Review
                        </Button>
                      </Link>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-3 text-xs font-bold uppercase tracking-widest text-ink-soft">{children}</th>
)

const Td = ({ children }: { children: React.ReactNode }) => (
  <td className="px-4 py-3 align-middle">{children}</td>
)

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
    <div
      className={`w-12 h-12 rounded-lg border-2 border-ink flex items-center justify-center font-display font-extrabold text-xl shadow-brutal-sm ${tone}`}
    >
      {value}
    </div>
    <p className="mt-3 text-xs font-bold uppercase tracking-widest text-ink-soft">{label}</p>
  </Card>
)
