import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Download,
  AlertTriangle,
  TrendingUp,
  Filter,
  CheckCircle,
  FileSpreadsheet,
  Activity,
  Layers
} from 'lucide-react';
import { generateHistoricalSeries } from '../../data/mockData';

export default function HistoricalMonitoring({
  transformerId,
  transformerTag,
  alarms = []
}) {
  const [selectedRange, setSelectedRange] = useState('24h'); // '24h' | '7d' | '30d' | 'custom'
  const [selectedCategory, setSelectedCategory] = useState('thermal'); // 'thermal' | 'electrical' | 'power' | 'harmonics' | 'thi'
  const [subView, setSubView] = useState('graphs'); // 'graphs' | 'alarms'

  // Generate dataset based on range
  const pointsCount = selectedRange === '30d' ? 30 : (selectedRange === '7d' ? 28 : 24);
  const data = useMemo(() => {
    return generateHistoricalSeries(transformerId, pointsCount);
  }, [transformerId, selectedRange]);

  // Filter alarms for this transformer
  const transformerAlarms = alarms.filter(a => a.transformerId === transformerId);

  // CSV Export utility
  const handleExportCSV = () => {
    const headers = ["Timestamp", "Time", "Primary Winding (°C)", "Secondary Winding (°C)", "Oil Temp (°C)", "Ambient Temp (°C)", "HV Avg Voltage (kV)", "HV Avg Current (A)", "Active Power (kW)", "Power Factor", "THI Score"];
    const rows = data.map(d => [
      d.timestamp,
      d.timeLabel,
      d.primaryWindingTemp,
      d.secondaryWindingTemp,
      d.oilTemp,
      d.ambientTemp,
      d.vAvgHV,
      d.iAvgHV,
      d.activePower,
      d.powerFactor,
      d.thi
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `THMS_Historical_${transformerTag}_${selectedRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SVG Chart Renderer
  const renderHistoricalChart = () => {
    if (!data || data.length === 0) return null;

    let lines = [];
    let yMin = 0;
    let yMax = 100;
    let unit = '';

    if (selectedCategory === 'thermal') {
      yMin = 20;
      yMax = 110;
      unit = '°C';
      lines = [
        { key: 'primaryWindingTemp', label: 'Primary Winding Temp', color: '#f59e0b' },
        { key: 'secondaryWindingTemp', label: 'Secondary Winding Temp', color: '#ef4444' },
        { key: 'oilTemp', label: 'Oil Temp', color: '#06b6d4' },
        { key: 'ambientTemp', label: 'Ambient Temp', color: '#64748b' }
      ];
    } else if (selectedCategory === 'electrical') {
      const is220 = transformerId === 'TR-66MVA-03';
      const is33 = transformerId === 'TR-16MVA-04';
      yMin = is220 ? 200 : (is33 ? 30 : 120);
      yMax = is220 ? 240 : (is33 ? 36 : 144);
      unit = 'kV';
      lines = [
        { key: 'vAvgHV', label: 'Average Line Voltage', color: '#0284c7' }
      ];
    } else if (selectedCategory === 'power') {
      yMin = 0;
      yMax = 60000;
      unit = 'kW';
      lines = [
        { key: 'activePower', label: 'Active Power (kW)', color: '#8b5cf6' }
      ];
    } else if (selectedCategory === 'harmonics') {
      yMin = 0;
      yMax = 6;
      unit = '%';
      lines = [
        { key: 'voltageTHD', label: 'Voltage THD (%)', color: '#ec4899' },
        { key: 'currentTHD', label: 'Current THD (%)', color: '#8b5cf6' },
        { key: 'voltageUnbalance', label: 'Voltage Unbalance (%)', color: '#06b6d4' },
        { key: 'currentUnbalance', label: 'Current Unbalance (%)', color: '#10b981' }
      ];
    } else if (selectedCategory === 'thi') {
      yMin = 50;
      yMax = 100;
      unit = 'Index';
      lines = [
        { key: 'thi', label: 'Transformer Health Index (THI)', color: '#06b6d4' }
      ];
    }

    const width = 900;
    const height = 260;
    const padding = 45;
    const graphW = width - padding * 2;
    const graphH = height - padding * 2;

    return (
      <div className="space-y-3">
        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {lines.map((l, i) => (
              <div key={i} className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-300">
                <span className="w-3 h-1 rounded-full" style={{ backgroundColor: l.color }} />
                <span>{l.label}</span>
              </div>
            ))}
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            Points: {data.length} records • Unit: {unit}
          </span>
        </div>

        {/* SVG Curve Container */}
        <div className="w-full overflow-hidden rounded-xl bg-slate-950 p-2 border border-slate-800">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 sm:h-64">
            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
              const y = padding + graphH * (1 - pct);
              const val = Math.round(yMin + (yMax - yMin) * pct);
              return (
                <g key={i}>
                  <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#1e293b" strokeDasharray={pct === 0 ? "none" : "3,3"} />
                  <text x={padding - 8} y={y + 3.5} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Threshold line for thermal */}
            {selectedCategory === 'thermal' && (
              <g>
                {/* 85°C Warning limit */}
                <line
                  x1={padding}
                  y1={height - padding - ((85 - yMin) / (yMax - yMin)) * graphH}
                  x2={width - padding}
                  y2={height - padding - ((85 - yMin) / (yMax - yMin)) * graphH}
                  stroke="#ef4444"
                  strokeDasharray="4,4"
                  strokeWidth="1.2"
                />
                <text
                  x={width - padding - 4}
                  y={height - padding - ((85 - yMin) / (yMax - yMin)) * graphH - 4}
                  fill="#ef4444"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  85°C Warning Setpoint
                </text>
              </g>
            )}

            {/* Render lines */}
            {lines.map((l, lIdx) => {
              const polyPoints = data.map((d, dIdx) => {
                const x = padding + (dIdx / (data.length - 1)) * graphW;
                const normalized = Math.max(0, Math.min(1, (d[l.key] - yMin) / (yMax - yMin)));
                const y = height - padding - normalized * graphH;
                return `${x},${y}`;
              }).join(' ');

              return (
                <g key={lIdx}>
                  <polyline
                    fill="none"
                    stroke={l.color}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={polyPoints}
                  />
                  {/* Subtle data points */}
                  {data.filter((_, idx) => idx % 2 === 0).map((d, idx) => {
                    const originalIdx = idx * 2;
                    const x = padding + (originalIdx / (data.length - 1)) * graphW;
                    const normalized = Math.max(0, Math.min(1, (d[l.key] - yMin) / (yMax - yMin)));
                    const y = height - padding - normalized * graphH;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="2.5"
                        fill="#0b1120"
                        stroke={l.color}
                        strokeWidth="1.5"
                      />
                    );
                  })}
                </g>
              );
            })}

            {/* X Axis Time Labels */}
            {data.filter((_, idx) => idx % Math.ceil(data.length / 8) === 0).map((d, idx, arr) => {
              const originalIdx = data.indexOf(d);
              const x = padding + (originalIdx / (data.length - 1)) * graphW;
              return (
                <text
                  key={idx}
                  x={x}
                  y={height - 12}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {selectedRange === '24h' ? d.timeLabel : d.dateLabel}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
      {/* Top Header & Range Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Historical Monitoring & Alarm Archive
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            DPR Section 8 time-series analysis for electrical & physical telemetry
          </p>
        </div>

        {/* View Switcher: Graphs vs Alarms */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSubView('graphs')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                subView === 'graphs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Parameter Graphs
            </button>
            <button
              onClick={() => setSubView('alarms')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                subView === 'alarms'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Alarm Records ({transformerAlarms.length})
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
            title="Export historical telemetry as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Export</span>
          </button>
        </div>
      </div>

      {subView === 'graphs' ? (
        <>
          {/* Controls: Date Range & Parameter Category */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-4">
            {/* Category Buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSelectedCategory('thermal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === 'thermal'
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Thermal (Windings & Oil)
              </button>
              <button
                onClick={() => setSelectedCategory('electrical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === 'electrical'
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Line Voltage
              </button>
              <button
                onClick={() => setSelectedCategory('power')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === 'power'
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Active Power (kW)
              </button>
              <button
                onClick={() => setSelectedCategory('harmonics')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === 'harmonics'
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Harmonics & Unbalance
              </button>
              <button
                onClick={() => setSelectedCategory('thi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === 'thi'
                    ? 'bg-cyan-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Health Index (THI) Trend
              </button>
            </div>

            {/* Range Presets */}
            <div className="flex items-center gap-1 self-start md:self-auto bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
              <button
                onClick={() => setSelectedRange('24h')}
                className={`px-2.5 py-1 rounded text-xs transition ${
                  selectedRange === '24h' ? 'bg-white dark:bg-slate-700 font-bold shadow-sm' : 'text-slate-500'
                }`}
              >
                24 Hours
              </button>
              <button
                onClick={() => setSelectedRange('7d')}
                className={`px-2.5 py-1 rounded text-xs transition ${
                  selectedRange === '7d' ? 'bg-white dark:bg-slate-700 font-bold shadow-sm' : 'text-slate-500'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setSelectedRange('30d')}
                className={`px-2.5 py-1 rounded text-xs transition ${
                  selectedRange === '30d' ? 'bg-white dark:bg-slate-700 font-bold shadow-sm' : 'text-slate-500'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          {/* Chart Display */}
          <div className="mt-4">
            {renderHistoricalChart()}
          </div>
        </>
      ) : (
        /* Previous Alarm Records (DPR Section 8) */
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-sans">
                <th className="pb-2.5 font-semibold">Alarm ID</th>
                <th className="pb-2.5 font-semibold">Timestamp</th>
                <th className="pb-2.5 font-semibold">Severity</th>
                <th className="pb-2.5 font-semibold">Parameter</th>
                <th className="pb-2.5 font-semibold">Trigger Value</th>
                <th className="pb-2.5 font-semibold">Limit Threshold</th>
                <th className="pb-2.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {transformerAlarms.length > 0 ? (
                transformerAlarms.map((alm) => (
                  <tr key={alm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{alm.id}</td>
                    <td className="py-2.5 text-slate-500 font-mono">
                      {new Date(alm.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        alm.severity === 'Critical'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                          : (alm.severity === 'Warning'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                            : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400')
                      }`}>
                        {alm.severity}
                      </span>
                    </td>
                    <td className="py-2.5 font-sans font-medium text-slate-800 dark:text-slate-200">{alm.parameter}</td>
                    <td className="py-2.5 font-bold text-slate-900 dark:text-white">{alm.currentValue}</td>
                    <td className="py-2.5 text-slate-500">{alm.threshold}</td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1 font-sans ${
                        alm.status === 'Active' ? 'text-amber-500 font-bold' : 'text-emerald-500'
                      }`}>
                        {alm.status === 'Active' ? 'Active' : 'Resolved'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400 font-sans">
                    No previous alarms recorded for this transformer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
