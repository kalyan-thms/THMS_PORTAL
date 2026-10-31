// Transformer Health Monitoring System (THMS) - Data Layer
// Mangal Electrical Industries Limited - R&D Department
// Compliant with DPR Specifications (Sections 1-10)

export const INITIAL_COMPANIES = [
  {
    id: "COMP-001",
    name: "Adani Power Rajasthan Limited",
    shortName: "Adani Power",
    code: "APRL",
    contactPerson: "Rajesh Sharma (Head of Substation)",
    email: "substation.ops@adanipower.com",
    phone: "+91 98290 12345",
    address: "Kawai Thermal Power Plant, Baran, Rajasthan - 325219",
    active: true,
    transformerCount: 2
  },
  {
    id: "COMP-002",
    name: "Tata Power Distribution Limited",
    shortName: "Tata Power",
    code: "TPDDL",
    contactPerson: "Dr. Vikram Sethi (Chief Maintenance Engineer)",
    email: "vikram.sethi@tatapower.com",
    phone: "+91 94140 56789",
    address: "Grid Substation No. 7, RIICO Industrial Area, Jaipur - 302013",
    active: true,
    transformerCount: 1
  },
  {
    id: "COMP-003",
    name: "NTPC Anta Gas Power Station",
    shortName: "NTPC Anta",
    code: "NTPC",
    contactPerson: "Alok Mukherjee (DGM Electrical)",
    email: "alok.mukherjee@ntpc.co.in",
    phone: "+91 98765 43210",
    address: "NH-27, Anta, Baran District, Rajasthan - 325202",
    active: true,
    transformerCount: 1
  }
];

export const INITIAL_TRANSFORMERS = [
  {
    id: "TR-50MVA-01",
    tagNumber: "MEIL/2023/T-1049",
    serialNumber: "SN-MEIL-2023-8841",
    companyId: "COMP-001",
    companyName: "Adani Power Rajasthan Limited",
    capacity: "50 MVA",
    hvRating: "132 kV",
    lvRating: "33 kV",
    coolingType: "ONAN / ONAF",
    vectorGroup: "YNd11",
    yearOfMfg: 2023,
    ageYears: 3,
    location: "Kawai 132kV Switchyard Bay-03",
    status: "Normal", // Normal, Warning, Critical, Offline
    isOutdated: false, // Per DPR 7.3: Reading freshness indicator
    lastUpdated: new Date().toISOString(),
    thiScore: 88.4, // Pilot Placeholder
    thiStatus: "Good",
    active: true,
    assignedUsers: ["user-adani-01"],
    notes: "Commissioned under Mangal R&D Telemetry Pilot Project"
  },
  {
    id: "TR-25MVA-02",
    tagNumber: "MEIL/2021/T-0782",
    serialNumber: "SN-MEIL-2021-6204",
    companyId: "COMP-001",
    companyName: "Adani Power Rajasthan Limited",
    capacity: "25 MVA",
    hvRating: "132 kV",
    lvRating: "33 kV",
    coolingType: "ONAN",
    vectorGroup: "YNd11",
    yearOfMfg: 2021,
    ageYears: 5,
    location: "Kawai Auxiliary Substation Bay-01",
    status: "Warning",
    isOutdated: false,
    lastUpdated: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    thiScore: 71.2,
    thiStatus: "Fair",
    active: true,
    assignedUsers: ["user-adani-01"],
    notes: "Primary winding temperature alert active"
  },
  {
    id: "TR-66MVA-03",
    tagNumber: "MEIL/2024/T-1210",
    serialNumber: "SN-MEIL-2024-9912",
    companyId: "COMP-002",
    companyName: "Tata Power Distribution Limited",
    capacity: "66 MVA",
    hvRating: "220 kV",
    lvRating: "66 kV",
    coolingType: "ONAF / OFAF",
    vectorGroup: "YNd1",
    yearOfMfg: 2024,
    ageYears: 2,
    location: "Jaipur Grid Substation No. 7, Bay-02",
    status: "Normal",
    isOutdated: false,
    lastUpdated: new Date().toISOString(),
    thiScore: 94.8,
    thiStatus: "Optimal",
    active: true,
    assignedUsers: ["user-tata-01"],
    notes: "Recently routine-serviced"
  },
  {
    id: "TR-16MVA-04",
    tagNumber: "MEIL/2019/T-0431",
    serialNumber: "SN-MEIL-2019-3120",
    companyId: "COMP-003",
    companyName: "NTPC Anta Gas Power Station",
    capacity: "16 MVA",
    hvRating: "33 kV",
    lvRating: "11 kV",
    coolingType: "ONAN",
    vectorGroup: "Dyn11",
    yearOfMfg: 2019,
    ageYears: 7,
    location: "Unit-1 Auxiliary Bay",
    status: "Normal",
    isOutdated: true, // Demonstrating DPR 7.3: Outdated reading marked clearly
    lastUpdated: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    thiScore: 82.0,
    thiStatus: "Good",
    active: true,
    assignedUsers: ["user-ntpc-01"],
    notes: "Telemetry gateway link delay observed"
  }
];

// ELECTRICAL PARAMETERS (DPR Section 4)
// Group 1: Voltage
// Group 2: Current
// Group 3: Power
// Group 4: Power Factor
// Group 5: Frequency
// Group 6: Energy
// Group 7: Unbalance
// Group 8: Harmonic Distortion
export const INITIAL_ELECTRICAL_DATA = {
  "TR-50MVA-01": {
    hv: {
      voltage: {
        vAB: 132.4, // kV
        vBC: 132.1,
        vCA: 132.6,
        vAvg: 132.37,
        unit: "kV"
      },
      current: {
        iA: 184.2, // A
        iB: 181.9,
        iC: 183.6,
        iAvg: 183.23,
        unit: "A"
      },
      power: {
        active: 38450, // kW
        reactive: 12210, // kVAR
        apparent: 40340, // kVA
      },
      powerFactor: {
        total: 0.953,
        type: "Lagging"
      },
      frequency: {
        value: 50.02,
        unit: "Hz"
      },
      energy: {
        activeDelivered: 4218900, // kWh
        activeReceived: 12450 // kWh
      },
      unbalance: {
        voltageUnbalance: 0.32, // %
        currentUnbalance: 1.15 // %
      },
      harmonics: {
        voltageTHD: 1.42, // %
        currentTHD: 2.18 // %
      }
    },
    lv: {
      voltage: {
        vAB: 33.12, // kV
        vBC: 33.08,
        vCA: 33.16,
        vAvg: 33.12,
        unit: "kV"
      },
      current: {
        iA: 732.4, // A
        iB: 724.8,
        iC: 729.1,
        iAvg: 728.77,
        unit: "A"
      },
      power: {
        active: 38120, // kW
        reactive: 12100, // kVAR
        apparent: 39990, // kVA
      },
      powerFactor: {
        total: 0.953,
        type: "Lagging"
      },
      frequency: {
        value: 50.02,
        unit: "Hz"
      },
      energy: {
        activeDelivered: 4182400, // kWh
        activeReceived: 9800 // kWh
      },
      unbalance: {
        voltageUnbalance: 0.28, // %
        currentUnbalance: 0.94 // %
      },
      harmonics: {
        voltageTHD: 1.65, // %
        currentTHD: 2.74 // %
      }
    }
  },
  "TR-25MVA-02": {
    hv: {
      voltage: { vAB: 131.8, vBC: 131.5, vCA: 131.9, vAvg: 131.73, unit: "kV" },
      current: { iA: 98.4, iB: 104.2, iC: 100.8, iAvg: 101.13, unit: "A" },
      power: { active: 21100, reactive: 7200, apparent: 22295 },
      powerFactor: { total: 0.946, type: "Lagging" },
      frequency: { value: 49.98, unit: "Hz" },
      energy: { activeDelivered: 2984500, activeReceived: 5400 },
      unbalance: { voltageUnbalance: 0.41, currentUnbalance: 2.85 },
      harmonics: { voltageTHD: 1.85, currentTHD: 3.42 }
    },
    lv: {
      voltage: { vAB: 32.95, vBC: 32.90, vCA: 33.02, vAvg: 32.96, unit: "kV" },
      current: { iA: 391.2, iB: 412.5, iC: 399.8, iAvg: 401.17, unit: "A" },
      power: { active: 20850, reactive: 7120, apparent: 22030 },
      powerFactor: { total: 0.946, type: "Lagging" },
      frequency: { value: 49.98, unit: "Hz" },
      energy: { activeDelivered: 2951200, activeReceived: 4100 },
      unbalance: { voltageUnbalance: 0.35, currentUnbalance: 2.71 },
      harmonics: { voltageTHD: 2.10, currentTHD: 3.90 }
    }
  },
  "TR-66MVA-03": {
    hv: {
      voltage: { vAB: 220.5, vBC: 220.2, vCA: 220.8, vAvg: 220.50, unit: "kV" },
      current: { iA: 142.1, iB: 141.8, iC: 142.4, iAvg: 142.10, unit: "A" },
      power: { active: 51200, reactive: 14300, apparent: 53160 },
      powerFactor: { total: 0.963, type: "Lagging" },
      frequency: { value: 50.01, unit: "Hz" },
      energy: { activeDelivered: 1428000, activeReceived: 2100 },
      unbalance: { voltageUnbalance: 0.18, currentUnbalance: 0.42 },
      harmonics: { voltageTHD: 1.12, currentTHD: 1.75 }
    },
    lv: {
      voltage: { vAB: 66.15, vBC: 66.10, vCA: 66.22, vAvg: 66.16, unit: "kV" },
      current: { iA: 472.0, iB: 470.5, iC: 473.1, iAvg: 471.87, unit: "A" },
      power: { active: 50820, reactive: 14180, apparent: 52760 },
      powerFactor: { total: 0.963, type: "Lagging" },
      frequency: { value: 50.01, unit: "Hz" },
      energy: { activeDelivered: 1415000, activeReceived: 1800 },
      unbalance: { voltageUnbalance: 0.15, currentUnbalance: 0.38 },
      harmonics: { voltageTHD: 1.30, currentTHD: 1.95 }
    }
  },
  "TR-16MVA-04": {
    hv: {
      voltage: { vAB: 33.05, vBC: 33.01, vCA: 33.10, vAvg: 33.05, unit: "kV" },
      current: { iA: 210.5, iB: 209.8, iC: 211.2, iAvg: 210.50, unit: "A" },
      power: { active: 11400, reactive: 3600, apparent: 11950 },
      powerFactor: { total: 0.954, type: "Lagging" },
      frequency: { value: 50.00, unit: "Hz" },
      energy: { activeDelivered: 8940000, activeReceived: 15400 },
      unbalance: { voltageUnbalance: 0.22, currentUnbalance: 0.65 },
      harmonics: { voltageTHD: 1.55, currentTHD: 2.30 }
    },
    lv: {
      voltage: { vAB: 11.02, vBC: 10.99, vCA: 11.04, vAvg: 11.02, unit: "kV" },
      current: { iA: 628.0, iB: 626.2, iC: 630.1, iAvg: 628.10, unit: "A" },
      power: { active: 11250, reactive: 3550, apparent: 11790 },
      powerFactor: { total: 0.954, type: "Lagging" },
      frequency: { value: 50.00, unit: "Hz" },
      energy: { activeDelivered: 8820000, activeReceived: 12200 },
      unbalance: { voltageUnbalance: 0.20, currentUnbalance: 0.58 },
      harmonics: { voltageTHD: 1.70, currentTHD: 2.65 }
    }
  }
};

// PHYSICAL PARAMETERS (DPR Section 5)
// 1. Primary Winding Temperature
// 2. Secondary Winding Temperature
// 3. Oil Temperature
// 4. Buchholz Relay Status
// 5. OLTC Position and Operation Counter
// 6. OCTC Position
// 7. MOG Status / Oil Level
// 8. PRV Status
// 9. Ambient Temperature
// 10. Transformer Details (HV/LV ratings, capacity, age, location, active/inactive)
// 11. Transformer Health Index
export const INITIAL_PHYSICAL_DATA = {
  "TR-50MVA-01": {
    primaryWindingTemp: 64.2, // °C (Limit: 95°C Alarm, 105°C Trip)
    secondaryWindingTemp: 67.8, // °C
    oilTemp: 52.6, // °C (Limit: 85°C Alarm, 95°C Trip)
    buchholzRelay: "Normal", // Normal, Gas Accumulation, Alarm, Trip
    oltc: {
      position: 9, // Tap number (-8 to +8 or 1 to 17)
      operationCounter: 14820,
      inTransit: false
    },
    octc: {
      position: 3 // Tap position
    },
    mog: {
      levelPercent: 68.5,
      status: "Normal" // Normal, Low Oil Level, High Oil Level
    },
    prv: "Normal", // Normal, Operated
    ambientTemp: 31.4, // °C
    lastReadingTime: "2026-10-31T12:45:00Z"
  },
  "TR-25MVA-02": {
    primaryWindingTemp: 88.4, // °C - Alert range (Alarm is 85°C)
    secondaryWindingTemp: 82.1,
    oilTemp: 71.0,
    buchholzRelay: "Normal",
    oltc: {
      position: 7,
      operationCounter: 26410,
      inTransit: false
    },
    octc: {
      position: 2
    },
    mog: {
      levelPercent: 54.0,
      status: "Normal"
    },
    prv: "Normal",
    ambientTemp: 33.8,
    lastReadingTime: "2026-10-31T12:41:00Z"
  },
  "TR-66MVA-03": {
    primaryWindingTemp: 58.2,
    secondaryWindingTemp: 61.5,
    oilTemp: 47.9,
    buchholzRelay: "Normal",
    oltc: {
      position: 11,
      operationCounter: 6310,
      inTransit: false
    },
    octc: {
      position: 3
    },
    mog: {
      levelPercent: 72.0,
      status: "Normal"
    },
    prv: "Normal",
    ambientTemp: 29.5,
    lastReadingTime: "2026-10-31T12:47:00Z"
  },
  "TR-16MVA-04": {
    primaryWindingTemp: 60.1,
    secondaryWindingTemp: 62.4,
    oilTemp: 49.3,
    buchholzRelay: "Normal",
    oltc: {
      position: 5,
      operationCounter: 38920,
      inTransit: false
    },
    octc: {
      position: 3
    },
    mog: {
      levelPercent: 63.2,
      status: "Normal"
    },
    prv: "Normal",
    ambientTemp: 30.2,
    lastReadingTime: "2026-10-31T12:05:00Z"
  }
};

// FAULTS AND ALARMS
export const INITIAL_ALARMS = [
  {
    id: "ALM-2026-0091",
    transformerId: "TR-25MVA-02",
    transformerTag: "MEIL/2021/T-0782",
    companyName: "Adani Power Rajasthan Limited",
    timestamp: "2026-10-31T11:22:15Z",
    severity: "Warning", // Warning, Critical, Info
    parameter: "Primary Winding Temperature",
    currentValue: "88.4 °C",
    threshold: "> 85.0 °C (Warning)",
    status: "Active",
    acknowledged: false,
    message: "Primary winding temperature exceeded warning setpoint."
  },
  {
    id: "ALM-2026-0084",
    transformerId: "TR-16MVA-04",
    transformerTag: "MEIL/2019/T-0431",
    companyName: "NTPC Anta Gas Power Station",
    timestamp: "2026-10-31T12:07:00Z",
    severity: "Info",
    parameter: "Telemetry Communications",
    currentValue: "Outdated (42m ago)",
    threshold: "> 15 min latency",
    status: "Active",
    acknowledged: true,
    message: "Telemetry reading interval delayed. System marked readings as Outdated (DPR 7.3: Not a transformer fault)."
  },
  {
    id: "ALM-2026-0062",
    transformerId: "TR-50MVA-01",
    transformerTag: "MEIL/2023/T-1049",
    companyName: "Adani Power Rajasthan Limited",
    timestamp: "2026-10-28T09:14:40Z",
    severity: "Warning",
    parameter: "Current Unbalance",
    currentValue: "2.8 %",
    threshold: "> 2.5 %",
    status: "Resolved",
    acknowledged: true,
    resolvedAt: "2026-10-28T10:45:00Z",
    message: "Temporary load imbalance cleared on feeder 3."
  },
  {
    id: "ALM-2026-0041",
    transformerId: "TR-66MVA-03",
    transformerTag: "MEIL/2024/T-1210",
    companyName: "Tata Power Distribution Limited",
    timestamp: "2026-10-15T14:30:10Z",
    severity: "Info",
    parameter: "OLTC Operation Counter",
    currentValue: "6,000 Ops",
    threshold: "Inspection milestone",
    status: "Resolved",
    acknowledged: true,
    resolvedAt: "2026-10-15T16:00:00Z",
    message: "6,000 tap changer operations milestone reached."
  }
];

// USERS & ROLES (DPR Section 2)
// Only two user categories: End User & Administrator
export const INITIAL_USERS = [
  {
    id: "user-admin-01",
    name: "Dr. K. S. Rathore",
    email: "admin@mangal.com",
    role: "Administrator", // Mangal R&D Team
    department: "Research & Development",
    designation: "Chief Software Architect & R&D Lead",
    company: "Mangal Electrical Industries Limited",
    permittedTransformers: ["ALL"],
    status: "Active",
    createdAt: "2026-01-10"
  },
  {
    id: "user-adani-01",
    name: "Rajesh Sharma",
    email: "client@adani.com",
    role: "End User", // Client company staff
    department: "Substation Operations",
    designation: "Executive Engineer",
    company: "Adani Power Rajasthan Limited",
    companyId: "COMP-001",
    permittedTransformers: ["TR-50MVA-01", "TR-25MVA-02"],
    status: "Active",
    createdAt: "2026-03-15"
  },
  {
    id: "user-tata-01",
    name: "Dr. Vikram Sethi",
    email: "engineer@tatapower.com",
    role: "End User",
    department: "Electrical Maintenance",
    designation: "Chief Maintenance Engineer",
    company: "Tata Power Distribution Limited",
    companyId: "COMP-002",
    permittedTransformers: ["TR-66MVA-03"],
    status: "Active",
    createdAt: "2026-04-20"
  },
  {
    id: "user-ntpc-01",
    name: "Alok Mukherjee",
    email: "alok@ntpc.co.in",
    role: "End User",
    department: "Substation Protection",
    designation: "DGM Electrical",
    company: "NTPC Anta Gas Power Station",
    companyId: "COMP-003",
    permittedTransformers: ["TR-16MVA-04"],
    status: "Active",
    createdAt: "2026-05-12"
  }
];

// EMAIL RECIPIENTS MANAGEMENT (DPR Section 6 & 7)
export const INITIAL_EMAIL_RECIPIENTS = [
  {
    id: "RCPT-001",
    name: "Adani Central Substation Control",
    email: "substation.ctrl@adanipower.com",
    companyId: "COMP-001",
    transformerId: "TR-50MVA-01",
    dailyReport: true,
    faultAlerts: true,
    active: true
  },
  {
    id: "RCPT-002",
    name: "Adani Resident Maintenance Engineer",
    email: "maint.kawai@adanipower.com",
    companyId: "COMP-001",
    transformerId: "TR-25MVA-02",
    dailyReport: true,
    faultAlerts: true,
    active: true
  },
  {
    id: "RCPT-003",
    name: "Tata Power Grid Ops Desk",
    email: "gridops@tatapower.com",
    companyId: "COMP-002",
    transformerId: "TR-66MVA-03",
    dailyReport: true,
    faultAlerts: true,
    active: true
  },
  {
    id: "RCPT-004",
    name: "Mangal R&D Fleet Telemetry Watch",
    email: "rd.monitoring@mangal.com",
    companyId: "ALL",
    transformerId: "ALL",
    dailyReport: true,
    faultAlerts: true,
    active: true
  }
];

// HISTORICAL REPORTS ARCHIVE (DPR Section 7.1 & 8)
export const INITIAL_REPORTS = [
  {
    id: "RPT-2026-10-31-01",
    transformerId: "TR-50MVA-01",
    transformerTag: "MEIL/2023/T-1049",
    companyName: "Adani Power Rajasthan Limited",
    date: "2026-10-31",
    generatedAt: "2026-10-31T06:00:00Z",
    type: "Daily Comprehensive Health & Energy Report",
    fileName: "THMS_Daily_Report_TR-50MVA-01_2026-10-31.pdf",
    fileSize: "2.4 MB",
    status: "Generated & Dispatched",
    averageTHI: 88.6,
    peakLoadPercent: 76.9,
    energyDeliveredDay: "922,800 kWh",
    oilTempPeak: "54.1 °C",
    windingTempPeak: "69.2 °C",
    alarmCount: 0
  },
  {
    id: "RPT-2026-10-30-01",
    transformerId: "TR-50MVA-01",
    transformerTag: "MEIL/2023/T-1049",
    companyName: "Adani Power Rajasthan Limited",
    date: "2026-10-30",
    generatedAt: "2026-10-30T06:00:00Z",
    type: "Daily Comprehensive Health & Energy Report",
    fileName: "THMS_Daily_Report_TR-50MVA-01_2026-10-30.pdf",
    fileSize: "2.3 MB",
    status: "Generated & Dispatched",
    averageTHI: 89.1,
    peakLoadPercent: 78.4,
    energyDeliveredDay: "941,200 kWh",
    oilTempPeak: "55.0 °C",
    windingTempPeak: "71.4 °C",
    alarmCount: 0
  },
  {
    id: "RPT-2026-10-29-01",
    transformerId: "TR-50MVA-01",
    transformerTag: "MEIL/2023/T-1049",
    companyName: "Adani Power Rajasthan Limited",
    date: "2026-10-29",
    generatedAt: "2026-10-29T06:00:00Z",
    type: "Daily Comprehensive Health & Energy Report",
    fileName: "THMS_Daily_Report_TR-50MVA-01_2026-10-29.pdf",
    fileSize: "2.4 MB",
    status: "Generated & Dispatched",
    averageTHI: 88.9,
    peakLoadPercent: 75.2,
    energyDeliveredDay: "904,000 kWh",
    oilTempPeak: "53.6 °C",
    windingTempPeak: "68.8 °C",
    alarmCount: 0
  },
  {
    id: "RPT-2026-10-31-02",
    transformerId: "TR-25MVA-02",
    transformerTag: "MEIL/2021/T-0782",
    companyName: "Adani Power Rajasthan Limited",
    date: "2026-10-31",
    generatedAt: "2026-10-31T06:00:00Z",
    type: "Daily Comprehensive Health & Energy Report",
    fileName: "THMS_Daily_Report_TR-25MVA-02_2026-10-31.pdf",
    fileSize: "2.1 MB",
    status: "Generated & Dispatched",
    averageTHI: 72.5,
    peakLoadPercent: 88.2,
    energyDeliveredDay: "506,400 kWh",
    oilTempPeak: "72.4 °C",
    windingTempPeak: "89.8 °C",
    alarmCount: 1
  },
  {
    id: "RPT-2026-10-31-03",
    transformerId: "TR-66MVA-03",
    transformerTag: "MEIL/2024/T-1210",
    companyName: "Tata Power Distribution Limited",
    date: "2026-10-31",
    generatedAt: "2026-10-31T06:00:00Z",
    type: "Daily Comprehensive Health & Energy Report",
    fileName: "THMS_Daily_Report_TR-66MVA-03_2026-10-31.pdf",
    fileSize: "2.5 MB",
    status: "Generated & Dispatched",
    averageTHI: 95.0,
    peakLoadPercent: 80.5,
    energyDeliveredDay: "1,270,000 kWh",
    oilTempPeak: "49.0 °C",
    windingTempPeak: "62.8 °C",
    alarmCount: 0
  }
];

// HISTORICAL TELEMETRY GENERATOR (DPR Section 8)
// Generates realistic 24-point time series for a given transformer and time window
export function generateHistoricalSeries(transformerId, points = 24) {
  const result = [];
  const now = Date.now();
  const stepMs = (24 * 60 * 60 * 1000) / points;

  const baseWinding = transformerId === "TR-25MVA-02" ? 84 : 63;
  const baseOil = transformerId === "TR-25MVA-02" ? 68 : 51;
  const baseVoltHV = transformerId === "TR-66MVA-03" ? 220 : (transformerId === "TR-16MVA-04" ? 33 : 132);
  const baseCurrHV = transformerId === "TR-50MVA-01" ? 180 : (transformerId === "TR-25MVA-02" ? 100 : (transformerId === "TR-66MVA-03" ? 140 : 210));
  const baseActive = transformerId === "TR-50MVA-01" ? 38000 : (transformerId === "TR-25MVA-02" ? 21000 : (transformerId === "TR-66MVA-03" ? 51000 : 11200));

  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * stepMs);
    const hour = timestamp.getHours();
    // Diurnal temperature and load curve
    const loadFactor = 0.82 + 0.18 * Math.sin(((hour - 8) / 24) * 2 * Math.PI);
    const ambient = 26 + 8 * Math.sin(((hour - 10) / 24) * 2 * Math.PI);

    const timeLabel = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const dateLabel = timestamp.toISOString().split("T")[0];

    result.push({
      timestamp: timestamp.toISOString(),
      timeLabel,
      dateLabel,
      ambientTemp: parseFloat(ambient.toFixed(1)),
      primaryWindingTemp: parseFloat((baseWinding * loadFactor + (Math.random() * 2 - 1)).toFixed(1)),
      secondaryWindingTemp: parseFloat(((baseWinding + 3) * loadFactor + (Math.random() * 2 - 1)).toFixed(1)),
      oilTemp: parseFloat((baseOil * loadFactor + (Math.random() * 1.5 - 0.75)).toFixed(1)),
      vAvgHV: parseFloat((baseVoltHV * (1 + (Math.random() * 0.01 - 0.005))).toFixed(2)),
      iAvgHV: parseFloat((baseCurrHV * loadFactor + (Math.random() * 4 - 2)).toFixed(1)),
      activePower: parseFloat((baseActive * loadFactor + (Math.random() * 400 - 200)).toFixed(0)),
      powerFactor: parseFloat((0.95 + (Math.random() * 0.02 - 0.01)).toFixed(3)),
      voltageTHD: parseFloat((1.3 + Math.random() * 0.4).toFixed(2)),
      currentTHD: parseFloat((2.0 + Math.random() * 0.6).toFixed(2)),
      voltageUnbalance: parseFloat((0.25 + Math.random() * 0.15).toFixed(2)),
      currentUnbalance: parseFloat((0.85 + Math.random() * 0.4).toFixed(2)),
      thi: parseFloat((transformerId === "TR-25MVA-02" ? 71.5 : (transformerId === "TR-66MVA-03" ? 94.6 : 88.5) + (Math.random() * 0.8 - 0.4)).toFixed(1))
    });
  }

  return result;
}
