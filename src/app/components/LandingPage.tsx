import { Zap, Activity, Lightbulb, ChevronRight, Leaf, BarChart2, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useNavigate } from 'react-router';

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className="w-7 h-7" />,
      color: 'bg-blue-50 text-blue-600',
      title: 'Catat Perangkat',
      desc: 'Daftarkan semua perangkat elektronik di rumah Anda — dari AC, kulkas, hingga lampu LED — lengkap dengan merek, model, dan jam pemakaian.',
    },
    {
      icon: <BarChart2 className="w-7 h-7" />,
      color: 'bg-indigo-50 text-indigo-600',
      title: 'Visualisasi Mudah',
      desc: 'Pantau tren pemakaian harian melalui grafik interaktif yang informatif. Lihat perangkat mana yang paling banyak mengonsumsi listrik di rumah Anda.',
    },
    {
      icon: <Lightbulb className="w-7 h-7" />,
      color: 'bg-amber-50 text-amber-600',
      title: 'Rekomendasi Cerdas',
      desc: 'Dapatkan saran hemat energi yang dipersonalisasi berdasarkan perangkat yang terdaftar. Didukung integrasi model AI untuk analisis lebih akurat.',
    },
    {
      icon: <Leaf className="w-7 h-7" />,
      color: 'bg-emerald-50 text-emerald-600',
      title: 'Jejak Karbon',
      desc: 'Monitor emisi CO₂ dari konsumsi listrik Anda. Bantu jaga lingkungan dengan kebiasaan penggunaan energi yang lebih bertanggung jawab.',
    },
    {
      icon: <Activity className="w-7 h-7" />,
      color: 'bg-rose-50 text-rose-600',
      title: 'Log Penggunaan',
      desc: 'Catat penggunaan perangkat spesifik setiap hari dan lihat riwayat konsumsi selama 7 hari terakhir dalam satu tampilan yang bersih.',
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      color: 'bg-teal-50 text-teal-600',
      title: 'Data Lokal Aman',
      desc: 'Semua data disimpan di perangkat Anda sendiri (localStorage). Tidak ada data yang dikirim ke server — privasi Anda tetap terjaga sepenuhnya.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl shadow-sm">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900">bagiWatt</span>
          </div>
          <Button
            variant="ghost"
            className="text-indigo-600 font-semibold hover:bg-indigo-50"
            onClick={() => navigate('/login')}
          >
            Masuk
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Hemat Energi Dimulai dari Kesadaran
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-900">
              Pantau Listrik Rumah{' '}
              <span className="text-indigo-600">Anda</span>
            </h1>

            <p className="text-lg text-slate-500 leading-relaxed max-w-md">
              bagiWatt membantu Anda memahami konsumsi listrik setiap perangkat di rumah.
              Catat, pantau, dan hemat — tanpa perlu ahli teknik.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-8 h-13 rounded-xl shadow-lg shadow-indigo-200"
                onClick={() => navigate('/login')}
              >
                Mulai Sekarang <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Stat chips */}
            <div className="flex flex-wrap gap-3 pt-2">
              {[
                { label: 'Perangkat didukung', val: '15+' },
                { label: 'Data lokal, privasi aman', val: '100%' },
                { label: 'Gratis selamanya', val: '✓' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-sm text-slate-600">
                  <span className="font-bold text-indigo-600">{s.val}</span>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative mt-8 md:mt-0">
            <div className="aspect-[4/3] bg-indigo-50 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-100 relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGhvbWUlMjBlbGVjdHJpY2l0eXxlbnwxfHx8fDE3NzU5MDc3OTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Smart Energy Monitoring"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />

              {/* Floating badge */}
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="bg-green-100 p-2.5 rounded-full">
                  <Activity className="text-green-600 w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Penghematan Bulan Ini</p>
                  <p className="font-bold text-slate-800">Rp 145.000</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Semua yang Anda Butuhkan</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Fitur lengkap untuk monitoring konsumsi listrik rumah, dirancang agar mudah digunakan siapa saja.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-20 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-10 text-white text-center shadow-xl shadow-indigo-200">
          <Zap className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl font-bold mb-3">Siap Mulai Hemat Listrik?</h2>
          <p className="text-indigo-100 mb-6 max-w-md mx-auto">
            Daftar atau masuk sekarang — gratis, tanpa perlu email konfirmasi.
          </p>
          <Button
            size="lg"
            className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold px-8 rounded-xl shadow"
            onClick={() => navigate('/login')}
          >
            Mulai Sekarang <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 mt-12 py-8 text-center text-sm text-slate-400">
        <p>© 2026 bagiWatt — Monitoring Listrik Rumah yang Cerdas</p>
      </footer>
    </div>
  );
}
