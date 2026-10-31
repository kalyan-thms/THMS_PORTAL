import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Activity,
  Sun,
  Moon,
  LogOut,
  Shield,
  Building2,
  Zap,
  User,
  ChevronDown,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function Navbar({ onOpenTHIModal }) {
  const {
    currentUser,
    logout,
    isAdmin,
    loginAsDemo,
    transformers,
    accessibleTransformers,
    selectedTransformerId,
    setSelectedTransformerId,
    currentTransformer,
    jitterTelemetry
  } = useAuth();

  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-700/60 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Department */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-cyan-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold tracking-wider text-sm border border-blue-400/30">
              MEIL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white tracking-tight text-base sm:text-lg">
                  THMS Portal
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-semibold">
                  Commercial
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Mangal Electrical Industries Ltd. • Research & Development
              </p>
            </div>
          </div>

          {/* Central Transformer Switcher (for End Users or Admin fleet monitoring) */}
          {accessibleTransformers.length > 0 && (
            <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <Zap className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-mono text-slate-500 dark:text-slate-400">
                  Monitored Transformer
                </span>
                <select
                  value={selectedTransformerId || ''}
                  onChange={(e) => setSelectedTransformerId(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none cursor-pointer pr-4"
                >
                  {accessibleTransformers.map((tr) => (
                    <option key={tr.id} value={tr.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                      {tr.tagNumber} ({tr.capacity} • {tr.hvRating}/{tr.lvRating})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Telemetry Jitter Simulation Button (Clearly labeled Demo) */}
            <button
              onClick={jitterTelemetry}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
              title="Trigger simulated live sensor telemetry tick"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-500" />
              <span>Tick Telemetry</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Role Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {isAdmin ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                  <span>Admin (R&D)</span>
                </>
              ) : (
                <>
                  <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="truncate max-w-[120px]">{currentUser?.company || 'End User'}</span>
                </>
              )}
            </div>

            {/* Quick Role Switcher Dropdown for Demo Evaluation */}
            <div className="relative group">
              <button
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/60 transition"
                title="Switch demo account"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Switch Role</span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
              </button>

              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 shadow-2xl border border-slate-200 dark:border-slate-700 p-2 hidden group-hover:block z-50">
                <div className="px-2 py-1 text-[10px] font-mono uppercase text-slate-400 border-b border-slate-100 dark:border-slate-700 mb-1">
                  Demo Role Switcher
                </div>
                <button
                  onClick={() => loginAsDemo('admin')}
                  className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-slate-100 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span>Administrator (Mangal R&D)</span>
                  {isAdmin && <span className="text-[10px] text-cyan-400 font-bold">Active</span>}
                </button>
                <button
                  onClick={() => loginAsDemo('adani')}
                  className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-slate-100 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span>End User (Adani Power)</span>
                  {currentUser?.companyId === 'COMP-001' && <span className="text-[10px] text-cyan-400 font-bold">Active</span>}
                </button>
                <button
                  onClick={() => loginAsDemo('tata')}
                  className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-slate-100 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span>End User (Tata Power)</span>
                  {currentUser?.companyId === 'COMP-002' && <span className="text-[10px] text-cyan-400 font-bold">Active</span>}
                </button>
                <button
                  onClick={() => loginAsDemo('ntpc')}
                  className="w-full text-left px-2 py-1.5 rounded text-xs hover:bg-slate-100 dark:hover:bg-slate-700/70 text-slate-800 dark:text-slate-200 flex items-center justify-between"
                >
                  <span>End User (NTPC Outdated Link)</span>
                  {currentUser?.companyId === 'COMP-003' && <span className="text-[10px] text-cyan-400 font-bold">Active</span>}
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-slate-700 transition"
              title="Logout from THMS Portal"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
