import React from 'react';
import { X, ShieldAlert, Info, Activity, CheckCircle, Clock } from 'lucide-react';

export default function HealthIndexModal({ isOpen, onClose, transformer }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Transformer Health Index (THI)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mangal R&D Telemetry Pilot Specification (DPR Section 9)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs">
          {/* Prominent DPR Warning Banner */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">
                R&D Architecture Notice (Section 9 Requirement):
              </strong>
              <p className="mt-0.5 leading-relaxed">
                The formal calculation method, weighting coefficients, and operational trip thresholds for the Transformer Health Index are currently being finalized and approved by the Mangal Electrical Industries R&D engineering team. The displayed score represents a <strong>clearly identified placeholder</strong> for commercial demonstration.
              </p>
            </div>
          </div>

          {/* Current Asset Status */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 font-mono">
            <div className="flex justify-between items-center text-slate-500 mb-2">
              <span>Monitored Asset:</span>
              <span className="font-bold text-slate-900 dark:text-white">{transformer?.tagNumber}</span>
            </div>
            <div className="flex justify-between items-center text-slate-500 mb-2">
              <span>Demonstration Score:</span>
              <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                {transformer?.thiScore} / 100 ({transformer?.thiStatus})
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-500">
              <span>Subsystem Inputs:</span>
              <span>Oil Temp, Winding Temps, Buchholz, Gas, Electrical Unbalance</span>
            </div>
          </div>

          {/* Planned R&D Subsystem Formulation */}
          <div className="space-y-1.5">
            <span className="font-bold text-slate-700 dark:text-slate-300 font-sans block">
              Planned R&D Parameter Weighting Structure:
            </span>
            <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
              <li><strong>Thermal Degradation Factor (30%):</strong> Primary/Secondary Winding RTD readings and Top Oil delta over ambient.</li>
              <li><strong>Dielectric Integrity (25%):</strong> MOG level, moisture in breather, and Buchholz gas accumulation.</li>
              <li><strong>Electrical Stress (25%):</strong> Current and voltage unbalance, power factor, and harmonic THD.</li>
              <li><strong>Mechanical Integrity (20%):</strong> OLTC operation counts, PRV status, and tank vibration indicators.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 transition"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
}
