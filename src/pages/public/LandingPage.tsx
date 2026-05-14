import { ArrowRight, Check, Heart, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

const FEATURES = [
  {
    icon: <Sparkles size={20} />,
    title: 'Template Eksklusif',
    desc: 'Desain hand-crafted oleh MLJDL Agency. Setiap template unik dan elegan.',
  },
  {
    icon: <Users size={20} />,
    title: 'Buku Tamu Pintar',
    desc: 'Generate link personalisasi per tamu, kirim langsung via WhatsApp, tracking status.',
  },
  {
    icon: <Heart size={20} />,
    title: 'Review oleh Tim',
    desc: 'Tim MLJDL review konten sebelum publish. Kualitas terjaga.',
  },
]

const STEPS = [
  { num: '01', title: 'Pilih Template', desc: 'Browse galeri template di /templates.' },
  { num: '02', title: 'Isi Konten', desc: 'Form wizard untuk data couple, event, foto, rekening.' },
  { num: '03', title: 'Review', desc: 'Tim MLJDL cek dan polish konten Anda.' },
  { num: '04', title: 'Publish', desc: 'Undangan siap dibagikan ke tamu via WhatsApp.' },
]

export const LandingPage = () => (
  <>
    {/* Hero */}
    <section className="px-6 py-16 md:py-24">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-soft border-2 border-ink shadow-brutal-sm mb-6">
          <Sparkles size={14} className="text-accent-deep" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Wedding Invitation Platform
          </span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-extrabold text-ink leading-tight">
          Undangan digital yang
          <br />
          <span className="bg-accent text-cream px-3 inline-block transform -rotate-1 border-2 border-ink shadow-brutal">
            elegan &amp; mudah
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-ink-soft max-w-2xl mx-auto">
          Bikin undangan pernikahan digital dengan template eksklusif MLJDL.
          Isi konten sendiri lewat CMS, review oleh tim kami, langsung publish.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/templates">
            <Button size="lg" rightIcon={<ArrowRight size={16} />}>
              Lihat Template
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary" size="lg">
              Daftar Gratis
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="eyebrow">Kenapa MLJDL Undangan</p>
          <h2 className="section-title mt-2">Fitur yang bikin gampang</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <Card key={f.title} hoverable>
              <div className="w-12 h-12 rounded-lg bg-accent text-cream border-2 border-ink flex items-center justify-center shadow-brutal-sm mb-4">
                {f.icon}
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-ink-soft">{f.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Flow */}
    <section className="px-6 py-16 bg-cream-soft border-y-2 border-ink">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="eyebrow">Cara Kerja</p>
          <h2 className="section-title mt-2">Empat langkah saja</h2>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          {STEPS.map((s) => (
            <Card key={s.num}>
              <div className="font-display text-4xl font-extrabold text-accent-deep">{s.num}</div>
              <h3 className="font-display text-lg font-bold mt-2">{s.title}</h3>
              <p className="text-sm text-ink-soft mt-1">{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="px-6 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="section-title">Mulai bikin undangan sekarang</h2>
        <p className="text-ink-soft mt-3">
          Gratis untuk mulai. Lihat template dulu, baru daftar kalau cocok.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Link to="/templates">
            <Button size="lg" leftIcon={<Sparkles size={16} />}>
              Browse Template
            </Button>
          </Link>
          <div className="text-sm text-ink-soft flex items-center gap-2">
            <Check size={14} className="text-success" />
            Tanpa kartu kredit
          </div>
        </div>
      </div>
    </section>
  </>
)
