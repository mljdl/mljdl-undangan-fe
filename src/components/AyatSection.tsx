import { AYAT_AR_RUM } from '../data/scripture';

export const AyatSection = () => {
  return (
    <section id="ayat" className="wedding-section bg-gradient-to-b from-transparent to-cream-warm/40">
      <div className="wedding-section__inner">
        <div className="reveal">
          <div className="eyebrow">{AYAT_AR_RUM.cite}</div>
        </div>

        <div className="reveal reveal--delay-1 mt-6 space-y-6">
          <div className="font-arabic text-2xl md:text-3xl leading-loose text-brown-deep">
            {AYAT_AR_RUM.arabic}
          </div>
          <p className="font-serif italic text-base md:text-lg text-brown-ink/75">
            {AYAT_AR_RUM.translit}
          </p>
          <p className="body-text">{AYAT_AR_RUM.translation}</p>
          <p className="font-display tracking-[0.3em] text-sm uppercase text-rose-dust">
            &mdash; {AYAT_AR_RUM.source} &mdash;
          </p>
        </div>
      </div>
    </section>
  );
};
