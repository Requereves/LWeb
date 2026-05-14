import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import { useAppContext } from '../context/AppContext';
import {
  Zap, LayoutDashboard, MonitorSmartphone, LineChart,
  Lightbulb, Wallet, User as UserIcon, LogOut, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

const navItems = [
  { name: 'Dashboard',     path: '/app',                  icon: LayoutDashboard,   end: true  },
  { name: 'Perangkat',     path: '/app/devices',          icon: MonitorSmartphone, end: false },
  { name: 'Log Penggunaan', path: '/app/logs',            icon: LineChart,         end: false },
  { name: 'Rekomendasi',   path: '/app/recommendations',  icon: Lightbulb,         end: false },
  { name: 'Token Listrik', path: '/app/token',            icon: Wallet,            end: false },
  { name: 'Profil',        path: '/app/profile',          icon: UserIcon,          end: false },
];

export function AppLayout() {
  const { user, logout }  = useAppContext();
  const navigate           = useNavigate();
  const location           = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Current page title for mobile header
  const currentItem = navItems.find(item =>
    item.end ? location.pathname === item.path : location.pathname.startsWith(item.path)
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Desktop Sidebar ───────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 shadow-sm z-10 shrink-0">
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 border-b border-slate-100">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-sm">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-none">bagiWatt</h1>
            <p className="text-xs text-slate-400 mt-0.5">Monitoring Listrik</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {item.name}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="px-3 pb-4 pt-3 border-t border-slate-100 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.username}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 border-slate-100 h-9 text-sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* ── Mobile Layout ────────────────────────────────── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-slate-100 px-4 py-3.5 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 rounded-lg">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">bagiWatt</span>
            {currentItem && (
              <span className="text-slate-400 mx-1">/</span>
            )}
            <span className="text-slate-600 text-sm font-medium">{currentItem?.name}</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-30 flex">
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer */}
            <div className="relative w-72 bg-white shadow-xl flex flex-col">
              <div className="px-5 py-5 flex items-center gap-3 border-b border-slate-100">
                <div className="p-2 bg-indigo-600 rounded-xl shadow-sm">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h1 className="font-bold text-slate-900">bagiWatt</h1>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="px-3 pb-5 pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{user?.username}</p>
                    <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-indigo-50/30">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
