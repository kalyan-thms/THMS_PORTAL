import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import EndUserDashboard from './pages/EndUserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/common/Navbar';

function PortalRouter() {
  const { currentUser, isAdmin, isEndUser } = useAuth();
  const [adminViewMode, setAdminViewMode] = useState('admin'); // 'admin' | 'client_preview'

  if (!currentUser) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar />

      {/* Admin Quick Switcher Banner when R&D Admin wants to inspect client perspective */}
      {isAdmin && (
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>R&D Admin View Controller:</span>
            <div className="inline-flex rounded-md p-0.5 bg-slate-800 border border-slate-700">
              <button
                onClick={() => setAdminViewMode('admin')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  adminViewMode === 'admin' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Administrator Control Center
              </button>
              <button
                onClick={() => setAdminViewMode('client_preview')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  adminViewMode === 'client_preview' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Live Client Portal View
              </button>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Mangal Electrical Industries Ltd. • Research & Development
          </span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {isAdmin ? (
          adminViewMode === 'admin' ? <AdminDashboard /> : <EndUserDashboard />
        ) : (
          <EndUserDashboard />
        )}
      </main>

      {/* Commercial Product Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Mangal Electrical Industries Limited. All Rights Reserved.
          </span>
          <span>
            THMS Hardware-Software Telemetry System • DPR Compliant
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortalRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}
