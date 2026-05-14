// ── Wedding template renderer types (legacy from undangan-fe) ──
export interface Person {
  fullName: string
  nickName: string
  role?: 'Mempelai Pria' | 'Mempelai Wanita'
  birthOrder?: string
  parents?: {
    father?: { name: string; deceased?: boolean }
    mother?: { name: string; deceased?: boolean }
  }
}

export interface EventDetail {
  type: 'Akad Nikah' | 'Resepsi' | string
  date: string
  timeStart?: string
  timeEnd?: string
  timezone?: string
  venue?: string
  address?: string[]
  lat?: number
  lng?: number
  dateIso?: string
}

export interface BankAccount {
  bank: string
  number: string
  holder: string
}

export interface Guest {
  id: string
  name: string
  phone?: string
  shared: boolean
}

export interface Ucapan {
  id: string
  name: string
  attend: 'hadir' | 'ragu' | 'tidak'
  count: number
  message: string
  createdAt: string
}

export interface ToastState {
  type: 'success' | 'error' | 'info'
  message: string
}

// ── CMS/admin/discovery types ──────────────────────────────────
export type UserRole = 'couple' | 'wedding_admin' | 'wedding_superadmin'

export interface AuthUser {
  id: string
  name: string
  email: string
  roles: string[]
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export type WeddingStatus =
  | 'draft'
  | 'on_progress'
  | 'in_review'
  | 'final_draft'
  | 'published'
  | 'archived'

export type WeddingProgressStep = 1 | 2 | 3 | 4

export interface WeddingBride {
  fullName: string
  nickName: string
  birthOrder?: string
  parents?: {
    father?: { name: string; deceased?: boolean }
    mother?: { name: string; deceased?: boolean }
  }
}

export interface WeddingEventData {
  type: string
  date: string
  dateIso?: string
  timeStart?: string
  timeEnd?: string
  timezone?: string
  venue?: string
  address?: string[]
  lat?: number
  lng?: number
}

export interface WeddingBankAccount {
  bank: string
  number: string
  holder: string
}

export interface WeddingTheme {
  primaryColor?: string
  secondaryColor?: string
  font?: string
}

export interface WeddingCoupleData {
  bride?: WeddingBride
  groom?: WeddingBride
}

export interface Wedding {
  id: string
  slug: string
  status: WeddingStatus
  progressStep: WeddingProgressStep
  templateId: string
  templateSlug?: string | null
  templateName?: string | null
  ownerUserId: string
  ownerName?: string | null
  ownerEmail?: string | null
  assignedAdminUserId?: string | null
  assignedAdminName?: string | null
  coupleData: WeddingCoupleData | null
  events: WeddingEventData[] | null
  bankAccounts: WeddingBankAccount[] | null
  theme: WeddingTheme | null
  hasCoupleAssets: boolean
  publishedAt: string | null
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

export interface WeddingTemplate {
  id: string
  slug: string
  name: string
  description: string | null
  thumbnailUrl: string | null
  previewImageUrl: string | null
  previewDemoUrl: string | null
  configSchema: {
    allowAudio?: boolean
    allowCustomColors?: string[]
    requiresPhotos?: string[]
    supportedSections?: string[]
  }
  isPremium: boolean
  priceIdr: number
  displayOrder: number
}

export interface WeddingGuest {
  id: string
  weddingId: string
  name: string
  phone: string | null
  inviteToken: string | null
  sharedAt: string | null
  openedAt: string | null
  createdAt: string
}

export interface WeddingRsvp {
  id: string
  weddingId: string
  guestId: string | null
  guestName: string | null
  name: string
  attend: 'hadir' | 'ragu' | 'tidak'
  count: number
  message: string | null
  createdAt: string
}

export interface ApiErrorBody {
  error?: {
    code: string
    message: string
    status?: number
  }
}
