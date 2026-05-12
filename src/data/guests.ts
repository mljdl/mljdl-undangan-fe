import type { Guest } from '../types';

/**
 * Daftar tamu awal. Edit array ini untuk menambah/ubah tamu.
 * Field `shared` menandai apakah link sudah dikirim ke tamu.
 */
export const INITIAL_GUESTS: Guest[] = [
  { id: 'g-001', name: 'Bapak Andi Wijaya', phone: '081234567890', shared: false },
  { id: 'g-002', name: 'Ibu Sri Mulyani', phone: '081298765432', shared: true },
  { id: 'g-003', name: 'Keluarga Bapak Suparno', shared: false },
];
