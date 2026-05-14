import { useState } from 'react'
import { AcaraSection } from '../../components/AcaraSection'
import { AmplopSection } from '../../components/AmplopSection'
import { AyatSection } from '../../components/AyatSection'
import { CountdownSection } from '../../components/CountdownSection'
import { CoverSection } from '../../components/CoverSection'
import { HadithSection } from '../../components/HadithSection'
import { LokasiSection } from '../../components/LokasiSection'
import { MempelaiSection } from '../../components/MempelaiSection'
import { PembukaanSection } from '../../components/PembukaanSection'
import { PenutupSection } from '../../components/PenutupSection'
import { PetalRain } from '../../components/PetalRain'
import { Preloader } from '../../components/Preloader'
import { RsvpSection } from '../../components/RsvpSection'
import type { TemplateWeddingData } from '../types'

/**
 * Wrapper component yang menggabungkan semua section. Receives `data` prop
 * sehingga bisa dipakai oleh PreviewPage (mock/live data) maupun WeddingPage
 * (real data from API). Existing section components di src/components/ tetap
 * baca dari src/data/* sebagai fallback - layer ini cukup orchestrasi flow
 * cover -> sections.
 *
 * Future enhancement: pass `data` ke setiap section sehingga semua section
 * benar-benar data-driven. Untuk MVP-1 cukup pakai data hardcoded dari
 * src/data/ sebagai default, di-override nanti pas multi-tenant.
 */
interface Props {
  data: TemplateWeddingData
  /**
   * Preview mode: skip Preloader dan langsung expand semua section supaya
   * user bisa scroll & lihat full template tanpa harus klik "Buka Undangan".
   * Dipakai oleh `/preview/:templateSlug` dan iframe-iframe preview.
   */
  previewMode?: boolean
}

export const FloralWatercolorTemplate: React.FC<Props> = ({ data, previewMode = false }) => {
  const [opened, setOpened] = useState(previewMode)

  return (
    <>
      {!previewMode && <Preloader />}
      <CoverSection onOpen={() => setOpened(true)} />

      {opened && (
        <>
          {/* Petal rain — floats di atas semua content, behind modals */}
          <PetalRain count={18} />

          <main id="main" data-wedding-slug={data.slug} className="relative">
            <PembukaanSection />
            <AyatSection />
            <HadithSection />
            <MempelaiSection />
            <CountdownSection />
            <AcaraSection />
            <LokasiSection />
            <RsvpSection />
            <AmplopSection />
            <PenutupSection />
          </main>
        </>
      )}
    </>
  )
}
