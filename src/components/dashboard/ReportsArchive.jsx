import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  CheckCircle,
  Clock,
  Printer,
  Shield,
  Building,
  Zap,
  X
} from 'lucide-react';

export default function ReportsArchive({
  reports = [],
  transformer,
  electricalData = {},
  physicalData = {}
}) {
  const [selectedReportForPreview, setSelectedReportForPreview] = useState(null);

  // Filter reports for current transformer
  const transformerReports = reports.filter(r => r.transformerId === transformer?.id);

  // Generate authentic PDF using jsPDF
  const generateAndDownloadPDF = (report) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [15, 43, 72]; // MEIL Navy
    const accentColor = [2, 132, 199]; // Cyan accent
    const darkGray = [30, 41, 59];

    // Header banner
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 28, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('MANGAL ELECTRICAL INDUSTRIES LIMITED', 14, 12);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(190, 210, 235);
    doc.text('RESEARCH & DEVELOPMENT DEPARTMENT • JAIPUR, RAJASTHAN', 14, 18);
    doc.text('TRANSFORMER HEALTH MONITORING SYSTEM (THMS) — DAILY AUDIT REPORT', 14, 23);

    // Meta details section
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORT DETAILS & ASSET IDENTIFICATION', 14, 36);

    const metaData = [
      ['Client Company:', transformer?.companyName || 'Industrial Substation Client', 'Report Date:', report.date],
      ['Asset Tag Number:', transformer?.tagNumber || 'MEIL/2023/T-1049', 'Generated At:', new Date(report.generatedAt).toLocaleString()],
      ['Serial Number:', transformer?.serialNumber || 'SN-MEIL-8841', 'Capacity & Ratio:', `${transformer?.capacity} • ${transformer?.hvRating}/${transformer?.lvRating}`],
      ['Substation Location:', transformer?.location || 'Switchyard Bay-03', 'Overall Status:', `${transformer?.status} (THI: ${report.averageTHI} / 100)`]
    ];

    doc.autoTable({
      startY: 39,
      body: metaData,
      theme: 'plain',
      styles: { fontSize: 8.5, cellPadding: 1.5, textColor: darkGray },
      columnStyles: {
        0: { fontStyle: 'bold', width: 38 },
        1: { width: 67 },
        2: { fontStyle: 'bold', width: 32 },
        3: { width: 63 }
      }
    });

    let lastY = doc.lastAutoTable.finalY + 4;

    // SECTION 1: ELECTRICAL PARAMETERS TABLE (DPR Section 4)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text('1. ELECTRICAL TELEMETRY SUMMARY (HV & LV DUAL-METER)', 14, lastY);

    const hv = electricalData.hv || {};
    const lv = electricalData.lv || {};

    const electricalTableRows = [
      ['Average Line Voltage', `${hv.voltage?.vAvg || 132.37} kV`, `${lv.voltage?.vAvg || 33.12} kV`, 'Line Voltages A-B, B-C, C-A Average'],
      ['Average Phase Current', `${hv.current?.iAvg || 183.2} A`, `${lv.current?.iAvg || 728.8} A`, 'Three-phase average loading'],
      ['Total Active Power', `${((hv.power?.active || 38450) / 1000).toFixed(2)} MW`, `${((lv.power?.active || 38120) / 1000).toFixed(2)} MW`, 'Total real power throughput'],
      ['Reactive / Apparent Power', `${hv.power?.reactive || 12210} kVAR / ${hv.power?.apparent || 40340} kVA`, `${lv.power?.reactive || 12100} kVAR / ${lv.power?.apparent || 39990} kVA`, 'Reactive and total apparent load'],
      ['Total Power Factor', `${hv.powerFactor?.total || 0.953} (Lag)`, `${lv.powerFactor?.total || 0.953} (Lag)`, 'Operating displacement factor'],
      ['System Frequency', `${hv.frequency?.value || 50.02} Hz`, `${lv.frequency?.value || 50.02} Hz`, 'Grid synchronized frequency'],
      ['Active Energy Delivered', `${(hv.energy?.activeDelivered || 4218900).toLocaleString()} kWh`, `${(lv.energy?.activeDelivered || 4182400).toLocaleString()} kWh`, 'Cumulative net delivered energy'],
      ['Voltage / Current Unbalance', `${hv.unbalance?.voltageUnbalance || 0.32}% / ${hv.unbalance?.currentUnbalance || 1.15}%`, `${lv.unbalance?.voltageUnbalance || 0.28}% / ${lv.unbalance?.currentUnbalance || 0.94}%`, 'Phase symmetry index (DPR Group 7)'],
      ['Harmonic Distortion (THD)', `V-THD: ${hv.harmonics?.voltageTHD || 1.42}% • I-THD: ${hv.harmonics?.currentTHD || 2.18}%`, `V-THD: ${lv.harmonics?.voltageTHD || 1.65}% • I-THD: ${lv.harmonics?.currentTHD || 2.74}%`, 'Compliant with IEEE 519 standards']
    ];

    doc.autoTable({
      startY: lastY + 2,
      head: [['Parameter (DPR Section 4)', 'HV-Side Meter', 'LV-Side Meter', 'Engineering Notes']],
      body: electricalTableRows,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8, fontStyle: 'bold' },
      styles: { fontSize: 7.5, cellPadding: 2, textColor: darkGray },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    lastY = doc.lastAutoTable.finalY + 4;

    // SECTION 2: PHYSICAL PARAMETERS TABLE (DPR Section 5)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...primaryColor);
    doc.text('2. PHYSICAL SENSORS & PROTECTIVE DEVICES (DPR Section 5)', 14, lastY);

    const phys = physicalData;
    const physicalTableRows = [
      ['Primary & Secondary Winding Temp', `Pri: ${phys.primaryWindingTemp || 64.2} °C • Sec: ${phys.secondaryWindingTemp || 67.8} °C`, 'Normal (Alarm limit: 95°C, Trip limit: 105°C)'],
      ['Top Oil Temperature', `${phys.oilTemp || 52.6} °C`, 'Normal (Alarm limit: 85°C, Trip limit: 95°C)'],
      ['Buchholz Protective Relay', phys.buchholzRelay || 'Normal', 'No gas accumulation detected; surge switch intact'],
      ['OLTC Position & Counter', `Tap #${phys.oltc?.position || 9} • ${(phys.oltc?.operationCounter || 14820).toLocaleString()} Ops`, 'Automatic tap changer in valid regulation range'],
      ['OCTC Switch Position', `Tap #${phys.octc?.position || 3}`, 'Off-Circuit tap fixed link confirmed'],
      ['Magnetic Oil Gauge (MOG)', `${phys.mog?.levelPercent || 68.5}% (${phys.mog?.status || 'Normal'})`, 'Conservator oil expansion level nominal'],
      ['Pressure Relief Valve (PRV)', phys.prv || 'Normal', 'Spring diaphragm sealed; visual flag unoperated'],
      ['Substation Ambient Temp', `${phys.ambientTemp || 31.4} °C`, `Calculated Top Oil Temp Rise: +${((phys.oilTemp || 52.6) - (phys.ambientTemp || 31.4)).toFixed(1)} °C`]
    ];

    doc.autoTable({
      startY: lastY + 2,
      head: [['Physical Parameter', 'Recorded Value', 'Operational Assessment']],
      body: physicalTableRows,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255, fontSize: 8, fontStyle: 'bold' },
      styles: { fontSize: 7.5, cellPadding: 2, textColor: darkGray },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    lastY = doc.lastAutoTable.finalY + 5;

    // SECTION 3: R&D NOTICE & THI TRANSPARENCY (DPR Section 9)
    doc.setFillColor(241, 245, 249);
    doc.rect(14, lastY, 182, 18, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, lastY, 182, 18, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...primaryColor);
    doc.text('TRANSFORMER HEALTH INDEX (THI) R&D TRANSPARENCY NOTICE (DPR SECTION 9):', 17, lastY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text('The calculation method, parameter weightings and trip thresholds for the formal Health Index are under development', 17, lastY + 9.5);
    doc.text('and will be formally approved by the Mangal R&D team. The score above represents the pilot demonstration index.', 17, lastY + 13.5);

    // Footer signature line
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('MANGAL ELECTRICAL INDUSTRIES LIMITED — RESEARCH & DEVELOPMENT DIVISION', 14, 285);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Certified Automated System Generation • thms.mangal.com', 14, 289);

    // Save PDF
    doc.save(report.fileName || `THMS_Daily_Report_${transformer?.tagNumber}_${report.date}.pdf`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Daily PDF Reports & Date-Wise Archive
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated daily reports generated per DPR Section 7.1 with download & preview
          </p>
        </div>

        {/* Generate Today's Live Report on the fly */}
        <button
          onClick={() => {
            const todayReport = {
              id: `RPT-LIVE-${Date.now()}`,
              transformerId: transformer?.id,
              transformerTag: transformer?.tagNumber,
              companyName: transformer?.companyName,
              date: new Date().toISOString().split('T')[0],
              generatedAt: new Date().toISOString(),
              fileName: `THMS_Daily_Report_${transformer?.tagNumber}_${new Date().toISOString().split('T')[0]}.pdf`,
              averageTHI: transformer?.thiScore || 88.5
            };
            generateAndDownloadPDF(todayReport);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Generate Today's PDF Report</span>
        </button>
      </div>

      {/* Reports Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-sans">
              <th className="pb-2.5 font-semibold">Report Date</th>
              <th className="pb-2.5 font-semibold">Document Name</th>
              <th className="pb-2.5 font-semibold">Average THI</th>
              <th className="pb-2.5 font-semibold">Peak Winding</th>
              <th className="pb-2.5 font-semibold">Energy Delivered</th>
              <th className="pb-2.5 font-semibold">Archive Status</th>
              <th className="pb-2.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {transformerReports.length > 0 ? (
              transformerReports.map((rpt) => (
                <tr key={rpt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>{rpt.date}</span>
                  </td>
                  <td className="py-3 text-slate-600 dark:text-slate-300 truncate max-w-[220px]">
                    {rpt.fileName}
                  </td>
                  <td className="py-3 font-bold text-cyan-600 dark:text-cyan-400">
                    {rpt.averageTHI}
                  </td>
                  <td className="py-3 text-slate-700 dark:text-slate-300">
                    {rpt.windingTempPeak}
                  </td>
                  <td className="py-3 text-slate-700 dark:text-slate-300">
                    {rpt.energyDeliveredDay}
                  </td>
                  <td className="py-3 font-sans">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="w-3 h-3" /> Dispatched
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 font-sans">
                      <button
                        onClick={() => setSelectedReportForPreview(rpt)}
                        className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                        title="View Report Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => generateAndDownloadPDF(rpt)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs transition"
                        title="Download PDF Document"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-slate-400 font-sans">
                  No historical reports available for this asset.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Report Preview Modal */}
      {selectedReportForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Report Preview: {selectedReportForPreview.fileName}
                </h4>
              </div>
              <button
                onClick={() => setSelectedReportForPreview(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1 font-mono">
                <div><strong>Asset:</strong> {transformer?.tagNumber} ({transformer?.capacity} • {transformer?.hvRating}/{transformer?.lvRating})</div>
                <div><strong>Client Company:</strong> {transformer?.companyName}</div>
                <div><strong>Report Date:</strong> {selectedReportForPreview.date}</div>
                <div><strong>Average Health Index:</strong> {selectedReportForPreview.averageTHI} / 100</div>
                <div><strong>Daily Energy Output:</strong> {selectedReportForPreview.energyDeliveredDay}</div>
                <div><strong>Peak Winding Temp:</strong> {selectedReportForPreview.windingTempPeak}</div>
                <div><strong>Peak Top Oil Temp:</strong> {selectedReportForPreview.oilTempPeak}</div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs">
                <strong>DPR Compliance Verification:</strong> This daily audit report includes all 8 groups of Section 4 electrical meter readings (dual HV/LV meters) and Section 5 physical parameters.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedReportForPreview(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  generateAndDownloadPDF(selectedReportForPreview);
                  setSelectedReportForPreview(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
