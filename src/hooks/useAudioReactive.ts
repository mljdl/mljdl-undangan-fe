import { useEffect } from 'react'

interface Options {
  /** id elemen <audio> (default 'bgAudio'). */
  audioId?: string
  /**
   * Elemen target tempat CSS variable ditulis (mis. `.wedding-root`).
   * Variable yang di-set:
   *   --au-bass    (0..1) — energi frekuensi rendah (dentuman/beat), smoothed
   *   --au-energy  (0..1) — energi keseluruhan lagu, smoothed
   *   --au-active  (0/1)  — 1 saat musik benar-benar main
   */
  target: HTMLElement | null
  /** Faktor smoothing (0..1). Makin kecil makin halus/lambat. Default 0.18. */
  smoothing?: number
}

/**
 * Audio-reactive driver: menganalisis <audio> via Web Audio API dan menulis
 * nilai bass/energy ke CSS custom property pada `target`. Elemen dekoratif
 * (bloom, petal, ornament, glow) bereaksi murni lewat CSS — tanpa re-render
 * React, jadi ringan.
 *
 * Graceful: AudioContext baru dibuat saat audio pertama kali `play` (butuh
 * user gesture). Kalau file audio tidak ada / tidak pernah diputar, semua
 * variable tetap 0 dan tidak ada reaksi (template tampil normal).
 *
 * Catatan teknis: createMediaElementSource() hanya boleh dipanggil SEKALI per
 * elemen audio — di-guard dengan flag pada elemennya.
 */
export function useAudioReactive({
  audioId = 'bgAudio',
  target,
  smoothing = 0.18,
}: Options) {
  useEffect(() => {
    if (!target) return
    if (typeof window === 'undefined') return

    const audio = document.getElementById(audioId) as HTMLAudioElement | null
    if (!audio) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    type AudioEl = HTMLAudioElement & {
      __auSource?: MediaElementAudioSourceNode
      __auCtx?: AudioContext
    }
    const el = audio as AudioEl

    let ctx: AudioContext | null = null
    let analyser: AnalyserNode | null = null
    let freq: Uint8Array | null = null
    let raf = 0
    let bass = 0
    let energy = 0
    let disposed = false

    const setVar = (name: string, value: number) => {
      target.style.setProperty(name, value.toFixed(3))
    }

    function ensureGraph() {
      if (ctx || disposed) return
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!Ctor) return
      try {
        // Reuse existing source/ctx kalau hook pernah jalan (StrictMode/re-mount).
        if (el.__auCtx && el.__auSource) {
          ctx = el.__auCtx
          const src = el.__auSource
          analyser = ctx.createAnalyser()
          analyser.fftSize = 256
          analyser.smoothingTimeConstant = 0.8
          src.connect(analyser)
        } else {
          ctx = new Ctor()
          const src = ctx.createMediaElementSource(el)
          analyser = ctx.createAnalyser()
          analyser.fftSize = 256
          analyser.smoothingTimeConstant = 0.8
          src.connect(analyser)
          analyser.connect(ctx.destination)
          el.__auCtx = ctx
          el.__auSource = src
        }
        freq = new Uint8Array(analyser.frequencyBinCount)
      } catch {
        // createMediaElementSource bisa throw kalau sudah pernah dipanggil di
        // konteks lain — abaikan, fitur jadi no-op.
        ctx = null
        analyser = null
      }
    }

    function loop() {
      raf = requestAnimationFrame(loop)
      if (!analyser || !freq) return
      analyser.getByteFrequencyData(freq)

      const bins = freq.length
      // Bass = ~rentang bin terendah (kira-kira <150Hz pada fftSize 256/44.1k).
      const bassEnd = Math.max(2, Math.floor(bins * 0.08))
      let bSum = 0
      for (let i = 0; i < bassEnd; i++) bSum += freq[i]
      const bassRaw = bSum / bassEnd / 255

      let eSum = 0
      for (let i = 0; i < bins; i++) eSum += freq[i]
      const energyRaw = eSum / bins / 255

      // Smoothing (lerp) supaya halus, ga jittery.
      bass += (bassRaw - bass) * smoothing
      energy += (energyRaw - energy) * smoothing

      setVar('--au-bass', bass)
      setVar('--au-energy', energy)
    }

    const onPlay = () => {
      if (reduceMotion) return
      ensureGraph()
      if (ctx && ctx.state === 'suspended') void ctx.resume()
      target.style.setProperty('--au-active', '1')
      if (!raf) raf = requestAnimationFrame(loop)
    }

    const onPauseOrEnd = () => {
      target.style.setProperty('--au-active', '0')
      // decay halus ke 0
      const decay = () => {
        bass *= 0.9
        energy *= 0.9
        setVar('--au-bass', bass)
        setVar('--au-energy', energy)
        if (bass > 0.01 || energy > 0.01) {
          requestAnimationFrame(decay)
        }
      }
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      requestAnimationFrame(decay)
    }

    // init vars
    target.style.setProperty('--au-bass', '0')
    target.style.setProperty('--au-energy', '0')
    target.style.setProperty('--au-active', '0')

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPauseOrEnd)
    audio.addEventListener('ended', onPauseOrEnd)
    // kalau audio sudah keburu main sebelum listener pasang
    if (!audio.paused) onPlay()

    return () => {
      disposed = true
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPauseOrEnd)
      audio.removeEventListener('ended', onPauseOrEnd)
      if (raf) cancelAnimationFrame(raf)
      // Jangan close ctx (di-cache di elemen audio untuk re-mount berikutnya).
      try {
        analyser?.disconnect()
      } catch {
        /* ignore */
      }
    }
  }, [audioId, target, smoothing])
}
