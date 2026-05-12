import { Heart, Sparkles } from 'lucide-react';
import { EVENTS } from '../data/wedding';
import type { EventDetail } from '../types';

const ICONS = [Heart, Sparkles];

const EventCard = ({ event, idx }: { event: EventDetail; idx: number }) => {
  const Icon = ICONS[idx] ?? Heart;
  return (
    <div
      className={`reveal reveal--delay-${(idx + 1) as 1 | 2} bg-cream/70 backdrop-blur-sm border border-gold/30 rounded-3xl px-6 py-8 md:px-10 md:py-10 text-center shadow-soft`}
    >
      <Icon className="mx-auto text-rose-dust" size={32} strokeWidth={1.4} />
      <h3 className="font-display text-2xl md:text-3xl text-brown-deep mt-3">{event.type}</h3>
      <div className="mx-auto my-4 h-px w-16 bg-gold/60" />
      <p className="text-sm tracking-wide uppercase text-brown-ink/70">{event.date}</p>
      <p className="font-display text-2xl text-terracotta mt-2">
        {event.timeStart} &mdash; {event.timeEnd}{' '}
        <span className="text-sm text-brown-ink/55 align-middle">{event.timezone}</span>
      </p>
      <p className="body-text mt-4">
        <span className="font-medium">{event.venue}</span>
        <br />
        {event.address.map((line, i) => (
          <span key={i}>
            {line}
            {i < event.address.length - 1 && <br />}
          </span>
        ))}
      </p>
    </div>
  );
};

export const AcaraSection = () => {
  return (
    <section id="acara" className="wedding-section">
      <div className="wedding-section__inner max-w-4xl">
        <div className="reveal">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mb-6" />
          <div className="eyebrow">The Ceremony</div>
          <h2 className="section-title">Tasyakuran Pernikahan</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-10">
          {EVENTS.map((ev, idx) => (
            <EventCard key={ev.type} event={ev} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
