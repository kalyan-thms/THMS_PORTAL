import React, { useState, useEffect } from 'react';
import { Activity, Play, Pause, RefreshCw, Zap, Thermometer, Shield } from 'lucide-react';

export default function LiveMonitoring({ transformerId, electricalData = {}, physicalData = {} }) {
  const [isRunning, setIsRunning] = useState(true);
  const [historyPoints, setHistoryPoints] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('temp'); // 'temp' | 'voltage' | 'current' | 'power'

  // Initialize and append live stream
  useEffect(() => {
    // Generate initial 15 points
    const pts = [];
    const now = Date.now();
    for (let i = 14; i >= 0; i--) {
      const t = new Date(now - i * 3000);
      pts.push({
        time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        winding: 64.2 + (Math.random() * 1.5 - 0.75),
        oil: 52.6 + (Math.random() * 0.8 - 0.4),
        voltage: 132.4 + (Math.random() * 0.6 - 0.3),
        current: 183.2 + (Math.random() * 4 - 2),
        power: 38450 + (Math.random() * 200 - 100)
      });
    }
    setHistoryPoints(pts);
  }, [transformerId]);

  // Live timer interval
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setHistoryPoints(prev => {
        const last = prev[prev.length - 1] || { winding: 64.2, oil: 52.6, voltage: 132.4, current: 183.2, power: 38450 };
        const now = new Date();
        const newPoint = {
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          winding: +(last.winding + (Math.random() * 0.6 - 0.3)).toFixed(1),
          oil: +(last.oil + (Math.random() * 0.3 - 0.15)).toFixed(1),
          voltage: +(last.voltage + (Math.random() * 0.2 - 0.1)).toFixed(2),
          current: +(last.current + (Math.random() * 2.5 - 1.25)).toFixed(1),
          power: Math.round(last.power + (Math.random() * 80 - 40))
        };
        return [...prev.slice(1), newPoint];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Calculate SVG curve coordinates for selected metric
  const renderChart = () => {
    if (historyPoints.length < 2) return null;

    let dataKey = 'winding';
    let dataKey2 = 'oil';
    let label1 = 'Primary Winding Temp (°C)';
    let label2 = 'Top Oil Temp (°C)';
    let color1 = '#06b6d4'; // Cyan
    let color2 = '#3b82f6'; // Blue
    let minVal = 40;
    let maxVal = 90;

    if (selectedMetric === 'voltage') {
      dataKey = 'voltage';
      dataKey2 = null;
      label1 = 'Average Line Voltage (kV)';
      color1 = '#eab308'; // Amber
      minVal = 125;
      maxVal = 140;
    } else if (selectedMetric === 'current') {
      dataKey = 'current';
      dataKey2 = null;
      label1 = 'Average Phase Current (A)';
      color1 = '#10b981'; // Emerald
      minVal = 150;
      maxVal = 220;
    } else if (selectedMetric === 'power') {
      dataKey = 'power';
      dataKey2 = null;
      label1 = 'Total Active Power (kW)';
      color1 = '#8b5cf6'; // Purple
      minVal = 35000;
      maxVal = 42000;
    }

    const width = 800;
    const height = 220;
    const padding = 35;
    const graphW = width - padding * 2;
    const graphH = height - padding * 2;

    const points1 = historyPoints.map((pt, idx) => {
      const x = padding + (idx / (historyPoints.length - 1)) * graphW;
      const normalized = (pt[dataKey] - minVal) / (maxVal - minVal);
      const y = height - padding - normalized * graphH;
      return `${x},${y}`;
    }).join(' ');

    const points2 = dataKey2 ? historyPoints.map((pt, idx) => {
      const x = padding + (idx / (historyPoints.length - 1)) * graphW;
      const normalized = (pt[dataKey2] - minVal) / (maxVal - minVal);
      const y = height - padding - normalized * graphH;
      return `${x},${y}`;
    }).join(' ') : null;

    const latest = historyPoints[historyPoints.length - 1];

    return (
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color1 }} />
              {label1}: <strong className="text-slate-900 dark:text-white">{latest[dataKey]}</strong>
            </span>
            {dataKey2 && (
              <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color2 }} />
                {label2}: <strong className="text-slate-900 dark:text-white">{latest[dataKey2]}</strong>
              </span>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Window: Last 45s (2.5s update rate)
          </div>
        </div>

        {/* SVG Live Graphic */}
        <div className="w-full overflow-hidden rounded-lg bg-slate-950 p-2 border border-slate-800">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 sm:h-52">
            {/* Grid lines */}
            <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#1e293b" strokeDasharray="3,3" />
            <line x1={padding} y1={padding + graphH / 2} x2={width - padding} y2={padding + graphH / 2} stroke="#1e293b" strokeDasharray="3,3" />
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" />

            {/* Y Axis Labels */}
            <text x={padding - 8} y={padding + 4} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
              {maxVal}
            </text>
            <text x={padding - 8} y={padding + graphH / 2 + 3} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
              {Math.round((maxVal + minVal) / 2)}
            </text>
            <text x={padding - 8} y={height - padding} fill="#64748b" fontSize="10" fontFamily="monospace" textAnchor="end">
              {minVal}
            </text>

            {/* Polyline 1 */}
            <polyline
              fill="none"
              stroke={color1}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points1}
            />

            {/* Polyline 2 if available */}
            {points2 && (
              <polyline
                fill="none"
                stroke={color2}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points2}
              />
            )}

            {/* Node dots */}
            {historyPoints.map((pt, idx) => {
              const x = padding + (idx / (historyPoints.length - 1)) * graphW;
              const y1 = height - padding - ((pt[dataKey] - minVal) / (maxVal - minVal)) * graphH;
              return (
                <circle
                  key={`dot1-${idx}`}
                  cx={x}
                  cy={y1}
                  r="3.5"
                  fill="#0a101d"
                  stroke={color1}
                  strokeWidth="2"
                />
              );
            })}

            {/* X Axis Time Labels */}
            {historyPoints.filter((_, idx) => idx % 3 === 0).map((pt, idx) => {
              const originalIdx = idx * 3;
              const x = padding + (originalIdx / (historyPoints.length - 1)) * graphW;
              return (
                <text
                  key={`time-${idx}`}
                  x={x}
                  y={height - 12}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {pt.time}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500 animate-pulse" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Live Telemetry & Real-Time Waveforms
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              High-frequency sensor stream for transformer health tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isRunning
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause Live Stream' : 'Resume Stream'}</span>
          </button>
        </div>
      </div>

      {/* Metric Selectors */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pb-2">
        <button
          onClick={() => setSelectedMetric('temp')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            selectedMetric === 'temp'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Winding & Oil Temperatures
        </button>
        <button
          onClick={() => setSelectedMetric('voltage')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            selectedMetric === 'voltage'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          HV Voltage Trend
        </button>
        <button
          onClick={() => setSelectedMetric('current')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            selectedMetric === 'current'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          HV Phase Current
        </button>
        <button
          onClick={() => setSelectedMetric('power')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
            selectedMetric === 'power'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          Active Power (kW)
        </button>
      </div>

      {/* Chart Canvas */}
      <div className="mt-2">
        {renderChart()}
      </div>
    </div>
  );
}
