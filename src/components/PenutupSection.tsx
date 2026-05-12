export const PenutupSection = () => {
  return (
    <section
      id="penutup"
      className="wedding-section bg-gradient-to-b from-transparent to-cream-warm/60"
    >
      <div className="wedding-section__inner">
        <div className="reveal mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <p className="body-text mt-8 reveal reveal--delay-1">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan
          hadir dan memberikan doa restu kepada kedua mempelai.
        </p>
        <p className="body-text mt-4 reveal reveal--delay-2">
          Atas kehadiran dan doa restu yang diberikan, kami sekeluarga mengucapkan terima kasih.
        </p>

        <div className="my-8 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent reveal reveal--delay-2" />

        <p className="body-text italic reveal reveal--delay-3">
          <em>Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh</em>
        </p>

        <p className="text-sm text-brown-ink/70 mt-6 reveal reveal--delay-3">
          Kami yang berbahagia,
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-brown-deep reveal reveal--delay-3 mt-2">
          Rizki <span className="font-script text-rose-dust">&amp;</span> Fadia
        </h2>
      </div>

      <footer className="text-center text-xs text-brown-ink/55 mt-16">
        Crafted with <span className="text-rose-dust">&#9825;</span> by MLJDL Agency
      </footer>
    </section>
  );
};
