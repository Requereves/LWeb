import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Wallet, Zap, CalendarDays, Plus, Activity, Info } from 'lucide-react';
import { Progress } from './ui/progress';

export function TokenPayment() {
  const { tokens, addTokenPurchase } = useAppContext();

  const [date, setDate]     = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [kwh, setKwh]       = useState('');

  // Agregasi dari data tersimpan (bukan kalkulasi baru)
  const totalSpent     = tokens.reduce((sum, t) => sum + t.amountRupiah, 0);
  const totalKwhBought = tokens.reduce((sum, t) => sum + t.kwhReceived, 0);

  // Estimasi sisa dari data tersimpan (persentase sederhana untuk tampilan)
  const latestToken   = tokens.length > 0 ? [...tokens].sort((a, b) => b.date.localeCompare(a.date))[0] : null;
  const lastKwh       = latestToken?.kwhReceived ?? 0;
  const mockUsed      = lastKwh > 0 ? lastKwh * 0.4 : 0;
  const mockRemaining = Math.max(0, lastKwh - mockUsed);
  const remainPct     = lastKwh > 0 ? (mockRemaining / lastKwh) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = parseInt(amount.replace(/[^0-9]/g, ''));
    const kwhVal  = parseFloat(kwh) || 0;

    if (!date || isNaN(nominal) || nominal <= 0) return;

    addTokenPurchase({
      date,
      amountRupiah: nominal,
      kwhReceived: kwhVal,
    });

    setAmount('');
    setKwh('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Token & Pembayaran</h2>
        <p className="text-gray-500">Catat pembelian token listrik dan pantau riwayat pengeluaran Anda.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-5">
          {/* Estimasi Sisa Card */}
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-200" />
                Estimasi Sisa Listrik
              </CardTitle>
              <CardDescription className="text-blue-200 text-xs">
                Berdasarkan pembelian token terakhir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-4xl font-extrabold">
                {mockRemaining.toFixed(1)}{' '}
                <span className="text-xl font-normal text-blue-200">kWh</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-blue-100">
                  <span>Sisa dari {lastKwh.toFixed(1)} kWh</span>
                  <span>{Math.round(remainPct)}%</span>
                </div>
                <Progress value={remainPct} className="h-2 bg-blue-900 [&>div]:bg-green-400" />
              </div>
              <p className="text-xs text-blue-200 flex items-center gap-1">
                <Info className="h-3 w-3" />
                Estimasi kasar — integrasi AI untuk prediksi akurat
              </p>
            </CardContent>
          </Card>

          {/* Form Catat Token */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Catat Pembelian Token</CardTitle>
              <CardDescription>Isi nominal & kWh sesuai struk pembelian</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Tanggal Pembelian</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nominal (Rp)</Label>
                  <Input
                    type="text"
                    placeholder="Contoh: 100000"
                    value={amount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setAmount(val ? `Rp ${parseInt(val).toLocaleString('id-ID')}` : '');
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label>kWh Diterima</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="Lihat di struk token (cth: 67.8)"
                    value={kwh}
                    onChange={(e) => setKwh(e.target.value)}
                  />
                  <p className="text-xs text-gray-400">
                    Isi sesuai jumlah kWh yang tercetak di struk pembelian token listrik.
                  </p>
                </div>

                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Simpan Transaksi
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Summary Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">Total Pengeluaran</CardTitle>
                <Wallet className="w-4 h-4 text-indigo-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  Rp {totalSpent.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-gray-400 mt-1">Dari {tokens.length} transaksi</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">Total Daya Dibeli</CardTitle>
                <Zap className="w-4 h-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{totalKwhBought.toFixed(1)} kWh</div>
                <p className="text-xs text-gray-400 mt-1">Akumulasi semua transaksi</p>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History Table */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pembelian Token</CardTitle>
              <CardDescription>Semua transaksi token listrik yang dicatat</CardDescription>
            </CardHeader>
            <CardContent>
              {tokens.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500">
                        <th className="px-4 py-3 rounded-tl-lg">Tanggal</th>
                        <th className="px-4 py-3">Nominal</th>
                        <th className="px-4 py-3 rounded-tr-lg">Daya (kWh)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y border-t">
                      {[...tokens]
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((token) => (
                          <tr key={token.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap text-gray-900 font-medium">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                  <CalendarDays className="w-4 h-4" />
                                </div>
                                {token.date}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-gray-900 font-semibold">
                              Rp {token.amountRupiah.toLocaleString('id-ID')}
                            </td>
                            <td className="px-4 py-4">
                              {token.kwhReceived > 0 ? (
                                <span className="text-orange-600 font-semibold">
                                  +{token.kwhReceived.toFixed(1)} kWh
                                </span>
                              ) : (
                                <span className="text-gray-400 italic text-xs">Belum diisi</span>
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Wallet className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Belum ada riwayat pembelian token</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
