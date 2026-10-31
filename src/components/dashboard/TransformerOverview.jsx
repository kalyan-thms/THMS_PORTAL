import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  WifiOff,
  Radio,
  Building,
  Info,
  Calendar,
  MapPin,
  Cpu,
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function TransformerOverview({
  transformer,
  company,
  activeAlarms = [],
  onOpenTHIModal,
  onOpenAlarmsTab
}) {
  if (!transformer) return null;

  // Status badge styling
  const getStatusBadge = (status, isOutdated) => {
    if (isOutdated) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          <Clock className="w-3.5 h-3.5" />
          Readings Outdated (Telemetry Latency)
        </span>
      );
    }
    switch (status) {
      case 'Normal':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Normal Operational Status
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5" />
            Warning Alert Active
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            Critical Trip Hazard
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-500 border border-slate-500/30">
            <WifiOff className="w-3.5 h-3.5" />
            Offline
          </span>
        );
    }
  };

  const formattedTime = new Date(transformer.lastUpdated).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
      {/* Top Bar: Company Name & Transformer Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {transformer.companyName || company?.name}
              </h2>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {transformer.tagNumber}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{transformer.location}</span>
            </p>
          </div>
        </div>

        {/* Status & Freshness */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {getStatusBadge(transformer.status, transformer.isOutdated)}

          {/* Reading freshness timestamp */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
            <Radio className={`w-3.5 h-3.5 ${transformer.isOutdated ? 'text-amber-500' : 'text-emerald-500 animate-pulse'}`} />
            <span>Updated: {formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Grid of Key Transformer Identification Details (DPR Section 3A & 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mt-4">
        {/* Capacity */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-medium">
            Capacity
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
            {transformer.capacity}
          </span>
        </div>

        {/* Voltage Ratings */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-medium">
            HV / LV Rating
          </span>
          <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5 block font-mono">
            {transformer.hvRating} / {transformer.lvRating}
          </span>
        </div>

        {/* Cooling & Vector Group */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-medium">
            Cooling / Vector
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 block truncate">
            {transformer.coolingType} • {transformer.vectorGroup}
          </span>
        </div>

        {/* Age & Year */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-medium">
            Age & Mfg Year
          </span>
          <span className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 block">
            {transformer.ageYears} yrs ({transformer.yearOfMfg})
          </span>
        </div>

        {/* Serial Number */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 block font-medium">
            Serial Number
          </span>
          <span className="text-xs sm:text-sm font-mono font-medium text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
            {transformer.serialNumber}
          </span>
        </div>

        {/* Transformer Health Index (THI) Card */}
        <div
          onClick={onOpenTHIModal}
          className="bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-transparent p-3 rounded-lg border border-cyan-500/30 cursor-pointer hover:border-cyan-400 transition group relative"
          title="Click to view Transformer Health Index R&D Status"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-mono text-cyan-600 dark:text-cyan-400 block font-bold">
              Health Index (THI)
            </span>
            <Info className="w-3.5 h-3.5 text-cyan-500 opacity-80 group-hover:opacity-100" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-lg sm:text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
              {transformer.thiScore}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">/ 100</span>
            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 ml-auto">
              {transformer.thiStatus}
            </span>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 block truncate mt-0.5">
            *Pilot formula (R&D Pending)
          </span>
        </div>
      </div>

      {/* Faults and Alarms Summary Alert Strip (DPR Section 3A) */}
      {activeAlarms.length > 0 ? (
        <div className="mt-3.5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>
              <strong>Active Fault Detected:</strong> {activeAlarms[0].parameter} ({activeAlarms[0].currentValue}) — {activeAlarms[0].message}
            </span>
          </div>
          {onOpenAlarmsTab && (
            <button
              onClick={onOpenAlarmsTab}
              className="text-xs font-semibold text-rose-700 dark:text-rose-300 underline underline-offset-2 hover:text-rose-900 shrink-0"
            >
              View Alarm Records ({activeAlarms.length})
            </button>
          )}
        </div>
      ) : (
        <div className="mt-3.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>All protective relays and operational parameters within normal limits. Zero active faults.</span>
        </div>
      )}
    </div>
  );
}
