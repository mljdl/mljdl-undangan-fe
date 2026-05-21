/**
 * WeddingFrame — floral frame STATIS di layer paling bawah (position: fixed,
 * jadi diam saat di-scroll). Dibangun dari SVG ornament library yang sudah ada
 * di template (#orn-floral-a/-b/-c via OrnamentDefs), bukan dari raster upload.
 *
 * Kenapa begini ("pake claude design"):
 *  - SIMETRIS SEMPURNA: pakai 1 ornamen yang sama di 4 pojok, di-mirror
 *    (scaleX/scaleY/scale) -> kiri=kanan, atas=bawah, presisi piksel.
 *  - BLEND 100%: art-style + palet identik dengan ornamen template lain,
 *    jadi tidak "membias" / tidak terlihat tempelan.
 *  - VECTOR: crisp di semua resolusi, ukuran ~0 KB (pakai <use href>).
 *  - z-index -1: DI ATAS body washes, DI BAWAH semua konten + petal yang turun.
 *
 * Kalau user menaruh raster sendiri di /assets/bg-frame.png, .has-backdrop
 * di-set pada .wedding-root dan frame SVG ini otomatis disembunyikan (CSS),
 * digantikan gambar pilihan user.
 */
export const WeddingFrame = () => {
  return (
    <div className="wedding-frame" aria-hidden="true">
      {/* Watercolor wash lembut di tiap pojok supaya tepi layar berasa "berbunga"
          (radial gradient murni CSS, ga butuh asset). */}
      <span className="wf-wash wf-wash-tl" />
      <span className="wf-wash wf-wash-tr" />
      <span className="wf-wash wf-wash-bl" />
      <span className="wf-wash wf-wash-br" />

      {/* Floral cluster simetris di 4 pojok (ornamen sama, di-mirror) */}
      <svg className="wf-corner wf-tl" viewBox="0 0 320 300">
        <use href="#orn-floral-a" />
      </svg>
      <svg className="wf-corner wf-tr" viewBox="0 0 320 300">
        <use href="#orn-floral-a" />
      </svg>
      <svg className="wf-corner wf-bl" viewBox="0 0 320 300">
        <use href="#orn-floral-a" />
      </svg>
      <svg className="wf-corner wf-br" viewBox="0 0 320 300">
        <use href="#orn-floral-a" />
      </svg>
    </div>
  )
}
