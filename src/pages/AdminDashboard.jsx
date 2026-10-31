import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Zap,
  Users,
  AlertTriangle,
  Mail,
  FileText,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  Shield,
  Send,
  Eye,
  Download,
  X,
  Filter,
  Check,
  Radio
} from 'lucide-react';
import ReportsArchive from '../components/dashboard/ReportsArchive';

export default function AdminDashboard() {
  const {
    companies,
    transformers,
    users,
    alarms,
    emailRecipients,
    reports,
    demoNotifications,
    addCompany,
    updateCompany,
    addTransformer,
    updateTransformer,
    addUser,
    updateUser,
    assignTransformerToUser,
    removeTransformerFromUser,
    acknowledgeAlarm,
    addEmailRecipient,
    updateEmailRecipient,
    deleteEmailRecipient,
    triggerSimulatedEmailNotification,
    setSelectedTransformerId
  } = useAuth();

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet' | 'companies' | 'transformers' | 'users' | 'alarms' | 'email' | 'reports'

  // Modals state
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const [showTransformerModal, setShowTransformerModal] = useState(false);
  const [editingTransformer, setEditingTransformer] = useState(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [showRecipientModal, setShowRecipientModal] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [notificationToast, setNotificationToast] = useState(null);

  // Form states
  const [companyForm, setCompanyForm] = useState({ name: '', code: '', contactPerson: '', email: '', phone: '', address: '' });
  const [trForm, setTrForm] = useState({
    companyId: '',
    tagNumber: '',
    serialNumber: '',
    capacity: '25 MVA',
    hvRating: '132 kV',
    lvRating: '33 kV',
    coolingType: 'ONAN',
    vectorGroup: 'YNd11',
    yearOfMfg: 2024,
    location: ''
  });
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'End User',
    department: '',
    designation: '',
    company: '',
    permittedTransformers: []
  });
  const [recipientForm, setRecipientForm] = useState({
    name: '',
    email: '',
    companyId: 'ALL',
    transformerId: 'ALL',
    dailyReport: true,
    faultAlerts: true
  });

  // Calculate fleet stats
  const totalTransformers = transformers.length;
  const normalCount = transformers.filter(t => t.status === 'Normal' && !t.isOutdated).length;
  const warningCount = transformers.filter(t => t.status === 'Warning').length;
  const criticalCount = transformers.filter(t => t.status === 'Critical').length;
  const outdatedCount = transformers.filter(t => t.isOutdated).length;
  const activeAlarmsCount = alarms.filter(a => a.status === 'Active').length;

  // Handlers for Company
  const handleOpenCompanyModal = (comp = null) => {
    if (comp) {
      setEditingCompany(comp);
      setCompanyForm(comp);
    } else {
      setEditingCompany(null);
      setCompanyForm({ name: '', code: '', contactPerson: '', email: '', phone: '', address: '' });
    }
    setShowCompanyModal(true);
  };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    if (editingCompany) {
      updateCompany(editingCompany.id, companyForm);
    } else {
      addCompany(companyForm);
    }
    setShowCompanyModal(false);
  };

  // Handlers for Transformer
  const handleOpenTransformerModal = (tr = null) => {
    if (tr) {
      setEditingTransformer(tr);
      setTrForm(tr);
    } else {
      setEditingTransformer(null);
      setTrForm({
        companyId: companies[0]?.id || '',
        tagNumber: `MEIL/2026/T-${Math.floor(1000 + Math.random() * 9000)}`,
        serialNumber: `SN-MEIL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        capacity: '50 MVA',
        hvRating: '132 kV',
        lvRating: '33 kV',
        coolingType: 'ONAF',
        vectorGroup: 'YNd11',
        yearOfMfg: 2026,
        location: 'Substation Bay'
      });
    }
    setShowTransformerModal(true);
  };

  const handleSaveTransformer = (e) => {
    e.preventDefault();
    const comp = companies.find(c => c.id === trForm.companyId);
    const dataToSave = { ...trForm, companyName: comp ? comp.name : '' };
    if (editingTransformer) {
      updateTransformer(editingTransformer.id, dataToSave);
    } else {
      addTransformer(dataToSave);
    }
    setShowTransformerModal(false);
  };

  // Handlers for User
  const handleOpenUserModal = (u = null) => {
    if (u) {
      setEditingUser(u);
      setUserForm({ ...u, permittedTransformers: u.permittedTransformers || [] });
    } else {
      setEditingUser(null);
      setUserForm({
        name: '',
        email: '',
        role: 'End User',
        department: 'Substation Maintenance',
        designation: 'Engineer',
        company: companies[0]?.name || '',
        permittedTransformers: []
      });
    }
    setShowUserModal(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, userForm);
    } else {
      addUser(userForm);
    }
    setShowUserModal(false);
  };

  // Handlers for Email Recipient
  const handleOpenRecipientModal = (r = null) => {
    if (r) {
      setEditingRecipient(r);
      setRecipientForm(r);
    } else {
      setEditingRecipient(null);
      setRecipientForm({
        name: '',
        email: '',
        companyId: 'ALL',
        transformerId: 'ALL',
        dailyReport: true,
        faultAlerts: true
      });
    }
    setShowRecipientModal(true);
  };

  const handleSaveRecipient = (e) => {
    e.preventDefault();
    if (editingRecipient) {
      updateEmailRecipient(editingRecipient.id, recipientForm);
    } else {
      addEmailRecipient(recipientForm);
    }
    setShowRecipientModal(false);
  };

  // Test Email Notification Trigger (Demo Behavior per DPR Section 8)
  const handleTriggerTestEmail = (alarm) => {
    const activeEmails = emailRecipients.filter(r => r.active && r.faultAlerts).map(r => r.email);
    const notif = triggerSimulatedEmailNotification(alarm, activeEmails);
    setNotificationToast(notif);
    setTimeout(() => setNotificationToast(null), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Admin Title & Role Identification */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Mangal R&D Administrator Command Center
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Fleet monitoring, client assets, user permissions & automated notifications (DPR Section 6 & 7)
          </p>
        </div>

        {/* Demo Notice Banner */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>Role: <strong>Administrator (Mangal R&D)</strong></span>
        </div>
      </div>

      {/* KPI Fleet Summary Counters (DPR Section 6) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-slate-500 block">Total Fleet</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {totalTransformers} <span className="text-xs font-normal text-slate-400">units</span>
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 block">Normal Ops</span>
          <span className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1 block">
            {normalCount}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-amber-500 block">Warning Alerts</span>
          <span className="text-xl font-bold font-mono text-amber-500 mt-1 block">
            {warningCount}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-rose-500 block">Critical Alarms</span>
          <span className="text-xl font-bold font-mono text-rose-500 mt-1 block">
            {criticalCount}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-cyan-600 dark:text-cyan-400 block">Client Companies</span>
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1 block">
            {companies.length}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[10px] font-mono uppercase text-purple-600 dark:text-purple-400 block">Outdated Links</span>
          <span className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400 mt-1 block">
            {outdatedCount}
          </span>
        </div>
      </div>

      {/* Simulated Email Toast Notification (Per DPR Section 8 Demo Behavior) */}
      {notificationToast && (
        <div className="p-4 rounded-xl bg-cyan-950 border border-cyan-500 text-cyan-200 shadow-xl flex items-start justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-2.5">
            <Mail className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <span>[DEMO EMAIL DISPATCHED]</span>
                <span className="text-[10px] font-mono bg-cyan-900 text-cyan-300 px-1.5 py-0.2 rounded">
                  Simulated Notification (DPR Section 8)
                </span>
              </div>
              <p className="mt-1 font-mono">{notificationToast.subject}</p>
              <p className="text-cyan-300/80 mt-0.5 text-[11px]">{notificationToast.body}</p>
              <div className="mt-1 text-[10px] text-cyan-400">
                Recipients: {notificationToast.recipients.join(', ')}
              </div>
            </div>
          </div>
          <button
            onClick={() => setNotificationToast(null)}
            className="text-cyan-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs (Strictly DPR Section 6 & 7 modules) */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto space-x-1 sm:space-x-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'fleet'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Fleet Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('companies')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'companies'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Client Companies ({companies.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('transformers')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'transformers'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Transformer Registry ({transformers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts & Permissions ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alarms')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'alarms'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Faults & Alarms History ({alarms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 whitespace-nowrap transition ${
            activeTab === 'email'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Email Notification Recipients ({emailRecipients.length})</span>
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
          <span>Fleet Reports Archive</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: FLEET OVERVIEW                                     */}
      {/* ========================================================= */}
      {activeTab === 'fleet' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Fleet Status & Transformer Registry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time operational status across all registered commercial client assets
              </p>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tag, company, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none w-56 sm:w-64"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-sans">
                  <th className="pb-2.5 font-semibold">Asset Tag</th>
                  <th className="pb-2.5 font-semibold">Client Company</th>
                  <th className="pb-2.5 font-semibold">Capacity / Ratings</th>
                  <th className="pb-2.5 font-semibold">Location</th>
                  <th className="pb-2.5 font-semibold">Health (THI)</th>
                  <th className="pb-2.5 font-semibold">Status / Telemetry Freshness</th>
                  <th className="pb-2.5 font-semibold text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {transformers
                  .filter(t => !searchQuery || t.tagNumber.toLowerCase().includes(searchQuery.toLowerCase()) || t.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || t.location.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((tr) => (
                    <tr key={tr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 font-bold text-slate-900 dark:text-white">
                        {tr.tagNumber}
                        <span className="block text-[10px] text-slate-400 font-normal">{tr.serialNumber}</span>
                      </td>
                      <td className="py-3 font-sans text-slate-700 dark:text-slate-300 font-medium truncate max-w-[180px]">
                        {tr.companyName}
                      </td>
                      <td className="py-3 text-slate-800 dark:text-slate-200">
                        {tr.capacity} • {tr.hvRating}/{tr.lvRating}
                      </td>
                      <td className="py-3 text-slate-500 truncate max-w-[150px]">
                        {tr.location}
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">
                          {tr.thiScore}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans ml-1">({tr.thiStatus})</span>
                      </td>
                      <td className="py-3 font-sans">
                        {tr.isOutdated ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                            <Clock className="w-3 h-3" /> Outdated Reading (Link Delay)
                          </span>
                        ) : tr.status === 'Normal' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                            <CheckCircle className="w-3 h-3" /> Normal
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                            <AlertTriangle className="w-3 h-3" /> {tr.status}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedTransformerId(tr.id);
                            // Also switch to End User view temporarily if desired or toast
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-sans font-medium transition"
                        >
                          Select Asset
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CLIENT COMPANIES MANAGEMENT (DPR Section 6)        */}
      {/* ========================================================= */}
      {activeTab === 'companies' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Registered Client Companies
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage commercial client company profiles and designated technical contacts
              </p>
            </div>

            <button
              onClick={() => handleOpenCompanyModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Register New Client Company</span>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((comp) => (
              <div
                key={comp.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-blue-600 dark:text-blue-400 font-bold">
                        {comp.code} • {comp.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {comp.name}
                      </h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold font-mono">
                      {comp.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div><strong>Contact:</strong> {comp.contactPerson}</div>
                    <div><strong>Email:</strong> {comp.email}</div>
                    <div><strong>Phone:</strong> {comp.phone}</div>
                    <div className="truncate"><strong>Address:</strong> {comp.address}</div>
                    <div><strong>Transformers Assigned:</strong> {transformers.filter(t => t.companyId === comp.id).length} units</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 flex justify-end gap-2 text-xs">
                  <button
                    onClick={() => handleOpenCompanyModal(comp)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition"
                  >
                    <Edit className="w-3 h-3" />
                    <span>Edit Company</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: TRANSFORMER REGISTRY MANAGEMENT (DPR Section 6)    */}
      {/* ========================================================= */}
      {activeTab === 'transformers' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Transformers Inventory & Specifications
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Register, configure, and maintain transformer fleet records
              </p>
            </div>

            <button
              onClick={() => handleOpenTransformerModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Transformer</span>
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-sans">
                  <th className="pb-2.5 font-semibold">Asset Tag</th>
                  <th className="pb-2.5 font-semibold">Client Company</th>
                  <th className="pb-2.5 font-semibold">Capacity</th>
                  <th className="pb-2.5 font-semibold">Voltage Ratio</th>
                  <th className="pb-2.5 font-semibold">Cooling / Vector</th>
                  <th className="pb-2.5 font-semibold">Age (Year)</th>
                  <th className="pb-2.5 font-semibold">Substation Location</th>
                  <th className="pb-2.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {transformers.map((tr) => (
                  <tr key={tr.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {tr.tagNumber}
                      <span className="block text-[10px] text-slate-400 font-normal">{tr.serialNumber}</span>
                    </td>
                    <td className="py-3 font-sans text-slate-700 dark:text-slate-300 font-medium">
                      {tr.companyName}
                    </td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">
                      {tr.capacity}
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-300">
                      {tr.hvRating} / {tr.lvRating}
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {tr.coolingType} • {tr.vectorGroup}
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-300">
                      {tr.ageYears} yrs ({tr.yearOfMfg})
                    </td>
                    <td className="py-3 text-slate-500 truncate max-w-[160px]">
                      {tr.location}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleOpenTransformerModal(tr)}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-sans transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: USER ACCOUNTS & ACCESS PERMISSIONS (DPR Section 6) */}
      {/* ========================================================= */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                User Accounts & Access Permissions
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Role-based access: strictly End User vs Administrator, with transformer assignment
              </p>
            </div>

            <button
              onClick={() => handleOpenUserModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create New User</span>
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-sans">
                  <th className="pb-2.5 font-semibold">User Details</th>
                  <th className="pb-2.5 font-semibold">Role Category</th>
                  <th className="pb-2.5 font-semibold">Organization / Dept</th>
                  <th className="pb-2.5 font-semibold">Assigned Transformers</th>
                  <th className="pb-2.5 font-semibold">Account Status</th>
                  <th className="pb-2.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 font-sans">
                      <span className="font-bold text-slate-900 dark:text-white block">{u.name}</span>
                      <span className="text-slate-500 text-xs font-mono">{u.email}</span>
                    </td>
                    <td className="py-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        u.role === 'Administrator'
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 font-sans text-slate-700 dark:text-slate-300">
                      <div>{u.company}</div>
                      <div className="text-[11px] text-slate-400">{u.department}</div>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-300">
                      {u.permittedTransformers.includes('ALL') ? (
                        <span className="text-blue-500 font-bold font-sans">All Fleet (Admin)</span>
                      ) : (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {u.permittedTransformers.map(tid => (
                            <span key={tid} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">
                              {tid}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-3 font-sans">
                      <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold text-[11px]">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    </td>
                    <td className="py-3 text-right font-sans">
                      <button
                        onClick={() => handleOpenUserModal(u)}
                        className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs transition"
                      >
                        Edit / Assign
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: FAULTS & ALARMS HISTORY (DPR Section 6 & 7.2)      */}
      {/* ========================================================= */}
      {activeTab === 'alarms' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Fleet-Wide Faults & Alarms Audit Log
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Active alerts, trip conditions, latency events, and automatic email dispatch triggers
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-sans">
                  <th className="pb-2.5 font-semibold">Alarm ID</th>
                  <th className="pb-2.5 font-semibold">Transformer Tag</th>
                  <th className="pb-2.5 font-semibold">Client Company</th>
                  <th className="pb-2.5 font-semibold">Timestamp</th>
                  <th className="pb-2.5 font-semibold">Severity</th>
                  <th className="pb-2.5 font-semibold">Parameter & Reading</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                  <th className="pb-2.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {alarms.map((alm) => (
                  <tr key={alm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{alm.id}</td>
                    <td className="py-3 text-cyan-600 dark:text-cyan-400 font-bold">{alm.transformerTag}</td>
                    <td className="py-3 font-sans text-slate-700 dark:text-slate-300">{alm.companyName}</td>
                    <td className="py-3 text-slate-500">
                      {new Date(alm.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3">
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
                    <td className="py-3 font-sans">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{alm.parameter}:</span>{' '}
                      <span className="font-mono font-bold">{alm.currentValue}</span>
                    </td>
                    <td className="py-3 font-sans">
                      <span className={alm.status === 'Active' ? 'text-amber-500 font-bold' : 'text-emerald-500'}>
                        {alm.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-1.5">
                        {!alm.acknowledged && (
                          <button
                            onClick={() => acknowledgeAlarm(alm.id)}
                            className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-[11px] transition"
                          >
                            Acknowledge
                          </button>
                        )}
                        <button
                          onClick={() => handleTriggerTestEmail(alm)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] transition"
                          title="Simulate dispatching automated email alert"
                        >
                          <Send className="w-3 h-3" />
                          <span>Dispatch Alert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 6: EMAIL RECIPIENTS MANAGEMENT (DPR Section 6 & 7)   */}
      {/* ========================================================= */}
      {activeTab === 'email' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Email Notification Recipients Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage destination maintenance teams for automatic daily PDF reports & real-time fault alerts (DPR Section 7)
              </p>
            </div>

            <button
              onClick={() => handleOpenRecipientModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Notification Recipient</span>
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="pb-2.5 font-semibold">Recipient Name & Email</th>
                  <th className="pb-2.5 font-semibold">Company Scope</th>
                  <th className="pb-2.5 font-semibold">Monitored Transformer</th>
                  <th className="pb-2.5 font-semibold">Daily PDF Reports</th>
                  <th className="pb-2.5 font-semibold">Fault Condition Alerts</th>
                  <th className="pb-2.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                {emailRecipients.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 font-sans">
                      <span className="font-bold text-slate-900 dark:text-white block">{rec.name}</span>
                      <span className="text-slate-500 text-xs font-mono">{rec.email}</span>
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-300 font-sans">
                      {rec.companyId === 'ALL' ? 'Fleet Wide (All Companies)' : rec.companyId}
                    </td>
                    <td className="py-3 text-slate-700 dark:text-slate-300">
                      {rec.transformerId === 'ALL' ? 'All Assigned Units' : rec.transformerId}
                    </td>
                    <td className="py-3">
                      {rec.dailyReport ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Enabled (06:00 AM)
                        </span>
                      ) : (
                        <span className="text-slate-400">Disabled</span>
                      )}
                    </td>
                    <td className="py-3">
                      {rec.faultAlerts ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <Check className="w-3.5 h-3.5" /> Enabled (Instant)
                        </span>
                      ) : (
                        <span className="text-slate-400">Disabled</span>
                      )}
                    </td>
                    <td className="py-3 text-right font-sans">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenRecipientModal(rec)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteEmailRecipient(rec.id)}
                          className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 7: FLEET REPORTS ARCHIVE (DPR Section 6 & 7.1)        */}
      {/* ========================================================= */}
      {activeTab === 'reports' && (
        <ReportsArchive
          reports={reports}
          transformer={transformers[0]}
          electricalData={transformers[0] ? {} : {}}
          physicalData={transformers[0] ? {} : {}}
        />
      )}

      {/* ========================================================= */}
      {/* MODAL: COMPANY FORM                                       */}
      {/* ========================================================= */}
      {showCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {editingCompany ? 'Edit Client Company' : 'Register New Client Company'}
              </h4>
              <button onClick={() => setShowCompanyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Full Name</label>
                <input
                  type="text"
                  required
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  placeholder="e.g. Adani Power Rajasthan Limited"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Short Code</label>
                  <input
                    type="text"
                    required
                    value={companyForm.code}
                    onChange={(e) => setCompanyForm({ ...companyForm, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. APRL"
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={companyForm.contactPerson}
                    onChange={(e) => setCompanyForm({ ...companyForm, contactPerson: e.target.value })}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={companyForm.email}
                    onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                    placeholder="ops@company.com"
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={companyForm.phone}
                    onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                    placeholder="+91 98290 12345"
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Substation Yard / Office Address</label>
                <textarea
                  rows="2"
                  value={companyForm.address}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                  placeholder="Substation Bay, Plant Address"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCompanyModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500"
                >
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: TRANSFORMER FORM                                   */}
      {/* ========================================================= */}
      {showTransformerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {editingTransformer ? 'Edit Transformer Asset' : 'Register New Transformer Asset'}
              </h4>
              <button onClick={() => setShowTransformerModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTransformer} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Company</label>
                <select
                  required
                  value={trForm.companyId}
                  onChange={(e) => setTrForm({ ...trForm, companyId: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Asset Tag Number</label>
                  <input
                    type="text"
                    required
                    value={trForm.tagNumber}
                    onChange={(e) => setTrForm({ ...trForm, tagNumber: e.target.value })}
                    placeholder="MEIL/2026/T-1001"
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Serial Number</label>
                  <input
                    type="text"
                    required
                    value={trForm.serialNumber}
                    onChange={(e) => setTrForm({ ...trForm, serialNumber: e.target.value })}
                    placeholder="SN-MEIL-2026-001"
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Capacity</label>
                  <input
                    type="text"
                    required
                    value={trForm.capacity}
                    onChange={(e) => setTrForm({ ...trForm, capacity: e.target.value })}
                    placeholder="50 MVA"
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">HV Rating</label>
                  <input
                    type="text"
                    required
                    value={trForm.hvRating}
                    onChange={(e) => setTrForm({ ...trForm, hvRating: e.target.value })}
                    placeholder="132 kV"
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">LV Rating</label>
                  <input
                    type="text"
                    required
                    value={trForm.lvRating}
                    onChange={(e) => setTrForm({ ...trForm, lvRating: e.target.value })}
                    placeholder="33 kV"
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Cooling Type</label>
                  <input
                    type="text"
                    value={trForm.coolingType}
                    onChange={(e) => setTrForm({ ...trForm, coolingType: e.target.value })}
                    placeholder="ONAN / ONAF"
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Vector Group</label>
                  <input
                    type="text"
                    value={trForm.vectorGroup}
                    onChange={(e) => setTrForm({ ...trForm, vectorGroup: e.target.value })}
                    placeholder="YNd11"
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Year of Mfg</label>
                  <input
                    type="number"
                    value={trForm.yearOfMfg}
                    onChange={(e) => setTrForm({ ...trForm, yearOfMfg: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Substation Location / Bay ID</label>
                <input
                  type="text"
                  required
                  value={trForm.location}
                  onChange={(e) => setTrForm({ ...trForm, location: e.target.value })}
                  placeholder="e.g. Switchyard Bay-03, Suratgarh"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTransformerModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500"
                >
                  Save Transformer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: USER & TRANSFORMER ASSIGNMENT FORM (DPR Section 6) */}
      {/* ========================================================= */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {editingUser ? 'Edit User & Permissions' : 'Create New User Account'}
              </h4>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email (Login ID)</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Access Role Category</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="End User">End User (Client Company Staff)</option>
                    <option value="Administrator">Administrator (Mangal R&D Team)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={userForm.company}
                    onChange={(e) => setUserForm({ ...userForm, company: e.target.value })}
                    className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Assign Transformers Checklist (DPR Section 6: "Assign transformers to users") */}
              {userForm.role === 'End User' && (
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Assign Permitted Transformers to User:
                  </label>
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-h-36 overflow-y-auto space-y-1.5">
                    {transformers.map((tr) => {
                      const isChecked = userForm.permittedTransformers.includes(tr.id);
                      return (
                        <label key={tr.id} className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300 hover:text-white">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const next = isChecked
                                ? userForm.permittedTransformers.filter(id => id !== tr.id)
                                : [...userForm.permittedTransformers, tr.id];
                              setUserForm({ ...userForm, permittedTransformers: next });
                            }}
                            className="rounded text-blue-600 accent-blue-600"
                          />
                          <span className="font-mono text-[11px]">
                            {tr.tagNumber} ({tr.companyName} • {tr.capacity})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500"
                >
                  Save User & Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EMAIL RECIPIENT FORM (DPR Section 6 & 7)           */}
      {/* ========================================================= */}
      {showRecipientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {editingRecipient ? 'Edit Email Recipient' : 'Add Notification Recipient'}
              </h4>
              <button onClick={() => setShowRecipientModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecipient} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Recipient Name / Team</label>
                <input
                  type="text"
                  required
                  value={recipientForm.name}
                  onChange={(e) => setRecipientForm({ ...recipientForm, name: e.target.value })}
                  placeholder="e.g. Substation Protection Desk"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={recipientForm.email}
                  onChange={(e) => setRecipientForm({ ...recipientForm, email: e.target.value })}
                  placeholder="ops@client.com"
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="pt-2 space-y-2 border-t border-slate-200 dark:border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={recipientForm.dailyReport}
                    onChange={(e) => setRecipientForm({ ...recipientForm, dailyReport: e.target.checked })}
                    className="rounded text-blue-600 accent-blue-600"
                  />
                  <span>Dispatch Automated Daily PDF Reports (06:00 AM)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={recipientForm.faultAlerts}
                    onChange={(e) => setRecipientForm({ ...recipientForm, faultAlerts: e.target.checked })}
                    className="rounded text-blue-600 accent-blue-600"
                  />
                  <span>Dispatch Immediate Fault Condition Email Alerts</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRecipientModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500"
                >
                  Save Recipient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
