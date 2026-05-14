import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { DeviceForm } from './DeviceForm';
import { DeviceList } from './DeviceList';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function DeviceManagement() {
  const { devices, addDevice, updateDevice, deleteDevice } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  const filteredDevices = devices.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || (d.brand && d.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCategory = categoryFilter === 'Semua' || d.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const handleAddDevice = (device: any) => {
    // The existing DeviceForm doesn't send brand/model yet, so we map them if missing
    addDevice({
      ...device,
      brand: device.brand || 'Unbranded',
      model: device.model || 'Unknown',
      status: 'active'
    });
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    updateDevice(id, { status: currentStatus === 'active' ? 'inactive' : 'active' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Manajemen Perangkat</h2>
        <p className="text-gray-500">Kelola daftar elektronik, daya, dan status penggunaannya di rumah Anda.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DeviceForm onAddDevice={handleAddDevice} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari perangkat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Kategori</SelectItem>
                <SelectItem value="Pendingin">Pendingin</SelectItem>
                <SelectItem value="Elektronik">Elektronik</SelectItem>
                <SelectItem value="Penerangan">Penerangan</SelectItem>
                <SelectItem value="Dapur">Dapur</SelectItem>
                <SelectItem value="Kamar Mandi">Kamar Mandi</SelectItem>
                <SelectItem value="Lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DeviceList
            devices={filteredDevices}
            onDeleteDevice={deleteDevice}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      </div>
    </div>
  );
}
