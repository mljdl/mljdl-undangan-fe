import { HADITHS } from '../data/scripture';

export const HadithSection = () => {
  return (
    <section id="hadith" className="wedding-section">
      <div className="wedding-section__inner">
        <div className="reveal">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mb-6" />
          <div className="eyebrow">Sabda Rasulullah &#xFDFA;</div>
          <h2 className="section-title">Pesan Para Cinta</h2>
        </div>

        <div className="space-y-10 mt-8">
          {HADITHS.map((h, idx) => (
            <div
              key={idx}
              className={`reveal ${idx === 0 ? 'reveal--delay-1' : 'reveal--delay-2'}`}
            >
              <div className="font-arabic text-xl md:text-2xl leading-loose text-brown-deep">
                {h.arabic}
              </div>
              <p className="body-text mt-4">{h.translation}</p>
              <p className="font-display tracking-[0.3em] text-xs uppercase text-rose-dust mt-3">
                &mdash; {h.source} &mdash;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
