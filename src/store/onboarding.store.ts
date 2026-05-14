/**
 * Onboarding store: simpen field tambahan dari form Daftar yang BELUM
 * dipersist ke BE (karena BE `/auth/register` cuma butuh name/email/password).
 *
 * Data ini di-prefill saat user pertama kali edit `/cms/konten`.
 */

const STORAGE_KEY = 'mljdl-undgn:onboarding'

export type OnboardingRole = 'pria' | 'wanita'

export interface OnboardingProfile {
  /** Nomor WhatsApp couple (yang daftar). E.g. "+628123456789". */
  phone?: string
  /** Nama pasangan (calon yg satunya, yg ga daftar). */
  partnerName?: string
  /** Estimasi tanggal nikah, ISO date (YYYY-MM-DD). */
  weddingDate?: string
  /** Role user yang daftar: pria atau wanita. */
  role?: OnboardingRole
}

function read(): OnboardingProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as OnboardingProfile
  } catch {
    return null
  }
}

function write(data: OnboardingProfile | null): void {
  try {
    if (data && Object.keys(data).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    /* ignore quota errors */
  }
}

export const onboardingStore = {
  get: read,
  set: write,
  clear: () => write(null),
}
