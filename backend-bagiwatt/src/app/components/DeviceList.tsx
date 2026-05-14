import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Trash2, Tv, Snowflake, Lightbulb, Laptop, UtensilsCrossed, Droplet, Power, PowerOff } from 'lucide-react';
import { Badge } from './ui/badge';
import { Device } from '../context/AppContext';

interface DeviceListProps {
  devices: Device[];
  onDeleteDevice: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Pendingin':    <Snowflake className="h-4 w-4" />,
  'Elektronik':  <Tv className="h-4 w-4" />,
  'Penerangan':  <Lightbulb className="h-4 w-4" />,
  'Dapur':       <UtensilsCrossed className="h-4 w-4" />,
  'Kamar Mandi': <Droplet className="h-4 w-4" />,
  'Lainnya':     <Laptop className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
  'Pendingin':    'bg-blue-100 text-blue-800',
  'Elektronik':  'bg-purple-100 text-purple-800',
  'Penerangan':  'bg-yellow-100 text-yellow-800',
  'Dapur':       'bg-orange-100 text-orange-800',
  'Kamar Mandi': 'bg-cyan-100 text-cyan-800',
  'Lainnya':     'bg-gray-100 text-gray-800',
};

export function DeviceList({ devices, onDeleteDevice, onToggleStatus }: DeviceListProps) {
  if (devices.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500 py-8">
            <Tv className="h-12 w-12 mx-auto mb-3 opacity-25" />
            <p className="font-medium">Belum ada perangkat yang ditambahkan</p>
            <p className="text-sm mt-1">Tambahkan perangkat untuk mulai monitoring</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Perangkat</CardTitle>
        <CardDescription>Total {devices.length} perangkat terdaftar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {devices.map((device) => (
            <div
              key={device.id}
              className={`flex items-center justify-between p-4 border rounded-xl transition-colors ${
                device.status === 'inactive'
                  ? 'bg-gray-50 border-gray-100 opacity-70'
                  : 'bg-white border-gray-100 hover:bg-gray-50/70'
              }`}
            >
              {/* Icon + Info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                  device.status === 'active' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'
                }`}>
                  {categoryIcons[device.category] ?? categoryIcons['Lainnya']}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name + badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="font-semibold text-gray-900 truncate">
                      {device.name}
                      {device.year ? <span className="text-gray-400 font-normal ml-1">({device.year})</span> : null}
                    </span>
                    <Badge className={`text-xs ${categoryColors[device.category] ?? categoryColors['Lainnya']}`}>
                      {device.category}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        device.status === 'active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {device.status === 'active' ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>

                  {/* Meta info — hanya data input, tanpa kalkulasi */}
                  <p className="text-sm text-gray-500 truncate">
                    {device.brand !== 'Unbranded' && device.brand ? `${device.brand} ${device.model !== 'Unknown' ? device.model : ''}  •  ` : ''}
                    <span className="text-gray-700 font-medium">{device.wattage} W</span>
                    {' · '}
                    <span className="text-gray-700 font-medium">{device.hoursPerDay} jam/hari</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 ml-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleStatus(device.id, device.status)}
                  className={
                    device.status === 'active'
                      ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }
                  title={device.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                >
                  {device.status === 'active' ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteDevice(device.id)}
                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
                  title="Hapus perangkat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
