import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import TransformerOverview from '../components/dashboard/TransformerOverview';
import ElectricalMonitoring from '../components/dashboard/ElectricalMonitoring';
import PhysicalMonitoring from '../components/dashboard/PhysicalMonitoring';
import LiveMonitoring from '../components/dashboard/LiveMonitoring';
import HistoricalMonitoring from '../components/dashboard/HistoricalMonitoring';
import ReportsArchive from '../components/dashboard/ReportsArchive';
import HealthIndexModal from '../components/dashboard/HealthIndexModal';
import TransformerDigitalTwin from '../components/3d/TransformerDigitalTwin';
import {
  Activity,
  Zap,
  Thermometer,
  TrendingUp,
  FileText,
  AlertTriangle,
  Layers,
  Box
} from 'lucide-react';

export default function EndUserDashboard() {
  const {
    currentTransformer,
    electricalData,
    physicalData,
    alarms,
    reports
  } = useAuth();

  // Active Monitoring Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'electrical' | 'physical' | 'live' | 'historical' | 'reports'
  const [highlighted3DComponent, setHighlighted3DComponent] = useState(null);
  const [isTHIModalOpen, setIsTHIModalOpen] = useState(false);

  if (!currentTransformer) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500">
        No transformer asset assigned to this client account. Contact Mangal R&D Administrator.
      </div>
    );
  }

  const transformerId = currentTransformer.id;
  const currentElectrical = electricalData[transformerId] || electricalData["TR-50MVA-01"] || {};
  const currentPhysical = physicalData[transformerId] || physicalData["TR-50MVA-01"] || {};
  const activeAlarms = alarms.filter(a => a.transformerId === transformerId && a.status === 'Active');

  const handleSelectPhysicalComponent = (compKey) => {
    setHighlighted3DComponent(compKey);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* SECTION A: TRANSFORMER OVERVIEW (Always visible at top per DPR Section 3A) */}
      <TransformerOverview
        transformer={currentTransformer}
        activeAlarms={activeAlarms}
        onOpenTHIModal={() => setIsTHIModalOpen(true)}
        onOpenAlarmsTab={() => setActiveTab('historical')}
      />

      {/* Navigation Tabs Bar (Compact, high-end commercial SCADA style) */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto space-x-1 sm:space-x-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>Physical & 3D Digital Twin</span>
        </button>

        <button
          onClick={() => setActiveTab('electrical')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'electrical'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Electrical Monitoring (HV & LV)</span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'live'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live Telemetry & Waves</span>
        </button>

        <button
          onClick={() => setActiveTab('historical')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'historical'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Historical Monitoring & Alarms</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'reports'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Daily Reports Archive</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB: OVERVIEW & 3D DIGITAL TWIN + PHYSICAL PARAMETERS     */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* 3D Digital Twin Visualizer (DPR Section 6) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-1">
              <TransformerDigitalTwin
                highlightedComponent={highlighted3DComponent}
                onSelectComponent={handleSelectPhysicalComponent}
                physicalData={currentPhysical}
              />
            </div>
            <div className="lg:col-span-2">
              {/* SECTION C: PHYSICAL PARAMETERS */}
              <PhysicalMonitoring
                physicalData={currentPhysical}
                transformer={currentTransformer}
                onSelectComponent={handleSelectPhysicalComponent}
                selectedComponentKey={highlighted3DComponent}
                onOpenTHIModal={() => setIsTHIModalOpen(true)}
              />
            </div>
          </div>

          {/* Quick Electrical Highlights */}
          <ElectricalMonitoring
            electricalData={currentElectrical}
            transformerTag={currentTransformer.tagNumber}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: ELECTRICAL MONITORING (DPR Section 4)                */}
      {/* ========================================================= */}
      {activeTab === 'electrical' && (
        <ElectricalMonitoring
          electricalData={currentElectrical}
          transformerTag={currentTransformer.tagNumber}
        />
      )}

      {/* ========================================================= */}
      {/* TAB: LIVE TELEMETRY (DPR Section 8)                       */}
      {/* ========================================================= */}
      {activeTab === 'live' && (
        <LiveMonitoring
          transformerId={transformerId}
          electricalData={currentElectrical}
          physicalData={currentPhysical}
        />
      )}

      {/* ========================================================= */}
      {/* TAB: HISTORICAL MONITORING & ALARMS (DPR Section 8)       */}
      {/* ========================================================= */}
      {activeTab === 'historical' && (
        <HistoricalMonitoring
          transformerId={transformerId}
          transformerTag={currentTransformer.tagNumber}
          alarms={alarms}
        />
      )}

      {/* ========================================================= */}
      {/* TAB: DAILY REPORTS ARCHIVE (DPR Section 7.1)              */}
      {/* ========================================================= */}
      {activeTab === 'reports' && (
        <ReportsArchive
          reports={reports}
          transformer={currentTransformer}
          electricalData={currentElectrical}
          physicalData={currentPhysical}
        />
      )}

      {/* THI R&D Transparency Modal (DPR Section 9) */}
      <HealthIndexModal
        isOpen={isTHIModalOpen}
        onClose={() => setIsTHIModalOpen(false)}
        transformer={currentTransformer}
      />
    </div>
  );
}
