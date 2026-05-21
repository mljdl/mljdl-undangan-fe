/**
 * OrnamentDefs — the hidden inline SVG `<symbol>`/gradient library extracted
 * VERBATIM from the legacy single-file invitation (undangan-rizki-fadia.html,
 * the `<svg width="0" height="0"><defs>…</defs></svg>` block, lines ~2001-2735).
 *
 * Every `<use href="#orn-*">` / `<use href="#bride-silhouette">` etc. across the
 * template resolves against these defs, so this component MUST be rendered once,
 * at the top of FloralWatercolorTemplate, before any consuming section.
 *
 * The markup is injected via dangerouslySetInnerHTML so the raw SVG attributes
 * (stroke-width, stop-color, gradientUnits, href, …) stay byte-identical to the
 * legacy and we don't have to hand-convert ~730 lines of SVG to JSX camelCase.
 */
const ORNAMENT_DEFS_HTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>

    <!-- Reusable sakura petal: base at (0,0), points UP, tip with V-notch -->
    <symbol id="sakura-petal" overflow="visible">
      <path d="M 0 0
               C -3 0 -6.5 -2 -7.5 -7
               C -8 -11.5 -5 -14 -2 -14
               L 0 -10
               L 2 -14
               C 5 -14 8 -11.5 7.5 -7
               C 6.5 -2 3 0 0 0 Z"
            fill="#fef0e3" stroke="#c97862" stroke-width="0.55" stroke-linejoin="round"/>
      <path d="M 0 -2
               C -3 -3 -5 -5 -5.5 -8
               C -6 -11 -4 -12 -2 -12
               L 0 -9.5
               L 2 -12
               C 4 -12 6 -11 5.5 -8
               C 5 -5 3 -3 0 -2 Z"
            fill="#f5d9c4" opacity="0.85"/>
      <ellipse cx="-1.8" cy="-9" rx="1.5" ry="2.5" fill="#fdf6ee" opacity="0.55"/>
    </symbol>

    <!-- Sakura full blossom: 5 petals + center stamens. Use at any (x,y). -->
    <symbol id="sakura-blossom" overflow="visible">
      <use href="#sakura-petal"/>
      <use href="#sakura-petal" transform="rotate(72)"/>
      <use href="#sakura-petal" transform="rotate(144)"/>
      <use href="#sakura-petal" transform="rotate(216)"/>
      <use href="#sakura-petal" transform="rotate(288)"/>
      <!-- Center pink shadow -->
      <circle r="2.6" fill="#e8b095"/>
      <!-- Stamens -->
      <g stroke="#b8915a" stroke-width="0.45" fill="#b8915a" stroke-linecap="round">
        <line x1="0" y1="0" x2="0" y2="-3.6"/>
        <line x1="0" y1="0" x2="3.4" y2="-1.1"/>
        <line x1="0" y1="0" x2="2.1" y2="2.9"/>
        <line x1="0" y1="0" x2="-2.1" y2="2.9"/>
        <line x1="0" y1="0" x2="-3.4" y2="-1.1"/>
        <circle cx="0" cy="-3.6" r="0.7"/>
        <circle cx="3.4" cy="-1.1" r="0.7"/>
        <circle cx="2.1" cy="2.9" r="0.7"/>
        <circle cx="-2.1" cy="2.9" r="0.7"/>
        <circle cx="-3.4" cy="-1.1" r="0.7"/>
      </g>
      <circle r="0.9" fill="#3d1f15"/>
    </symbol>

    <!-- Sakura bud (closed/half-open) -->
    <symbol id="sakura-bud" overflow="visible">
      <ellipse cx="0" cy="-3" rx="3" ry="4.5" fill="#e8b095" stroke="#a85a48" stroke-width="0.5"/>
      <path d="M -2 -1 Q 0 -7 2 -1" fill="none" stroke="#a85a48" stroke-width="0.4" opacity="0.7"/>
      <ellipse cx="0" cy="0" rx="2" ry="1.8" fill="#8a6f5a" opacity="0.7"/>
    </symbol>

    <!-- Eucalyptus leaf: oval with center vein, attaches at left edge -->
    <symbol id="euca-leaf" overflow="visible">
      <ellipse cx="6.5" cy="0" rx="6.2" ry="3.4"
               fill="#c97862" fill-opacity="0.32" stroke="#a85a48" stroke-width="0.7"/>
      <line x1="0.5" y1="0" x2="12.5" y2="0"
            stroke="#6b3a2c" stroke-width="0.35" opacity="0.7"/>
      <ellipse cx="5" cy="-1" rx="3.5" ry="1.8"
               fill="#fdf6ee" opacity="0.18"/>
    </symbol>

    <!-- Smaller eucalyptus leaf -->
    <symbol id="euca-leaf-sm" overflow="visible">
      <ellipse cx="4.5" cy="0" rx="4.2" ry="2.4"
               fill="#c97862" fill-opacity="0.32" stroke="#a85a48" stroke-width="0.6"/>
      <line x1="0.5" y1="0" x2="8.5" y2="0"
            stroke="#6b3a2c" stroke-width="0.3" opacity="0.7"/>
    </symbol>

    <!-- ============================================
         CREAM-PEACH ROSE BLOOM (compact, layered)
         Centered at (0,0). For orbit decoration & accents.
         ============================================ -->
    <symbol id="rose-bloom" overflow="visible">
      <!-- soft glow -->
      <circle r="14" fill="#fef0e3" opacity="0.5"/>
      <!-- 5 outer petals -->
      <g fill="#f5d9c4" stroke="#c97862" stroke-width="0.55" stroke-linejoin="round">
        <path d="M 0 -12 Q -8 -10 -9 -3 Q -5 4 0 3 Q 5 4 9 -3 Q 8 -10 0 -12 Z"/>
        <g transform="rotate(72)"><path d="M 0 -12 Q -8 -10 -9 -3 Q -5 4 0 3 Q 5 4 9 -3 Q 8 -10 0 -12 Z"/></g>
        <g transform="rotate(144)"><path d="M 0 -12 Q -8 -10 -9 -3 Q -5 4 0 3 Q 5 4 9 -3 Q 8 -10 0 -12 Z"/></g>
        <g transform="rotate(216)"><path d="M 0 -12 Q -8 -10 -9 -3 Q -5 4 0 3 Q 5 4 9 -3 Q 8 -10 0 -12 Z"/></g>
        <g transform="rotate(288)"><path d="M 0 -12 Q -8 -10 -9 -3 Q -5 4 0 3 Q 5 4 9 -3 Q 8 -10 0 -12 Z"/></g>
      </g>
      <!-- mid petal layer -->
      <g fill="#e8b095" fill-opacity="0.92" stroke="#a85a48" stroke-width="0.45">
        <path d="M 0 -8 Q -5 -6 -5 -1 Q -2 3 0 2 Q 2 3 5 -1 Q 5 -6 0 -8 Z" transform="rotate(36)"/>
        <path d="M 0 -8 Q -5 -6 -5 -1 Q -2 3 0 2 Q 2 3 5 -1 Q 5 -6 0 -8 Z" transform="rotate(108)"/>
        <path d="M 0 -8 Q -5 -6 -5 -1 Q -2 3 0 2 Q 2 3 5 -1 Q 5 -6 0 -8 Z" transform="rotate(180)"/>
        <path d="M 0 -8 Q -5 -6 -5 -1 Q -2 3 0 2 Q 2 3 5 -1 Q 5 -6 0 -8 Z" transform="rotate(252)"/>
        <path d="M 0 -8 Q -5 -6 -5 -1 Q -2 3 0 2 Q 2 3 5 -1 Q 5 -6 0 -8 Z" transform="rotate(324)"/>
      </g>
      <!-- inner spiral bud -->
      <g fill="#c97862" stroke="#a85a48" stroke-width="0.4">
        <path d="M -2 -3 Q -4 0 -2 3 Q 1 4 3 1 Q 3 -2 -2 -3 Z"/>
        <path d="M 0 -1 Q -1 1 1 2 Q 2 1 1 -1 Z"/>
      </g>
      <circle r="1.1" fill="#3d1f15"/>
      <circle cx="-3" cy="-3" r="1.1" fill="#fdf6ee" opacity="0.6"/>
    </symbol>

    <!-- ============================================
         PORTRAIT BACKGROUND GRADIENT
         ============================================ -->
    <linearGradient id="portrait-bg-grad-v2" x1="0.3" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stop-color="#fef0e3"/>
      <stop offset="50%" stop-color="#f5d9c4"/>
      <stop offset="100%" stop-color="#e8b095"/>
    </linearGradient>
    <linearGradient id="tiara-gold-v2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#e6c280"/>
      <stop offset="50%" stop-color="#b8915a"/>
      <stop offset="100%" stop-color="#8a6a40"/>
    </linearGradient>
    <radialGradient id="gem-coral-v2" cx="0.4" cy="0.35" r="0.7">
      <stop offset="0%" stop-color="#e8b095"/>
      <stop offset="50%" stop-color="#c97862"/>
      <stop offset="100%" stop-color="#7d2f2f"/>
    </radialGradient>

    <!-- ============================================
         GROOM SILHOUETTE v2 — refined proportions
         Light source: top-left. Shaded: right side.
         ============================================ -->
    <symbol id="groom-silhouette" viewBox="0 0 200 240">
      <!-- Background watercolor circle -->
      <circle cx="100" cy="120" r="100" fill="url(#portrait-bg-grad-v2)"/>

      <!-- Soft inner ring -->
      <circle cx="100" cy="120" r="98" fill="none" stroke="#fdf6ee" stroke-width="1.4" opacity="0.5"/>

      <!-- Body silhouette: jas (white suit) -->
      <path d="M 28 240
               L 28 198
               C 28 176 39 167 62 161
               C 76 158 84 154 90 150
               L 100 180
               L 110 150
               C 116 154 124 158 138 161
               C 161 167 172 176 172 198
               L 172 240 Z"
            fill="#fdf6ee" stroke="#a85a48" stroke-width="1.4" stroke-linejoin="round"/>

      <!-- Subtle right-side body shadow (depth) -->
      <path d="M 168 240
               L 168 200
               C 168 180 158 172 142 167"
            fill="none" stroke="#e8b095" stroke-width="2.2" opacity="0.45" stroke-linecap="round"/>

      <!-- Lapel — left -->
      <path d="M 90 150
               L 78 175
               L 84 212
               L 100 180 Z"
            fill="#fef0e3" stroke="#a85a48" stroke-width="0.7" stroke-linejoin="round"/>

      <!-- Lapel — right -->
      <path d="M 110 150
               L 122 175
               L 116 212
               L 100 180 Z"
            fill="#fef0e3" stroke="#a85a48" stroke-width="0.7" stroke-linejoin="round"/>

      <!-- Inner V (collar shadow) -->
      <path d="M 93 150 L 100 178 L 107 150 L 103 144 L 97 144 Z" fill="#3a2418"/>

      <!-- Bow tie (refined, with knot detail) -->
      <g transform="translate(100 162)">
        <!-- left wing -->
        <path d="M 0 0 L -14 -5.5 Q -17 0 -14 5.5 L 0 0 Z"
              fill="#7d2f2f" stroke="#5a1f1f" stroke-width="0.7" stroke-linejoin="round"/>
        <!-- right wing -->
        <path d="M 0 0 L 14 -5.5 Q 17 0 14 5.5 L 0 0 Z"
              fill="#7d2f2f" stroke="#5a1f1f" stroke-width="0.7" stroke-linejoin="round"/>
        <!-- highlight on wings -->
        <path d="M -10 -3 Q -8 -1 -10 1.5" fill="none" stroke="#a04848" stroke-width="0.6" opacity="0.6"/>
        <path d="M 10 -3 Q 8 -1 10 1.5" fill="none" stroke="#a04848" stroke-width="0.6" opacity="0.6"/>
        <!-- center knot -->
        <rect x="-3" y="-4.8" width="6" height="9.6" rx="1.5" fill="#5a1f1f"/>
        <rect x="-2.4" y="-4.2" width="4.8" height="2" rx="1" fill="#7d2f2f"/>
        <circle r="0.7" fill="#3d1010"/>
      </g>

      <!-- Neck -->
      <path d="M 92 132 L 92 148 L 108 148 L 108 132
               Q 104 134 100 134 Q 96 134 92 132 Z"
            fill="#a08574"/>
      <!-- Neck shadow on right -->
      <path d="M 100 132 L 108 132 L 108 148 L 100 148 Z" fill="#8a6f5a" opacity="0.45"/>
      <!-- Soft chin shadow on neck -->
      <ellipse cx="100" cy="146" rx="9" ry="3" fill="#5a3d2e" opacity="0.42"/>

      <!-- Head -->
      <ellipse cx="100" cy="100" rx="30" ry="34" fill="#a08574"/>

      <!-- Head shading (right side darker — light from upper-left) -->
      <path d="M 100 66
               C 118 67 128 80 130 100
               C 130 121 122 132 110 134
               L 105 134
               L 105 66 Z"
            fill="#8a6f5a" opacity="0.5"/>

      <!-- Subtle highlight on left cheekbone -->
      <ellipse cx="83" cy="92" rx="6" ry="9" fill="#b59880" opacity="0.45"/>

      <!-- Hairline under peci -->
      <path d="M 73 78 Q 100 76 127 78"
            stroke="#5a3d2e" stroke-width="1.2" fill="none" opacity="0.75"/>
      <!-- Hair edge wisp at temples -->
      <path d="M 75 80 Q 73 86 76 90"
            stroke="#5a3d2e" stroke-width="0.7" fill="none" opacity="0.5"/>
      <path d="M 125 80 Q 127 86 124 90"
            stroke="#5a3d2e" stroke-width="0.7" fill="none" opacity="0.5"/>

      <!-- Peci (proper Indonesian dome shape) -->
      <g>
        <!-- Base shadow -->
        <path d="M 70 82 Q 100 78 130 82 L 130 84 Q 100 80 70 84 Z"
              fill="#a85a48" opacity="0.3"/>
        <!-- Main dome — slight taper toward top -->
        <path d="M 70 82
                 C 70 60 80 47 100 47
                 C 120 47 130 60 130 82 Z"
              fill="#fdf6ee" stroke="#a85a48" stroke-width="1.3" stroke-linejoin="round"/>
        <!-- Right side dome shadow (depth) -->
        <path d="M 130 82
                 C 130 70 124 58 116 51
                 C 122 56 126 65 126 80 Z"
              fill="#e8b095" opacity="0.4"/>
        <!-- Top dome highlight (light from above-left) -->
        <ellipse cx="92" cy="56" rx="13" ry="5" fill="#fef0e3" opacity="0.85"/>
        <ellipse cx="98" cy="51" rx="6" ry="2" fill="#ffffff" opacity="0.55"/>
        <!-- Texture: woven dotted lines (subtle) -->
        <g stroke="#c97862" stroke-width="0.4" fill="none" opacity="0.55">
          <path d="M 75 60 Q 100 57 125 60" stroke-dasharray="1.2 2.4"/>
          <path d="M 73 67 Q 100 64 127 67" stroke-dasharray="1.2 2.4"/>
          <path d="M 71 74 Q 100 71 129 74" stroke-dasharray="1.2 2.4"/>
        </g>
        <!-- Gold trim band at base -->
        <path d="M 70 84 Q 100 80 130 84" stroke="#b8915a" stroke-width="1.3" fill="none"/>
        <path d="M 71 86 Q 100 82 129 86" stroke="#d4b27a" stroke-width="0.5" fill="none" opacity="0.7"/>
      </g>
    </symbol>

    <!-- ============================================
         BRIDE SILHOUETTE v2 — flowing hijab + tiara
         Hijab uses fill-rule="evenodd" for face cutout.
         ============================================ -->
    <symbol id="bride-silhouette" viewBox="0 0 200 240">
      <!-- Background -->
      <circle cx="100" cy="120" r="100" fill="url(#portrait-bg-grad-v2)"/>
      <circle cx="100" cy="120" r="98" fill="none" stroke="#fdf6ee" stroke-width="1.4" opacity="0.5"/>

      <!-- Face oval (skin) — drawn FIRST, then hijab covers around it -->
      <ellipse cx="100" cy="115" rx="22" ry="27" fill="#a08574"/>
      <!-- Face shading (right side) -->
      <path d="M 100 88
               C 117 90 122 105 122 115
               C 122 130 116 140 108 142
               L 102 142
               L 102 88 Z"
            fill="#8a6f5a" opacity="0.5"/>
      <!-- Subtle left-cheek highlight -->
      <ellipse cx="88" cy="108" rx="5" ry="8" fill="#b59880" opacity="0.45"/>

      <!-- Neck (peeking under hijab) -->
      <rect x="92" y="135" width="16" height="14" fill="#a08574"/>
      <ellipse cx="100" cy="148" rx="8" ry="2.5" fill="#8a6f5a" opacity="0.5"/>

      <!-- HIJAB — single path with evenodd, face cutout at top -->
      <path fill-rule="evenodd"
            fill="#fdf6ee" stroke="#a85a48" stroke-width="1.3" stroke-linejoin="round"
            d="
              M 22 240
              L 22 155
              C 22 100 42 65 75 55
              C 83 53 92 52 100 52
              C 108 52 117 53 125 55
              C 158 65 178 100 178 155
              L 178 240
              Z

              M 100 88
              C 113 88 124 99 124 115
              C 124 132 116 144 100 144
              C 84 144 76 132 76 115
              C 76 99 87 88 100 88
              Z
            "/>

      <!-- Hijab inner edge — subtle shadow line around face opening -->
      <path d="M 100 88
               C 86 88 76 100 76 115
               C 76 132 84 144 100 144
               C 116 144 124 132 124 115
               C 124 100 113 88 100 88 Z"
            fill="none" stroke="#a85a48" stroke-width="1" opacity="0.55"/>

      <!-- Hijab fabric drape lines (suggesting natural folds) -->
      <g fill="none" stroke="#e8b095" stroke-width="1.1" opacity="0.5" stroke-linecap="round">
        <path d="M 50 220 Q 35 165 55 110"/>
        <path d="M 150 220 Q 165 165 145 110"/>
        <path d="M 80 232 Q 76 200 80 175"/>
        <path d="M 120 232 Q 124 200 120 175"/>
      </g>

      <!-- Hijab right-side larger shadow zone -->
      <path d="M 165 240
               L 165 165
               C 165 130 155 105 138 90
               C 152 100 160 125 160 160
               L 160 240 Z"
            fill="#a85a48" opacity="0.07"/>

      <!-- Hijab top highlight (light from above) -->
      <path d="M 60 75 Q 80 60 100 58"
            fill="none" stroke="#fef0e3" stroke-width="3" opacity="0.7" stroke-linecap="round"/>

      <!-- TIARA on top of hijab (refined Art Nouveau style) -->
      <g transform="translate(100 76)">
        <!-- Base band shadow -->
        <path d="M -23 5 Q 0 9 23 5 L 23 8 Q 0 12 -23 8 Z" fill="#a85a48" opacity="0.3"/>
        <!-- Main band gold -->
        <path d="M -24 4 Q 0 8 24 4 L 24 6.5 Q 0 10.5 -24 6.5 Z"
              fill="url(#tiara-gold-v2)" stroke="#8a6a40" stroke-width="0.5"/>
        <!-- Center main peak (largest, leaf-shaped) -->
        <path d="M -4 4
                 Q -3 -2 0 -10
                 Q 3 -2 4 4 Z"
              fill="url(#tiara-gold-v2)" stroke="#8a6a40" stroke-width="0.5"/>
        <!-- Inner detail line on center peak -->
        <line x1="0" y1="-9" x2="0" y2="-2" stroke="#fef0e3" stroke-width="0.6" opacity="0.7"/>
        <!-- Side peaks (medium) -->
        <path d="M -14 4 Q -12 -1 -10 -5 Q -8 -1 -7 4 Z"
              fill="url(#tiara-gold-v2)" stroke="#8a6a40" stroke-width="0.4"/>
        <path d="M 14 4 Q 12 -1 10 -5 Q 8 -1 7 4 Z"
              fill="url(#tiara-gold-v2)" stroke="#8a6a40" stroke-width="0.4"/>
        <!-- Edge peaks (small) -->
        <path d="M -20 4 Q -19 1.5 -18 -1 Q -17 1.5 -16 4 Z"
              fill="url(#tiara-gold-v2)" stroke="#8a6a40" stroke-width="0.3"/>
        <path d="M 20 4 Q 19 1.5 18 -1 Q 17 1.5 16 4 Z"
              fill="url(#tiara-gold-v2)" stroke="#8a6a40" stroke-width="0.3"/>
        <!-- Center main gem -->
        <circle cx="0" cy="-4" r="2.4" fill="url(#gem-coral-v2)" stroke="#7d2f2f" stroke-width="0.4"/>
        <!-- Side gems -->
        <circle cx="-10" cy="-1" r="1.4" fill="url(#gem-coral-v2)" stroke="#7d2f2f" stroke-width="0.3"/>
        <circle cx="10" cy="-1" r="1.4" fill="url(#gem-coral-v2)" stroke="#7d2f2f" stroke-width="0.3"/>
        <!-- Highlights on gems -->
        <ellipse cx="-0.8" cy="-5" rx="0.9" ry="0.7" fill="#fef0e3" opacity="0.85"/>
        <ellipse cx="-10.4" cy="-1.5" rx="0.5" ry="0.4" fill="#fef0e3" opacity="0.75"/>
        <ellipse cx="9.6" cy="-1.5" rx="0.5" ry="0.4" fill="#fef0e3" opacity="0.75"/>
        <!-- Tiny accent dots between peaks -->
        <circle cx="-5" cy="3" r="0.6" fill="#d4b27a"/>
        <circle cx="5" cy="3" r="0.6" fill="#d4b27a"/>
        <circle cx="-17" cy="3" r="0.5" fill="#d4b27a"/>
        <circle cx="17" cy="3" r="0.5" fill="#d4b27a"/>
      </g>
    </symbol>

    <!-- ============================================
         FLORAL CLUSTER A — sakura branch dominant
         Designed for corner anchor (bottom-left). 320x300 viewBox.
         ============================================ -->
    <symbol id="orn-floral-a" viewBox="0 0 320 300">
      <!-- ===== Branch system (warm brown, organic curves) ===== -->
      <g fill="none" stroke-linecap="round">
        <!-- Main sakura branch curving from bottom-left to upper-right -->
        <path d="M 8 285 Q 50 250 90 215 Q 140 175 195 130 Q 240 95 290 55"
              stroke="#5a2f22" stroke-width="2.4"/>
        <!-- Inner highlight on branch -->
        <path d="M 12 282 Q 52 248 92 213 Q 142 173 197 128 Q 242 93 288 57"
              stroke="#8a4d39" stroke-width="0.8" opacity="0.6"/>
        <!-- Secondary side branch (lower) -->
        <path d="M 70 230 Q 75 200 85 175 Q 92 155 110 145"
              stroke="#5a2f22" stroke-width="1.6"/>
        <!-- Small twig 1 -->
        <path d="M 165 165 Q 158 140 165 120"
              stroke="#5a2f22" stroke-width="1.2"/>
        <!-- Small twig 2 (eucalyptus stem) -->
        <path d="M 235 95 Q 260 80 285 78"
              stroke="#5a2f22" stroke-width="1.3"/>
      </g>

      <!-- ===== Eucalyptus leaves on the small upper twig ===== -->
      <g>
        <use href="#euca-leaf" transform="translate(238 95) rotate(-25)"/>
        <use href="#euca-leaf" transform="translate(238 95) rotate(40) scale(-1, 1) translate(-1 0)"/>
        <use href="#euca-leaf" transform="translate(258 84) rotate(-20)"/>
        <use href="#euca-leaf" transform="translate(258 84) rotate(35) scale(-1, 1) translate(-1 0)"/>
        <use href="#euca-leaf-sm" transform="translate(278 80) rotate(-15)"/>
      </g>

      <!-- ===== A pair of eucalyptus leaves at lower side branch ===== -->
      <g>
        <use href="#euca-leaf-sm" transform="translate(78 200) rotate(-50)"/>
        <use href="#euca-leaf-sm" transform="translate(78 200) rotate(50) scale(-1 1) translate(-1 0)"/>
        <use href="#euca-leaf" transform="translate(85 175) rotate(-40)"/>
        <use href="#euca-leaf-sm" transform="translate(95 158) rotate(45)"/>
      </g>

      <!-- ===== SAKURA BLOSSOMS (varied sizes for depth) ===== -->

      <!-- Largest blossom — focal at top right -->
      <g transform="translate(265 75) scale(2.3)">
        <use href="#sakura-blossom"/>
      </g>

      <!-- Medium blossom — middle of branch -->
      <g transform="translate(180 142) scale(1.7)">
        <use href="#sakura-blossom"/>
      </g>

      <!-- Medium-small blossom — lower branch -->
      <g transform="translate(115 200) scale(1.45)">
        <use href="#sakura-blossom"/>
      </g>

      <!-- Small blossom near bottom -->
      <g transform="translate(45 270) scale(1.2)">
        <use href="#sakura-blossom"/>
      </g>

      <!-- Buds along branch -->
      <g transform="translate(140 175) scale(1.1) rotate(-30)">
        <use href="#sakura-bud"/>
      </g>
      <g transform="translate(218 113) scale(1) rotate(40)">
        <use href="#sakura-bud"/>
      </g>
      <g transform="translate(80 245) scale(0.9) rotate(-15)">
        <use href="#sakura-bud"/>
      </g>

      <!-- ===== Fallen / drifting petals ===== -->
      <g>
        <g transform="translate(38 180) rotate(35) scale(0.7)">
          <use href="#sakura-petal"/>
        </g>
        <g transform="translate(140 240) rotate(-50) scale(0.65)">
          <use href="#sakura-petal"/>
        </g>
        <g transform="translate(225 205) rotate(80) scale(0.55)">
          <use href="#sakura-petal"/>
        </g>
        <g transform="translate(290 150) rotate(-30) scale(0.6)">
          <use href="#sakura-petal"/>
        </g>
      </g>

      <!-- Tiny sparkle gold dots -->
      <g fill="#b8915a">
        <circle cx="155" cy="220" r="1.1"/>
        <circle cx="208" cy="160" r="0.9"/>
        <circle cx="92" cy="120" r="0.8"/>
        <circle cx="252" cy="105" r="1.2"/>
        <circle cx="60" cy="225" r="0.7"/>
      </g>
    </symbol>

    <!-- ============================================
         FLORAL CLUSTER B — eucalyptus dominant
         320x240 viewBox.
         ============================================ -->
    <symbol id="orn-floral-b" viewBox="0 0 320 240">
      <!-- Main horizontal eucalyptus branch -->
      <g fill="none" stroke-linecap="round">
        <path d="M 8 200 Q 70 180 140 155 Q 210 130 290 95"
              stroke="#5a2f22" stroke-width="2"/>
        <path d="M 12 198 Q 72 178 142 153 Q 212 128 288 97"
              stroke="#8a4d39" stroke-width="0.7" opacity="0.5"/>
        <!-- side stem 1 -->
        <path d="M 60 188 Q 80 200 95 215"
              stroke="#5a2f22" stroke-width="1.3"/>
        <!-- side stem 2 -->
        <path d="M 190 145 Q 220 130 240 110"
              stroke="#5a2f22" stroke-width="1.4"/>
        <!-- side stem 3 (curving up from main) -->
        <path d="M 110 167 Q 100 145 115 125"
              stroke="#5a2f22" stroke-width="1.2"/>
      </g>

      <!-- ===== Pairs of eucalyptus leaves along main branch ===== -->
      <g>
        <!-- pair 1 -->
        <use href="#euca-leaf" transform="translate(28 195) rotate(-55)"/>
        <use href="#euca-leaf" transform="translate(28 195) rotate(55) scale(-1 1) translate(-1 0)"/>
        <!-- pair 2 -->
        <use href="#euca-leaf" transform="translate(50 188) rotate(-50)"/>
        <use href="#euca-leaf" transform="translate(50 188) rotate(60) scale(-1 1) translate(-1 0)"/>
        <!-- pair 3 -->
        <use href="#euca-leaf" transform="translate(78 180) rotate(-45)"/>
        <use href="#euca-leaf" transform="translate(78 180) rotate(65) scale(-1 1) translate(-1 0)"/>
        <!-- pair 4 -->
        <use href="#euca-leaf" transform="translate(108 170) rotate(-50)"/>
        <use href="#euca-leaf" transform="translate(108 170) rotate(55) scale(-1 1) translate(-1 0)"/>
        <!-- pair 5 -->
        <use href="#euca-leaf" transform="translate(138 158) rotate(-55)"/>
        <use href="#euca-leaf" transform="translate(138 158) rotate(50) scale(-1 1) translate(-1 0)"/>
        <!-- pair 6 -->
        <use href="#euca-leaf" transform="translate(168 148) rotate(-50)"/>
        <use href="#euca-leaf" transform="translate(168 148) rotate(60) scale(-1 1) translate(-1 0)"/>
        <!-- pair 7 -->
        <use href="#euca-leaf" transform="translate(200 138) rotate(-45)"/>
        <use href="#euca-leaf" transform="translate(200 138) rotate(65) scale(-1 1) translate(-1 0)"/>
        <!-- pair 8 -->
        <use href="#euca-leaf" transform="translate(232 124) rotate(-55)"/>
        <use href="#euca-leaf" transform="translate(232 124) rotate(50) scale(-1 1) translate(-1 0)"/>
        <!-- pair 9 -->
        <use href="#euca-leaf-sm" transform="translate(262 112) rotate(-50)"/>
        <use href="#euca-leaf-sm" transform="translate(262 112) rotate(55) scale(-1 1) translate(-1 0)"/>
        <!-- pair 10 (terminal) -->
        <use href="#euca-leaf-sm" transform="translate(283 100) rotate(-30)"/>
      </g>

      <!-- Side stem leaves -->
      <g>
        <use href="#euca-leaf-sm" transform="translate(70 195) rotate(50)"/>
        <use href="#euca-leaf-sm" transform="translate(82 207) rotate(75)"/>
        <use href="#euca-leaf-sm" transform="translate(200 142) rotate(-30)"/>
        <use href="#euca-leaf-sm" transform="translate(220 128) rotate(-25)"/>
        <use href="#euca-leaf-sm" transform="translate(108 142) rotate(-65)"/>
      </g>

      <!-- ===== Sakura accents — 2 mid-size + 1 small + buds ===== -->
      <g transform="translate(120 130) scale(1.6)">
        <use href="#sakura-blossom"/>
      </g>
      <g transform="translate(245 105) scale(1.5)">
        <use href="#sakura-blossom"/>
      </g>
      <g transform="translate(80 200) scale(1.1)">
        <use href="#sakura-blossom"/>
      </g>

      <g transform="translate(165 145) scale(0.95) rotate(-30)">
        <use href="#sakura-bud"/>
      </g>
      <g transform="translate(220 122) scale(0.85) rotate(40)">
        <use href="#sakura-bud"/>
      </g>

      <!-- Drifting petals -->
      <g transform="translate(50 145) rotate(-20) scale(0.6)">
        <use href="#sakura-petal"/>
      </g>
      <g transform="translate(290 165) rotate(110) scale(0.65)">
        <use href="#sakura-petal"/>
      </g>

      <!-- Gold accent dots -->
      <g fill="#b8915a">
        <circle cx="155" cy="155" r="1"/>
        <circle cx="218" cy="115" r="1.1"/>
        <circle cx="40" cy="180" r="0.8"/>
      </g>
    </symbol>

    <!-- ============================================
         FLORAL CLUSTER C — small accent
         200x140 viewBox.
         ============================================ -->
    <symbol id="orn-floral-c" viewBox="0 0 200 140">
      <!-- Curved branch -->
      <g fill="none" stroke-linecap="round">
        <path d="M 8 125 Q 60 95 110 75 Q 150 60 192 50"
              stroke="#5a2f22" stroke-width="1.7"/>
        <path d="M 70 100 Q 75 80 85 65"
              stroke="#5a2f22" stroke-width="1.1"/>
      </g>

      <!-- Eucalyptus pairs -->
      <g>
        <use href="#euca-leaf-sm" transform="translate(28 116) rotate(-50)"/>
        <use href="#euca-leaf-sm" transform="translate(28 116) rotate(55) scale(-1 1) translate(-1 0)"/>
        <use href="#euca-leaf-sm" transform="translate(55 102) rotate(-45)"/>
        <use href="#euca-leaf-sm" transform="translate(55 102) rotate(60) scale(-1 1) translate(-1 0)"/>
        <use href="#euca-leaf-sm" transform="translate(85 88) rotate(-50)"/>
        <use href="#euca-leaf-sm" transform="translate(85 88) rotate(55) scale(-1 1) translate(-1 0)"/>
        <use href="#euca-leaf-sm" transform="translate(135 67) rotate(-40)"/>
        <use href="#euca-leaf-sm" transform="translate(160 58) rotate(-35)"/>
        <use href="#euca-leaf-sm" transform="translate(80 72) rotate(-65)"/>
      </g>

      <!-- Single focal sakura -->
      <g transform="translate(180 50) scale(1.6)">
        <use href="#sakura-blossom"/>
      </g>
      <!-- One smaller sakura -->
      <g transform="translate(115 78) scale(1.1)">
        <use href="#sakura-blossom"/>
      </g>
      <!-- A bud -->
      <g transform="translate(150 65) scale(0.85) rotate(-20)">
        <use href="#sakura-bud"/>
      </g>

      <!-- Gold dots -->
      <g fill="#b8915a">
        <circle cx="100" cy="85" r="0.9"/>
        <circle cx="165" cy="62" r="0.8"/>
      </g>
    </symbol>


    <!-- ============================================
         LEAF SPRAY (horizontal divider)
         viewBox 240x60
         ============================================ -->
    <symbol id="orn-leaf-spray" viewBox="0 0 240 60">
      <path d="M5 30 Q60 22 120 28 Q180 34 235 30"
            fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
      <g fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1">
        <ellipse cx="30" cy="22" rx="9" ry="3.5" transform="rotate(-15 30 22)"/>
        <ellipse cx="50" cy="20" rx="10" ry="3.8" transform="rotate(-12 50 20)"/>
        <ellipse cx="72" cy="22" rx="11" ry="4" transform="rotate(-8 72 22)"/>
        <ellipse cx="170" cy="38" rx="11" ry="4" transform="rotate(8 170 38)"/>
        <ellipse cx="192" cy="40" rx="10" ry="3.8" transform="rotate(12 192 40)"/>
        <ellipse cx="212" cy="38" rx="9" ry="3.5" transform="rotate(15 212 38)"/>
      </g>
      <!-- center motif -->
      <g transform="translate(120 30)" fill="currentColor" stroke="currentColor">
        <circle r="5" fill="none" stroke-width="1"/>
        <circle r="2" fill-opacity="1"/>
        <path d="M-12 0 L-7 0 M7 0 L12 0" stroke-width="0.8" fill="none"/>
      </g>
    </symbol>

    <!-- ============================================
         SINGLE LEAF (small accent)
         ============================================ -->
    <symbol id="orn-leaf-single" viewBox="0 0 60 30">
      <path d="M5 15 Q15 5 30 6 Q50 8 55 15 Q50 22 30 24 Q15 25 5 15 Z"
            fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1"/>
      <line x1="5" y1="15" x2="55" y2="15" stroke="currentColor" stroke-width="0.6" opacity="0.7"/>
      <g stroke="currentColor" stroke-width="0.4" fill="none" opacity="0.6">
        <line x1="15" y1="11" x2="22" y2="9"/>
        <line x1="25" y1="9" x2="32" y2="8"/>
        <line x1="35" y1="9" x2="42" y2="10"/>
        <line x1="15" y1="19" x2="22" y2="21"/>
        <line x1="25" y1="21" x2="32" y2="22"/>
        <line x1="35" y1="21" x2="42" y2="20"/>
      </g>
    </symbol>

    <!-- ============================================
         CORNER FRAME (gold)
         ============================================ -->
    <symbol id="orn-corner" viewBox="0 0 70 70">
      <g fill="none" stroke="currentColor" stroke-width="1">
        <path d="M5 5 L40 5 M5 5 L5 40"/>
        <path d="M5 5 Q15 15 22 13 M5 5 Q15 15 13 22" stroke-width="0.7"/>
        <circle cx="5" cy="5" r="2" fill="currentColor"/>
        <path d="M40 5 Q42 9 46 8" stroke-width="0.7"/>
        <path d="M5 40 Q9 42 8 46" stroke-width="0.7"/>
      </g>
    </symbol>

    <!-- ============================================
         8-POINT ISLAMIC STAR
         ============================================ -->
    <symbol id="orn-star" viewBox="0 0 100 100">
      <g fill="none" stroke="currentColor" stroke-width="1">
        <path d="M50 5 L57 35 L88 28 L65 50 L88 72 L57 65 L50 95 L43 65 L12 72 L35 50 L12 28 L43 35 Z"/>
        <circle cx="50" cy="50" r="6"/>
      </g>
    </symbol>

    <!-- ============================================
         ORNATE DIVIDER (with center motif)
         ============================================ -->
    <symbol id="orn-divider" viewBox="0 0 240 30">
      <g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
        <path d="M5 15 Q60 12 95 15"/>
        <path d="M145 15 Q180 18 235 15"/>
        <path d="M95 15 L100 15"/>
        <path d="M140 15 L145 15"/>
      </g>
      <g transform="translate(120 15)" fill="currentColor">
        <circle r="6" fill="none" stroke="currentColor" stroke-width="1"/>
        <circle r="5" fill="none" stroke="currentColor" stroke-width="0.5"/>
        <circle r="2" fill-opacity="0.9"/>
        <g fill="none" stroke="currentColor" stroke-width="0.6">
          <path d="M-10 0 L-7 0 M7 0 L10 0"/>
          <path d="M0 -10 L0 -7 M0 7 L0 10"/>
        </g>
      </g>
      <g fill="currentColor" fill-opacity="0.4">
        <circle cx="80" cy="15" r="1.2"/>
        <circle cx="160" cy="15" r="1.2"/>
      </g>
    </symbol>

    <!-- ============================================
         LAUREL — wide for cover
         ============================================ -->
    <symbol id="orn-laurel" viewBox="0 0 220 70">
      <g fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round">
        <path d="M10 35 Q60 22 110 35 Q160 48 210 35"/>
      </g>
      <g fill="currentColor" fill-opacity="0.35" stroke="currentColor" stroke-width="0.9">
        <ellipse cx="35" cy="26" rx="10" ry="4" transform="rotate(-25 35 26)"/>
        <ellipse cx="58" cy="22" rx="11" ry="4.5" transform="rotate(-20 58 22)"/>
        <ellipse cx="82" cy="24" rx="11" ry="4.5" transform="rotate(-15 82 24)"/>
        <ellipse cx="138" cy="46" rx="11" ry="4.5" transform="rotate(15 138 46)"/>
        <ellipse cx="162" cy="48" rx="11" ry="4.5" transform="rotate(20 162 48)"/>
        <ellipse cx="185" cy="44" rx="10" ry="4" transform="rotate(25 185 44)"/>
      </g>
      <g transform="translate(110 35)" fill="currentColor">
        <circle r="5" fill="none" stroke="currentColor" stroke-width="1"/>
        <circle r="2" fill-opacity="0.8"/>
      </g>
      <g fill="currentColor" fill-opacity="0.3">
        <circle cx="20" cy="35" r="1"/>
        <circle cx="200" cy="35" r="1"/>
      </g>
    </symbol>

    <!-- ============================================
         MAP MARKER PIN
         ============================================ -->
    <symbol id="orn-pin" viewBox="0 0 44 56">
      <path d="M22 2 C10 2 4 11 4 22 C4 33 22 54 22 54 C22 54 40 33 40 22 C40 11 34 2 22 2 Z"
            fill="#a85a48" stroke="#6b3a2c" stroke-width="1.2"/>
      <circle cx="22" cy="22" r="9" fill="#fdf6ee"/>
      <path d="M17 22 L21 26 L28 18" fill="none" stroke="#a85a48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </symbol>

  </defs>
</svg>`

export const OrnamentDefs = () => (
  <div
    aria-hidden="true"
    style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    dangerouslySetInnerHTML={{ __html: ORNAMENT_DEFS_HTML }}
  />
)
