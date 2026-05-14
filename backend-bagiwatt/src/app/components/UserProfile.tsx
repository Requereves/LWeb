import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter,
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { User, Mail, Shield, LogOut, Pencil, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router';

export function UserProfile() {
  const { user, updateProfile, logout, devices, logs, tokens } = useAppContext();
  const navigate = useNavigate();

  const [username,  setUsername]  = useState(user?.username ?? '');
  const [email,     setEmail]     = useState(user?.email ?? '');
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    updateProfile({ username, email });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUsername(user?.username ?? '');
    setEmail(user?.email ?? '');
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = [
    { label: 'Perangkat Terdaftar', value: devices.length },
    { label: 'Log Penggunaan', value: logs.length },
    { label: 'Pembelian Token', value: tokens.length },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Profil Pengguna</h2>
        <p className="text-gray-500">Kelola informasi akun dan pantau statistik penggunaan.</p>
      </div>

      {/* Profile Card */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{user?.username}</h3>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 border-green-200 border">
              Aktif
            </Badge>
          </div>
        </CardHeader>

        {/* Stats */}
        <CardContent className="border-t pt-5">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-indigo-600">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Edit Form */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-800">Informasi Akun</h4>
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-600 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  Username
                </Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50 text-gray-600' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  Email
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-gray-50 text-gray-600' : ''}
                />
              </div>
            </div>
          </div>
        </CardContent>

        {isEditing && (
          <CardFooter className="border-t bg-gray-50/50 gap-3 justify-end">
            <Button variant="outline" onClick={handleCancel} className="gap-1.5">
              <X className="w-3.5 h-3.5" />
              Batal
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 gap-1.5"
              onClick={handleSave}
            >
              <Check className="w-3.5 h-3.5" />
              Simpan Perubahan
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* Energy Score Card */}
      <Card className="shadow-sm bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-100">
        <CardContent className="pt-5 flex items-center gap-5">
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e0e7ff" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="2.5"
                strokeDasharray={`${user?.energySavingScore ?? 85} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-indigo-700">
              {user?.energySavingScore ?? 85}
            </span>
          </div>
          <div>
            <h4 className="font-bold text-indigo-800">Skor Hemat Energi</h4>
            <p className="text-sm text-indigo-600 mt-0.5">
              Anda lebih hemat dari <strong>60%</strong> pengguna lain!
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Skor meningkat seiring kebiasaan hemat energi yang konsisten.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Logout / Danger Zone */}
      <Card className="shadow-sm border-red-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-red-600 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Keamanan & Sesi
          </CardTitle>
          <CardDescription>Kelola sesi aktif Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-red-100 bg-red-50 rounded-xl gap-4">
            <div>
              <p className="font-medium text-gray-800">Keluar dari Perangkat Ini</p>
              <p className="text-sm text-gray-500">
                Sesi Anda akan berakhir. Data tersimpan di localStorage tidak akan dihapus.
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full sm:w-auto shrink-0 gap-2"
            >
              <LogOut className="w-4 h-4" />
              Keluar Akun
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
