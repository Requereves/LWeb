import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Plus, Info } from 'lucide-react';
import { Device } from '../context/AppContext';

interface DeviceFormProps {
  onAddDevice: (device: Partial<Device>) => void;
}

// Referensi wattage umum (bisa diubah manual oleh pengguna)
const devicePresets: Record<string, { wattage: number; category: string }> = {
  'AC':                { wattage: 900,  category: 'Pendingin'   },
  'Kulkas':            { wattage: 100,  category: 'Pendingin'   },
  'Kipas Angin':       { wattage: 55,   category: 'Pendingin'   },
  'TV LED 32"':        { wattage: 60,   category: 'Elektronik'  },
  'TV LED 50"':        { wattage: 100,  category: 'Elektronik'  },
  'Komputer Desktop':  { wattage: 300,  category: 'Elektronik'  },
  'Laptop':            { wattage: 65,   category: 'Elektronik'  },
  'Mesin Cuci':        { wattage: 500,  category: 'Elektronik'  },
  'Setrika':           { wattage: 350,  category: 'Elektronik'  },
  'Lampu LED':         { wattage: 10,   category: 'Penerangan'  },
  'Lampu Neon':        { wattage: 40,   category: 'Penerangan'  },
  'Rice Cooker':       { wattage: 400,  category: 'Dapur'       },
  'Microwave':         { wattage: 1200, category: 'Dapur'       },
  'Dispenser':         { wattage: 350,  category: 'Dapur'       },
  'Water Heater':      { wattage: 1500, category: 'Kamar Mandi' },
  'Hair Dryer':        { wattage: 1200, category: 'Kamar Mandi' },
};

export function DeviceForm({ onAddDevice }: DeviceFormProps) {
  const [deviceType,  setDeviceType]  = useState('');
  const [customName,  setCustomName]  = useState('');
  const [brand,       setBrand]       = useState('');
  const [model,       setModel]       = useState('');
  const [wattage,     setWattage]     = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [year,        setYear]        = useState('');
  const [isCustom,    setIsCustom]    = useState(false);

  const handleDeviceTypeChange = (value: string) => {
    if (value === 'custom') {
      setIsCustom(true);
      setDeviceType('');
      setWattage('');
    } else {
      setIsCustom(false);
      setDeviceType(value);
      const preset = devicePresets[value];
      if (preset) setWattage(preset.wattage.toString());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const name     = isCustom ? customName : deviceType;
    const category = isCustom ? 'Lainnya' : (devicePresets[deviceType]?.category ?? 'Lainnya');

    if (!name || !wattage || !hoursPerDay) return;

    onAddDevice({
      name,
      category,
      wattage:     parseFloat(wattage),
      hoursPerDay: parseFloat(hoursPerDay),
      brand:       brand      || 'Unbranded',
      model:       model      || 'Unknown',
      year:        year ? parseInt(year) : undefined,
      status:      'active',
    });

    // Reset form
    setDeviceType('');
    setCustomName('');
    setBrand('');
    setModel('');
    setWattage('');
    setHoursPerDay('');
    setYear('');
    setIsCustom(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-indigo-600" />
          Tambah Perangkat
        </CardTitle>
        <CardDescription>
          Masukkan data perangkat elektronik di rumah Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pilih jenis perangkat */}
          <div className="space-y-2">
            <Label>Jenis Perangkat</Label>
            <Select value={isCustom ? 'custom' : deviceType} onValueChange={handleDeviceTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih atau custom…" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(devicePresets).map((device) => (
                  <SelectItem key={device} value={device}>{device}</SelectItem>
                ))}
                <SelectItem value="custom">Perangkat Lainnya (Custom)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nama custom */}
          {isCustom && (
            <div className="space-y-2">
              <Label htmlFor="customName">Nama Perangkat</Label>
              <Input
                id="customName"
                type="text"
                placeholder="Contoh: Smart TV"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>
          )}

          {/* Merek & Model */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="brand">Merek <span className="text-gray-400 font-normal">(Opsional)</span></Label>
              <Input
                id="brand"
                placeholder="Samsung, LG, …"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model <span className="text-gray-400 font-normal">(Opsional)</span></Label>
              <Input
                id="model"
                placeholder="AR09A, …"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
          </div>

          {/* Daya & Jam/Hari */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="wattage">Daya (Watt)</Label>
              <Input
                id="wattage"
                type="number"
                placeholder="Cth: 900"
                value={wattage}
                onChange={(e) => setWattage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Jam Pakai/Hari</Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                placeholder="Cth: 8"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
              />
            </div>
          </div>

          {/* Info daya */}
          {deviceType && !isCustom && (
            <div className="flex items-start gap-2 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-700">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Daya <strong>{wattage} W</strong> adalah referensi umum untuk <strong>{deviceType}</strong>.
                Sesuaikan dengan label watt yang tertera pada perangkat Anda.
              </span>
            </div>
          )}

          {/* Tahun pembelian */}
          <div className="space-y-2">
            <Label>Tahun Pembelian <span className="text-gray-400 font-normal">(Opsional)</span></Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tahun" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2">
            <Plus className="h-4 w-4 mr-2" />
            Tambahkan Perangkat
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
