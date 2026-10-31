import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TransformerAssembly3D from '../components/3d/TransformerAssembly3D';
import {
  Lock,
  User,
  Shield,
  Sun,
  Moon,
  Eye,
  EyeOff,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Building,
  Factory,
  FileCheck2,
  MapPin,
  AlertCircle
} from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  // User Type selection: ONLY 'User' or 'Admin'
  const [userType, setUserType] = useState('User'); // 'User' | 'Admin'
  const [userId, setUserId] = useState('client@adani.com');
  const [password, setPassword] = useState('client2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Expandable company information footer
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setErrorMsg('');
    if (type === 'Admin') {
      setUserId('admin@mangal.com');
      setPassword('admin2026');
    } else {
      setUserId('client@adani.com');
      setPassword('client2026');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(userId, password, userType);
    if (!res.success) {
      setErrorMsg(res.error || 'Invalid credentials. Please verify your User ID and password.');
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
      {/* 1. TOP HEADER: Display ONLY "MANGAL ELECTRICAL INDUSTRIES LIMITED" */}
      <header className={`w-full border-b transition-colors duration-300 px-4 sm:px-8 py-3.5 flex items-center justify-between ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200 shadow-sm'
        }`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src="/mangal-logo.png"
            alt="Mangal Logo"
            className="h-8 sm:h-9 w-auto object-contain"
          />
          <h1 className="text-sm sm:text-lg lg:text-xl font-bold font-mono tracking-tight uppercase select-none text-slate-900 dark:text-white">
            Transformer Health Monitoring System
          </h1>

        </div>

        {/* Light Mode / Dark Mode Switcher */}
        <button
          onClick={toggleTheme}
          type="button"
          aria-label="Toggle theme"
          className={`p-2 rounded-xl border transition-all duration-200 active:scale-95 ${isDark
            ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700'
            : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* 2. MAIN SECTION: 3D TRANSFORMER & STREAMLINED SIGN-IN */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">

        {/* LEFT / CENTER: PREMIUM 3D TRANSFORMER ANIMATION */}
        {/* Automatic continuous assembly and disassembly loop, no buttons, fully theme-adaptive */}
        <div className={`relative w-full lg:w-3/5 xl:w-2/3 h-[380px] sm:h-[460px] lg:h-[540px] rounded-2xl overflow-hidden border transition-all duration-300 ${isDark
          ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-slate-800/80 shadow-2xl'
          : 'bg-gradient-to-b from-slate-100 via-slate-50 to-slate-100 border-slate-200 shadow-xl'
          }`}>
          <TransformerAssembly3D isDark={isDark} />
        </div>

        {/* RIGHT: CLEAN & STREAMLINED SIGN-IN SECTION */}
        {/* Contains ONLY: 1. User Type selection (User/Admin), 2. User ID, 3. Password, 4. Login button */}
        <div className="w-full lg:w-2/5 xl:w-1/3 flex justify-center">
          <div className={`w-full max-w-md p-6 sm:p-7 rounded-2xl border transition-all duration-300 ${isDark
            ? 'bg-slate-900/95 border-slate-800 shadow-2xl'
            : 'bg-white border-slate-200 shadow-xl'
            }`}>
            <div className="mb-5">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Sign In
              </h2>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* 1. USER TYPE SELECTION: ONLY "User" and "Admin" */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 font-mono">
                  User Type
                </label>
                <div className={`grid grid-cols-2 gap-1.5 p-1 rounded-xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}>
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange('User')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${userType === 'User'
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>User</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUserTypeChange('Admin')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${userType === 'Admin'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {/* 2. USER ID */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  User ID
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter your User ID"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-mono outline-none transition-all ${isDark
                      ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                      }`}
                  />
                </div>
              </div>

              {/* 3. PASSWORD */}
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your Password"
                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl border text-xs font-mono outline-none transition-all ${isDark
                      ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 4. LOGIN BUTTON */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold text-xs tracking-wide shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 mt-2"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* 4. COMPANY INFORMATION AT THE BOTTOM OF THE LOGIN PAGE */}
      <div className={`w-full border-t transition-colors duration-300 ${isDark ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white border-slate-200'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Collapsible toggle bar for complete corporate details */}
          <div className="py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <button
              type="button"
              onClick={() => setShowCompanyDetails(!showCompanyDetails)}
              className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 font-medium transition"
            >
              <Building className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Corporate Information (GSTIN • CIN • Registered Office • Manufacturing Units)</span>
              {showCompanyDetails ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
            </button>

            {/* Statutory Quick Badges */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              <span>CIN: <strong className="text-slate-700 dark:text-slate-300">L31909RJ2008PLC026255</strong></span>
              <span className="hidden sm:inline">•</span>
              <span>GSTIN: <strong className="text-slate-700 dark:text-slate-300">08AAFCM4722P1Z1</strong></span>
            </div>
          </div>

          {/* Expandable Company Information Drawer */}
          {showCompanyDetails && (
            <div className={`pb-5 pt-3 border-t text-xs grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in ${isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>

              {/* SECTION A: GSTIN & CIN */}
              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-mono text-[11px] mb-2">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>GSTIN & CIN Registrations</span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-sans text-[10px]">CIN:</span>
                    <strong className="text-slate-800 dark:text-slate-200">L31909RJ2008PLC026255</strong>
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-400 block font-sans text-[10px]">GSTIN Rajasthan:</span>
                    <strong className="text-slate-800 dark:text-slate-200">08AAFCM4722P1Z1</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-sans text-[10px]">GSTIN Rajasthan (SEZ):</span>
                    <strong className="text-slate-800 dark:text-slate-200">08AAFCM4722P2Z0</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-sans text-[10px]">GSTIN Uttar Pradesh:</span>
                    <strong className="text-slate-800 dark:text-slate-200">09AAFCM4722P1ZZ</strong>
                  </div>
                </div>
              </div>

              {/* SECTION B: REGISTERED OFFICE ADDRESS */}
              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono text-[11px] mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Registered Office Address</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  C-61, C-61 (A&B), Road No. 1-C,<br />
                  V.K.I. Area, Jaipur 302 013,<br />
                  Rajasthan, India
                </p>
              </div>

              {/* SECTION C: FACTORY MANUFACTURING UNITS */}
              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono text-[11px] mb-2">
                  <Factory className="w-3.5 h-3.5" />
                  <span>Factory Addresses (Units 1 - 5)</span>
                </div>
                <div className="space-y-2 text-[11px] text-slate-700 dark:text-slate-300 font-sans max-h-48 overflow-y-auto pr-1">
                  <div>
                    <strong>Unit 1:</strong> C-61, C-61 (A&B), Road No. 1-C, V.K.I. Area, Jaipur 302 013, Rajasthan, India
                  </div>
                  <div>
                    <strong>Unit 2:</strong> E-54, Road No.5, VKI Area, Jaipur 302 013, Rajasthan, India
                  </div>
                  <div>
                    <strong>Unit 3:</strong> Plot no. B-308, Road No.16, Vishwakarma Industrial Area, Jaipur 302 013, Rajasthan, India
                  </div>
                  <div>
                    <strong>Unit 4:</strong> E-40 to E-46A, Shree Khatu, Shyam ji Industrial Area, Reengus, Sikar 332 404, Rajasthan, India
                  </div>
                  <div>
                    <strong>Unit 5:</strong> Plot No. PA 011 -008B, Mahindra World City SEZ Zone, Kalwara Ajmer Road 302 029, Rajasthan, India
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* OFFICIAL FOOTER BRANDING LINE */}
          <div className={`py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 ${isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Powered by Mangal Electrical Industries Limited
            </span>
            <span>
              India.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
