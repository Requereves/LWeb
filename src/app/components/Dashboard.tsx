import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Zap, Activity, Leaf, MonitorSmartphone, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Badge } from './ui/badge';

const COLORS = ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

export function Dashboard() {
  const { devices, logs, COST_PER_KWH } = useAppContext();

  const totalDevices  = devices.length;
  const activeDevices = devices.filter(d => d.status === 'active').length;

  const currentMonth  = new Date().toISOString().slice(0, 7);
  const monthlyLogs   = logs.filter(l => l.date.startsWith(currentMonth));
  const monthlyKwh    = monthlyLogs.reduce((sum, l) => sum + l.totalKwh, 0);
  const monthlyCarbon = monthlyLogs.reduce((sum, l) => sum + l.carbonEmission, 0);
  const monthlyCost   = monthlyKwh * COST_PER_KWH;

  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const weeklyData = last7Days.map(date => {
    const dayLogs = logs.filter(l => l.date === date);
    const kwh = dayLogs.reduce((sum, l) => sum + l.totalKwh, 0);
    const label = new Date(date + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short' });
    return { date, name: label, kwh: +kwh.toFixed(2) };
  });

  const maxKwh = Math.max(...weeklyData.map(d => d.kwh), 1);

  const categoryCount = devices
    .filter(d => d.status === 'active')
    .reduce((acc: Record<string, number>, d) => {
      acc[d.category] = (acc[d.category] || 0) + 1;
      return acc;
    }, {});

  const pieData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  const totalPie = pieData.reduce((s: number, p: any) => s + p.value, 0);

  // Build conic-gradient segments for CSS donut
  const buildGradient = () => {
    let angle = 0;
    return pieData.map((p, i) => {
      const pct = ((p.value as number) / totalPie) * 360;
      const seg = `${COLORS[i % COLORS.length]} ${angle}deg ${angle + pct}deg`;
      angle += pct;
      return seg;
    }).join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Ringkasan konsumsi energi Anda bulan ini.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Estimasi Biaya / Bulan</CardTitle>
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Zap className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              Rp {monthlyCost.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
            </div>
            <p className="text-xs text-gray-500 mt-1">Berdasarkan {monthlyLogs.length} log bulan ini</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pemakaian / Bulan</CardTitle>
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Activity className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{monthlyKwh.toFixed(1)} kWh</div>
            <p className="text-xs text-gray-500 mt-1">Total kWh dari log tercatat</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Jejak Karbon</CardTitle>
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Leaf className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{monthlyCarbon.toFixed(1)} kg CO₂</div>
            <p className="text-xs text-gray-500 mt-1">Emisi karbon bulan ini</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Perangkat</CardTitle>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><MonitorSmartphone className="h-4 w-4" /></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {activeDevices} <span className="text-sm font-normal text-gray-500">aktif</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Dari total {totalDevices} perangkat</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Weekly Bar Chart — pure CSS */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Tren Pemakaian 7 Hari</CardTitle>
                <CardDescription>Total kWh per hari dari log tercatat</CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[260px] px-2">
              <div className="flex items-end gap-2 flex-1 w-full">
                {weeklyData.map((d) => (
                  <div key={d.date} className="flex flex-col items-center flex-1 h-full justify-end gap-1">
                    {d.kwh > 0 && (
                      <span className="text-[10px] text-gray-400">{d.kwh.toFixed(1)}</span>
                    )}
                    <div
                      style={{
                        height: `${Math.max((d.kwh / maxKwh) * 180, 2)}px`,
                        backgroundColor: d.kwh > 0 ? '#4f46e5' : '#e5e7eb',
                      }}
                      className="w-full rounded-t-md"
                      title={`${d.name}: ${d.kwh} kWh`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                {weeklyData.map((d) => (
                  <div key={d.date} className="flex-1 text-center text-[11px] text-gray-500">{d.name}</div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Donut Chart — pure CSS conic-gradient */}
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Kategori Perangkat</CardTitle>
            <CardDescription>Jumlah perangkat aktif per kategori</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {pieData.length > 0 ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
                  <div
                    className="rounded-full"
                    style={{
                      width: 180,
                      height: 180,
                      background: `conic-gradient(${buildGradient()})`,
                    }}
                  />
                  {/* Inner white circle for donut effect */}
                  <div
                    className="absolute bg-white rounded-full flex items-center justify-center"
                    style={{ width: 100, height: 100 }}
                  >
                    <span className="text-xs text-gray-500 text-center leading-tight">
                      {totalPie}<br />
                      <span className="text-[10px]">perangkat</span>
                    </span>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
                  {pieData.map((p, i) => (
                    <div key={`legend-${p.name}-${i}`} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-gray-600">{String(p.name)} ({String(p.value)})</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-gray-400 text-sm">
                Belum ada perangkat aktif
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Consumers Banner */}
      {devices.filter(d => d.status === 'active').length > 0 && (
        <Card className="border-indigo-100 bg-indigo-50/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-indigo-800">
              <Zap className="h-4 w-4" />
              Perangkat Aktif Teratas (berdasarkan daya)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[...devices]
                .filter(d => d.status === 'active')
                .sort((a, b) => b.wattage - a.wattage)
                .slice(0, 5)
                .map((d, i) => (
                  <Badge
                    key={d.id}
                    variant="secondary"
                    className={`px-3 py-1 text-sm gap-1.5 ${
                      i === 0 ? 'bg-red-100 text-red-700 border-red-200' :
                      i === 1 ? 'bg-orange-100 text-orange-700 border-orange-200' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span>{d.name}</span>
                    <span className="opacity-70">— {d.wattage}W</span>
                  </Badge>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}