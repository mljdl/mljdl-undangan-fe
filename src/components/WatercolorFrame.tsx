/**
 * WatercolorFrame — floral frame STATIS hand-crafted (Claude design), meniru
 * vibe referensi "pink gypsophila watercolor": semburan cat air pink lembut +
 * baby's breath (gypsophila) + bunga kecil + daun, di 4 pojok, SIMETRIS.
 *
 * Dibangun penuh sebagai SVG (tanpa raster/upload):
 *  - blob wash pink di-blur -> kesan cat air lembut
 *  - 1 cluster pojok di-mirror ke 4 pojok (scaleX/Y) -> simetris sempurna
 *  - fixed + z-index -1 -> diam saat scroll, di bawah konten, di atas washes
 *
 * Warna mengikuti palet template (cream/peach/rose) supaya blend, ga membias.
 */
export const WatercolorFrame = () => {
  return (
    <div className="watercolor-frame" aria-hidden="true">
      <svg className="wcf-defs" width="0" height="0">
        <defs>
          <filter id="wcf-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="wcf-soft-sm" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>

          {/* ── 1 cluster pojok (orientasi top-left), nanti di-mirror ── */}
          <g id="wcf-cluster">
            {/* Watercolor washes (pink lembut, blur) */}
            <path
              d="M-10 -10 C 60 -20 130 10 150 70 C 165 120 120 150 70 150 C 20 150 -30 110 -20 50 C -16 22 -25 0 -10 -10 Z"
              fill="#f4b8c6"
              opacity="0.30"
              filter="url(#wcf-soft)"
            />
            <path
              d="M40 90 C 90 80 150 95 175 140 C 195 180 165 215 120 210 C 80 206 50 175 48 135 C 47 112 30 100 40 90 Z"
              fill="#f7c9d4"
              opacity="0.26"
              filter="url(#wcf-soft)"
            />
            <path
              d="M-10 120 C 35 110 70 140 70 180 C 70 215 40 235 8 225 C -20 216 -28 180 -18 150 C -14 138 -20 128 -10 120 Z"
              fill="#f2aebe"
              opacity="0.22"
              filter="url(#wcf-soft)"
            />
            {/* speckle splatter */}
            <g fill="#e89aab" opacity="0.5">
              <circle cx="120" cy="60" r="2.4" />
              <circle cx="138" cy="78" r="1.6" />
              <circle cx="150" cy="118" r="2" />
              <circle cx="30" cy="150" r="1.8" />
              <circle cx="58" cy="172" r="1.4" />
            </g>

            {/* Baby's breath sprig 1 — melengkung ke kanan (sepanjang tepi atas) */}
            <g
              stroke="#c9b48f"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
              opacity="0.95"
            >
              <path d="M18 30 C 70 26 130 30 196 22" />
              <path d="M62 28 C 70 16 78 12 84 6" />
              <path d="M96 29 C 104 18 112 14 120 9" />
              <path d="M138 27 C 146 16 154 12 162 8" />
              <path d="M40 29 C 44 20 50 16 56 12" />
            </g>
            {/* gypsophila berries (krem) */}
            <g>
              {[
                [84, 4],
                [120, 7],
                [162, 6],
                [56, 10],
                [102, 6],
                [142, 5],
                [74, 14],
                [180, 16],
                [196, 20],
              ].map(([cx, cy], i) => (
                <g key={i}>
                  <circle cx={cx} cy={cy} r="5.4" fill="#f6efe4" stroke="#e7d9c4" strokeWidth="0.8" />
                  <circle cx={cx} cy={cy} r="1.5" fill="#d8c4a6" />
                </g>
              ))}
            </g>

            {/* Bunga kecil 5 kelopak di dekat pojok */}
            <g transform="translate(30 64)">
              <g fill="#f9d6dd" stroke="#e8b9c4" strokeWidth="0.7">
                <ellipse cx="0" cy="-13" rx="7" ry="11" />
                <ellipse cx="12" cy="-4" rx="7" ry="11" transform="rotate(72 12 -4)" />
                <ellipse cx="8" cy="11" rx="7" ry="11" transform="rotate(144 8 11)" />
                <ellipse cx="-8" cy="11" rx="7" ry="11" transform="rotate(216 -8 11)" />
                <ellipse cx="-12" cy="-4" rx="7" ry="11" transform="rotate(288 -12 -4)" />
              </g>
              <circle cx="0" cy="0" r="5" fill="#f0c073" />
              <circle cx="0" cy="0" r="5" fill="none" stroke="#e0a850" strokeWidth="0.6" />
            </g>

            {/* Kuncup + tangkai turun (rose-dust) */}
            <g stroke="#9bbf8f" strokeWidth="2" fill="none" strokeLinecap="round">
              <path d="M150 150 C 158 175 156 200 150 224" />
              <path d="M150 186 C 160 182 168 186 172 196" />
              <path d="M150 204 C 140 200 132 204 128 214" />
            </g>
            <g transform="translate(150 232)">
              <path
                d="M0 -14 C 7 -12 9 -4 7 4 C 5 11 -5 11 -7 4 C -9 -4 -7 -12 0 -14 Z"
                fill="#e8b3a0"
                stroke="#c97862"
                strokeWidth="0.8"
              />
              <path d="M-6 2 C -3 6 3 6 6 2" fill="none" stroke="#c97862" strokeWidth="0.7" />
            </g>

            {/* Daun-daun */}
            <g fill="#9bbf8f" stroke="#7da06f" strokeWidth="0.6" opacity="0.95">
              <path d="M52 44 C 64 40 78 48 84 62 C 72 64 58 58 52 44 Z" />
              <path d="M16 96 C 24 84 40 80 52 86 C 44 100 28 104 16 96 Z" />
              <path d="M120 96 C 132 90 148 94 156 106 C 144 114 128 110 120 96 Z" />
            </g>
          </g>
        </defs>
      </svg>

      {/* 4 pojok — cluster sama, di-mirror untuk simetri sempurna */}
      <svg className="wcf-corner wcf-tl" viewBox="0 0 240 240">
        <use href="#wcf-cluster" />
      </svg>
      <svg className="wcf-corner wcf-tr" viewBox="0 0 240 240">
        <use href="#wcf-cluster" />
      </svg>
      <svg className="wcf-corner wcf-bl" viewBox="0 0 240 240">
        <use href="#wcf-cluster" />
      </svg>
      <svg className="wcf-corner wcf-br" viewBox="0 0 240 240">
        <use href="#wcf-cluster" />
      </svg>
    </div>
  )
}
