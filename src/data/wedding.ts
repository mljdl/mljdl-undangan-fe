import type { EventDetail, Person } from '../types';

export const WEDDING_DATE_ISO = '2026-06-13T08:00:00+07:00';

export const COUPLE_BRIDE: Person = {
  fullName: 'Nurul Fadia, S.S.I',
  nickName: 'Fadia',
  role: 'Mempelai Wanita',
  birthOrder: 'Anak ke-2 dari 3 bersaudara',
  parents: {
    father: { name: 'Bapak M. Syakur', deceased: true },
    mother: { name: 'Ibu Chairani', deceased: true },
  },
};

export const COUPLE_GROOM: Person = {
  fullName: 'Mochammad Rizki, S.Pd',
  nickName: 'Rizki',
  role: 'Mempelai Pria',
  birthOrder: 'Anak ke-3 dari 3 bersaudara',
  parents: {
    father: { name: 'Bapak Juanda' },
    mother: { name: 'Ibu Tuti' },
  },
};

export const EVENTS: EventDetail[] = [
  {
    type: 'Akad Nikah',
    date: 'Sabtu, 13 Juni 2026',
    timeStart: '08.00',
    timeEnd: '10.00',
    timezone: 'WIB',
    venue: "Kinanti's House",
    address: ['Jl. AUP No. 7 RT 4/RW 10', 'Pasar Minggu, Jakarta Selatan'],
  },
  {
    type: 'Resepsi',
    date: 'Sabtu, 13 Juni 2026',
    timeStart: '10.00',
    timeEnd: '15.00',
    timezone: 'WIB',
    venue: "Kinanti's House",
    address: ['Jl. AUP No. 7 RT 4/RW 10', 'Pasar Minggu, Jakarta Selatan'],
  },
];

export const VENUE = {
  name: "Kinanti's House",
  address: 'Jl. AUP No. 7 RT 4/RW 10, Pasar Minggu, Jakarta Selatan',
  // Approximate coordinates for Pasar Minggu area
  lat: -6.2876,
  lng: 106.8459,
  mapsUrl: 'https://maps.google.com/?q=Jl.+AUP+No.+7+Pasar+Minggu+Jakarta+Selatan',
};
