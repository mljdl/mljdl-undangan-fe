import { useState } from 'react';
import { AcaraSection } from '../components/AcaraSection';
import { AmplopSection } from '../components/AmplopSection';
import { AyatSection } from '../components/AyatSection';
import { CountdownSection } from '../components/CountdownSection';
import { CoverSection } from '../components/CoverSection';
import { HadithSection } from '../components/HadithSection';
import { LokasiSection } from '../components/LokasiSection';
import { MempelaiSection } from '../components/MempelaiSection';
import { PembukaanSection } from '../components/PembukaanSection';
import { PenutupSection } from '../components/PenutupSection';
import { Preloader } from '../components/Preloader';
import { RsvpSection } from '../components/RsvpSection';

export const UndanganPage = () => {
  const [opened, setOpened] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    requestAnimationFrame(() => {
      const el = document.getElementById('pembukaan');
      el?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  return (
    <>
      <Preloader />
      <CoverSection onOpen={handleOpen} />

      {opened && (
        <main id="main">
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
      )}
    </>
  );
};
