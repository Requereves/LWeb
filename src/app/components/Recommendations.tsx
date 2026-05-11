import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import {
  Lightbulb, Clock, TrendingDown, AlertTriangle, Medal,
  Sparkles, Zap, Leaf, Thermometer, Plug,
} from 'lucide-react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

// Tipe rekomendasi statis — tidak mengandung kalkulasi energi
interface Recommendation {
  icon: React.ReactNode;
  type: 'efisiensi' | 'hemat' | 'perhatian' | 'ramah lingkungan';
  title: string;
  description: string;
}

// Rekomendasi umum yang selalu ditampilkan
const STATIC_TIPS: Recommendation[] = [
  {
    icon: <Plug className="h-5 w-5" />,
    type: 'ramah lingkungan',
    title: 'Cabut Stop Kontak Saat Tidak Digunakan',
    description:
      'Matikan atau cabut perangkat elektronik dari stop kontak ketika tidak dipakai. Mode standby tetap mengonsumsi daya dan menambah tagihan listrik secara perlahan.',
  },
  {
    icon: <Clock className="h-5 w-5" />,
    type: 'efisiensi',
    title: 'Atur Jadwal Penggunaan',
    description:
      'Gunakan timer otomatis pada perangkat seperti AC dan water heater. Matikan 30–60 menit sebelum Anda bangun atau tidur untuk menghemat energi tanpa mengurangi kenyamanan.',
  },
  {
    icon: <Thermometer className="h-5 w-5" />,
    type: 'hemat',
    title: 'Optimalkan Suhu AC',
    description:
      'Atur suhu AC di kisaran 24–26°C. Setiap penurunan 1°C di bawah 25°C meningkatkan konsumsi energi sekitar 6%. Gunakan kipas angin bersama AC untuk sirkulasi udara yang lebih efisien.',
  },
  {
    icon: <TrendingDown className="h-5 w-5" />,
    type: 'hemat',
    title: 'Gunakan di Luar Jam Puncak',
    description:
      'Hindari menggunakan perangkat berdaya tinggi (mesin cuci, microwave, setrika) pada jam puncak listrik PLN (17:00–22:00) untuk menjaga stabilitas tegangan dan mengurangi risiko kenaikan tagihan.',
  },
  {
    icon: <Leaf className="h-5 w-5" />,
    type: 'ramah lingkungan',
    title: 'Maksimalkan Cahaya Alami',
    description:
      'Manfaatkan sinar matahari di siang hari. Matikan lampu di ruangan yang sudah terang secara alami dan pertimbangkan cat dinding warna terang untuk memantulkan cahaya lebih baik.',
  },
];

// Rekomendasi berdasarkan keberadaan kategori tertentu
function getDynamicTips(categories: string[]): Recommendation[] {
  const tips: Recommendation[] = [];

  if (categories.includes('Pendingin')) {
    tips.push({
      icon: <AlertTriangle className="h-5 w-5" />,
      type: 'perhatian',
      title: 'Perawatan Rutin Pendingin (AC/Kulkas)',
      description:
        'Bersihkan filter AC minimal sebulan sekali dan pastikan kisi-kisi kulkas tidak tertutup benda. Pendingin kotor bisa mengonsumsi 15–25% daya lebih besar dari kondisi normal.',
    });
  }

  if (categories.includes('Elektronik')) {
    tips.push({
      icon: <TrendingDown className="h-5 w-5" />,
      type: 'efisiensi',
      title: 'Mode Hemat Daya Perangkat Elektronik',
      description:
        'Aktifkan mode hemat daya (power saving mode) pada TV, laptop, dan komputer. Kurangi kecerahan layar hingga 50% untuk menghemat energi tanpa mengorbankan kenyamanan melihat.',
    });
  }

  if (categories.includes('Dapur')) {
    tips.push({
      icon: <Lightbulb className="h-5 w-5" />,
      type: 'hemat',
      title: 'Efisiensi Perangkat Dapur',
      description:
        'Gunakan rice cooker dan microwave sesuai kapasitas. Jangan terlalu sering membuka kulkas dan pastikan pintu tertutup rapat untuk menjaga suhu internal yang stabil.',
    });
  }

  return tips;
}

export function Recommendations() {
  const { devices, user } = useAppContext();
  const activeDevices = devices.filter(d => d.status === 'active');

  const activeCategories = [...new Set(activeDevices.map(d => d.category))];
  const dynamicTips = getDynamicTips(activeCategories);
  const allTips: Recommendation[] = [...dynamicTips, ...STATIC_TIPS];

  // Top consumers berdasarkan daya (Watt) — bukan kalkulasi kWh
  const topConsumers = [...activeDevices]
    .sort((a, b) => b.wattage - a.wattage)
    .slice(0, 3);

  const typeStyle: Record<string, string> = {
    perhatian:      'bg-red-100 text-red-600',
    hemat:          'bg-amber-100 text-amber-600',
    'ramah lingkungan': 'bg-emerald-100 text-emerald-600',
    efisiensi:      'bg-blue-100 text-blue-600',
  };

  const badgeStyle: Record<string, string> = {
    perhatian:      'text-red-700 border-red-200 bg-red-50',
    hemat:          'text-amber-700 border-amber-200 bg-amber-50',
    'ramah lingkungan': 'text-emerald-700 border-emerald-200 bg-emerald-50',
    efisiensi:      'text-blue-700 border-blue-200 bg-blue-50',
  };

  if (activeDevices.length === 0) {
    return (
      <div className="text-center py-16">
        <Zap className="h-16 w-16 mx-auto mb-4 text-gray-200" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Belum Ada Rekomendasi</h3>
        <p className="text-gray-400 text-sm">
          Tambahkan perangkat terlebih dahulu untuk mendapatkan saran penghematan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Rekomendasi Cerdas</h2>
        <p className="text-gray-500">
          Saran penghematan berdasarkan jenis perangkat yang terdaftar di rumah Anda.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Skor Gamifikasi */}
        <Card className="md:col-span-1 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white shadow-xl">
          <CardHeader className="text-center pb-2">
            <Medal className="w-12 h-12 mx-auto mb-2 text-yellow-300" />
            <CardTitle className="text-xl">Skor Hemat Energi</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <span className="text-5xl font-extrabold">{user?.energySavingScore ?? 85}</span>
              <span className="text-indigo-200 ml-1">/ 100</span>
            </div>
            <Progress
              value={user?.energySavingScore ?? 85}
              className="h-2 bg-indigo-900 [&>div]:bg-green-400"
            />
            <p className="text-sm text-indigo-100 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Anda lebih hemat dari 60% pengguna lain!
            </p>
          </CardContent>
        </Card>

        {/* Saran Penghematan */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Saran Penghematan
            </CardTitle>
            <CardDescription>
              Disesuaikan dengan perangkat yang terdaftar di akun Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {allTips.slice(0, 4).map((rec, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50/80 transition-colors"
                >
                  <div className={`p-3 rounded-xl h-fit shadow-sm shrink-0 ${typeStyle[rec.type]}`}>
                    {rec.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                      <Badge variant="outline" className={`text-xs ${badgeStyle[rec.type]}`}>
                        {rec.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Consumers */}
      {topConsumers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Perangkat dengan Daya Terbesar
            </CardTitle>
            <CardDescription>
              Fokus pada perangkat ini untuk dampak penghematan paling signifikan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              {topConsumers.map((device, index) => (
                <div
                  key={device.id}
                  className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm flex flex-col gap-3"
                >
                  <div className="flex justify-between items-center">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-inner text-white ${
                        index === 0 ? 'bg-red-500' :
                        index === 1 ? 'bg-orange-400' :
                        'bg-amber-400'
                      }`}
                    >
                      #{index + 1}
                    </div>
                    <Badge variant="outline" className="text-xs text-gray-500">{device.category}</Badge>
                  </div>

                  <div>
                    <h5 className="font-bold text-gray-900">{device.name}</h5>
                    {device.brand !== 'Unbranded' && (
                      <p className="text-xs text-gray-400">{device.brand} {device.model}</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between text-sm">
                    <span className="text-gray-500">Daya</span>
                    <span className="font-semibold text-orange-600">{device.wattage} W</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pemakaian</span>
                    <span className="font-semibold text-gray-700">{device.hoursPerDay} jam/hari</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sisa tips */}
      {allTips.length > 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Leaf className="h-5 w-5 text-emerald-500" />
              Tips Tambahan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {allTips.slice(4).map((rec, index) => (
                <div
                  key={index}
                  className="flex gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50/60 transition-colors"
                >
                  <div className={`p-2.5 rounded-lg h-fit shrink-0 ${typeStyle[rec.type]}`}>
                    {rec.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{rec.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
