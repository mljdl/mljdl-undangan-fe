import { useEffect, useState } from 'react'

interface Coords {
  lat: number
  lng: number
}

type DistanceState =
  | { status: 'idle' }
  | { status: 'asking' }
  | { status: 'denied'; reason: string }
  | { status: 'ok'; km: number; userCoords: Coords }

/**
 * Hitung jarak user ke venue dengan Geolocation API + Haversine formula.
 *
 * - Prompt permission ke user (browser akan munculin native dialog).
 * - Kalau di-allow, return km dengan 1 desimal.
 * - Kalau di-deny atau ga ada GPS, fallback ke status "denied".
 *
 * Penting: Geolocation API HANYA bekerja di HTTPS atau localhost. Di production
 * pastikan deploy ke HTTPS supaya bisa request lokasi.
 */
export function useDistance(venue: Coords, options?: { auto?: boolean }) {
  const [state, setState] = useState<DistanceState>({ status: 'idle' })

  const request = () => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'denied', reason: 'Browser tidak mendukung geolocation.' })
      return
    }
    setState({ status: 'asking' })
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const km = haversineKm(
          { lat: pos.coords.latitude, lng: pos.coords.longitude },
          venue,
        )
        setState({
          status: 'ok',
          km,
          userCoords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        })
      },
      (err) => {
        const reasons: Record<number, string> = {
          1: 'Izin lokasi ditolak.',
          2: 'Lokasi tidak tersedia.',
          3: 'Permintaan lokasi timeout.',
        }
        setState({ status: 'denied', reason: reasons[err.code] ?? err.message })
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 5 * 60 * 1000 },
    )
  }

  useEffect(() => {
    if (options?.auto) request()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { state, request }
}

function haversineKm(a: Coords, b: Coords): number {
  const R = 6371 // Earth radius km
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
  return Math.round(R * c * 10) / 10
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}
