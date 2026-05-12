import { Send } from 'lucide-react';
import { useState } from 'react';
import type { Ucapan } from '../types';

type Attend = 'hadir' | 'ragu' | 'tidak';

const ATTEND_LABEL: Record<Attend, string> = {
  hadir: 'Hadir',
  ragu: 'Ragu-ragu',
  tidak: 'Tidak Hadir',
};

const ATTEND_COLOR: Record<Attend, string> = {
  hadir: 'bg-leaf-green/20 text-leaf-green border-leaf-green/40',
  ragu: 'bg-gold-light/30 text-gold border-gold/40',
  tidak: 'bg-rose-dust/15 text-rose-dust border-rose-dust/40',
};

export const RsvpSection = () => {
  const [name, setName] = useState('');
  const [attend, setAttend] = useState<Attend>('hadir');
  const [count, setCount] = useState(1);
  const [message, setMessage] = useState('');
  const [ucapanList, setUcapanList] = useState<Ucapan[]>([
    {
      id: 'demo-1',
      name: 'Keluarga Besar Pak Hidayat',
      attend: 'hadir',
      count: 4,
      message: 'Selamat menempuh hidup baru, semoga sakinah mawaddah wa rahmah.',
      createdAt: new Date().toISOString(),
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const next: Ucapan = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      attend,
      count,
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };
    setUcapanList((prev) => [next, ...prev]);
    setName('');
    setMessage('');
    setCount(1);
    setAttend('hadir');
  };

  return (
    <section id="rsvp" className="wedding-section">
      <div className="wedding-section__inner max-w-2xl">
        <div className="reveal">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mb-6" />
          <div className="eyebrow">Ucapan &amp; RSVP</div>
          <h2 className="section-title">Doa &amp; Restu</h2>
          <p className="body-text">
            Mohon konfirmasi kehadiran dan kirimkan doa terbaik untuk kami.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="reveal reveal--delay-1 mt-8 space-y-4 text-left bg-cream/70 backdrop-blur-sm border border-gold/30 rounded-3xl p-6 md:p-8 shadow-soft"
        >
          <div>
            <label className="block text-xs uppercase tracking-widest text-brown-ink/60 mb-1">
              Nama
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nama lengkap"
              autoComplete="name"
              className="w-full rounded-xl border border-gold/40 bg-cream/80 px-4 py-2.5 text-brown-ink placeholder:text-brown-ink/40 focus:outline-none focus:ring-2 focus:ring-rose-dust/40"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-brown-ink/60 mb-2">
              Konfirmasi Kehadiran
            </label>
            <div className="flex flex-wrap gap-2">
              {(['hadir', 'ragu', 'tidak'] as Attend[]).map((opt) => (
                <button
                  type="button"
                  key={opt}
                  onClick={() => setAttend(opt)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-widest border transition-all ${
                    attend === opt
                      ? ATTEND_COLOR[opt]
                      : 'border-gold/30 text-brown-ink/60 hover:border-gold/60'
                  }`}
                >
                  {ATTEND_LABEL[opt]}
                </button>
              ))}
            </div>
          </div>

          {attend !== 'tidak' && (
            <div>
              <label className="block text-xs uppercase tracking-widest text-brown-ink/60 mb-1">
                Jumlah Tamu
              </label>
              <select
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full rounded-xl border border-gold/40 bg-cream/80 px-4 py-2.5 text-brown-ink focus:outline-none focus:ring-2 focus:ring-rose-dust/40"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} orang
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-widest text-brown-ink/60 mb-1">
              Ucapan &amp; Doa
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              placeholder="Tulis ucapan dan doa terbaik untuk kami..."
              className="w-full rounded-xl border border-gold/40 bg-cream/80 px-4 py-2.5 text-brown-ink placeholder:text-brown-ink/40 focus:outline-none focus:ring-2 focus:ring-rose-dust/40"
            />
          </div>

          <button type="submit" className="btn-gold w-full justify-center">
            <Send size={16} />
            Kirim
          </button>
        </form>

        <div className="reveal reveal--delay-2 mt-10 space-y-4 text-left" aria-live="polite">
          {ucapanList.map((u) => (
            <div
              key={u.id}
              className="bg-cream/60 border border-gold/20 rounded-2xl px-5 py-4 shadow-soft-sm"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-display text-lg text-brown-deep">{u.name}</span>
                <span
                  className={`text-[10px] uppercase tracking-widest border rounded-full px-3 py-1 ${ATTEND_COLOR[u.attend]}`}
                >
                  {ATTEND_LABEL[u.attend]}
                </span>
              </div>
              {u.message && <p className="body-text mt-2 italic">{u.message}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
