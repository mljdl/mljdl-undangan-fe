import { useEffect, useRef, useState } from 'react'
import { OrnamentDefs } from '../../components/OrnamentDefs'
import { WatercolorFrame } from '../../components/WatercolorFrame'
import { useAudioReactive } from '../../hooks/useAudioReactive'
import type { TemplateWeddingData } from '../types'
import { DEMO_DATA } from './demo-data'
import './legacy-template.css'

/**
 * FloralWatercolorTemplate — a faithful, pixel-for-pixel React port of the legacy
 * single-file invitation (legacy/undangan-rizki-fadia.html).
 *
 * Strategy
 * --------
 * The legacy markup is reproduced 1:1 as JSX (same DOM order, same class names,
 * same element IDs, same bloom/ornament layers). All of the legacy inline JS is
 * ported into a single useEffect that runs once after mount and drives the DOM
 * imperatively via the legacy IDs/classes — exactly like the original — because
 * the behaviour (per-digit countdown injection, word-by-word reveal, Leaflet,
 * heart confetti spawned on <body>, magnetic button, 3D tilt) is fundamentally
 * imperative and was authored against the real DOM.
 *
 * Scoping
 * -------
 * Everything renders inside `<div className="wedding-root">`; legacy global rules
 * were rescoped to `.wedding-root` in legacy-template.css. Body-level concerns
 * (cream bg, watercolor washes, base font) are applied by toggling the
 * `wedding-active` class on <body> on mount/unmount so the CMS / glassmorphism
 * chrome on other routes is never affected.
 *
 * previewMode
 * -----------
 * In preview mode the preloader is skipped and the cover auto-opens (main is
 * revealed immediately) so the `/preview/:slug` iframe can scroll the whole
 * template without a click.
 */
interface Props {
  data: TemplateWeddingData
  previewMode?: boolean
}

const WEDDING_LATLNG = { lat: -6.295, lng: 106.84 }
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'

function ensureLeaflet(): Promise<void> {
  return new Promise((resolve) => {
    const w = window as unknown as { L?: unknown }
    if (w.L) {
      resolve()
      return
    }
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${LEAFLET_JS}"]`,
    )
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      // in case it already loaded
      if (w.L) resolve()
      return
    }
    const s = document.createElement('script')
    s.src = LEAFLET_JS
    s.async = true
    s.crossOrigin = ''
    s.addEventListener('load', () => resolve(), { once: true })
    s.addEventListener('error', () => resolve(), { once: true })
    document.head.appendChild(s)
  })
}

export const FloralWatercolorTemplate: React.FC<Props> = ({
  data,
  previewMode = false,
}) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const [rootEl, setRootEl] = useState<HTMLDivElement | null>(null)

  // Audio-reactive: tulis --au-bass / --au-energy ke .wedding-root saat musik
  // main. Elemen dekoratif bereaksi lewat CSS (lihat legacy-template.css).
  useAudioReactive({ audioId: 'bgAudio', target: rootEl, smoothing: 0.16 })

  // Floral backdrop: aktif HANYA kalau /assets/bg-frame.png benar-benar ada.
  // Kalau file belum ada, backdrop tetap 0 dan bloom per-section full (no regresi).
  useEffect(() => {
    if (!rootEl) return
    const img = new Image()
    img.onload = () => rootEl.classList.add('has-backdrop')
    img.onerror = () => rootEl.classList.remove('has-backdrop')
    img.src = '/assets/bg-frame.png'
  }, [rootEl])

  // ── derive content from data with demo fallback ──────────────────────────
  const d = data ?? DEMO_DATA
  const bride = d.bride ?? DEMO_DATA.bride!
  const groom = d.groom ?? DEMO_DATA.groom!
  const events = d.events?.length ? d.events : DEMO_DATA.events
  const banks = d.bankAccounts?.length ? d.bankAccounts : DEMO_DATA.bankAccounts
  const weddingDateIso = d.weddingDateIso || DEMO_DATA.weddingDateIso

  const akad = events[0]
  const resepsi = events[1] ?? events[0]
  const venueName = akad?.venue ?? "Kinanti's House"
  const venueAddress = akad?.address ?? [
    'Jl. AUP No. 7 RT 4/RW 10',
    'Pasar Minggu, Jakarta Selatan',
  ]
  const venueLat = akad?.lat ?? WEDDING_LATLNG.lat
  const venueLng = akad?.lng ?? WEDDING_LATLNG.lng
  const venueLabel = `${venueName}, ${venueAddress.join(' ')}`


  // ── body-class scoping: only style <body> while this template is mounted ──
  useEffect(() => {
    document.body.classList.add('wedding-active')
    if (!previewMode) document.body.style.overflow = 'hidden'
    return () => {
      document.body.classList.remove('wedding-active')
      document.body.style.overflow = ''
    }
  }, [previewMode])

  // ── all ported legacy behaviour (runs once after mount) ──────────────────
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const $ = <T extends Element = HTMLElement>(s: string): T | null =>
      root.querySelector<T>(s)
    const $$ = <T extends Element = HTMLElement>(s: string): T[] =>
      Array.from(root.querySelectorAll<T>(s))

    const cleanups: Array<() => void> = []
    const timers: number[] = []
    const addWin = (
      type: string,
      fn: EventListenerOrEventListenerObject,
      opts?: AddEventListenerOptions,
    ) => {
      window.addEventListener(type, fn, opts)
      cleanups.push(() => window.removeEventListener(type, fn, opts))
    }

    const REDUCE_MOTION = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const WEDDING_DATE = new Date(weddingDateIso)

    // ── guest name from URL (?to / ?kepada / ?nama) ──────────────────────
    const guestEl = $('#guestName')
    if (guestEl) {
      const params = new URLSearchParams(window.location.search)
      const to =
        params.get('to') || params.get('kepada') || params.get('nama')
      if (to) {
        guestEl.textContent = decodeURIComponent(to.replace(/\+/g, ' '))
      } else if (d.guestName) {
        guestEl.textContent = d.guestName
      }
    }

    // ── preloader hide + cover open + audio ──────────────────────────────
    const preloader = $('#preloader')
    const cover = $('#cover')
    const main = $('#main')
    const audio = $<HTMLAudioElement>('#bgAudio')
    const audioBtn = $('#audioToggle')
    const scrollHint = $('#scrollHint')

    let mapInited = false
    const initMap = () => {
      if (mapInited) return
      mapInited = true
      const mapsContainer = $('#mapsContainer')
      const mapEl = $('#map')
      if (!mapsContainer || !mapEl) return
      ensureLeaflet().then(() => {
        const L = (window as unknown as { L?: any }).L
        if (!L) {
          mapsContainer.classList.add('is-fallback')
          return
        }
        try {
          const map = L.map(mapEl, {
            center: [venueLat, venueLng],
            zoom: 16,
            zoomControl: true,
            attributionControl: true,
            scrollWheelZoom: false,
          })
          L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
            {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
              subdomains: 'abcd',
              maxZoom: 19,
            },
          ).addTo(map)
          const venueIcon = L.divIcon({
            className: 'venue-marker',
            html: `<div class="venue-marker__pin"><svg viewBox="0 0 44 56" width="44" height="56"><use href="#orn-pin"/></svg><div class="venue-marker__pulse"></div></div>`,
            iconSize: [44, 56],
            iconAnchor: [22, 56],
            popupAnchor: [0, -50],
          })
          L.marker([venueLat, venueLng], { icon: venueIcon })
            .addTo(map)
            .bindPopup(
              `<div style="font-family: var(--font-display, serif); font-size: 1.1rem; color: #6b3a2c; text-align: center;"><strong style="display: block; font-size: 1.25rem; margin-bottom: 0.3rem;">${venueName}</strong><em style="font-style: italic; color: #a85a48;">${venueAddress.join(', ')}</em></div>`,
            )
          window.setTimeout(() => map.invalidateSize(), 300)
        } catch (err) {
          console.warn('Leaflet init failed, falling back to illustrated map', err)
          mapsContainer.classList.add('is-fallback')
        }
      })
    }

    const openInvitation = () => {
      cover?.classList.add('is-opened')
      main?.classList.add('is-revealed')
      document.body.style.overflow = ''
      if (audio) {
        audio.volume = 0.5
        const p = audio.play()
        if (p && p.then) {
          p.then(() => audioBtn?.classList.add('is-playing')).catch(() => {})
        }
      }
      const t = window.setTimeout(() => {
        audioBtn?.classList.add('is-visible')
        scrollHint?.classList.add('is-visible')
        initMap()
      }, 1400)
      timers.push(t)
      let hidden = false
      addWin(
        'scroll',
        () => {
          if (!hidden && window.scrollY > 60) {
            scrollHint?.classList.remove('is-visible')
            hidden = true
          }
        },
        { passive: true },
      )
    }

    if (previewMode) {
      // skip preloader + auto-open
      preloader?.classList.add('is-gone')
      cover?.classList.add('is-opened')
      main?.classList.add('is-revealed')
      audioBtn?.classList.add('is-visible')
      document.body.style.overflow = ''
    } else {
      const t = window.setTimeout(
        () => preloader?.classList.add('is-gone'),
        1200,
      )
      timers.push(t)
    }

    const openBtn = $('#openBtn')
    const onOpen = () => openInvitation()
    openBtn?.addEventListener('click', onOpen)
    cleanups.push(() => openBtn?.removeEventListener('click', onOpen))

    const onAudio = () => {
      if (!audio) return
      if (audio.paused) {
        audio
          .play()
          .then(() => audioBtn?.classList.add('is-playing'))
          .catch(() => {})
      } else {
        audio.pause()
        audioBtn?.classList.remove('is-playing')
      }
    }
    audioBtn?.addEventListener('click', onAudio)
    cleanups.push(() => audioBtn?.removeEventListener('click', onAudio))

    // ── IntersectionObserver reveal ──────────────────────────────────────
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )
    $$('.reveal').forEach((el) => io.observe(el))
    cleanups.push(() => io.disconnect())
    if (previewMode) $$('.reveal').forEach((el) => el.classList.add('is-in'))

    // ── countdown (per-digit tick) ───────────────────────────────────────
    const cdEls = {
      days: $('[data-cd="days"]'),
      hours: $('[data-cd="hours"]'),
      minutes: $('[data-cd="minutes"]'),
      seconds: $('[data-cd="seconds"]'),
    }
    const pad = (n: number) => String(Math.max(0, n)).padStart(2, '0')
    const setDigits = (container: HTMLElement | null, value: number) => {
      if (!container) return
      const str = pad(value)
      const digits = container.querySelectorAll<HTMLElement>('.countdown__digit')
      if (digits.length !== str.length) {
        container.innerHTML = ''
        for (const ch of str) {
          const span = document.createElement('span')
          span.className = 'countdown__digit'
          span.textContent = ch
          container.appendChild(span)
        }
        return
      }
      digits.forEach((dg, i) => {
        if (dg.textContent !== str[i]) {
          dg.textContent = str[i]
          dg.classList.remove('is-tick')
          void dg.offsetWidth
          dg.classList.add('is-tick')
        }
      })
    }
    const tickCountdown = () => {
      const diff = WEDDING_DATE.getTime() - Date.now()
      if (diff <= 0) {
        setDigits(cdEls.days, 0)
        setDigits(cdEls.hours, 0)
        setDigits(cdEls.minutes, 0)
        setDigits(cdEls.seconds, 0)
        cdEls.days?.parentElement?.classList.add('countdown__cell--done')
        return
      }
      const s = Math.floor(diff / 1000)
      setDigits(cdEls.days, Math.floor(s / 86400))
      setDigits(cdEls.hours, Math.floor((s % 86400) / 3600))
      setDigits(cdEls.minutes, Math.floor((s % 3600) / 60))
      setDigits(cdEls.seconds, s % 60)
    }
    tickCountdown()
    const cdInterval = window.setInterval(tickCountdown, 1000)
    cleanups.push(() => window.clearInterval(cdInterval))

    // ── add-to-calendar ──────────────────────────────────────────────────
    const calBtn = $('#addToCalendar')
    const onCal = () => {
      const start = '20260613T010000Z'
      const end = '20260613T080000Z'
      const text = encodeURIComponent(
        `Pernikahan ${groom.nickName} & ${bride.nickName}`,
      )
      const details = encodeURIComponent(
        'Akad: 08.00 - 10.00 WIB\nResepsi: 10.00 - 15.00 WIB\n\nSemoga Allah SWT memberkahi pernikahan kami.',
      )
      const location = encodeURIComponent(venueLabel)
      const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}&location=${location}`
      window.open(url, '_blank', 'noopener')
    }
    calBtn?.addEventListener('click', onCal)
    cleanups.push(() => calBtn?.removeEventListener('click', onCal))

    // ── lokasi map (init on intersect, in addition to cover-open) ────────
    const lokasi = $('#lokasi')
    if (lokasi) {
      const lokasiObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              initMap()
              lokasiObserver.disconnect()
            }
          })
        },
        { threshold: 0.1 },
      )
      lokasiObserver.observe(lokasi)
      cleanups.push(() => lokasiObserver.disconnect())
    }
    if (previewMode) initMap()

    // ── distance (haversine + geolocation) ───────────────────────────────
    const distanceBox = $('#distanceBox')
    const distanceValue = $('#distanceValue')
    const distanceUnit = $('#distanceUnit')
    const distanceCaptionEl = $('#distanceCaption')
    const haversine = (
      lat1: number,
      lon1: number,
      lat2: number,
      lon2: number,
    ) => {
      const R = 6371
      const toRad = (x: number) => (x * Math.PI) / 180
      const dLat = toRad(lat2 - lat1)
      const dLon = toRad(lon2 - lon1)
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    }
    const formatDistance = (km: number) =>
      km < 1
        ? { value: Math.round(km * 1000), unit: 'm' }
        : { value: km < 10 ? Math.round(km * 10) / 10 : Math.round(km), unit: 'km' }
    const distanceCaption = (km: number) => {
      if (km < 1) return 'Sangat dekat — Anda hampir sampai di lokasi acara!'
      if (km < 5) return 'Cukup dekat dari lokasi acara. Sampai jumpa di sana!'
      if (km < 25) return 'Masih dalam jangkauan kota. Kami tunggu kehadiran Anda!'
      if (km < 100) return 'Lumayan jauh, namun doa Anda tetap dekat di hati kami.'
      return 'Jauh di mata, dekat di doa. Terima kasih atas restu Anda.'
    }
    const calcDistance = () => {
      if (!distanceBox) return
      if (!navigator.geolocation) {
        distanceBox.classList.remove('is-loading')
        distanceBox.classList.add('is-error')
        return
      }
      distanceBox.classList.remove('is-error', 'is-resolved')
      distanceBox.classList.add('is-loading')
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const km = haversine(
            pos.coords.latitude,
            pos.coords.longitude,
            venueLat,
            venueLng,
          )
          const { value, unit } = formatDistance(km)
          if (distanceValue) distanceValue.textContent = String(value)
          if (distanceUnit) distanceUnit.textContent = unit
          if (distanceCaptionEl)
            distanceCaptionEl.textContent = distanceCaption(km)
          distanceBox.classList.remove('is-loading', 'is-error')
          distanceBox.classList.add('is-resolved')
        },
        () => {
          distanceBox.classList.remove('is-loading', 'is-resolved')
          distanceBox.classList.add('is-error')
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
      )
    }
    const calcBtn = $('#calcDistanceBtn')
    const recalcBtn = $('#recalcDistance')
    calcBtn?.addEventListener('click', calcDistance)
    recalcBtn?.addEventListener('click', calcDistance)
    cleanups.push(() => calcBtn?.removeEventListener('click', calcDistance))
    cleanups.push(() => recalcBtn?.removeEventListener('click', calcDistance))

    // ── toast ────────────────────────────────────────────────────────────
    const toast = $('#toast')
    const toastMsg = $('#toastMsg')
    let toastTimer = 0
    const showToast = (msg: string, duration = 2400) => {
      if (!toast) return
      if (toastMsg) toastMsg.textContent = msg
      toast.classList.add('is-visible')
      window.clearTimeout(toastTimer)
      toastTimer = window.setTimeout(
        () => toast.classList.remove('is-visible'),
        duration,
      )
    }
    cleanups.push(() => window.clearTimeout(toastTimer))

    // ── copy rekening ────────────────────────────────────────────────────
    const fallbackCopy = (text: string) => {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        /* noop */
      }
      document.body.removeChild(ta)
    }
    const copyHandlers: Array<{ el: HTMLElement; fn: () => void }> = []
    $$('.amplop-card__copy').forEach((btn) => {
      const fn = () => {
        const number = btn.dataset.copy || ''
        const onDone = () => {
          btn.classList.add('is-copied')
          const span = btn.querySelector('span')
          const prev = span?.textContent
          if (span) span.textContent = 'Tersalin'
          showToast('Nomor rekening tersalin!')
          window.setTimeout(() => {
            btn.classList.remove('is-copied')
            if (span && prev) span.textContent = prev
          }, 2200)
        }
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(number).then(onDone).catch(() => {
            fallbackCopy(number)
            onDone()
          })
        } else {
          fallbackCopy(number)
          onDone()
        }
      }
      btn.addEventListener('click', fn)
      copyHandlers.push({ el: btn, fn })
    })
    cleanups.push(() =>
      copyHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn)),
    )

    // ── RSVP ─────────────────────────────────────────────────────────────
    const rsvpForm = $<HTMLFormElement>('#rsvpForm')
    const ucapanList = $('#ucapanList')
    const onSubmit = (ev: Event) => {
      ev.preventDefault()
      if (!rsvpForm || !ucapanList) return
      const fd = new FormData(rsvpForm)
      const name = String(fd.get('name') || '').trim()
      if (!name) {
        const input = $<HTMLInputElement>('#rsvpName')
        input?.focus()
        return
      }
      const attend = String(fd.get('attend') || 'hadir')
      const message = String(fd.get('message') || '').trim()
      const statusLabel =
        attend === 'hadir' ? 'Hadir' : attend === 'ragu' ? 'Belum Pasti' : 'Tidak Hadir'
      const item = document.createElement('div')
      item.className = 'ucapan-item'
      const head = document.createElement('div')
      head.className = 'ucapan-item__head'
      const nameEl = document.createElement('span')
      nameEl.className = 'ucapan-item__name'
      nameEl.textContent = name
      const statusEl = document.createElement('span')
      statusEl.className = 'ucapan-item__status'
      statusEl.textContent = statusLabel
      head.appendChild(nameEl)
      head.appendChild(statusEl)
      item.appendChild(head)
      if (message) {
        const msgEl = document.createElement('p')
        msgEl.className = 'ucapan-item__msg'
        msgEl.textContent = `"${message}"`
        item.appendChild(msgEl)
      }
      ucapanList.insertBefore(item, ucapanList.firstChild)
      showToast('Terima kasih atas konfirmasi & doanya!')
      rsvpForm.reset()
    }
    rsvpForm?.addEventListener('submit', onSubmit)
    cleanups.push(() => rsvpForm?.removeEventListener('submit', onSubmit))

    // ── petals spawner ───────────────────────────────────────────────────
    const petalsRoot = $('#petals')
    if (petalsRoot && !REDUCE_MOTION) {
      const COUNT = window.innerWidth < 600 ? 10 : 18
      for (let i = 0; i < COUNT; i++) {
        const p = document.createElement('div')
        p.className = 'petal'
        const size = 6 + Math.random() * 12
        p.style.width = p.style.height = size + 'px'
        p.style.left = Math.random() * 100 + 'vw'
        p.style.animationDuration = 10 + Math.random() * 16 + 's'
        p.style.animationDelay = -Math.random() * 16 + 's'
        p.style.opacity = (0.25 + Math.random() * 0.35).toFixed(2)
        petalsRoot.appendChild(p)
      }
    }

    // ── blooms: fade in once each asset loads ────────────────────────────
    $$<HTMLImageElement>('.bloom').forEach((el) => {
      if (el.tagName === 'IMG') {
        if (el.complete && el.naturalWidth > 0) {
          el.classList.add('is-loaded')
        } else {
          el.addEventListener('load', () => el.classList.add('is-loaded'), {
            once: true,
          })
          el.addEventListener('error', () => (el.style.display = 'none'), {
            once: true,
          })
        }
      } else {
        el.classList.add('is-loaded')
      }
    })

    // ── parallax ([data-px]) ─────────────────────────────────────────────
    if (!REDUCE_MOTION) {
      const items = $$('[data-px]').map((el) => ({
        el,
        factor: parseFloat(el.dataset.px || '') || 0.15,
      }))
      if (items.length) {
        let raf: number | null = null
        const update = () => {
          raf = null
          const vh = window.innerHeight
          for (const it of items) {
            const rect = it.el.getBoundingClientRect()
            const center = rect.top + rect.height / 2
            const offset = (center - vh / 2) * it.factor
            it.el.style.setProperty('--px-y', (-offset).toFixed(1) + 'px')
          }
        }
        const onScroll = () => {
          if (!raf) raf = requestAnimationFrame(update)
        }
        addWin('scroll', onScroll, { passive: true })
        addWin('resize', onScroll, { passive: true })
        update()
      }
    }

    // ── scroll progress bar ──────────────────────────────────────────────
    const bar = $('#scrollProgress')
    if (bar) {
      let raf: number | null = null
      const update = () => {
        raf = null
        const h = document.documentElement
        const total = h.scrollHeight - h.clientHeight
        const pct = total > 0 ? (window.scrollY / total) * 100 : 0
        bar.style.width = pct + '%'
      }
      addWin(
        'scroll',
        () => {
          if (!raf) raf = requestAnimationFrame(update)
        },
        { passive: true },
      )
      addWin('resize', update)
      update()
    }

    // ── magnetic button (#openBtn) ───────────────────────────────────────
    if (!REDUCE_MOTION && openBtn) {
      const STRENGTH = 0.25
      const MAX = 12
      const onMove = (e: MouseEvent) => {
        const rect = openBtn.getBoundingClientRect()
        const dx = e.clientX - (rect.left + rect.width / 2)
        const dy = e.clientY - (rect.top + rect.height / 2)
        const tx = Math.max(-MAX, Math.min(MAX, dx * STRENGTH))
        const ty = Math.max(-MAX, Math.min(MAX, dy * STRENGTH))
        openBtn.style.transform = `translate(${tx}px, ${ty}px)`
        const mx = ((e.clientX - rect.left) / rect.width) * 100
        const my = ((e.clientY - rect.top) / rect.height) * 100
        openBtn.style.setProperty('--mx', mx + '%')
        openBtn.style.setProperty('--my', my + '%')
      }
      const onLeave = () => {
        openBtn.style.transform = ''
      }
      openBtn.addEventListener('mousemove', onMove)
      openBtn.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        openBtn.removeEventListener('mousemove', onMove)
        openBtn.removeEventListener('mouseleave', onLeave)
      })
    }

    // ── 3D tilt ([data-tilt]) ────────────────────────────────────────────
    if (!REDUCE_MOTION) {
      const MAX_DEG = 6
      $$('[data-tilt]').forEach((card) => {
        let raf: number | null = null
        const setTilt = (e: MouseEvent) => {
          raf = null
          const rect = card.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const dx = (e.clientX - cx) / (rect.width / 2)
          const dy = (e.clientY - cy) / (rect.height / 2)
          const rx = Math.max(-1, Math.min(1, -dy)) * MAX_DEG
          const ry = Math.max(-1, Math.min(1, dx)) * MAX_DEG
          card.style.transform = `perspective(900px) rotateX(${rx.toFixed(
            2,
          )}deg) rotateY(${ry.toFixed(2)}deg)`
        }
        const onMove = (e: MouseEvent) => {
          if (!raf) raf = requestAnimationFrame(() => setTilt(e))
        }
        const onLeave = () => {
          card.style.transform = ''
        }
        card.addEventListener('mousemove', onMove)
        card.addEventListener('mouseleave', onLeave)
        cleanups.push(() => {
          card.removeEventListener('mousemove', onMove)
          card.removeEventListener('mouseleave', onLeave)
        })
      })
    }

    // ── word-by-word reveal (ayat / hadith translations) ────────────────
    $$('.ayat__translation, .hadith__translation').forEach((p) => {
      const text = (p.textContent || '').trim()
      p.textContent = ''
      const words = text.split(/(\s+)/)
      let wordIdx = 0
      for (const part of words) {
        if (part.trim() === '') {
          p.appendChild(document.createTextNode(part))
        } else {
          const span = document.createElement('span')
          span.className = 'word'
          span.textContent = part
          const delay = Math.min(wordIdx * 35, 1800)
          span.style.setProperty('--w-delay', delay + 'ms')
          p.appendChild(span)
          wordIdx++
        }
      }
    })

    // ── heart confetti (footer .heart) ──────────────────────────────────
    const heart = $('footer .heart')
    if (heart) {
      const SYMBOLS = ['♡', '✿', '❀', '❁']
      const onHeart = () => {
        heart.classList.remove('is-pop')
        void heart.offsetWidth
        heart.classList.add('is-pop')
        if (REDUCE_MOTION) return
        const rect = heart.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const COUNT = 8
        for (let i = 0; i < COUNT; i++) {
          const flake = document.createElement('span')
          flake.className = 'heart-confetti'
          flake.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
          const spread = (Math.random() - 0.5) * 80
          flake.style.left = cx + spread + 'px'
          flake.style.top = cy + 'px'
          flake.style.fontSize = 10 + Math.random() * 12 + 'px'
          flake.style.setProperty('--r', (Math.random() - 0.5) * 60 + 'deg')
          flake.style.animationDelay = i * 40 + 'ms'
          document.body.appendChild(flake)
          window.setTimeout(() => flake.remove(), 1700 + i * 40)
        }
      }
      heart.addEventListener('click', onHeart)
      cleanups.push(() => heart.removeEventListener('click', onHeart))
    }

    // ── RSVP char count ──────────────────────────────────────────────────
    const ta = $<HTMLTextAreaElement>('#rsvpForm textarea[name="message"]')
    if (ta) {
      const MAX = 240
      ta.setAttribute('maxlength', String(MAX))
      const counter = document.createElement('span')
      counter.className = 'charcount'
      counter.textContent = `0 / ${MAX}`
      ta.parentNode?.insertBefore(counter, ta.nextSibling)
      const onInput = () => {
        const len = ta.value.length
        counter.textContent = `${len} / ${MAX}`
        counter.classList.toggle('is-near', len > MAX * 0.85)
      }
      ta.addEventListener('input', onInput)
      cleanups.push(() => ta.removeEventListener('input', onInput))
    }

    return () => {
      cleanups.forEach((fn) => fn())
      timers.forEach((t) => window.clearTimeout(t))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // helper to render the parents block
  const parentsBlock = (p: typeof bride.parents) => {
    const father = p?.father
    const mother = p?.mother
    return (
      <>
        {father?.deceased && <span className="alm">(Alm)</span>}
        {father?.name}
        <br />&amp;<br />
        {mother?.deceased && <span className="alm">(Almh)</span>}
        {mother?.name}
      </>
    )
  }

  return (
    <div
      className="wedding-root"
      ref={(node) => {
        rootRef.current = node
        setRootEl(node)
      }}
    >
      <OrnamentDefs />

      {/* Floral frame STATIS (Claude design, SVG watercolor pink gypsophila) —
          layer paling bawah, simetris 4 pojok, diam saat scroll. Otomatis
          disembunyikan kalau user pasang raster sendiri di /assets/bg-frame.png. */}
      <WatercolorFrame />

      {/* Opsi raster: kalau /assets/bg-frame.png ada, gambar ini blend di
          bawah konten & menggantikan frame SVG di atas. */}
      <div className="wedding-backdrop" aria-hidden="true" />

      {/* Audio-reactive glow overlay (opacity dikendalikan --au-energy via CSS) */}
      <div className="audio-glow" aria-hidden="true" />

      {/* PRELOADER */}
      <div className="preloader" id="preloader">
        <div className="preloader__inner">
          <div className="preloader__bismillah">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
          <div className="preloader__sub">A Sacred Day · 13 . 06 . 2026</div>
          <div className="preloader__ornament"></div>
        </div>
      </div>

      {/* COVER */}
      <section className="cover" id="cover">
        <div className="cover__bg"></div>

        <div className="cover__bloom-stack">
          <img
            className="bloom bloom--lg bloom--multiply bloom--warm bloom--fade-all bloom--drift-a bloom-pos-tl"
            data-bloom
            src="/assets/floral-1.webp"
            alt=""
            aria-hidden="true"
          />
          <img
            className="bloom bloom--lg bloom--multiply bloom--warm bloom--fade-all bloom--drift-b bloom-pos-br"
            data-bloom
            src="/assets/floral-2.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.5 }}
          />
          <img
            className="bloom bloom--md bloom--soft bloom--faint bloom--fade-all bloom--drift-c bloom-pos-c"
            data-bloom
            src="/assets/floral-3.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.35 }}
          />
        </div>

        <svg
          className="orn orn-cluster orn-cluster--xl orn-tl--xl orn--float-tl"
          viewBox="0 0 320 300"
          aria-hidden="true"
        >
          <use href="#orn-floral-a" />
        </svg>
        <svg
          className="orn orn-cluster orn-cluster--xl orn-tr--xl orn--float-tr"
          viewBox="0 0 320 240"
          aria-hidden="true"
        >
          <use href="#orn-floral-b" />
        </svg>
        <svg
          className="orn orn-cluster orn-cluster--xl orn-bl--xl orn--float-bl"
          viewBox="0 0 320 240"
          aria-hidden="true"
        >
          <use href="#orn-floral-b" />
        </svg>
        <svg
          className="orn orn-cluster orn-cluster--xl orn-br--xl orn--float-br"
          viewBox="0 0 320 300"
          aria-hidden="true"
        >
          <use href="#orn-floral-a" />
        </svg>

        <div className="cover__inner">
          <svg className="cover__top-svg" viewBox="0 0 220 70">
            <use href="#orn-laurel" />
          </svg>

          <div className="cover__pretitle">
            <span className="cover__pretitle-line"></span>
            The Wedding of
            <span className="cover__pretitle-line"></span>
          </div>

          <h1 className="cover__couple">
            {groom.nickName}
            <span className="amp">&amp;</span>
            {bride.nickName}
          </h1>

          <div className="cover__divider"></div>
          <div className="cover__date">13 · 06 · 2026</div>

          <p className="cover__greeting">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <div className="cover__guest" id="guestName">
            {d.guestName ?? 'Tamu Undangan'}
          </div>

          <button className="cover__btn" id="openBtn">
            Buka Undangan
            <span className="cover__btn-icon">→</span>
          </button>

          <p className="cover__hint">Tekan tombol untuk membuka</p>

          <svg className="cover__bottom-svg" viewBox="0 0 220 70">
            <use href="#orn-laurel" />
          </svg>
        </div>
      </section>

      {/* FLOATING UI */}
      <button className="audio-toggle" id="audioToggle" aria-label="Toggle audio">
        <svg
          className="icon-play"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <svg
          className="icon-pause"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      </button>

      <div className="scroll-indicator" id="scrollHint">
        Scroll <span className="arrow">↓</span>
      </div>
      <div className="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
      <div className="petals" id="petals" aria-hidden="true"></div>

      <audio id="bgAudio" loop preload="none">
        <source src="/audio/backsound.mp3" type="audio/mpeg" />
      </audio>

      {/* MAIN */}
      <main id="main" data-wedding-slug={d.slug}>
        {/* PEMBUKAAN */}
        <section className="section" id="pembukaan">
          <img
            className="bloom bloom--md bloom--soft bloom--faint bloom--fade-r bloom--drift-c bloom-pos-tl"
            data-bloom
            data-px="0.1"
            src="/assets/floral-3.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.45 }}
          />
          <img
            className="bloom bloom--md bloom--soft bloom--faint bloom--fade-l bloom--drift-a bloom-pos-br"
            data-bloom
            data-px="-0.1"
            src="/assets/floral-3.webp"
            alt=""
            aria-hidden="true"
            style={{
              ['--bloom-opacity' as string]: 0.45,
              transform: 'scaleX(-1) scaleY(-1)',
            }}
          />

          <svg className="orn orn-cluster orn-tl" viewBox="0 0 320 300" aria-hidden="true">
            <use href="#orn-floral-a" />
          </svg>
          <svg className="orn orn-cluster orn-br" viewBox="0 0 320 240" aria-hidden="true">
            <use href="#orn-floral-b" />
          </svg>

          <div className="section__inner">
            <div className="reveal">
              <div className="eyebrow">In The Name of Allah</div>
              <div className="ayat__arabic" style={{ marginBottom: '1.6rem' }}>
                بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </div>
              <svg className="div-svg" viewBox="0 0 240 30">
                <use href="#orn-divider" />
              </svg>
            </div>
            <p className="body reveal reveal--delay-1">
              <em>Assalamu'alaikum Warahmatullahi Wabarakatuh</em>
            </p>
            <p className="body reveal reveal--delay-2">
              Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, kami
              bermaksud mengundang Bapak/Ibu/Saudara/i pada acara pernikahan
              kami.
            </p>
          </div>
        </section>

        {/* AYAT */}
        <section className="section section--full">
          <img
            className="bloom bloom--xl bloom--multiply bloom--warm bloom--fade-all bloom--drift-c bloom-pos-c"
            data-bloom
            data-px="0.08"
            src="/assets/floral-1.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.4 }}
          />
          <img
            className="bloom bloom--md bloom--multiply bloom--deep bloom--fade-r bloom--drift-a bloom-pos-tl"
            data-bloom
            data-px="-0.16"
            src="/assets/floral-4.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.5 }}
          />
          <img
            className="bloom bloom--md bloom--multiply bloom--deep bloom--fade-l bloom--drift-b bloom-pos-br"
            data-bloom
            data-px="0.16"
            src="/assets/floral-4.webp"
            alt=""
            aria-hidden="true"
            style={{
              ['--bloom-opacity' as string]: 0.5,
              transform: 'scaleX(-1) scaleY(-1)',
            }}
          />

          <svg
            className="orn orn-cluster orn-cluster--xl orn-tl--xl"
            viewBox="0 0 320 240"
            aria-hidden="true"
          >
            <use href="#orn-floral-b" />
          </svg>
          <svg
            className="orn orn-cluster orn-cluster--xl orn-br--xl"
            viewBox="0 0 320 300"
            aria-hidden="true"
          >
            <use href="#orn-floral-a" />
          </svg>

          <div className="section__inner">
            <div className="reveal">
              <svg
                width="40"
                height="40"
                viewBox="0 0 100 100"
                style={{
                  color: 'var(--gold)',
                  margin: '0 auto 1rem',
                  opacity: 0.85,
                  display: 'block',
                }}
              >
                <use href="#orn-star" />
              </svg>
              <div className="eyebrow">Q.S. Ar-Rum : 21</div>
            </div>
            <div className="ayat reveal reveal--delay-1">
              <div className="ayat__arabic">
                وَمِنْ ءَايَـٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًا
                لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ
                إِنَّ فِى ذَٰلِكَ لَـَٔايَـٰتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
              </div>
              <p className="ayat__translit">
                Wa min āyātihī an khalaqa lakum min anfusikum azwājan litaskunū
                ilaihā wa ja'ala bainakum mawaddataw wa raḥmah, inna fī żālika
                la'āyātil liqaumiy yatafakkarūn.
              </p>
              <p className="ayat__translation">
                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan
                untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung
                dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa
                kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar
                terdapat tanda-tanda bagi kaum yang berfikir."
              </p>
              <p className="ayat__cite">— Ar-Rum : 21 —</p>
            </div>
          </div>
        </section>

        {/* HADITH */}
        <section className="section" id="hadith">
          <img
            className="bloom bloom--md bloom--multiply bloom--warm bloom--fade-r bloom--drift-a bloom-pos-tl"
            data-bloom
            data-px="0.12"
            src="/assets/floral-3.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.5 }}
          />
          <img
            className="bloom bloom--md bloom--multiply bloom--warm bloom--fade-l bloom--drift-b bloom-pos-br"
            data-bloom
            data-px="-0.12"
            src="/assets/floral-3.webp"
            alt=""
            aria-hidden="true"
            style={{
              ['--bloom-opacity' as string]: 0.5,
              transform: 'scaleX(-1) scaleY(-1)',
            }}
          />

          <svg className="orn orn-cluster orn-tl" viewBox="0 0 320 240" aria-hidden="true">
            <use href="#orn-floral-b" />
          </svg>
          <svg className="orn orn-cluster orn-br" viewBox="0 0 320 300" aria-hidden="true">
            <use href="#orn-floral-a" />
          </svg>

          <div className="section__inner">
            <div className="reveal">
              <svg className="div-svg" viewBox="0 0 240 30">
                <use href="#orn-divider" />
              </svg>
              <div className="eyebrow">Sabda Rasulullah ﷺ</div>
              <h2 className="section__title">Pesan Para Cinta</h2>
            </div>

            <div className="hadith reveal reveal--delay-1">
              <div className="hadith__arabic">
                إِذَا تَزَوَّجَ الْعَبْدُ فَقَدِ اسْتَكْمَلَ نِصْفَ الدِّينِ،
                فَلْيَتَّقِ اللَّهَ فِي النِّصْفِ الْبَاقِي
              </div>
              <p className="hadith__translation">
                "Apabila seorang hamba menikah, maka ia telah menyempurnakan
                setengah agamanya. Maka hendaklah ia bertakwa kepada Allah pada
                setengah yang lainnya."
              </p>
              <p className="hadith__cite">— HR. Al-Baihaqi —</p>
            </div>

            <div className="hadith reveal reveal--delay-2">
              <div className="hadith__arabic">
                خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ وَأَنَا خَيْرُكُمْ لِأَهْلِي
              </div>
              <p className="hadith__translation">
                "Sebaik-baik kalian adalah yang paling baik kepada keluarganya,
                dan aku adalah yang paling baik di antara kalian kepada
                keluargaku."
              </p>
              <p className="hadith__cite">— HR. At-Tirmidzi —</p>
            </div>
          </div>
        </section>

        {/* MEMPELAI */}
        <section className="section" id="mempelai">
          <img
            className="bloom bloom--lg bloom--multiply bloom--warm bloom--fade-r bloom--drift-a bloom-pos-tl"
            data-bloom
            data-px="0.18"
            src="/assets/floral-1.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.5 }}
          />
          <img
            className="bloom bloom--lg bloom--multiply bloom--deep bloom--fade-l bloom--drift-b bloom-pos-br"
            data-bloom
            data-px="-0.22"
            src="/assets/floral-4.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.45 }}
          />

          <svg className="orn orn-cluster orn-tl" viewBox="0 0 320 300" aria-hidden="true">
            <use href="#orn-floral-a" />
          </svg>
          <svg className="orn orn-cluster orn-tr" viewBox="0 0 320 240" aria-hidden="true">
            <use href="#orn-floral-b" />
          </svg>
          <svg className="orn orn-cluster orn-bl" viewBox="0 0 320 240" aria-hidden="true">
            <use href="#orn-floral-b" />
          </svg>
          <svg className="orn orn-cluster orn-br" viewBox="0 0 320 300" aria-hidden="true">
            <use href="#orn-floral-a" />
          </svg>

          <div className="section__inner">
            <div className="reveal">
              <svg className="div-svg" viewBox="0 0 240 30">
                <use href="#orn-divider" />
              </svg>
              <div className="eyebrow">The Bride &amp; The Groom</div>
              <h2 className="section__title">Kami Yang Berbahagia</h2>
            </div>

            <div className="mempelai__intro-wrap reveal reveal--delay-1">
              <svg className="mempelai__hero-orn" viewBox="0 0 320 240" aria-hidden="true">
                <use href="#orn-floral-c" />
              </svg>
              <p className="mempelai__intro">
                Maha Suci Allah yang telah mempertemukan dua hati,
                <br />
                menjadikannya tenteram dalam <em>mawaddah</em> dan{' '}
                <em>rahmah</em>.
              </p>
            </div>

            {/* BRIDE */}
            <div className="couple-card reveal reveal--delay-1" data-tilt>
              <svg className="couple-card__corner couple-card__corner--tl" viewBox="0 0 70 70">
                <use href="#orn-corner" />
              </svg>
              <svg className="couple-card__corner couple-card__corner--tr" viewBox="0 0 70 70">
                <use href="#orn-corner" />
              </svg>
              <svg className="couple-card__corner couple-card__corner--bl" viewBox="0 0 70 70">
                <use href="#orn-corner" />
              </svg>
              <svg className="couple-card__corner couple-card__corner--br" viewBox="0 0 70 70">
                <use href="#orn-corner" />
              </svg>

              <div className="couple-card__portrait">
                <svg viewBox="0 0 200 240" aria-hidden="true">
                  <use href="#bride-silhouette" />
                </svg>
              </div>

              <div className="couple-card__role">— {bride.role ?? 'Mempelai Wanita'} —</div>

              <div className="couple-card__name-wrap">
                <span className="orbit-flower orbit-flower--tl">
                  <svg viewBox="-20 -20 40 40">
                    <use href="#sakura-blossom" />
                  </svg>
                </span>
                <span className="orbit-flower orbit-flower--tr">
                  <svg viewBox="-20 -20 40 40">
                    <use href="#rose-bloom" />
                  </svg>
                </span>
                <span className="orbit-flower orbit-flower--bl">
                  <svg viewBox="-20 -20 40 40">
                    <use href="#rose-bloom" />
                  </svg>
                </span>
                <span className="orbit-flower orbit-flower--br">
                  <svg viewBox="-20 -20 40 40">
                    <use href="#sakura-blossom" />
                  </svg>
                </span>
                <h3 className="couple-card__name" data-text={bride.fullName}>
                  {bride.fullName}
                </h3>
              </div>

              <div className="couple-card__nick">— {bride.nickName} —</div>
              {bride.birthOrder && (
                <p className="couple-card__order">{bride.birthOrder}</p>
              )}
              <div className="couple-card__parents-label">— Putri dari —</div>
              <p className="couple-card__parents">{parentsBlock(bride.parents)}</p>
            </div>

            <span className="mempelai__amp reveal">&amp;</span>

            {/* GROOM */}
            <div className="couple-card reveal reveal--delay-1" data-tilt>
              <svg className="couple-card__corner couple-card__corner--tl" viewBox="0 0 70 70">
                <use href="#orn-corner" />
              </svg>
              <svg className="couple-card__corner couple-card__corner--tr" viewBox="0 0 70 70">
                <use href="#orn-corner" />
              </svg>
              <svg className="couple-card__corner couple-card__corner--bl" viewBox="0 0 70 70">
                <use href="#orn-corner" />
              </svg>
              <svg className="couple-card__corner couple-card__corner--br" viewBox="0 0 70 70">
                <use href="#orn-corner" />
              </svg>

              <div className="couple-card__portrait">
                <svg viewBox="0 0 200 240" aria-hidden="true">
                  <use href="#groom-silhouette" />
                </svg>
              </div>

              <div className="couple-card__role">— {groom.role ?? 'Mempelai Pria'} —</div>

              <div className="couple-card__name-wrap">
                <span className="orbit-flower orbit-flower--tl">
                  <svg viewBox="-20 -20 40 40">
                    <use href="#rose-bloom" />
                  </svg>
                </span>
                <span className="orbit-flower orbit-flower--tr">
                  <svg viewBox="-20 -20 40 40">
                    <use href="#sakura-blossom" />
                  </svg>
                </span>
                <span className="orbit-flower orbit-flower--bl">
                  <svg viewBox="-20 -20 40 40">
                    <use href="#sakura-blossom" />
                  </svg>
                </span>
                <span className="orbit-flower orbit-flower--br">
                  <svg viewBox="-20 -20 40 40">
                    <use href="#rose-bloom" />
                  </svg>
                </span>
                <h3 className="couple-card__name" data-text={groom.fullName}>
                  {groom.fullName}
                </h3>
              </div>

              <div className="couple-card__nick">— {groom.nickName} —</div>
              {groom.birthOrder && (
                <p className="couple-card__order">{groom.birthOrder}</p>
              )}
              <div className="couple-card__parents-label">— Putra dari —</div>
              <p className="couple-card__parents">{parentsBlock(groom.parents)}</p>
            </div>
          </div>
        </section>

        {/* COUNTDOWN */}
        <section className="section section--full" id="countdown-section">
          <img
            className="bloom bloom--xl bloom--multiply bloom--warm bloom--fade-all bloom--drift-c bloom-pos-c"
            data-bloom
            data-px="0.12"
            src="/assets/floral-2.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.4 }}
          />
          <img
            className="bloom bloom--md bloom--multiply bloom--deep bloom--fade-r bloom--drift-a bloom-pos-cl"
            data-bloom
            data-px="-0.18"
            src="/assets/floral-3.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.6 }}
          />
          <img
            className="bloom bloom--md bloom--multiply bloom--deep bloom--fade-l bloom--drift-b bloom-pos-cr"
            data-bloom
            data-px="0.18"
            src="/assets/floral-3.webp"
            alt=""
            aria-hidden="true"
            style={{
              ['--bloom-opacity' as string]: 0.6,
              transform: 'translateY(-50%) scaleX(-1)',
            }}
          />

          <svg
            className="orn orn-cluster orn-cluster--xl orn-tl--xl"
            viewBox="0 0 320 300"
            aria-hidden="true"
          >
            <use href="#orn-floral-a" />
          </svg>
          <svg
            className="orn orn-cluster orn-cluster--xl orn-br--xl"
            viewBox="0 0 320 240"
            aria-hidden="true"
          >
            <use href="#orn-floral-b" />
          </svg>

          <div className="section__inner">
            <div className="reveal">
              <svg className="div-svg" viewBox="0 0 240 30">
                <use href="#orn-divider" />
              </svg>
              <div className="eyebrow">Save Our Special Day</div>
              <div className="savedate__day">Sabtu</div>
              <div className="savedate">13 Juni 2026</div>
              <svg
                style={{
                  width: '130px',
                  height: '33px',
                  color: 'var(--terracotta)',
                  opacity: 0.7,
                  margin: '0.6rem auto',
                  display: 'block',
                }}
                viewBox="0 0 240 60"
              >
                <use href="#orn-leaf-spray" />
              </svg>
            </div>

            <div className="countdown reveal reveal--delay-1">
              <div className="countdown__cell">
                <span className="countdown__num" data-cd="days">
                  <span className="countdown__digit">0</span>
                  <span className="countdown__digit">0</span>
                </span>
                <div className="countdown__label">Hari</div>
              </div>
              <div className="countdown__cell">
                <span className="countdown__num" data-cd="hours">
                  <span className="countdown__digit">0</span>
                  <span className="countdown__digit">0</span>
                </span>
                <div className="countdown__label">Jam</div>
              </div>
              <div className="countdown__cell">
                <span className="countdown__num" data-cd="minutes">
                  <span className="countdown__digit">0</span>
                  <span className="countdown__digit">0</span>
                </span>
                <div className="countdown__label">Menit</div>
              </div>
              <div className="countdown__cell">
                <span className="countdown__num" data-cd="seconds">
                  <span className="countdown__digit">0</span>
                  <span className="countdown__digit">0</span>
                </span>
                <div className="countdown__label">Detik</div>
              </div>
            </div>

            <div
              className="lokasi-actions reveal reveal--delay-2"
              style={{ marginTop: '1.6rem' }}
            >
              <button className="btn btn--gold" id="addToCalendar">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Simpan ke Kalender
              </button>
            </div>
          </div>
        </section>

        {/* ACARA */}
        <section className="section" id="acara">
          <img
            className="bloom bloom--md bloom--multiply bloom--warm bloom--fade-r bloom--drift-b bloom-pos-tl"
            data-bloom
            data-px="0.14"
            src="/assets/floral-3.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.5 }}
          />
          <img
            className="bloom bloom--md bloom--multiply bloom--warm bloom--fade-l bloom--drift-a bloom-pos-br"
            data-bloom
            data-px="-0.14"
            src="/assets/floral-3.webp"
            alt=""
            aria-hidden="true"
            style={{
              ['--bloom-opacity' as string]: 0.5,
              transform: 'scaleX(-1) scaleY(-1)',
            }}
          />

          <svg className="orn orn-cluster orn-tl" viewBox="0 0 320 240" aria-hidden="true">
            <use href="#orn-floral-b" />
          </svg>
          <svg className="orn orn-cluster orn-br" viewBox="0 0 320 300" aria-hidden="true">
            <use href="#orn-floral-a" />
          </svg>

          <div className="section__inner">
            <div className="reveal">
              <svg className="div-svg" viewBox="0 0 240 30">
                <use href="#orn-divider" />
              </svg>
              <div className="eyebrow">The Ceremony</div>
              <h2 className="section__title">Tasyakuran Pernikahan</h2>
            </div>

            <div className="acara">
              <div className="acara__card reveal reveal--delay-1">
                <svg
                  className="acara__icon"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <path d="M32 8 C20 8 12 18 12 30 C12 38 16 44 22 50 L32 58 L42 50 C48 44 52 38 52 30 C52 18 44 8 32 8 Z" />
                  <path d="M32 22 L32 38 M24 30 L40 30" />
                  <circle cx="32" cy="14" r="2" fill="currentColor" />
                </svg>
                <h3 className="acara__type">{akad?.type ?? 'Akad Nikah'}</h3>
                <div className="acara__line"></div>
                <p className="acara__date">{akad?.date ?? 'Sabtu, 13 Juni 2026'}</p>
                <p className="acara__time">
                  {akad?.timeStart ?? '08.00'} — {akad?.timeEnd ?? '10.00'}{' '}
                  <span className="acara__time-zone">{akad?.timezone ?? 'WIB'}</span>
                </p>
                <p className="acara__where">
                  {venueName}
                  <br />
                  {(akad?.address ?? venueAddress).map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < (akad?.address ?? venueAddress).length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>

              <div className="acara__card reveal reveal--delay-2">
                <svg
                  className="acara__icon"
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                >
                  <circle cx="32" cy="32" r="22" />
                  <circle cx="32" cy="32" r="14" />
                  <circle cx="32" cy="32" r="2" fill="currentColor" />
                  <path d="M32 18 L32 22 M32 42 L32 46 M18 32 L22 32 M42 32 L46 32" />
                </svg>
                <h3 className="acara__type">{resepsi?.type ?? 'Resepsi'}</h3>
                <div className="acara__line"></div>
                <p className="acara__date">{resepsi?.date ?? 'Sabtu, 13 Juni 2026'}</p>
                <p className="acara__time">
                  {resepsi?.timeStart ?? '10.00'} — {resepsi?.timeEnd ?? '15.00'}{' '}
                  <span className="acara__time-zone">
                    {resepsi?.timezone ?? 'WIB'}
                  </span>
                </p>
                <p className="acara__where">
                  {resepsi?.venue ?? venueName}
                  <br />
                  {(resepsi?.address ?? venueAddress).map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < (resepsi?.address ?? venueAddress).length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LOKASI */}
        <section className="section section--full" id="lokasi">
          <img
            className="bloom bloom--lg bloom--multiply bloom--warm bloom--fade-r bloom--drift-a bloom-pos-tl"
            data-bloom
            data-px="0.16"
            src="/assets/floral-1.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.42 }}
          />
          <img
            className="bloom bloom--lg bloom--multiply bloom--deep bloom--fade-l bloom--drift-b bloom-pos-br"
            data-bloom
            data-px="-0.16"
            src="/assets/floral-2.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.45 }}
          />

          <svg
            className="orn orn-cluster orn-cluster--xl orn-tl--xl"
            viewBox="0 0 320 240"
            aria-hidden="true"
          >
            <use href="#orn-floral-b" />
          </svg>
          <svg
            className="orn orn-cluster orn-cluster--xl orn-br--xl"
            viewBox="0 0 320 300"
            aria-hidden="true"
          >
            <use href="#orn-floral-a" />
          </svg>

          <div className="section__inner">
            <div className="reveal">
              <svg className="div-svg" viewBox="0 0 240 30">
                <use href="#orn-divider" />
              </svg>
              <div className="eyebrow">The Location</div>
              <h2 className="section__title">Lokasi Acara</h2>
            </div>

            <p className="address reveal reveal--delay-1">
              <strong>{venueName}</strong>
              {venueAddress.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < venueAddress.length - 1 && <br />}
                </span>
              ))}
            </p>

            <div className="maps-wrap reveal reveal--delay-2">
              <div className="maps" id="mapsContainer">
                <div className="maps__inner" id="map"></div>
                <div className="maps-fallback" id="mapsFallback">
                  <svg
                    viewBox="0 0 800 550"
                    preserveAspectRatio="xMidYMid slice"
                    style={{ width: '100%', height: '100%', display: 'block' }}
                  >
                    <rect width="800" height="550" fill="#f9ebdd" />
                    <g stroke="#e8b095" strokeWidth="0.5" opacity="0.3">
                      <line x1="0" y1="100" x2="800" y2="100" />
                      <line x1="0" y1="200" x2="800" y2="200" />
                      <line x1="0" y1="300" x2="800" y2="300" />
                      <line x1="0" y1="400" x2="800" y2="400" />
                      <line x1="100" y1="0" x2="100" y2="550" />
                      <line x1="300" y1="0" x2="300" y2="550" />
                      <line x1="500" y1="0" x2="500" y2="550" />
                      <line x1="700" y1="0" x2="700" y2="550" />
                    </g>
                    <path
                      d="M0 320 Q150 310 300 305 Q450 295 600 290 Q700 285 800 280"
                      fill="none"
                      stroke="#c97862"
                      strokeWidth="14"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                    <path
                      d="M0 320 Q150 310 300 305 Q450 295 600 290 Q700 285 800 280"
                      fill="none"
                      stroke="#fdf6ee"
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray="14 10"
                    />
                    <path
                      d="M250 0 Q255 100 290 200 Q310 260 305 305"
                      fill="none"
                      stroke="#c97862"
                      strokeWidth="9"
                      opacity="0.5"
                    />
                    <path
                      d="M500 290 Q520 350 540 450 Q545 500 540 550"
                      fill="none"
                      stroke="#c97862"
                      strokeWidth="9"
                      opacity="0.5"
                    />
                    <text
                      x="700"
                      y="270"
                      fill="#6b3a2c"
                      fontFamily="Cormorant Garamond"
                      fontStyle="italic"
                      fontSize="14"
                      opacity="0.7"
                    >
                      Jl. Pasar Minggu
                    </text>
                    <text
                      x="290"
                      y="170"
                      fill="#6b3a2c"
                      fontFamily="Cormorant Garamond"
                      fontStyle="italic"
                      fontSize="13"
                      opacity="0.7"
                    >
                      Jl. Raya AUP
                    </text>
                    <g fill="#e8b095" opacity="0.45" stroke="#a85a48" strokeWidth="0.8">
                      <rect x="120" y="350" width="60" height="50" rx="3" />
                      <rect x="200" y="370" width="50" height="40" rx="3" />
                      <rect x="380" y="200" width="65" height="55" rx="3" />
                      <rect x="600" y="340" width="55" height="45" rx="3" />
                      <rect x="180" y="180" width="55" height="50" rx="3" />
                      <rect x="660" y="180" width="60" height="50" rx="3" />
                      <rect x="100" y="450" width="80" height="60" rx="3" />
                      <rect x="500" y="430" width="60" height="55" rx="3" />
                    </g>
                    <g>
                      <rect
                        x="380"
                        y="240"
                        width="80"
                        height="60"
                        rx="4"
                        fill="#fdf6ee"
                        stroke="#a85a48"
                        strokeWidth="2"
                      />
                      <path d="M380 240 L420 215 L460 240" fill="#a85a48" opacity="0.6" />
                      <rect x="408" y="270" width="14" height="30" fill="#6b3a2c" opacity="0.6" />
                    </g>
                    <circle cx="420" cy="220" r="32" fill="#a85a48" opacity="0.18">
                      <animate
                        attributeName="r"
                        values="20;38;20"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0.3;0.05;0.3"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <g transform="translate(396 168)">
                      <use href="#orn-pin" width="48" height="62" />
                    </g>
                    <g transform="translate(420 320)">
                      <rect
                        x="-90"
                        y="0"
                        width="180"
                        height="36"
                        rx="18"
                        fill="#fdf6ee"
                        stroke="#b8915a"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="22"
                        textAnchor="middle"
                        fill="#6b3a2c"
                        fontFamily="Italiana"
                        fontSize="18"
                      >
                        {venueName}
                      </text>
                    </g>
                    <g transform="translate(720 80)" opacity="0.6">
                      <circle r="22" fill="#fdf6ee" stroke="#a85a48" strokeWidth="1" />
                      <path d="M0 -16 L4 0 L0 16 L-4 0 Z" fill="#a85a48" />
                      <path d="M0 -16 L4 0 L0 0 Z" fill="#6b3a2c" />
                      <text
                        x="0"
                        y="-26"
                        textAnchor="middle"
                        fill="#6b3a2c"
                        fontFamily="Cormorant Garamond"
                        fontSize="11"
                        fontWeight="600"
                      >
                        N
                      </text>
                    </g>
                    <g transform="translate(40 480) scale(0.8)" opacity="0.5">
                      <use href="#orn-laurel" width="220" height="70" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>

            <div className="lokasi-actions reveal reveal--delay-3">
              <a
                className="btn btn--primary"
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  venueLabel,
                )}`}
                target="_blank"
                rel="noopener"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Buka di Google Maps
              </a>
            </div>

            <div className="distance-box reveal reveal--delay-3" id="distanceBox">
              <div className="distance-box__title">— Seberapa jauh dari Anda? —</div>
              <button className="btn btn--gold distance-box__cta" id="calcDistanceBtn">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Hitung Jarak dari Lokasi Saya
              </button>
              <div className="distance-box__loading" id="distanceLoading">
                <div className="distance-box__spinner"></div>
                <span>Mendeteksi lokasi Anda…</span>
              </div>
              <div className="distance-box__result">
                <div className="distance-box__big">
                  <span id="distanceValue">0</span>
                  <span className="unit" id="distanceUnit">
                    km
                  </span>
                </div>
                <p className="distance-box__caption" id="distanceCaption">
                  Anda berada kurang lebih ini dari lokasi acara.
                </p>
                <button className="distance-box__again" id="recalcDistance">
                  Hitung ulang
                </button>
              </div>
              <div className="distance-box__error" id="distanceError">
                Tidak dapat mengakses lokasi Anda. Pastikan izin lokasi diaktifkan
                di browser, lalu coba lagi.
              </div>
            </div>
          </div>
        </section>

        {/* RSVP */}
        <section className="section" id="rsvp">
          <img
            className="bloom bloom--md bloom--soft bloom--faint bloom--fade-r bloom--drift-c bloom-pos-tl"
            data-bloom
            data-px="0.12"
            src="/assets/floral-3.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.55 }}
          />
          <img
            className="bloom bloom--md bloom--soft bloom--faint bloom--fade-l bloom--drift-a bloom-pos-br"
            data-bloom
            data-px="-0.12"
            src="/assets/floral-3.webp"
            alt=""
            aria-hidden="true"
            style={{
              ['--bloom-opacity' as string]: 0.55,
              transform: 'scaleX(-1) scaleY(-1)',
            }}
          />

          <svg className="orn orn-cluster orn-tl" viewBox="0 0 320 300" aria-hidden="true">
            <use href="#orn-floral-a" />
          </svg>
          <svg className="orn orn-cluster orn-br" viewBox="0 0 320 240" aria-hidden="true">
            <use href="#orn-floral-b" />
          </svg>

          <div className="section__inner">
            <div className="reveal">
              <svg className="div-svg" viewBox="0 0 240 30">
                <use href="#orn-divider" />
              </svg>
              <div className="eyebrow">Konfirmasi Kehadiran</div>
              <h2 className="section__title">RSVP &amp; Doa</h2>
              <p className="section__sub">
                Mohon konfirmasi kehadiran Anda dan sampaikan doa terbaik untuk
                kami.
              </p>
            </div>

            <form className="rsvp-form reveal reveal--delay-1" id="rsvpForm" noValidate>
              <div className="rsvp-form__field">
                <label htmlFor="rsvpName">Nama Anda</label>
                <input
                  type="text"
                  id="rsvpName"
                  name="name"
                  required
                  placeholder="Nama lengkap"
                  autoComplete="name"
                />
              </div>
              <div className="rsvp-form__field">
                <label>Konfirmasi Kehadiran</label>
                <div className="rsvp-radios">
                  <input type="radio" id="rsvpYes" name="attend" value="hadir" defaultChecked />
                  <label htmlFor="rsvpYes">Hadir</label>
                  <input type="radio" id="rsvpMaybe" name="attend" value="ragu" />
                  <label htmlFor="rsvpMaybe">Belum Pasti</label>
                  <input type="radio" id="rsvpNo" name="attend" value="tidak" />
                  <label htmlFor="rsvpNo">Tidak Hadir</label>
                </div>
              </div>
              <div className="rsvp-form__field">
                <label htmlFor="rsvpCount">Jumlah Tamu</label>
                <select id="rsvpCount" name="count" defaultValue="1">
                  <option value="1">1 Orang</option>
                  <option value="2">2 Orang</option>
                  <option value="3">3 Orang</option>
                  <option value="4">4 Orang</option>
                </select>
              </div>
              <div className="rsvp-form__field">
                <label htmlFor="rsvpMsg">Ucapan &amp; Doa</label>
                <textarea
                  id="rsvpMsg"
                  name="message"
                  placeholder="Tulis ucapan & doa terbaik untuk kami…"
                ></textarea>
              </div>
              <button type="submit" className="btn btn--primary rsvp-form__submit">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
                Kirim Konfirmasi
              </button>
            </form>

            <div className="ucapan-list reveal reveal--delay-2" id="ucapanList" aria-live="polite">
              <div className="ucapan-item">
                <div className="ucapan-item__head">
                  <span className="ucapan-item__name">Keluarga Besar</span>
                  <span className="ucapan-item__status">Hadir</span>
                </div>
                <p className="ucapan-item__msg">
                  "Barakallahu laka wa baraka 'alaika wa jama'a bainakuma fi
                  khair. Semoga menjadi keluarga sakinah, mawaddah, wa rahmah."
                </p>
              </div>
              <div className="ucapan-item">
                <div className="ucapan-item__head">
                  <span className="ucapan-item__name">Sahabat SMAIT Ruhama</span>
                  <span className="ucapan-item__status">Hadir</span>
                </div>
                <p className="ucapan-item__msg">
                  "Selamat menempuh hidup baru, Pak Rizki &amp; Mbak Fadia. Semoga
                  senantiasa dalam lindungan Allah SWT."
                </p>
              </div>
              <div className="ucapan-item">
                <div className="ucapan-item__head">
                  <span className="ucapan-item__name">Teman Dekat</span>
                  <span className="ucapan-item__status">Hadir</span>
                </div>
                <p className="ucapan-item__msg">
                  "Semoga pernikahan kalian penuh keberkahan, dilimpahkan rezeki
                  yang halal, dan dianugerahi keturunan yang shalih shalihah.
                  Aamiin."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AMPLOP */}
        <section className="section section--full" id="amplop">
          <img
            className="bloom bloom--xl bloom--multiply bloom--warm bloom--fade-all bloom--drift-c bloom-pos-c"
            data-bloom
            data-px="0.1"
            src="/assets/floral-1.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.32 }}
          />
          <img
            className="bloom bloom--md bloom--multiply bloom--deep bloom--fade-r bloom--drift-a bloom-pos-tl"
            data-bloom
            data-px="-0.18"
            src="/assets/floral-4.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.5 }}
          />
          <img
            className="bloom bloom--md bloom--multiply bloom--deep bloom--fade-l bloom--drift-b bloom-pos-br"
            data-bloom
            data-px="0.18"
            src="/assets/floral-4.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.5, transform: 'scaleX(-1)' }}
          />

          <svg
            className="orn orn-cluster orn-cluster--xl orn-tl--xl"
            viewBox="0 0 320 300"
            aria-hidden="true"
          >
            <use href="#orn-floral-a" />
          </svg>
          <svg
            className="orn orn-cluster orn-cluster--xl orn-br--xl"
            viewBox="0 0 320 240"
            aria-hidden="true"
          >
            <use href="#orn-floral-b" />
          </svg>

          <div className="section__inner">
            <div className="reveal">
              <svg className="div-svg" viewBox="0 0 240 30">
                <use href="#orn-divider" />
              </svg>
              <div className="eyebrow">Wedding Gift</div>
              <h2 className="section__title">Amplop Digital</h2>
              <p className="section__sub">
                Tanpa mengurangi rasa hormat, bagi sahabat dan keluarga yang ingin
                memberikan tanda kasih, dapat melalui rekening berikut.
              </p>
            </div>

            <div className="amplop-cards">
              {banks.map((acc, i) => {
                const targetId = `num-${acc.bank.toLowerCase()}-${i}`
                return (
                  <div
                    key={i}
                    className={`amplop-card reveal reveal--delay-${i + 1}`}
                  >
                    <div className="amplop-card__bank">{acc.bank}</div>
                    <div className="amplop-card__num" id={targetId}>
                      {acc.number}
                    </div>
                    <div className="amplop-card__name">{acc.holder}</div>
                    <button
                      className="amplop-card__copy"
                      data-copy={acc.number}
                      data-target={targetId}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      <span>Salin</span>
                    </button>
                  </div>
                )
              })}
            </div>

            <p
              className="body reveal reveal--delay-3"
              style={{
                fontStyle: 'italic',
                opacity: 0.85,
                fontSize: '0.95rem',
                marginTop: '1.6rem',
              }}
            >
              Doa &amp; restu Anda adalah hadiah paling berarti bagi kami.
            </p>
          </div>
        </section>

        {/* PENUTUP */}
        <section className="section penutup" id="penutup">
          <img
            className="bloom bloom--xl bloom--multiply bloom--warm bloom--fade-all bloom--drift-c bloom-pos-c"
            data-bloom
            data-px="0.08"
            src="/assets/floral-2.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.4 }}
          />
          <img
            className="bloom bloom--lg bloom--soft bloom--faint bloom--fade-btm bloom--drift-a bloom-pos-tl"
            data-bloom
            data-px="-0.14"
            src="/assets/floral-1.webp"
            alt=""
            aria-hidden="true"
            style={{ ['--bloom-opacity' as string]: 0.45 }}
          />

          <svg className="orn orn-cluster orn-tl" viewBox="0 0 320 240" aria-hidden="true">
            <use href="#orn-floral-b" />
          </svg>
          <svg className="orn orn-cluster orn-tr" viewBox="0 0 320 300" aria-hidden="true">
            <use href="#orn-floral-a" />
          </svg>
          <svg className="orn orn-cluster orn-bl" viewBox="0 0 320 300" aria-hidden="true">
            <use href="#orn-floral-a" />
          </svg>
          <svg className="orn orn-cluster orn-br" viewBox="0 0 320 240" aria-hidden="true">
            <use href="#orn-floral-b" />
          </svg>

          <div className="section__inner">
            <svg
              className="reveal"
              style={{
                width: '220px',
                height: '70px',
                color: 'var(--terracotta)',
                opacity: 0.7,
                margin: '0 auto 1.4rem',
                display: 'block',
              }}
              viewBox="0 0 220 70"
            >
              <use href="#orn-laurel" />
            </svg>

            <p className="body reveal reveal--delay-1">
              Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
              Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada
              kedua mempelai.
            </p>
            <p className="body reveal reveal--delay-2">
              Atas kehadiran dan doa restu yang diberikan, kami sekeluarga
              mengucapkan terima kasih.
            </p>

            <svg className="div-svg reveal reveal--delay-2" viewBox="0 0 240 30">
              <use href="#orn-divider" />
            </svg>

            <p className="body reveal reveal--delay-3" style={{ fontStyle: 'italic' }}>
              <em>Wassalamu'alaikum Warahmatullahi Wabarakatuh</em>
            </p>

            <p className="penutup__from reveal reveal--delay-3">Kami yang berbahagia,</p>
            <h2 className="penutup__sign reveal reveal--delay-3">
              {groom.nickName} <span className="amp">&amp;</span> {bride.nickName}
            </h2>
          </div>
        </section>

        <footer>
          <p>
            Crafted with <span className="heart">♡</span> by MLJDL Agency
          </p>
        </footer>
      </main>

      <div className="toast" id="toast" role="status" aria-live="polite">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span id="toastMsg">Tersalin!</span>
      </div>
    </div>
  )
}
