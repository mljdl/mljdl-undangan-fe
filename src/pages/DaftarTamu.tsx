import { Copy, Download, Plus, Search, Send, Trash2, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Toast } from '../components/Toast';
import { INITIAL_GUESTS } from '../data/guests';
import type { Guest } from '../types';

const buildInviteUrl = (name: string) => {
  const base = window.location.origin + '/';
  return `${base}?to=${encodeURIComponent(name)}`;
};

const buildWaMessage = (name: string) => {
  const link = buildInviteUrl(name);
  return encodeURIComponent(
    `Assalamu'alaikum, ${name}.\n\nDengan hormat, kami mengundang Anda ke acara pernikahan Rizki & Fadia pada Sabtu, 13 Juni 2026.\n\nLink undangan: ${link}\n\nTerima kasih.`
  );
};

const phoneToWaNumber = (phone?: string) => {
  if (!phone) return '';
  const trimmed = phone.replace(/[^\d+]/g, '');
  if (trimmed.startsWith('+')) return trimmed.slice(1);
  if (trimmed.startsWith('0')) return '62' + trimmed.slice(1);
  return trimmed;
};

export const DaftarTamuPage = () => {
  const [guests, setGuests] = useState<Guest[]>(INITIAL_GUESTS);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<Guest | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter((g) => g.name.toLowerCase().includes(q));
  }, [guests, query]);

  const stats = useMemo(
    () => ({
      total: guests.length,
      shared: guests.filter((g) => g.shared).length,
      pending: guests.filter((g) => !g.shared).length,
    }),
    [guests]
  );

  const handleAdd = () => {
    if (!newName.trim()) return;
    const next: Guest = {
      id: `g-${Date.now()}`,
      name: newName.trim(),
      phone: newPhone.trim() || undefined,
      shared: false,
    };
    setGuests((prev) => [next, ...prev]);
    setNewName('');
    setNewPhone('');
    setShowForm(false);
    setToastMsg('Tamu ditambahkan');
  };

  const handleCopyLink = async (name: string) => {
    await navigator.clipboard.writeText(buildInviteUrl(name));
    setToastMsg('Link tersalin');
  };

  const handleSendWa = (g: Guest) => {
    const num = phoneToWaNumber(g.phone);
    const url = num
      ? `https://wa.me/${num}?text=${buildWaMessage(g.name)}`
      : `https://wa.me/?text=${buildWaMessage(g.name)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setGuests((prev) => prev.map((x) => (x.id === g.id ? { ...x, shared: true } : x)));
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    setGuests((prev) => prev.filter((g) => g.id !== confirmDelete.id));
    setConfirmDelete(null);
    setToastMsg('Tamu dihapus');
  };

  const handleExport = () => {
    const rows = [['Nama', 'No. WhatsApp', 'Status']];
    guests.forEach((g) => rows.push([g.name, g.phone ?? '', g.shared ? 'Terkirim' : 'Belum']));
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daftar-tamu.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-cream text-brown-ink px-4 py-12 md:px-10">
      <header className="text-center max-w-3xl mx-auto mb-10">
        <p className="eyebrow">Daftar Tamu Undangan</p>
        <h1 className="font-display text-4xl md:text-5xl text-brown-deep mt-2">
          Manajemen Undangan
        </h1>
        <p className="font-display text-rose-dust tracking-widest mt-2">Rizki &amp; Fadia</p>
        <p className="font-display text-brown-ink/70 tracking-widest">13 &middot; 06 &middot; 2026</p>

        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-8">
          {[
            { label: 'Total Tamu', value: stats.total },
            { label: 'Sudah Dikirim', value: stats.shared },
            { label: 'Belum Dikirim', value: stats.pending },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-cream/70 border border-gold/30 p-4 shadow-soft-sm"
            >
              <div className="font-display text-3xl text-brown-deep">{s.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-brown-ink/60 mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-ink/50"
            size={16}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama tamu..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gold/40 bg-cream/70 placeholder:text-brown-ink/40 focus:outline-none focus:ring-2 focus:ring-rose-dust/40"
          />
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-gold/40 hover:bg-cream-warm text-sm"
        >
          <Download size={16} />
          Export CSV
        </button>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="btn-gold"
        >
          <Plus size={16} />
          Tambah Tamu
        </button>
      </div>

      {showForm && (
        <div className="max-w-5xl mx-auto mb-8 bg-cream/70 border border-gold/30 rounded-2xl p-5 shadow-soft">
          <h3 className="font-display text-xl text-brown-deep mb-3">Tambah Tamu Baru</h3>
          <div className="grid md:grid-cols-[1fr_1fr_auto_auto] gap-3 items-center">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama tamu (contoh: Bapak Andi Wijaya)"
              className="px-4 py-2.5 rounded-xl border border-gold/40 bg-cream/80 focus:outline-none focus:ring-2 focus:ring-rose-dust/40"
            />
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="No. WhatsApp (opsional)"
              className="px-4 py-2.5 rounded-xl border border-gold/40 bg-cream/80 focus:outline-none focus:ring-2 focus:ring-rose-dust/40"
            />
            <button type="button" onClick={handleAdd} className="btn-gold">
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-full border border-gold/40 text-sm"
            >
              Batal
            </button>
          </div>
          <p className="text-xs text-brown-ink/60 mt-2">
            Format Indonesia (08...) atau internasional (+62...) keduanya bisa.
          </p>
        </div>
      )}

      <main className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((g) => (
          <article
            key={g.id}
            className="bg-cream/70 border border-gold/30 rounded-2xl p-5 shadow-soft-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-display text-lg text-brown-deep">{g.name}</h4>
              {g.shared ? (
                <span className="text-[10px] uppercase tracking-widest text-leaf-green border border-leaf-green/40 rounded-full px-2 py-0.5">
                  Terkirim
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-widest text-rose-dust border border-rose-dust/40 rounded-full px-2 py-0.5">
                  Belum
                </span>
              )}
            </div>
            {g.phone && <p className="text-sm text-brown-ink/70 mt-1">{g.phone}</p>}

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                type="button"
                onClick={() => handleCopyLink(g.name)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-gold/40 hover:bg-cream-warm"
              >
                <Copy size={14} />
                Link
              </button>
              <button
                type="button"
                onClick={() => handleSendWa(g)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-leaf-green/40 text-leaf-green hover:bg-leaf-green/10"
              >
                <Send size={14} />
                Kirim WA
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(g)}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-rose-dust/40 text-rose-dust hover:bg-rose-dust/10"
              >
                <Trash2 size={14} />
                Hapus
              </button>
            </div>
          </article>
        ))}
        {!filtered.length && (
          <p className="col-span-full text-center text-brown-ink/60 py-10">
            Tidak ada tamu yang cocok dengan pencarian.
          </p>
        )}
      </main>

      <footer className="text-center text-xs text-brown-ink/55 mt-12">
        Halaman daftar tamu &middot; Rizki &amp; Fadia Wedding 2026
      </footer>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 bg-brown-ink/40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-cream rounded-3xl border border-gold/40 shadow-soft-lg p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 rounded-full bg-rose-dust/15 text-rose-dust flex items-center justify-center mx-auto mb-3">
              <Trash2 size={20} />
            </div>
            <h3 className="font-display text-2xl text-brown-deep">Hapus Data Tamu?</h3>
            <p className="body-text mt-2 text-sm">
              Data tamu di bawah ini akan dihapus permanen dari daftar.
              <br />
              <span className="font-display text-brown-deep">{confirmDelete.name}</span>
            </p>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 rounded-full border border-gold/40 inline-flex items-center justify-center gap-2"
              >
                <X size={14} />
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 px-4 py-2 rounded-full bg-rose-dust text-cream inline-flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast
        message={toastMsg ?? ''}
        show={!!toastMsg}
        onHide={() => setToastMsg(null)}
      />
    </div>
  );
};
