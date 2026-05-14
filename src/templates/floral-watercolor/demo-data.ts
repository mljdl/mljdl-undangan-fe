import { BANK_ACCOUNTS } from '../../data/bank'
import {
  COUPLE_BRIDE,
  COUPLE_GROOM,
  EVENTS,
  WEDDING_DATE_ISO,
} from '../../data/wedding'
import type { TemplateWeddingData } from '../types'

export const DEMO_DATA: TemplateWeddingData = {
  slug: 'rizki-fadia',
  bride: COUPLE_BRIDE,
  groom: COUPLE_GROOM,
  events: EVENTS,
  bankAccounts: BANK_ACCOUNTS,
  weddingDateIso: WEDDING_DATE_ISO,
  guestName: 'Tamu Undangan',
}
