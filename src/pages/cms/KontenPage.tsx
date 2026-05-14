import { ChevronLeft, ChevronRight, Save } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ApiError } from '../../api/client'
import { weddingApi } from '../../api/wedding'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input, Textarea } from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'
import { useMyWedding } from '../../hooks/useMyWedding'
import type {
  Wedding,
  WeddingBankAccount,
  WeddingBride,
  WeddingEventData,
} from '../../types'

const STEPS = ['Couple Info', 'Events', 'Bank Accounts', 'Theme & Assets'] as const

const EMPTY_PERSON = (): WeddingBride => ({
  fullName: '',
  nickName: '',
  birthOrder: '',
  parents: { father: { name: '' }, mother: { name: '' } },
})

const EMPTY_EVENT = (): WeddingEventData => ({
  type: 'Akad Nikah',
  date: '',
  timeStart: '',
  timeEnd: '',
  timezone: 'WIB',
  venue: '',
  address: [''],
})

export const KontenPage = () => {
  const { wedding, loading, reload } = useMyWedding()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [bride, setBride] = useState<WeddingBride>(EMPTY_PERSON())
  const [groom, setGroom] = useState<WeddingBride>(EMPTY_PERSON())
  const [events, setEvents] = useState<WeddingEventData[]>([EMPTY_EVENT()])
  const [banks, setBanks] = useState<WeddingBankAccount[]>([
    { bank: '', number: '', holder: '' },
  ])
  const [primaryColor, setPrimaryColor] = useState('#c97862')
  const [hasCoupleAssets, setHasCoupleAssets] = useState(true)
  const toast = useToast()

  useEffect(() => {
    if (!wedding) return
    setBride(wedding.coupleData?.bride ?? EMPTY_PERSON())
    setGroom(wedding.coupleData?.groom ?? EMPTY_PERSON())
    setEvents(wedding.events?.length ? wedding.events : [EMPTY_EVENT()])
    setBanks(wedding.bankAccounts?.length ? wedding.bankAccounts : [{ bank: '', number: '', holder: '' }])
    setPrimaryColor(wedding.theme?.primaryColor ?? '#c97862')
    setHasCoupleAssets(wedding.hasCoupleAssets)
  }, [wedding])

  if (loading || !wedding) {
    return (
      <div className="space-y-4">
        <Card className="animate-pulse h-32" />
      </div>
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const patch: Partial<Wedding> = {
        coupleData: { bride, groom },
        events,
        bankAccounts: banks,
        theme: { primaryColor },
      }
      await weddingApi.update(wedding.id, {
        coupleData: patch.coupleData ?? null,
        events: patch.events ?? null,
        bankAccounts: patch.bankAccounts ?? null,
        theme: patch.theme ?? null,
        hasCoupleAssets,
      })
      toast.success('Konten tersimpan')
      await reload()
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Gagal simpan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Konten Undangan</p>
        <h1 className="section-title mt-2">Isi data wedding Anda</h1>
        <p className="text-ink-soft mt-2">
          Step {step + 1} dari {STEPS.length}: <strong>{STEPS[step]}</strong>
        </p>
      </div>

      {/* Step nav */}
      <div className="flex flex-wrap gap-2">
        {STEPS.map((label, idx) => (
          <button
            key={label}
            type="button"
            onClick={() => setStep(idx)}
            className={[
              'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border-2 border-ink transition-colors',
              idx === step ? 'bg-accent text-cream' : 'bg-cream-soft hover:bg-cream-deep',
            ].join(' ')}
          >
            {idx + 1}. {label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <Card>
        {step === 0 && (
          <div className="space-y-6">
            <PersonForm title="Mempelai Wanita" value={bride} onChange={setBride} />
            <hr className="border-cream-deep" />
            <PersonForm title="Mempelai Pria" value={groom} onChange={setGroom} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            {events.map((ev, idx) => (
              <Card key={idx} className="bg-cream">
                <div className="grid md:grid-cols-2 gap-3">
                  <Input
                    label="Jenis Acara"
                    value={ev.type}
                    onChange={(e) => updateEvent(setEvents, idx, { type: e.target.value })}
                  />
                  <Input
                    label="Tanggal (display)"
                    value={ev.date}
                    placeholder="Sabtu, 13 Juni 2026"
                    onChange={(e) => updateEvent(setEvents, idx, { date: e.target.value })}
                  />
                  <Input
                    label="Jam Mulai"
                    value={ev.timeStart ?? ''}
                    placeholder="08.00"
                    onChange={(e) => updateEvent(setEvents, idx, { timeStart: e.target.value })}
                  />
                  <Input
                    label="Jam Selesai"
                    value={ev.timeEnd ?? ''}
                    placeholder="10.00"
                    onChange={(e) => updateEvent(setEvents, idx, { timeEnd: e.target.value })}
                  />
                  <Input
                    label="Venue"
                    value={ev.venue ?? ''}
                    onChange={(e) => updateEvent(setEvents, idx, { venue: e.target.value })}
                  />
                  <Input
                    label="Timezone"
                    value={ev.timezone ?? 'WIB'}
                    onChange={(e) => updateEvent(setEvents, idx, { timezone: e.target.value })}
                  />
                </div>
                <Textarea
                  label="Alamat (satu baris per line)"
                  rows={3}
                  value={(ev.address ?? []).join('\n')}
                  onChange={(e) =>
                    updateEvent(setEvents, idx, { address: e.target.value.split('\n') })
                  }
                />
              </Card>
            ))}
            <Button
              variant="secondary"
              onClick={() => setEvents([...events, EMPTY_EVENT()])}
            >
              + Tambah Acara
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {banks.map((b, idx) => (
              <div key={idx} className="grid md:grid-cols-3 gap-3">
                <Input
                  label="Bank"
                  value={b.bank}
                  placeholder="BSI / BCA / Mandiri"
                  onChange={(e) => updateBank(setBanks, idx, { bank: e.target.value })}
                />
                <Input
                  label="Nomor Rekening"
                  value={b.number}
                  onChange={(e) => updateBank(setBanks, idx, { number: e.target.value })}
                />
                <Input
                  label="Atas Nama"
                  value={b.holder}
                  onChange={(e) => updateBank(setBanks, idx, { holder: e.target.value })}
                />
              </div>
            ))}
            <Button
              variant="secondary"
              onClick={() => setBanks([...banks, { bank: '', number: '', holder: '' }])}
            >
              + Tambah Rekening
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label className="brutal-label">Warna Primer</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-16 h-12 rounded-lg border-2 border-ink"
                />
                <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} />
              </div>
            </div>

            <Card className="bg-cream">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCoupleAssets}
                  onChange={(e) => setHasCoupleAssets(e.target.checked)}
                  className="mt-1 w-5 h-5 accent-accent"
                />
                <div>
                  <div className="font-bold">Saya akan upload foto sendiri</div>
                  <p className="text-sm text-ink-soft">
                    Uncheck kalau Anda ingin tim MLJDL siapkan foto/asset (charges may apply).
                  </p>
                </div>
              </label>
            </Card>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          leftIcon={<ChevronLeft size={14} />}
          disabled={step === 0}
          onClick={() => setStep(Math.max(0, step - 1))}
        >
          Sebelumnya
        </Button>

        <div className="flex items-center gap-2">
          <Button leftIcon={<Save size={14} />} loading={saving} onClick={handleSave}>
            Simpan
          </Button>
          {step < STEPS.length - 1 && (
            <Button
              variant="secondary"
              rightIcon={<ChevronRight size={14} />}
              onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
            >
              Selanjutnya
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function updateEvent(
  setEvents: React.Dispatch<React.SetStateAction<WeddingEventData[]>>,
  idx: number,
  patch: Partial<WeddingEventData>,
) {
  setEvents((prev) => prev.map((e, i) => (i === idx ? { ...e, ...patch } : e)))
}

function updateBank(
  setBanks: React.Dispatch<React.SetStateAction<WeddingBankAccount[]>>,
  idx: number,
  patch: Partial<WeddingBankAccount>,
) {
  setBanks((prev) => prev.map((e, i) => (i === idx ? { ...e, ...patch } : e)))
}

const PersonForm = ({
  title,
  value,
  onChange,
}: {
  title: string
  value: WeddingBride
  onChange: (next: WeddingBride) => void
}) => (
  <div>
    <h3 className="font-display text-lg font-bold mb-3">{title}</h3>
    <div className="grid md:grid-cols-2 gap-3">
      <Input
        label="Nama Lengkap"
        value={value.fullName}
        onChange={(e) => onChange({ ...value, fullName: e.target.value })}
        placeholder="Mochammad Rizki, S.Pd"
      />
      <Input
        label="Nama Panggilan"
        value={value.nickName}
        onChange={(e) => onChange({ ...value, nickName: e.target.value })}
        placeholder="Rizki"
      />
      <Input
        label="Anak ke"
        value={value.birthOrder ?? ''}
        onChange={(e) => onChange({ ...value, birthOrder: e.target.value })}
        placeholder="Anak ke-3 dari 3 bersaudara"
      />
    </div>
    <div className="grid md:grid-cols-2 gap-3 mt-3">
      <Input
        label="Nama Ayah"
        value={value.parents?.father?.name ?? ''}
        onChange={(e) =>
          onChange({
            ...value,
            parents: {
              ...value.parents,
              father: { ...value.parents?.father, name: e.target.value },
            },
          })
        }
      />
      <Input
        label="Nama Ibu"
        value={value.parents?.mother?.name ?? ''}
        onChange={(e) =>
          onChange({
            ...value,
            parents: {
              ...value.parents,
              mother: { ...value.parents?.mother, name: e.target.value },
            },
          })
        }
      />
    </div>
  </div>
)
