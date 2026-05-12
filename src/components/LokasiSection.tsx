import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { VENUE } from '../data/wedding';

export const LokasiSection = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = mapRef.current;
    if (!el) return;

    const map = L.map(el, {
      center: [VENUE.lat, VENUE.lng],
      zoom: 16,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    L.marker([VENUE.lat, VENUE.lng]).addTo(map).bindPopup(VENUE.name);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <section
      id="lokasi"
      className="wedding-section bg-gradient-to-b from-transparent to-cream-warm/40"
    >
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

        <div className="reveal reveal--delay-2 mt-8 rounded-3xl overflow-hidden border border-gold/30 shadow-soft">
          <div ref={mapRef} className="w-full h-72 md:h-96 bg-cream-warm" />
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
  );
};
