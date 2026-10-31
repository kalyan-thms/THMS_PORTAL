import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TransformerAssembly3D from '../components/3d/TransformerAssembly3D';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  Sun,
  Moon,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export default function LoginPage() {
  const { login, loginAsDemo } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const [email, setEmail] = useState('client@adani.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRoleTab, setSelectedRoleTab] = useState('enduser'); // 'enduser' | 'admin'
  const [errorMsg, setErrorMsg] = useState('');
  const [isAssembled, setIsAssembled] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(email, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Authentication failed.');
    }
  };

  const handleSelectRoleTab = (role) => {
    setSelectedRoleTab(role);
    setErrorMsg('');
    if (role === 'admin') {
      setEmail('admin@mangal.com');
      setPassword('admin2026');
    } else {
      setEmail('client@adani.com');
      setPassword('client2026');
    }
  };

  const handleQuickDemoLogin = (roleKey) => {
    loginAsDemo(roleKey);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* LEFT: CINEMATIC 3D TRANSFORMER ASSEMBLY SECTION (Section 3 of User Prompt) */}
      <div className="relative w-full lg:w-3/5 xl:w-2/3 h-[460px] sm:h-[520px] lg:h-screen flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-950">
        {/* Top Floating Branding */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-3 bg-slate-900/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800/80 shadow-lg">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-700 to-cyan-600 flex items-center justify-center font-bold text-white text-xs tracking-wider shadow">
            MEIL
          </div>
          <div>
            <span className="font-bold text-sm text-white tracking-tight block">
              Mangal Electrical Industries Limited
            </span>
            <span className="text-[10px] font-mono text-cyan-400 block">
              Research & Development Department • Jaipur
            </span>
          </div>
        </div>

        {/* 3D Assembly Simulator */}
        <div className="w-full h-full">
          <TransformerAssembly3D onAssembledChange={setIsAssembled} />
        </div>
      </div>

      {/* RIGHT: SECURE LOGIN FORM (Section 4 of DPR) */}
      <div className="w-full lg:w-2/5 xl:w-1/3 flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-slate-900/90 backdrop-blur-lg border-l border-slate-800">
        {/* Top Header / Theme Toggle */}
        <div className="flex items-center justify-between pb-4">
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
            THMS Commercial Portal v2.4
          </span>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Center: Auth Card */}
        <div className="my-auto py-6">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Sign In to THMS Portal
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Industrial Transformer Health & Electrical Telemetry Monitoring
            </p>
          </div>

          {/* User Category Tabs (Strictly DPR Section 2: End User vs Administrator) */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 mb-5">
            <button
              type="button"
              onClick={() => handleSelectRoleTab('enduser')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                selectedRoleTab === 'enduser'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>End User</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRoleTab('admin')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                selectedRoleTab === 'admin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Administrator</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Authorized Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none font-mono transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none font-mono transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition active:scale-95 mt-2"
            >
              <span>Authenticate & Enter Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Switcher for Evaluation */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-semibold">
              Instant Demo Access (Click to Test Role):
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 transition flex flex-col"
              >
                <strong className="text-blue-400">Admin (Mangal R&D)</strong>
                <span className="text-[10px] text-slate-500 font-mono">admin@mangal.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('adani')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 transition flex flex-col"
              >
                <strong className="text-emerald-400">End User (Adani Power)</strong>
                <span className="text-[10px] text-slate-500 font-mono">client@adani.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('tata')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 transition flex flex-col"
              >
                <strong className="text-cyan-400">End User (Tata Power)</strong>
                <span className="text-[10px] text-slate-500 font-mono">engineer@tatapower.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ntpc')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-slate-300 transition flex flex-col"
              >
                <strong className="text-purple-400">End User (NTPC Outdated)</strong>
                <span className="text-[10px] text-slate-500 font-mono">alok@ntpc.co.in</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono leading-relaxed">
          <p>
            Commercial Software Portal developed for <strong>Mangal Electrical Industries Limited</strong>. Conforming strictly to internal THMS Detailed Project Report (DPR).
          </p>
        </div>
      </div>
    </div>
  );
}
