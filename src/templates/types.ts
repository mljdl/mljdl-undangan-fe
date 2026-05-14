import type { FC } from 'react'
import type { Person, EventDetail, BankAccount } from '../types'

/**
 * Shape of wedding data passed ke template Component.
 * Diadopsi dari API response (mljdl-agency-os-core public endpoint)
 * plus local fallback (default Rizki & Fadia).
 */
export interface TemplateWeddingData {
  slug?: string
  bride: Person | null
  groom: Person | null
  events: EventDetail[]
  bankAccounts: BankAccount[]
  weddingDateIso: string
  guestName?: string
}

export interface TemplateComponentProps {
  data: TemplateWeddingData
  /**
   * Preview mode: skip splash/preloader + auto-expand semua section
   * supaya iframe preview bisa langsung scroll full template.
   */
  previewMode?: boolean
}

export interface TemplateModule {
  slug: string
  name: string
  description: string
  thumbnail: string
  preview: string
  Component: FC<TemplateComponentProps>
  defaultDemoData: TemplateWeddingData
  configSchema: {
    allowAudio?: boolean
    allowCustomColors?: string[]
    requiresPhotos?: string[]
    supportedSections?: string[]
  }
}
