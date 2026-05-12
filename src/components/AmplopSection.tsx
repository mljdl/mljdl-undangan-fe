import { Copy } from 'lucide-react';
import { useState } from 'react';
import { BANK_ACCOUNTS } from '../data/bank';
import { Toast } from './Toast';

export const AmplopSection = () => {
  const [toastVisible, setToastVisible] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastVisible(true);
    } catch {
      setToastVisible(true);
    }
  };

  return (
    <section
      id="amplop"
      className="wedding-section bg-gradient-to-b from-cream-warm/40 to-transparent"
    >
      <div className="wedding-section__inner max-w-3xl">
        <div className="reveal">
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mb-6" />
          <div className="eyebrow">Wedding Gift</div>
          <h2 className="section-title">Amplop Digital</h2>
          <p className="body-text">
            Tanpa mengurangi rasa hormat, bagi sahabat dan keluarga yang ingin memberikan tanda
            kasih, dapat melalui rekening berikut.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          {BANK_ACCOUNTS.map((acc, i) => (
            <div
              key={acc.bank}
              className={`reveal reveal--delay-${(i + 1) as 1 | 2} bg-cream/70 backdrop-blur-sm border border-gold/30 rounded-3xl p-6 shadow-soft text-center`}
            >
              <div className="font-display tracking-[0.3em] uppercase text-sm text-rose-dust">
                {acc.bank}
              </div>
              <div className="font-display text-2xl md:text-3xl text-brown-deep mt-2 tabular-nums">
                {acc.number}
              </div>
              <div className="text-sm text-brown-ink/70 mt-1">{acc.holder}</div>
              <button
                type="button"
                onClick={() => handleCopy(acc.number)}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/40 text-rose-dust text-xs uppercase tracking-widest hover:bg-rose-dust hover:text-cream transition-colors"
              >
                <Copy size={14} />
                Salin
              </button>
            </div>
          ))}
        </div>

        <p className="body-text italic mt-8 reveal reveal--delay-3 text-sm">
          Doa &amp; restu Anda adalah hadiah paling berarti bagi kami.
        </p>
      </div>

      <Toast
        message="Nomor rekening tersalin"
        show={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </section>
  );
};
