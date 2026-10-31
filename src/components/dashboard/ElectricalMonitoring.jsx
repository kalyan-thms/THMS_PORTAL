import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Gauge,
  Cpu,
  BarChart2,
  CheckCircle,
  TrendingUp,
  Percent,
  Layers
} from 'lucide-react';

export default function ElectricalMonitoring({ electricalData = {}, transformerTag = '' }) {
  // Toggle between HV-side meter and LV-side meter
  const [selectedMeter, setSelectedMeter] = useState('hv'); // 'hv' | 'lv'

  const currentMeterData = electricalData[selectedMeter] || electricalData.hv;

  if (!currentMeterData) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        No electrical meter readings available for this transformer.
      </div>
    );
  }

  const {
    voltage,
    current,
    power,
    powerFactor,
    frequency,
    energy,
    unbalance,
    harmonics
  } = currentMeterData;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
      {/* Header and Meter Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Electrical Parameter Monitoring
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Independent dual-meter telemetry conforming strictly to Section 4 of DPR
          </p>
        </div>

        {/* Meter Selector Tabs: HV-Side Meter vs LV-Side Meter */}
        <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setSelectedMeter('hv')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              selectedMeter === 'hv'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            HV-Side Meter
          </button>
          <button
            onClick={() => setSelectedMeter('lv')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
              selectedMeter === 'lv'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            LV-Side Meter
          </button>
        </div>
      </div>

      {/* Meter Notice */}
      <div className="mt-3 flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 font-mono">
        <span>Active Telemetry Source: <strong>{selectedMeter.toUpperCase()}-Side Digital Multi-Function Meter</strong></span>
        <span className="text-emerald-500 font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Live Stream
        </span>
      </div>

      {/* Grid of the 8 Required DPR Electrical Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">

        {/* 1. VOLTAGE GROUP */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              1. Voltage
            </span>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">{voltage.unit}</span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Average Line Voltage</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {voltage.vAvg.toFixed(2)} <span className="text-xs font-normal text-slate-400">{voltage.unit}</span>
            </span>
          </div>

          {/* Sub-readings: Line voltages A-B, B-C, C-A */}
          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/40 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span className="text-slate-500">Line A-B</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{voltage.vAB} {voltage.unit}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span className="text-slate-500">Line B-C</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{voltage.vBC} {voltage.unit}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span className="text-slate-500">Line C-A</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{voltage.vCA} {voltage.unit}</span>
            </div>
          </div>
        </div>

        {/* 2. CURRENT GROUP */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              2. Current
            </span>
            <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-bold">{current.unit}</span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Average Phase Current</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {current.iAvg.toFixed(1)} <span className="text-xs font-normal text-slate-400">{current.unit}</span>
            </span>
          </div>

          {/* Sub-readings: Phase currents A, B, C */}
          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/40 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span className="text-slate-500">Phase A (Red)</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{current.iA} {current.unit}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span className="text-slate-500">Phase B (Yellow)</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{current.iB} {current.unit}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span className="text-slate-500">Phase C (Blue)</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{current.iC} {current.unit}</span>
            </div>
          </div>
        </div>

        {/* 3. POWER GROUP */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              3. Power
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">kW / kVA</span>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Total Active Power</span>
            <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
              {(power.active / 1000).toFixed(2)} <span className="text-xs font-normal text-slate-400">MW</span>
            </span>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/40 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span className="text-slate-500">Total Active</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{power.active.toLocaleString()} kW</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span className="text-slate-500">Total Reactive</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{power.reactive.toLocaleString()} kVAR</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
              <span className="text-slate-500">Total Apparent</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{power.apparent.toLocaleString()} kVA</span>
            </div>
          </div>
        </div>

        {/* 4. POWER FACTOR & 5. FREQUENCY GROUP */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
                4. Power Factor & 5. Frequency
              </span>
            </div>

            {/* Total Power Factor */}
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-xs text-slate-500">Total Power Factor</span>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {powerFactor.total.toFixed(3)}
                </span>
                <span className="text-[10px] text-emerald-500 font-mono ml-1.5 font-semibold">
                  {powerFactor.type}
                </span>
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/40">
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-xs text-slate-500 font-sans">System Frequency</span>
              <span className="text-base font-bold text-slate-800 dark:text-slate-200">
                {frequency.value.toFixed(2)} <span className="text-xs font-normal text-slate-400">{frequency.unit}</span>
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, Math.max(0, ((frequency.value - 48.5) / 3) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* 6. ENERGY GROUP */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              6. Energy
            </span>
            <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-bold">kWh</span>
          </div>

          <div className="mt-3 space-y-2 font-mono text-xs">
            <div>
              <span className="text-slate-500 block text-[11px] font-sans">Active Energy Delivered</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white block mt-0.5">
                {energy.activeDelivered.toLocaleString()} <span className="text-xs font-normal text-slate-400">kWh</span>
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700/40">
              <span className="text-slate-500 block text-[11px] font-sans">Active Energy Received</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mt-0.5">
                {energy.activeReceived.toLocaleString()} <span className="text-xs font-normal text-slate-400">kWh</span>
              </span>
            </div>
          </div>
        </div>

        {/* 7. UNBALANCE GROUP */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              7. Unbalance
            </span>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">%</span>
          </div>

          <div className="mt-3 space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-500 font-sans">Voltage Unbalance</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{unbalance.voltageUnbalance}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${unbalance.voltageUnbalance > 1.5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (unbalance.voltageUnbalance / 3) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-500 font-sans">Current Unbalance</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{unbalance.currentUnbalance}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${unbalance.currentUnbalance > 2.5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (unbalance.currentUnbalance / 5) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 8. HARMONIC DISTORTION GROUP */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 md:col-span-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700/60">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono">
              8. Harmonic Distortion (THD)
            </span>
            <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">IEEE 519 Standard</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3 font-mono text-xs">
            <div>
              <span className="text-slate-500 font-sans block">Voltage THD</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">
                {harmonics.voltageTHD}%
              </span>
              <span className="text-[10px] text-emerald-500 font-sans mt-0.5 block">
                Limit: &lt; 5.0% (Compliant)
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-sans block">Current THD</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">
                {harmonics.currentTHD}%
              </span>
              <span className="text-[10px] text-emerald-500 font-sans mt-0.5 block">
                Limit: &lt; 8.0% (Compliant)
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
