import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Plus, Calendar as CalendarIcon, Clock, Leaf, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export function UsageLogs() {
  const { devices, logs, addUsageLog } = useAppContext();

  const [selectedDevice, setSelectedDevice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('');

  const activeDevices = devices.filter(d => d.status === 'active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice || !date || !duration) return;

    addUsageLog({
      deviceId: selectedDevice,
      date,
      durationHours: parseFloat(duration),
    });

    setDuration('');
  };

  // Agregasi kWh dari log tersimpan (bukan dihitung ulang)
  const logsByDate = logs.reduce((acc: Record<string, number>, log) => {
    acc[log.date] = (acc[log.date] || 0) + log.totalKwh;
    return acc;
  }, {});

  const chartData = Object.entries(logsByDate)
    .map(([date, kwh]) => ({
      date: new Date(date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      kwh: +kwh.toFixed(2),
    }))
    .slice(-7);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Log Penggunaan</h2>
        <p className="text-gray-500">Catat dan pantau penggunaan perangkat spesifik Anda dari hari ke hari.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form Catat Pemakaian */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Catat Pemakaian</CardTitle>
            <CardDescription>Pilih perangkat, tanggal, dan durasi penggunaan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Perangkat</Label>
                <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih perangkat aktif" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeDevices.map(d => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name} — {d.wattage}W
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tanggal</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Durasi (Jam)</Label>
                <Input
                  type="number"
                  step="0.5"
                  min="0"
                  placeholder="Contoh: 4.5"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              {/* Info box: nilai kWh dari AI */}
              <div className="flex gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Nilai <strong>kWh & emisi karbon</strong> akan diisi oleh model AI secara terpisah.
                  Data ini dicatat sebagai <em>pending</em> untuk sementara.
                </span>
              </div>

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Simpan Log
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Chart & Table */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pemakaian 7 Hari Terakhir</CardTitle>
              <CardDescription>Total kWh per hari dari log tersimpan</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} className="text-xs" />
                      <YAxis axisLine={false} tickLine={false} className="text-xs" unit=" kWh" />
                      <Tooltip
                        formatter={(v: number) => [`${v.toFixed(2)} kWh`, 'Total kWh']}
                        cursor={{ fill: '#f5f3ff' }}
                      />
                      <Bar dataKey="kwh" fill="#6366f1" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[240px] flex items-center justify-center text-gray-400 text-sm">
                  Belum ada data riwayat penggunaan
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tabel Log Terbaru</CardTitle>
              <CardDescription>Menampilkan 10 log terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500">
                        <th className="px-4 py-3 rounded-tl-lg">Tanggal</th>
                        <th className="px-4 py-3">Perangkat</th>
                        <th className="px-4 py-3">Durasi</th>
                        <th className="px-4 py-3">Konsumsi (kWh)</th>
                        <th className="px-4 py-3 rounded-tr-lg">Emisi CO₂</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-t">
                      {[...logs].reverse().slice(0, 10).map((log) => {
                        const device = devices.find(d => d.id === log.deviceId);
                        const isPending = log.totalKwh === 0;
                        return (
                          <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                                {log.date}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {device?.name ?? (
                                <span className="text-gray-400 italic">Perangkat dihapus</span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                {log.durationHours} jam
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {isPending ? (
                                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-xs">
                                  Menunggu AI
                                </Badge>
                              ) : (
                                <span className="text-indigo-600 font-semibold">
                                  {log.totalKwh.toFixed(2)} kWh
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {isPending ? (
                                <span className="text-gray-400">—</span>
                              ) : (
                                <div className="flex items-center gap-1 text-green-600 font-medium">
                                  <Leaf className="w-3.5 h-3.5" />
                                  {log.carbonEmission.toFixed(2)} kg
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Belum ada log penggunaan yang dicatat
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
