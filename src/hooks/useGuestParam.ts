import { useMemo } from 'react';

/**
 * Reads `?to=<name>` from the URL so the cover can greet the invited guest.
 * Falls back to "Tamu Undangan" when the param is absent.
 */
export function useGuestParam(): string {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'Tamu Undangan';
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    return to ? decodeURIComponent(to.replace(/\+/g, ' ')) : 'Tamu Undangan';
  }, []);
}
