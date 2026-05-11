import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Device {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  wattage: number;
  hoursPerDay: number;
  year?: number;
  status: 'active' | 'inactive';
}

export interface UsageLog {
  id: string;
  deviceId: string;
  date: string; // YYYY-MM-DD
  durationHours: number;
  totalKwh: number;       // 0 = belum dihitung AI; akan diisi oleh model AI
  carbonEmission: number; // 0 = belum dihitung AI; akan diisi oleh model AI
}

export interface TokenPurchase {
  id: string;
  date: string; // YYYY-MM-DD
  amountRupiah: number;
  kwhReceived: number; // diisi manual dari struk token
}

export interface UserProfile {
  username: string;
  email: string;
  energySavingScore: number;
}

interface AppContextType {
  user: UserProfile | null;
  devices: Device[];
  logs: UsageLog[];
  tokens: TokenPurchase[];
  login: (username: string, email: string) => void;
  logout: () => void;
  addDevice: (device: Omit<Device, 'id'>) => void;
  updateDevice: (id: string, device: Partial<Device>) => void;
  deleteDevice: (id: string) => void;
  // totalKwh & carbonEmission diisi 0 (placeholder) — akan diisi model AI
  addUsageLog: (log: Omit<UsageLog, 'id' | 'totalKwh' | 'carbonEmission'>) => void;
  addTokenPurchase: (token: Omit<TokenPurchase, 'id'>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  COST_PER_KWH: number; // hanya untuk label tampilan (Rp/kWh)
}

// ─────────────────────────────────────────────
// DATA DEMO — untuk tampilan awal aplikasi
// Nilai totalKwh & carbonEmission sudah pra-isi
// (simulasi hasil yang akan diberikan model AI)
// ─────────────────────────────────────────────
const DEMO_DEVICES: Device[] = [
  { id: 'demo-d1', name: 'AC Split 1PK', brand: 'Samsung', model: 'AR09A5JWFWK', category: 'Pendingin', wattage: 890, hoursPerDay: 8, year: 2022, status: 'active' },
  { id: 'demo-d2', name: 'Kulkas 2 Pintu', brand: 'Sharp', model: 'SJ-X195', category: 'Pendingin', wattage: 100, hoursPerDay: 24, year: 2020, status: 'active' },
  { id: 'demo-d3', name: 'TV LED 43"', brand: 'LG', model: '43LM5700', category: 'Elektronik', wattage: 75, hoursPerDay: 5, year: 2022, status: 'active' },
  { id: 'demo-d4', name: 'Laptop', brand: 'Asus', model: 'VivoBook 14', category: 'Elektronik', wattage: 65, hoursPerDay: 7, year: 2023, status: 'active' },
  { id: 'demo-d5', name: 'Lampu LED (x6)', brand: 'Philips', model: 'SceneSwitch 10W', category: 'Penerangan', wattage: 60, hoursPerDay: 10, year: 2021, status: 'active' },
  { id: 'demo-d6', name: 'Rice Cooker', brand: 'Miyako', model: 'MCM-508', category: 'Dapur', wattage: 400, hoursPerDay: 1.5, year: 2019, status: 'active' },
  { id: 'demo-d7', name: 'Water Heater', brand: 'Ariston', model: 'Aures Smart 3.5', category: 'Kamar Mandi', wattage: 3500, hoursPerDay: 0.5, year: 2021, status: 'inactive' },
];

const DEMO_LOGS: UsageLog[] = [
  // 9 Mei 2026
  { id: 'dl-01', deviceId: 'demo-d1', date: '2026-05-09', durationHours: 8,   totalKwh: 7.12, carbonEmission: 6.05 },
  { id: 'dl-02', deviceId: 'demo-d2', date: '2026-05-09', durationHours: 24,  totalKwh: 2.40, carbonEmission: 2.04 },
  { id: 'dl-03', deviceId: 'demo-d3', date: '2026-05-09', durationHours: 5,   totalKwh: 0.38, carbonEmission: 0.32 },
  { id: 'dl-04', deviceId: 'demo-d4', date: '2026-05-09', durationHours: 7,   totalKwh: 0.46, carbonEmission: 0.39 },
  // 8 Mei 2026
  { id: 'dl-05', deviceId: 'demo-d1', date: '2026-05-08', durationHours: 8,   totalKwh: 7.12, carbonEmission: 6.05 },
  { id: 'dl-06', deviceId: 'demo-d2', date: '2026-05-08', durationHours: 24,  totalKwh: 2.40, carbonEmission: 2.04 },
  { id: 'dl-07', deviceId: 'demo-d5', date: '2026-05-08', durationHours: 10,  totalKwh: 0.60, carbonEmission: 0.51 },
  // 7 Mei 2026
  { id: 'dl-08', deviceId: 'demo-d1', date: '2026-05-07', durationHours: 8,   totalKwh: 7.12, carbonEmission: 6.05 },
  { id: 'dl-09', deviceId: 'demo-d2', date: '2026-05-07', durationHours: 24,  totalKwh: 2.40, carbonEmission: 2.04 },
  { id: 'dl-10', deviceId: 'demo-d6', date: '2026-05-07', durationHours: 1.5, totalKwh: 0.60, carbonEmission: 0.51 },
  // 6 Mei 2026
  { id: 'dl-11', deviceId: 'demo-d1', date: '2026-05-06', durationHours: 7.5, totalKwh: 6.68, carbonEmission: 5.68 },
  { id: 'dl-12', deviceId: 'demo-d2', date: '2026-05-06', durationHours: 24,  totalKwh: 2.40, carbonEmission: 2.04 },
  { id: 'dl-13', deviceId: 'demo-d4', date: '2026-05-06', durationHours: 7,   totalKwh: 0.46, carbonEmission: 0.39 },
  // 5 Mei 2026
  { id: 'dl-14', deviceId: 'demo-d1', date: '2026-05-05', durationHours: 8,   totalKwh: 7.12, carbonEmission: 6.05 },
  { id: 'dl-15', deviceId: 'demo-d2', date: '2026-05-05', durationHours: 24,  totalKwh: 2.40, carbonEmission: 2.04 },
  { id: 'dl-16', deviceId: 'demo-d3', date: '2026-05-05', durationHours: 5,   totalKwh: 0.38, carbonEmission: 0.32 },
  // 4 Mei 2026
  { id: 'dl-17', deviceId: 'demo-d1', date: '2026-05-04', durationHours: 8,   totalKwh: 7.12, carbonEmission: 6.05 },
  { id: 'dl-18', deviceId: 'demo-d2', date: '2026-05-04', durationHours: 24,  totalKwh: 2.40, carbonEmission: 2.04 },
  // 3 Mei 2026
  { id: 'dl-19', deviceId: 'demo-d1', date: '2026-05-03', durationHours: 7,   totalKwh: 6.23, carbonEmission: 5.30 },
  { id: 'dl-20', deviceId: 'demo-d2', date: '2026-05-03', durationHours: 24,  totalKwh: 2.40, carbonEmission: 2.04 },
  { id: 'dl-21', deviceId: 'demo-d6', date: '2026-05-03', durationHours: 1.5, totalKwh: 0.60, carbonEmission: 0.51 },
];

const DEMO_TOKENS: TokenPurchase[] = [
  { id: 'dt-01', date: '2026-04-15', amountRupiah: 200000, kwhReceived: 136.6 },
  { id: 'dt-02', date: '2026-03-10', amountRupiah: 150000, kwhReceived: 101.7 },
  { id: 'dt-03', date: '2026-02-20', amountRupiah: 100000, kwhReceived: 67.2  },
];

// ─────────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Tarif listrik rata-rata PLN — hanya digunakan sebagai label tampilan
  const COST_PER_KWH = 1444.70;

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('bagiWatt_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [devices, setDevices] = useState<Device[]>(() => {
    const saved = localStorage.getItem('bagiWatt_devices');
    if (!saved) return DEMO_DEVICES;
    const parsed = JSON.parse(saved);
    return parsed;
  });

  const [logs, setLogs] = useState<UsageLog[]>(() => {
    const saved = localStorage.getItem('bagiWatt_logs');
    if (!saved) return DEMO_LOGS;
    const parsed = JSON.parse(saved);
    return parsed;
  });

  const [tokens, setTokens] = useState<TokenPurchase[]>(() => {
    const saved = localStorage.getItem('bagiWatt_tokens');
    if (!saved) return DEMO_TOKENS;
    const parsed = JSON.parse(saved);
    return parsed;
  });

  // Sinkronisasi ke localStorage
  useEffect(() => { localStorage.setItem('bagiWatt_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('bagiWatt_devices', JSON.stringify(devices)); }, [devices]);
  useEffect(() => { localStorage.setItem('bagiWatt_logs', JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem('bagiWatt_tokens', JSON.stringify(tokens)); }, [tokens]);

  const login = (username: string, email: string) => {
    setUser({ username, email, energySavingScore: 85 });
  };

  const logout = () => {
    setUser(null);
    // Hapus data pengguna; localStorage juga dibersihkan via useEffect
    localStorage.removeItem('bagiWatt_devices');
    localStorage.removeItem('bagiWatt_logs');
    localStorage.removeItem('bagiWatt_tokens');
    setDevices(DEMO_DEVICES);
    setLogs(DEMO_LOGS);
    setTokens(DEMO_TOKENS);
  };

  const addDevice = (device: Omit<Device, 'id'>) => {
    const newDevice = { ...device, id: Date.now().toString() };
    setDevices(prev => [...prev, newDevice]);
  };

  const updateDevice = (id: string, updates: Partial<Device>) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  /**
   * Menambah log penggunaan.
   * totalKwh & carbonEmission diset 0 sebagai placeholder —
   * nilai sebenarnya akan diisi oleh model AI (integrasi terpisah).
   */
  const addUsageLog = (logData: Omit<UsageLog, 'id' | 'totalKwh' | 'carbonEmission'>) => {
    const newLog: UsageLog = {
      ...logData,
      id: Date.now().toString(),
      totalKwh: 0,       // TODO: isi dari model AI
      carbonEmission: 0, // TODO: isi dari model AI
    };
    setLogs(prev => [...prev, newLog]);
  };

  /**
   * Menambah pembelian token listrik.
   * kwhReceived diisi manual dari struk pembelian.
   */
  const addTokenPurchase = (token: Omit<TokenPurchase, 'id'>) => {
    setTokens(prev => [...prev, { ...token, id: Date.now().toString() }]);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) setUser({ ...user, ...updates });
  };

  return (
    <AppContext.Provider value={{
      user, devices, logs, tokens,
      login, logout, addDevice, updateDevice, deleteDevice,
      addUsageLog, addTokenPurchase, updateProfile,
      COST_PER_KWH,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
