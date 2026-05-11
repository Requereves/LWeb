import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Zap, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export function LoginPage() {
  const [isLogin,   setIsLogin]   = useState(true);
  const [username,  setUsername]  = useState('');
  const [password,  setPassword]  = useState('');
  const [showPwd,   setShowPwd]   = useState(false);
  const [error,     setError]     = useState('');

  const navigate = useNavigate();
  const { login } = useAppContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username dan password harus diisi.');
      return;
    }

    if (isLogin) {
      const users = JSON.parse(localStorage.getItem('bagiWatt_users') || '{}');
      if (users[username] && users[username] === password) {
        login(username, `${username.toLowerCase()}@example.com`);
        navigate('/app');
      } else {
        setError('Username atau password salah.');
      }
    } else {
      const users = JSON.parse(localStorage.getItem('bagiWatt_users') || '{}');
      if (users[username]) {
        setError('Username sudah terdaftar, silakan masuk.');
      } else {
        users[username] = password;
        localStorage.setItem('bagiWatt_users', JSON.stringify(users));
        login(username, `${username.toLowerCase()}@example.com`);
        navigate('/app');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      {/* Back link */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali
      </button>

      <div className="w-full max-w-md">
        <Card className="shadow-xl border-slate-100">
          <CardHeader className="space-y-1 pb-4">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-sm">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">bagiWatt</span>
            </div>

            <CardTitle className="text-2xl font-bold">
              {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? 'Masukkan username dan password untuk melanjutkan'
                : 'Daftar untuk mulai memantau konsumsi listrik Anda'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 mt-1">
                {isLogin ? 'Masuk' : 'Daftar Sekarang'}
              </Button>

              <p className="text-center text-sm text-slate-500">
                {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                <button
                  type="button"
                  onClick={() => { setIsLogin(!isLogin); setError(''); }}
                  className="text-indigo-600 font-semibold hover:underline"
                >
                  {isLogin ? 'Daftar' : 'Masuk'}
                </button>
              </p>
            </form>

            {/* Demo note */}
            <div className="mt-5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 text-center">
              Ini adalah login simulasi — data disimpan di browser Anda (localStorage).
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
