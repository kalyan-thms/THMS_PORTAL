import React from 'react';
import {
  Thermometer,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Gauge,
  Sliders,
  Layers,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
  RotateCw
} from 'lucide-react';

export default function PhysicalMonitoring({
  physicalData = {},
  transformer = {},
  onSelectComponent,
  selectedComponentKey,
  onOpenTHIModal
}) {
  const {
    primaryWindingTemp = 64.2,
    secondaryWindingTemp = 67.8,
    oilTemp = 52.6,
    buchholzRelay = 'Normal',
    oltc = { position: 9, operationCounter: 14820 },
    octc = { position: 3 },
    mog = { levelPercent: 68.5, status: 'Normal' },
    prv = 'Normal',
    ambientTemp = 31.4
  } = physicalData;

  // Temperature warning conditions
  const isPrimaryWindingHigh = primaryWindingTemp > 85;
  const isOilTempHigh = oilTemp > 75;
  const isBuchholzAlarm = buchholzRelay !== 'Normal';
  const isPRVOperated = prv !== 'Normal';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-cyan-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Physical Parameter Monitoring
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time physical sensors & protective devices defined in Section 5 of DPR
          </p>
        </div>

        <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-200 dark:border-cyan-800 self-start sm:self-auto">
          Interactive: Click card to locate in 3D
        </span>
      </div>

      {/* Grid of All Required Section 5 Physical Parameters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">

        {/* 1. WINDING TEMPERATURES (Primary & Secondary) */}
        <div
          onClick={() => onSelectComponent('winding')}
          className={`p-4 rounded-xl border transition cursor-pointer relative ${
            selectedComponentKey === 'winding'
              ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 ring-1 ring-cyan-500'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              1. Winding Temperatures
            </span>
            <Thermometer className={`w-4 h-4 ${isPrimaryWindingHigh ? 'text-amber-500' : 'text-cyan-500'}`} />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <span className="text-[11px] text-slate-500 block">Primary Winding</span>
              <span className={`text-xl font-bold font-mono mt-0.5 block ${isPrimaryWindingHigh ? 'text-amber-500 font-extrabold' : 'text-slate-900 dark:text-white'}`}>
                {primaryWindingTemp}°C
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Alarm: 95°C</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Secondary Winding</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                {secondaryWindingTemp}°C
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Alarm: 95°C</span>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-[11px]">
            {isPrimaryWindingHigh ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> High Winding Temp Alert
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Normal Operating Zone
              </span>
            )}
          </div>
        </div>

        {/* 2. OIL TEMPERATURE */}
        <div
          onClick={() => onSelectComponent('oil')}
          className={`p-4 rounded-xl border transition cursor-pointer relative ${
            selectedComponentKey === 'oil'
              ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 ring-1 ring-cyan-500'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              2. Top Oil Temperature
            </span>
            <Flame className={`w-4 h-4 ${isOilTempHigh ? 'text-amber-500' : 'text-blue-500'}`} />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {oilTemp} <span className="text-sm font-normal text-slate-400">°C</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Threshold: 85°C Warning / 95°C Trip</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                Normal
              </span>
            </div>
          </div>

          <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${isOilTempHigh ? 'bg-amber-500' : 'bg-cyan-500'}`}
              style={{ width: `${Math.min(100, (oilTemp / 100) * 100)}%` }}
            />
          </div>
        </div>

        {/* 3. BUCHHOLZ RELAY STATUS */}
        <div
          onClick={() => onSelectComponent('buchholz')}
          className={`p-4 rounded-xl border transition cursor-pointer relative ${
            selectedComponentKey === 'buchholz'
              ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 ring-1 ring-cyan-500'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              3. Buchholz Relay
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-base font-bold text-slate-900 dark:text-white block">
                {buchholzRelay}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Gas Accumulation & Oil Surge Protection
              </span>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
              isBuchholzAlarm
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
            }`}>
              {buchholzRelay}
            </span>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/40 text-[10px] text-slate-500 font-mono">
            Float Contacts: De-energized • Surge Vane: Intact
          </div>
        </div>

        {/* 4. OLTC POSITION & OPERATION COUNTER */}
        <div
          onClick={() => onSelectComponent('oltc')}
          className={`p-4 rounded-xl border transition cursor-pointer relative ${
            selectedComponentKey === 'oltc'
              ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 ring-1 ring-cyan-500'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              4. OLTC Status
            </span>
            <RotateCw className="w-4 h-4 text-cyan-500" />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <span className="text-[11px] text-slate-500 block">Tap Position</span>
              <span className="text-xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-0.5 block">
                Tap #{oltc.position}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">Operation Counter</span>
              <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-0.5 block">
                {oltc.operationCounter.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/40 text-[10px] text-slate-500 font-mono">
            Drive Mechanism: Idle • Diverter Switch: OK
          </div>
        </div>

        {/* 5. OCTC POSITION */}
        <div
          onClick={() => onSelectComponent('octc')}
          className={`p-4 rounded-xl border transition cursor-pointer relative ${
            selectedComponentKey === 'octc'
              ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 ring-1 ring-cyan-500'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              5. OCTC Position
            </span>
            <Sliders className="w-4 h-4 text-slate-400" />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                Tap #{octc.position}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Off-Circuit Tap Switch Setting</span>
            </div>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              Locked
            </span>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/40 text-[10px] text-slate-500 font-mono">
            Manual de-energized setting verified
          </div>
        </div>

        {/* 6. MOG STATUS / OIL LEVEL */}
        <div
          onClick={() => onSelectComponent('mog')}
          className={`p-4 rounded-xl border transition cursor-pointer relative ${
            selectedComponentKey === 'mog'
              ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 ring-1 ring-cyan-500'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              6. MOG Status / Oil Level
            </span>
            <Gauge className="w-4 h-4 text-blue-500" />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {mog.levelPercent}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Magnetic Oil Gauge Float</span>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
              {mog.status}
            </span>
          </div>

          <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all"
              style={{ width: `${mog.levelPercent}%` }}
            />
          </div>
        </div>

        {/* 7. PRV STATUS (Pressure Relief Valve) */}
        <div
          onClick={() => onSelectComponent('prv')}
          className={`p-4 rounded-xl border transition cursor-pointer relative ${
            selectedComponentKey === 'prv'
              ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 ring-1 ring-cyan-500'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              7. PRV Status
            </span>
            <ShieldCheck className={`w-4 h-4 ${isPRVOperated ? 'text-rose-500' : 'text-emerald-500'}`} />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-base font-bold text-slate-900 dark:text-white block">
                {prv}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Pressure Relief Diaphragm
              </span>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
              isPRVOperated
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
            }`}>
              {prv}
            </span>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/40 text-[10px] text-slate-500 font-mono">
            Visual Flag: Reset • Microswitch: Normal
          </div>
        </div>

        {/* 8. AMBIENT TEMPERATURE */}
        <div
          onClick={() => onSelectComponent('ambient')}
          className={`p-4 rounded-xl border transition cursor-pointer relative ${
            selectedComponentKey === 'ambient'
              ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30 ring-1 ring-cyan-500'
              : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              8. Ambient Temperature
            </span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {ambientTemp} <span className="text-sm font-normal text-slate-400">°C</span>
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Substation Yard RTD Sensor</span>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Delta-T: +{(primaryWindingTemp - ambientTemp).toFixed(1)}°C
            </span>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/40 text-[10px] text-slate-500 font-mono">
            Permissible Temp Rise: 55°C (Compliant)
          </div>
        </div>

        {/* 9. TRANSFORMER DETAILS (Summary Card per DPR Section 5) */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              9. Transformer Details
            </span>
            <span className="text-[10px] font-mono text-emerald-500 font-bold">
              {transformer.active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>

          <div className="mt-2 space-y-1 text-xs font-mono">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Capacity:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{transformer.capacity}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Rating:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{transformer.hvRating} / {transformer.lvRating}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Age:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{transformer.ageYears} years ({transformer.yearOfMfg})</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400 truncate">
              <span>Location:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate ml-2">{transformer.location}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
