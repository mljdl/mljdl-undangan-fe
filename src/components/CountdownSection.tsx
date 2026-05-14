import { Calendar } from 'lucide-react';
import { WEDDING_DATE_ISO } from '../data/wedding';
import { useCountdown } from '../hooks/useCountdown';
import { FloralDecor } from './FloralDecor';

const Cell = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center bg-cream/70 backdrop-blur-sm border border-gold/30 rounded-2xl px-4 py-5 md:px-6 md:py-6 shadow-soft min-w-[72px] md:min-w-[88px]">
    <span className="font-display text-3xl md:text-5xl text-brown-deep tabular-nums">
      {String(value).padStart(2, '0')}
    </span>
    <span className="font-display tracking-[0.3em] uppercase text-[10px] md:text-xs text-rose-dust mt-1">
      {label}
    </span>
  </div>
);

const buildGoogleCalendarLink = () => {
  const start = '20260613T010000Z'; // 08:00 WIB = 01:00 UTC
  const end = '20260613T080000Z';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: 'Wedding of Rizki & Fadia',
    dates: `${start}/${end}`,
    details: 'Akad Nikah & Resepsi - Kinanti\'s House',
    location: "Kinanti's House, Jl. AUP No. 7, Pasar Minggu, Jakarta Selatan",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const CountdownSection = () => {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE_ISO);

  return (
    <section
      id="countdown"
      className="wedding-section bg-gradient-to-b from-cream-warm/30 via-transparent to-cream-warm/30 relative"
    >
      <FloralDecor variant="top" opacity={0.4} floralSet="1234" />
      <div className="wedding-section__inner">
        <div className="reveal">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mb-6" />
          <div className="eyebrow">Save Our Special Day</div>
          <div className="font-display text-2xl text-rose-dust mt-2">Sabtu</div>
          <div className="font-display text-4xl md:text-5xl text-brown-deep">13 Juni 2026</div>
        </div>

        <div className="flex justify-center gap-3 md:gap-5 mt-10 reveal reveal--delay-1">
          <Cell value={days} label="Hari" />
          <Cell value={hours} label="Jam" />
          <Cell value={minutes} label="Menit" />
          <Cell value={seconds} label="Detik" />
        </div>

        <div className="mt-10 reveal reveal--delay-2">
          <a
            href={buildGoogleCalendarLink()}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-gold"
          >
            <Calendar size={16} />
            Simpan ke Kalender
          </a>
        </div>
      </div>
    </section>
  );
};
