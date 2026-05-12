export interface Person {
  fullName: string;
  nickName: string;
  role: 'Mempelai Pria' | 'Mempelai Wanita';
  birthOrder: string;
  parents: {
    father: { name: string; deceased?: boolean };
    mother: { name: string; deceased?: boolean };
  };
}

export interface EventDetail {
  type: 'Akad Nikah' | 'Resepsi';
  date: string;
  timeStart: string;
  timeEnd: string;
  timezone: string;
  venue: string;
  address: string[];
}

export interface BankAccount {
  bank: string;
  number: string;
  holder: string;
}

export interface Guest {
  id: string;
  name: string;
  phone?: string;
  shared: boolean;
}

export interface Ucapan {
  id: string;
  name: string;
  attend: 'hadir' | 'ragu' | 'tidak';
  count: number;
  message: string;
  createdAt: string;
}

export interface ToastState {
  type: 'success' | 'error' | 'info';
  message: string;
}
