import L from 'leaflet'
import { MapPin, Navigation, Route } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { VENUE } from '../data/wedding'
import { useDistance } from '../hooks/useDistance'

export const LokasiSection = () => {
  const mapRef = useRef<HTMLDivElement | null>(null)
  const { state, request } = useDistance(
    { lat: VENUE.lat, lng: VENUE.lng },
    { auto: true },
  )

  useEffect(() => {
    const el = mapRef.current
    if (!el) return

    const map = L.map(el, {
      center: [VENUE.lat, VENUE.lng],
      zoom: 16,
      scrollWheelZoom: false,
    })

    // CartoDB Voyager — clean light style yang match wedding palette
    // (lebih soft dari OpenStreetMap default). Free, no API key.
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      },
    ).addTo(map)

    // Custom rose-dust marker dengan SVG inline (no broken default-marker icons)
    const customIcon = L.divIcon({
      className: 'wedding-marker',
      html: `
        <div style="
          width: 36px; height: 36px;
          background: #c97862;
          border: 3px solid #fff8ec;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(107,58,44,0.35);
          display: flex; align-items: center; justify-content: center;
        ">
          <div style="
            width: 10px; height: 10px;
            background: #fff8ec;
            border-radius: 50%;
            transform: rotate(45deg);
          "></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    })

    L.marker([VENUE.lat, VENUE.lng], { icon: customIcon })
      .addTo(map)
      .bindPopup(`<strong>${VENUE.name}</strong>`)

    return () => {
      map.remove()
    }
  }, [])

  return (
    <section
      id="lokasi"
      className="wedding-section bg-gradient-to-b from-transparent to-cream-warm/40 relative"
    >
      {/* Floral decoration accents — bloom-drift untuk subtle movement */}
      <img
        src="/assets/floral-1.svg"
        alt=""
        aria-hidden="true"
        className="absolute top-0 left-0 w-32 md:w-48 opacity-50 pointer-events-none -translate-x-8 -translate-y-8 bloom-drift-a"
        style={{ filter: 'sepia(0.15) saturate(0.9)' }}
      />
      <img
        src="/assets/floral-2.svg"
        alt=""
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-32 md:w-48 opacity-50 pointer-events-none translate-x-8 translate-y-8 bloom-drift-b"
        style={{ filter: 'sepia(0.15) saturate(0.9)' }}
      />

      <div className="wedding-section__inner max-w-4xl">
        <div className="reveal">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mb-6" />
          <div className="eyebrow">The Location</div>
          <h2 className="section-title">Lokasi Acara</h2>
        </div>

        <p className="body-text reveal reveal--delay-1">
          <strong>{VENUE.name}</strong>
          <br />
          {VENUE.address}
        </p>

        <div className="reveal reveal--delay-2 mt-8 rounded-3xl overflow-hidden border-2 border-gold/40 shadow-soft-lg">
          <div ref={mapRef} className="map-themed w-full h-72 md:h-96 bg-cream-warm" />
        </div>

        {/* Distance indicator */}
        <div className="reveal reveal--delay-2 mt-5 flex justify-center">
          <DistanceBadge state={state} onRetry={request} />
        </div>

        <div className="reveal reveal--delay-3 mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={VENUE.mapsUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-gold"
          >
            <Navigation size={16} />
            Buka di Google Maps
          </a>
          <a
            href={`geo:${VENUE.lat},${VENUE.lng}?q=${encodeURIComponent(VENUE.address)}`}
            className="btn-gold bg-brown-deep hover:bg-brown-ink"
          >
            <MapPin size={16} />
            Petunjuk Arah
          </a>
        </div>
      </div>
    </section>
  )
}

const DistanceBadge = ({
  state,
  onRetry,
}: {
  state: ReturnType<typeof useDistance>['state']
  onRetry: () => void
}) => {
  if (state.status === 'asking') {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream-soft border border-gold/30 text-xs md:text-sm font-display text-brown-deep tracking-widest uppercase">
        <Route size={14} className="animate-pulse" />
        Menghitung jarak Anda...
      </span>
    )
  }

  if (state.status === 'denied') {
    return (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream-soft border border-gold/30 text-xs md:text-sm font-display text-brown-deep tracking-widest uppercase hover:bg-cream-deep transition-colors"
        title={state.reason}
      >
        <Route size={14} />
        Izinkan lokasi untuk lihat jarak
      </button>
    )
  }

  if (state.status === 'ok') {
    return (
      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-dust text-cream text-xs md:text-sm font-display tracking-widest uppercase shadow-soft">
        <Route size={14} />
        Jarak Anda: {state.km} km dari venue
      </span>
    )
  }

  return null
}
