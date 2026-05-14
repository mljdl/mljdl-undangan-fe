import type { TemplateModule } from '../types'
import { DEMO_DATA } from './demo-data'
import { FloralWatercolorTemplate } from './FloralWatercolorTemplate'

const TEMPLATE: TemplateModule = {
  slug: 'floral-watercolor',
  name: 'Floral Watercolor',
  description: 'Elegan, warm, klasik dengan ornamen floral hand-painted.',
  thumbnail: '/templates/floral-watercolor/thumb.png',
  preview: '/templates/floral-watercolor/preview.png',
  Component: FloralWatercolorTemplate,
  defaultDemoData: DEMO_DATA,
  configSchema: {
    allowAudio: true,
    allowCustomColors: ['primary'],
    requiresPhotos: [],
    supportedSections: [
      'cover',
      'pembukaan',
      'ayat',
      'hadith',
      'mempelai',
      'countdown',
      'acara',
      'lokasi',
      'rsvp',
      'amplop',
      'penutup',
    ],
  },
}

export default TEMPLATE
