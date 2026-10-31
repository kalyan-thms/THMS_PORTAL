import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_USERS,
  INITIAL_COMPANIES,
  INITIAL_TRANSFORMERS,
  INITIAL_ELECTRICAL_DATA,
  INITIAL_PHYSICAL_DATA,
  INITIAL_ALARMS,
  INITIAL_EMAIL_RECIPIENTS,
  INITIAL_REPORTS
} from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Stored session
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('thms_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to End User for initial presentation or null for login
    return null;
  });

  // State collections
  const [users, setUsers] = useState(INITIAL_USERS);
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [transformers, setTransformers] = useState(INITIAL_TRANSFORMERS);
  const [electricalData, setElectricalData] = useState(INITIAL_ELECTRICAL_DATA);
  const [physicalData, setPhysicalData] = useState(INITIAL_PHYSICAL_DATA);
  const [alarms, setAlarms] = useState(INITIAL_ALARMS);
  const [emailRecipients, setEmailRecipients] = useState(INITIAL_EMAIL_RECIPIENTS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [demoNotifications, setDemoNotifications] = useState([]);

  // Selected transformer for End-User or Admin inspection
  const [selectedTransformerId, setSelectedTransformerId] = useState(null);

  // Sync selected transformer when user logs in
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('thms_user', JSON.stringify(currentUser));
      if (currentUser.role === 'End User') {
        const assigned = currentUser.permittedTransformers || [];
        if (assigned.length > 0 && (!selectedTransformerId || !assigned.includes(selectedTransformerId))) {
          setSelectedTransformerId(assigned[0]);
        }
      } else {
        // Administrator defaults to the first transformer if none selected
        if (!selectedTransformerId && transformers.length > 0) {
          setSelectedTransformerId(transformers[0].id);
        }
      }
    } else {
      localStorage.removeItem('thms_user');
      setSelectedTransformerId(null);
    }
  }, [currentUser]);

  // Login handler
  const login = (email, password) => {
    // Case-insensitive email match
    const matched = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      return { success: true, user: matched };
    }
    return { success: false, error: 'Invalid email credentials. Please choose a valid role account.' };
  };

  // Quick switch for demo evaluation
  const loginAsDemo = (roleKey) => {
    let target = users[0]; // Admin default
    if (roleKey === 'admin') {
      target = users.find(u => u.role === 'Administrator');
    } else if (roleKey === 'adani') {
      target = users.find(u => u.email === 'client@adani.com');
    } else if (roleKey === 'tata') {
      target = users.find(u => u.email === 'engineer@tatapower.com');
    } else if (roleKey === 'ntpc') {
      target = users.find(u => u.email === 'alok@ntpc.co.in');
    }
    if (target) {
      setCurrentUser(target);
      return target;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Filter transformers accessible to current user
  const accessibleTransformers = currentUser
    ? currentUser.role === 'Administrator'
      ? transformers
      : transformers.filter(t => (currentUser.permittedTransformers || []).includes(t.id))
    : [];

  const currentTransformer = transformers.find(t => t.id === selectedTransformerId) || accessibleTransformers[0] || null;

  // Real-time jitter simulator for live readings demo
  const jitterTelemetry = () => {
    if (!selectedTransformerId) return;

    setElectricalData(prev => {
      const current = prev[selectedTransformerId];
      if (!current) return prev;

      const voltJitter = (Math.random() * 0.4 - 0.2);
      const currJitter = (Math.random() * 2 - 1);
      const powJitter = (Math.random() * 60 - 30);

      return {
        ...prev,
        [selectedTransformerId]: {
          hv: {
            ...current.hv,
            voltage: {
              ...current.hv.voltage,
              vAvg: +(current.hv.voltage.vAvg + voltJitter * 0.1).toFixed(2)
            },
            current: {
              ...current.hv.current,
              iAvg: +(current.hv.current.iAvg + currJitter * 0.2).toFixed(1)
            },
            power: {
              ...current.hv.power,
              active: Math.round(current.hv.power.active + powJitter)
            }
          },
          lv: {
            ...current.lv,
            voltage: {
              ...current.lv.voltage,
              vAvg: +(current.lv.voltage.vAvg + voltJitter * 0.05).toFixed(2)
            },
            current: {
              ...current.lv.current,
              iAvg: +(current.lv.current.iAvg + currJitter * 0.8).toFixed(1)
            }
          }
        }
      };
    });

    setPhysicalData(prev => {
      const current = prev[selectedTransformerId];
      if (!current) return prev;
      const tempJitter = (Math.random() * 0.2 - 0.1);

      return {
        ...prev,
        [selectedTransformerId]: {
          ...current,
          primaryWindingTemp: +(current.primaryWindingTemp + tempJitter).toFixed(1),
          secondaryWindingTemp: +(current.secondaryWindingTemp + tempJitter).toFixed(1),
          oilTemp: +(current.oilTemp + tempJitter * 0.5).toFixed(1)
        }
      };
    });
  };

  // Administration Operations (DPR Section 6)
  const addCompany = (newComp) => {
    const id = `COMP-${String(companies.length + 1).padStart(3, '0')}`;
    const comp = { ...newComp, id, active: true, transformerCount: 0 };
    setCompanies(prev => [...prev, comp]);
    return comp;
  };

  const updateCompany = (id, updatedFields) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
  };

  const addTransformer = (newTr) => {
    const id = `TR-${newTr.capacity.replace(/\s+/g, '')}-${String(transformers.length + 1).padStart(2, '0')}`;
    const tr = {
      ...newTr,
      id,
      ageYears: new Date().getFullYear() - (parseInt(newTr.yearOfMfg) || new Date().getFullYear()),
      status: "Normal",
      isOutdated: false,
      lastUpdated: new Date().toISOString(),
      thiScore: 88.0,
      thiStatus: "Good",
      active: true,
      assignedUsers: []
    };
    setTransformers(prev => [...prev, tr]);

    // Provide default electrical and physical records
    setElectricalData(prev => ({
      ...prev,
      [id]: INITIAL_ELECTRICAL_DATA["TR-50MVA-01"]
    }));
    setPhysicalData(prev => ({
      ...prev,
      [id]: INITIAL_PHYSICAL_DATA["TR-50MVA-01"]
    }));

    // Update company transformer count
    setCompanies(prev => prev.map(c => c.id === newTr.companyId ? { ...c, transformerCount: c.transformerCount + 1 } : c));
    return tr;
  };

  const updateTransformer = (id, updatedFields) => {
    setTransformers(prev => prev.map(t => t.id === id ? { ...t, ...updatedFields } : t));
  };

  const addUser = (newUser) => {
    const id = `user-${Date.now()}`;
    const u = { ...newUser, id, status: "Active", createdAt: new Date().toISOString().split("T")[0] };
    setUsers(prev => [...prev, u]);
    return u;
  };

  const updateUser = (id, updatedFields) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updatedFields } : u));
  };

  const assignTransformerToUser = (userId, transformerId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const permitted = u.permittedTransformers || [];
        const nextPermitted = permitted.includes(transformerId)
          ? permitted
          : [...permitted, transformerId];
        return { ...u, permittedTransformers: nextPermitted };
      }
      return u;
    }));
  };

  const removeTransformerFromUser = (userId, transformerId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          permittedTransformers: (u.permittedTransformers || []).filter(id => id !== transformerId)
        };
      }
      return u;
    }));
  };

  // Alarm management
  const acknowledgeAlarm = (alarmId) => {
    setAlarms(prev => prev.map(a => a.id === alarmId ? { ...a, acknowledged: true } : a));
  };

  // Email notifications (DPR Section 7.2)
  const addEmailRecipient = (recipient) => {
    const id = `RCPT-${String(emailRecipients.length + 1).padStart(3, '0')}`;
    const item = { ...recipient, id, active: true };
    setEmailRecipients(prev => [...prev, item]);
    return item;
  };

  const updateEmailRecipient = (id, updatedFields) => {
    setEmailRecipients(prev => prev.map(r => r.id === id ? { ...r, ...updatedFields } : r));
  };

  const deleteEmailRecipient = (id) => {
    setEmailRecipients(prev => prev.filter(r => r.id !== id));
  };

  // Trigger simulated fault notification (per DPR Section 8: Clearly identified demo behavior)
  const triggerSimulatedEmailNotification = (alarm, recipientEmails) => {
    const notification = {
      id: `NOTIF-${Date.now()}`,
      timestamp: new Date().toISOString(),
      subject: `[THMS ALERT - ${alarm.severity.toUpperCase()}] ${alarm.parameter} on ${alarm.transformerTag}`,
      body: `Notice: Automated alert dispatched to maintenance crew for ${alarm.transformerTag} (${alarm.companyName}). Reading: ${alarm.currentValue} exceeded threshold ${alarm.threshold}.`,
      recipients: recipientEmails,
      isDemo: true // Required by DPR: Clearly identified demo behavior
    };
    setDemoNotifications(prev => [notification, ...prev]);
    return notification;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        loginAsDemo,
        logout,
        isAdmin: currentUser?.role === 'Administrator',
        isEndUser: currentUser?.role === 'End User',
        users,
        companies,
        transformers,
        accessibleTransformers,
        selectedTransformerId,
        setSelectedTransformerId,
        currentTransformer,
        electricalData,
        physicalData,
        alarms,
        emailRecipients,
        reports,
        demoNotifications,
        // Actions
        jitterTelemetry,
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
        triggerSimulatedEmailNotification
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
