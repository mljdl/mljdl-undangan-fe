import { FloralDecor } from './FloralDecor'

export const PembukaanSection = () => {
  return (
    <section id="pembukaan" className="wedding-section relative">
      <FloralDecor variant="top" opacity={0.45} floralSet="2424" />
      <div className="wedding-section__inner">
        <div className="reveal">
          <div className="eyebrow">In The Name of Allah</div>
          <div className="font-arabic text-2xl md:text-3xl text-brown-deep mb-6 leading-loose">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>
        <p className="body-text mt-8 reveal reveal--delay-1">
          <em>Assalamu&apos;alaikum Warahmatullahi Wabarakatuh</em>
        </p>
        <p className="body-text mt-4 reveal reveal--delay-2">
          Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta&apos;ala, kami bermaksud mengundang
          Bapak/Ibu/Saudara/i pada acara pernikahan kami.
        </p>
      </div>
    </section>
  );
};
