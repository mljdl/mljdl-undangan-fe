import { COUPLE_BRIDE, COUPLE_GROOM } from '../data/wedding';
import type { Person } from '../types';

const CoupleCard = ({ person, delay }: { person: Person; delay: 1 | 2 }) => (
  <div
    className={`reveal reveal--delay-${delay} relative bg-cream/70 backdrop-blur-sm border border-gold/30 rounded-3xl p-8 md:p-10 text-center shadow-soft`}
  >
    <div className="mx-auto mb-5 w-28 h-28 rounded-full bg-cream-warm border border-gold/40 flex items-center justify-center text-3xl font-display text-rose-dust">
      {person.nickName[0]}
    </div>
    <div className="font-display tracking-[0.3em] uppercase text-xs text-rose-dust">
      &mdash; {person.role} &mdash;
    </div>
    <h3 className="font-display text-3xl md:text-4xl text-brown-deep mt-2">{person.fullName}</h3>
    <div className="font-script text-3xl text-terracotta mt-1">&mdash; {person.nickName} &mdash;</div>
    <p className="text-sm text-brown-ink/70 mt-3">{person.birthOrder}</p>
    <div className="font-display tracking-[0.3em] uppercase text-xs text-rose-dust mt-5">
      &mdash; {person.role === 'Mempelai Wanita' ? 'Putri dari' : 'Putra dari'} &mdash;
    </div>
    <p className="body-text mt-2">
      {person.parents.father.deceased && (
        <span className="text-rose-dust italic text-sm">(Alm)&nbsp;</span>
      )}
      {person.parents.father.name}
      <br />
      &amp;
      <br />
      {person.parents.mother.deceased && (
        <span className="text-rose-dust italic text-sm">(Almh)&nbsp;</span>
      )}
      {person.parents.mother.name}
    </p>
  </div>
);

export const MempelaiSection = () => {
  return (
    <section id="mempelai" className="wedding-section">
      <div className="wedding-section__inner max-w-5xl">
        <div className="reveal">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mb-6" />
          <div className="eyebrow">The Bride &amp; The Groom</div>
          <h2 className="section-title">Kami Yang Berbahagia</h2>
        </div>

        <p className="body-text reveal reveal--delay-1 italic max-w-xl mx-auto">
          Maha Suci Allah yang telah mempertemukan dua hati,
          <br />
          menjadikannya tenteram dalam <em>mawaddah</em> dan <em>rahmah</em>.
        </p>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-12 items-stretch">
          <CoupleCard person={COUPLE_BRIDE} delay={1} />
          <CoupleCard person={COUPLE_GROOM} delay={2} />
        </div>
      </div>
    </section>
  );
};
