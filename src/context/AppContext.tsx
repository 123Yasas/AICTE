import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Application,
  DocumentItem,
  ValidationFinding,
  AnomalyFinding,
  RegulatoryRule,
  AuditLog,
  NotificationItem,
  DeficiencyItem,
} from '../types';
import {
  DEMO_USERS,
  INITIAL_APPLICATIONS,
  INITIAL_RULES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  currentUser: User;
  isAuthenticated: boolean;
  login: (email: string, password: string, selectedRole?: UserRole) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole, institutionName?: string) => boolean;
  switchRole: (role: UserRole) => void;
  applications: Application[];
  selectedAppId: string;
  setSelectedAppId: (id: string) => void;
  getApplication: (id: string) => Application | undefined;
  addApplication: (newApp: Partial<Application>) => string;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  addDocument: (appId: string, doc: Partial<DocumentItem>) => void;
  replaceDocument: (appId: string, oldDocId: string, replacement: Partial<DocumentItem>, deficiencyId?: string) => void;
  removeDocument: (appId: string, docId: string) => void;
  triggerValidation: (appId: string) => void;
  triggerAnomalyScan: (appId: string) => void;
  triggerExternalVerification: (appId: string, docId: string, method: string) => void;
  updateFindingStatus: (appId: string, findingId: string, status: 'Confirmed' | 'Dismissed' | 'Under Investigation', comment?: string) => void;
  updateAnomalyStatus: (appId: string, anomalyId: string, status: 'Confirmed' | 'Dismissed' | 'Forwarded for Scrutiny', notes?: string) => void;
  resolveDeficiency: (appId: string, deficiencyId: string, notes?: string) => void;
  addOfficerObservation: (appId: string, observation: string, actionRecommendation: string) => void;
  rules: RegulatoryRule[];
  addRule: (rule: Omit<RegulatoryRule, 'id'>) => void;
  toggleRule: (ruleId: string) => void;
  updateRule: (ruleId: string, updates: Partial<RegulatoryRule>) => void;
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('aicte_is_authenticated') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('aicte_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return DEMO_USERS[0];
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('aicte_applications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_APPLICATIONS;
  });

  const [rules, setRules] = useState<RegulatoryRule[]>(() => {
    const saved = localStorage.getItem('aicte_rules');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_RULES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('aicte_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('aicte_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [selectedAppId, setSelectedAppId] = useState<string>('APP-2026-001');
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('aicte_is_authenticated', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('aicte_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aicte_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('aicte_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('aicte_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('aicte_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (email: string, _password: string, selectedRole?: UserRole): boolean => {
    // Check known demo user
    const matched = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    let userToSet: User;

    if (matched) {
      userToSet = matched;
    } else {
      // Create user session based on email and role
      const role: UserRole =
        selectedRole ||
        (email.includes('officer') || email.includes('aicte')
          ? 'officer'
          : email.includes('admin')
          ? 'admin'
          : 'institution');

      userToSet = {
        id: `USER-${Date.now().toString().slice(-4)}`,
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        email: email.trim(),
        role,
        designation:
          role === 'admin'
            ? 'Systems Administrator'
            : role === 'officer'
            ? 'AICTE Scrutiny Officer'
            : 'Institution Principal',
        avatar:
          role === 'officer'
            ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
            : role === 'admin'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        institutionId: role === 'institution' ? 'INST-2026-101' : undefined,
        institutionName: role === 'institution' ? 'Greenfield Institute of Technology' : undefined,
      };
    }

    setCurrentUser(userToSet);
    setIsAuthenticated(true);

    addAuditLog({
      actor: userToSet.name,
      actorRole: userToSet.role,
      action: 'User Authentication / Login',
      applicationId: 'AUTH-GATEWAY',
      object: userToSet.email,
      newValue: `Role: ${userToSet.role}`,
      outcome: 'Success: Session token granted',
    });

    showToast(`Welcome, ${userToSet.name}! Signed in as ${userToSet.designation}.`, 'success');
    return true;
  };

  const logout = () => {
    addAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'User Logout',
      applicationId: 'AUTH-GATEWAY',
      object: currentUser.email,
      outcome: 'User session terminated cleanly',
    });

    setIsAuthenticated(false);
    showToast('Signed out of AICTE SmartVerify', 'info');
  };

  const register = (name: string, email: string, _password: string, role: UserRole, institutionName?: string): boolean => {
    const newUser: User = {
      id: `USER-${Date.now().toString().slice(-4)}`,
      name,
      email,
      role,
      designation:
        role === 'admin'
          ? 'Registered Administrator'
          : role === 'officer'
          ? 'Regional Scrutiny Officer'
          : 'Head of Institution',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      institutionId: role === 'institution' ? `INST-${Date.now().toString().slice(-3)}` : undefined,
      institutionName: role === 'institution' ? institutionName || 'Technical Institute' : undefined,
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);

    addAuditLog({
      actor: newUser.name,
      actorRole: newUser.role,
      action: 'New User Registration',
      applicationId: 'AUTH-GATEWAY',
      object: newUser.email,
      newValue: `Registered as ${role}`,
      outcome: 'User account created and verified',
    });

    showToast(`Account registered successfully for ${name}!`, 'success');
    return true;
  };

  const switchRole = (role: UserRole) => {
    const found = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setCurrentUser(found);
    setIsAuthenticated(true);
    showToast(`Switched active profile to ${found.name} (${found.designation})`, 'info');
    addAuditLog({
      actor: found.name,
      actorRole: found.role,
      action: 'Session Role Switched',
      applicationId: 'AUTH-SESSION',
      object: `Role: ${role}`,
      outcome: `User switched to ${role} context`,
    });
  };

  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ...log,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const getApplication = (id: string) => {
    return applications.find((app) => app.id === id);
  };

  const addApplication = (newApp: Partial<Application>) => {
    const nextNum = (applications.length + 1).toString().padStart(3, '0');
    const newId = `APP-2026-${nextNum}`;
    const fullApp: Application = {
      id: newId,
      institutionId: currentUser.institutionId || `INST-2026-${nextNum}`,
      institutionName: newApp.institutionName || currentUser.institutionName || 'Indian Institute of Engineering & Technology',
      category: newApp.category || 'Extension of Approval (EoA)',
      academicYear: newApp.academicYear || '2026-2027',
      submissionDate: new Date().toISOString().slice(0, 10),
      status: 'Preliminary Checks Complete',
      validationStatus: 'Passed',
      verificationStatus: 'Not Yet Checked',
      complianceStatus: 'Meets Configured Rules',
      assignedOfficer: 'Smt. Ananya Sharma',
      officerNotes: 'Fresh application submitted via portal. Preliminary validation triggered.',
      address: newApp.address || 'Knowledge Park IV, Greater Noida',
      state: newApp.state || 'Uttar Pradesh',
      district: newApp.district || 'Gautam Buddha Nagar',
      contactEmail: newApp.contactEmail || currentUser.email,
      contactPhone: newApp.contactPhone || '+91 98110 02299',
      approvedProgrammes: newApp.approvedProgrammes || ['Computer Science & Engg', 'Information Technology'],
      totalIntake: newApp.totalIntake || 300,
      facultyCount: newApp.facultyCount || 24,
      landAreaAcres: newApp.landAreaAcres || 5.0,
      builtUpAreaSqMeters: newApp.builtUpAreaSqMeters || 11000,
      lastModified: new Date().toISOString().replace('T', ' ').slice(0, 16),
      documents: newApp.documents || [],
      findings: newApp.findings || [],
      anomalies: newApp.anomalies || [],
      complianceChecks: newApp.complianceChecks || [],
      infrastructureAssets: newApp.infrastructureAssets || [],
      deficiencies: newApp.deficiencies || [],
    };

    setApplications((prev) => [fullApp, ...prev]);
    setSelectedAppId(newId);
    showToast(`Application ${newId} created successfully!`, 'success');

    addAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'Application Submission',
      applicationId: newId,
      object: fullApp.institutionName,
      newValue: `Category: ${fullApp.category}, Total Intake: ${fullApp.totalIntake}`,
      outcome: 'Draft application registered & queued for preliminary AI validation',
    });

    const newNotif: NotificationItem = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title: 'New Application Created',
      message: `${fullApp.institutionName} filed application ${newId} (${fullApp.category}).`,
      timestamp: 'Just now',
      isRead: false,
      category: 'Document',
      severity: 'Info',
      applicationId: newId,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newId;
  };

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            ...updates,
            lastModified: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return app;
      })
    );
  };

  const addDocument = (appId: string, doc: Partial<DocumentItem>) => {
    const docId = `DOC-${Date.now().toString().slice(-4)}`;
    const newDocItem: DocumentItem = {
      id: docId,
      name: doc.name || 'Uploaded_Document.pdf',
      category: doc.category || 'Mandatory Regulatory Affidavit',
      fileType: doc.fileType || 'pdf',
      fileSize: doc.fileSize || '2.4 MB',
      uploadDate: new Date().toISOString().slice(0, 10),
      ocrStatus: 'Completed',
      ocrConfidence: Math.floor(Math.random() * 8 + 92),
      extractedFields: doc.extractedFields || {
        'Document Title': doc.name || 'Affidavit / Certificate',
        'Entity Name': getApplication(appId)?.institutionName || 'Technical Institution',
        'Issue Date': '2026-05-10',
        'Issuing Authority': 'Authorized Competent Agency',
      },
      verificationStatus: 'Not Yet Checked',
      isMandatory: doc.isMandatory ?? true,
      pageCount: doc.pageCount || 4,
      anomaliesCount: 0,
      fileHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      ...doc,
    };

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            documents: [...app.documents, newDocItem],
            lastModified: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return app;
      })
    );

    addAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'Document Upload & OCR Processing',
      applicationId: appId,
      object: newDocItem.name,
      newValue: `DocID: ${docId}, Type: ${newDocItem.category}`,
      outcome: `File uploaded successfully. Simulated OCR extracted structured data (${newDocItem.ocrConfidence}% confidence)`,
    });

    showToast(`Uploaded ${newDocItem.name} — OCR analysis completed`, 'success');
  };

  const replaceDocument = (appId: string, oldDocId: string, replacement: Partial<DocumentItem>, deficiencyId?: string) => {
    const newDocId = `DOC-${Date.now().toString().slice(-4)}`;
    const app = getApplication(appId);
    const oldDoc = app?.documents.find((d) => d.id === oldDocId);

    const replacementDoc: DocumentItem = {
      id: newDocId,
      name: replacement.name || 'Replacement_Certificate_Verified.pdf',
      category: oldDoc?.category || replacement.category || 'Statutory Clearance',
      fileType: 'pdf',
      fileSize: replacement.fileSize || '2.2 MB',
      uploadDate: new Date().toISOString().slice(0, 10),
      ocrStatus: 'Completed',
      ocrConfidence: 98.4,
      extractedFields: replacement.extractedFields || {
        'Extracted Title': replacement.name || 'Revised Endorsement Certificate',
        'Status': 'Certified & Renewed',
        'Validity': '2027-12-31',
      },
      verificationStatus: 'Verified',
      verificationMethod: 'Authorized State Database Reconciliation',
      verificationSource: 'Live Official Database',
      verificationTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isMandatory: true,
      pageCount: 3,
      anomaliesCount: 0,
      fileHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      hasReplacement: true,
      replacementDate: new Date().toISOString().slice(0, 10),
      originalName: oldDoc?.name,
    };

    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === appId) {
          const updatedDocs = a.documents.map((d) => (d.id === oldDocId ? replacementDoc : d));
          const updatedDefs = a.deficiencies.map((def) => {
            if (deficiencyId && def.id === deficiencyId) {
              return { ...def, status: 'Correction Submitted' as const, replacementDocId: newDocId };
            }
            return def;
          });

          return {
            ...a,
            status: 'Correction Submitted',
            documents: updatedDocs,
            deficiencies: updatedDefs,
            lastModified: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return a;
      })
    );

    addAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'Document Replacement',
      applicationId: appId,
      object: replacementDoc.name,
      previousValue: oldDoc?.name || oldDocId,
      newValue: replacementDoc.id,
      outcome: 'Replacement document uploaded. Deficiency status moved to Correction Submitted.',
    });

    showToast(`Replacement document uploaded. Queued for officer revalidation!`, 'success');
  };

  const removeDocument = (appId: string, docId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            documents: app.documents.filter((d) => d.id !== docId),
            lastModified: new Date().toISOString().replace('T', ' ').slice(0, 16),
          };
        }
        return app;
      })
    );
    showToast(`Document removed from application`, 'info');
  };

  const triggerValidation = (appId: string) => {
    const app = getApplication(appId);
    if (!app) return;

    let newValidationStatus: Application['validationStatus'] = 'Passed';
    let newAppStatus: Application['status'] = 'Preliminary Checks Complete';

    if (app.deficiencies.some((d) => d.status === 'Open')) {
      newValidationStatus = 'Attention Required';
      newAppStatus = 'Deficiencies Found';
    } else if (app.documents.some((d) => d.verificationStatus === 'Expired' || d.verificationStatus === 'Mismatch Detected')) {
      newValidationStatus = 'Attention Required';
      newAppStatus = 'Attention Required';
    }

    updateApplication(appId, {
      validationStatus: newValidationStatus,
      status: newAppStatus,
    });

    addAuditLog({
      actor: 'AICTE SmartVerify Validation Engine',
      actorRole: 'system',
      action: 'Intelligent Rule Validation Run',
      applicationId: appId,
      object: `Evaluated ${app.documents.length} docs against ${rules.length} active APH rules`,
      outcome: `Validation finished with status: ${newValidationStatus}`,
    });

    showToast(`Validation pipeline finished for ${appId}. Status: ${newValidationStatus}`, 'success');
  };

  const triggerAnomalyScan = (appId: string) => {
    const app = getApplication(appId);
    if (!app) return;

    addAuditLog({
      actor: 'AICTE Anomaly & Tamper Detection Engine',
      actorRole: 'system',
      action: 'Forensic Document Inspection',
      applicationId: appId,
      object: `Scanned ${app.documents.length} PDFs for metadata, font variance, and compression artifacts`,
      outcome: `Analysis completed. Identified ${app.anomalies.length} potential anomalies flagged for officer scrutiny.`,
    });

    showToast(`Anomaly detection scan completed. Findings updated.`, 'info');
  };

  const triggerExternalVerification = (appId: string, docId: string, method: string) => {
    const targetDoc = getApplication(appId)?.documents.find((d) => d.id === docId);
    if (!targetDoc) return;

    const isFireDoc = targetDoc.category.toLowerCase().includes('fire');
    const outcomeStatus = isFireDoc && targetDoc.expiryDate && new Date(targetDoc.expiryDate) < new Date('2026-10-01')
      ? 'Expired'
      : 'Verified';

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            documents: app.documents.map((d) => {
              if (d.id === docId) {
                return {
                  ...d,
                  verificationStatus: outcomeStatus,
                  verificationMethod: method,
                  verificationSource: 'Authorized State Agency DB Adapter (Demo)',
                  verificationTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
                };
              }
              return d;
            }),
          };
        }
        return app;
      })
    );

    addAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: `External Authentication: ${method}`,
      applicationId: appId,
      object: targetDoc.name,
      newValue: `Status: ${outcomeStatus}`,
      outcome: `DEMO VERIFICATION: Source returned status ${outcomeStatus}`,
    });

    showToast(`Verification check completed: ${outcomeStatus}`, outcomeStatus === 'Verified' ? 'success' : 'warning');
  };

  const updateFindingStatus = (appId: string, findingId: string, status: 'Confirmed' | 'Dismissed' | 'Under Investigation', comment?: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            findings: app.findings.map((f) => {
              if (f.id === findingId) {
                return {
                  ...f,
                  officerReviewStatus: status,
                  officerComment: comment || f.officerComment,
                };
              }
              return f;
            }),
          };
        }
        return app;
      })
    );

    addAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: `Finding Marked as ${status}`,
      applicationId: appId,
      object: `Finding ID: ${findingId}`,
      newValue: status,
      outcome: comment || `Officer recorded decision: ${status}`,
    });

    showToast(`Finding marked as ${status}`, 'info');
  };

  const updateAnomalyStatus = (appId: string, anomalyId: string, status: 'Confirmed' | 'Dismissed' | 'Forwarded for Scrutiny', notes?: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            anomalies: app.anomalies.map((anom) => {
              if (anom.id === anomalyId) {
                return {
                  ...anom,
                  officerReviewStatus: status,
                  officerNotes: notes || anom.officerNotes,
                };
              }
              return anom;
            }),
          };
        }
        return app;
      })
    );

    addAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: `Anomaly Marked as ${status}`,
      applicationId: appId,
      object: `Anomaly ID: ${anomalyId}`,
      newValue: status,
      outcome: notes || `Officer review outcome: ${status}`,
    });

    showToast(`Anomaly marked as ${status}`, 'info');
  };

  const resolveDeficiency = (appId: string, deficiencyId: string, notes?: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updatedDefs = app.deficiencies.map((def) => {
            if (def.id === deficiencyId) {
              return {
                ...def,
                status: 'Resolved' as const,
                reviewerComments: notes || 'Reviewed and closed by authorized AICTE officer.',
              };
            }
            return def;
          });

          const hasOpenDefs = updatedDefs.some((d) => d.status === 'Open' || d.status === 'Not Resolved');

          return {
            ...app,
            deficiencies: updatedDefs,
            status: hasOpenDefs ? app.status : 'Preliminary Checks Complete',
            validationStatus: hasOpenDefs ? app.validationStatus : 'Passed',
          };
        }
        return app;
      })
    );

    addAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'Deficiency Resolved & Closed',
      applicationId: appId,
      object: deficiencyId,
      newValue: 'Resolved',
      outcome: notes || 'Deficiency cleared after evidence review',
    });

    showToast(`Deficiency ${deficiencyId} has been resolved!`, 'success');
  };

  const addOfficerObservation = (appId: string, observation: string, actionRecommendation: string) => {
    updateApplication(appId, {
      officerNotes: observation,
      status: actionRecommendation === 'Recommend for Approval' ? 'Recommended for Approval' : 'Under Officer Review',
    });

    addAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'Officer Decision & Official Observation Recorded',
      applicationId: appId,
      object: actionRecommendation,
      newValue: observation,
      outcome: `Recommendation: ${actionRecommendation}`,
    });

    showToast(`Officer observation saved successfully`, 'success');
  };

  const addRule = (newRuleData: Omit<RegulatoryRule, 'id'>) => {
    const id = `RULE-APH-${(rules.length + 1).toString().padStart(2, '0')}`;
    const rule: RegulatoryRule = { id, ...newRuleData };
    setRules((prev) => [rule, ...prev]);

    addAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'New Regulatory Rule Added',
      applicationId: 'SYSTEM-RULES',
      object: rule.code,
      newValue: rule.title,
      outcome: `Rule version ${rule.version} registered in APH compliance engine`,
    });

    showToast(`Rule ${rule.code} added successfully`, 'success');
  };

  const toggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          const updated = !r.isActive;
          addAuditLog({
            actor: currentUser.name,
            actorRole: currentUser.role,
            action: updated ? 'Regulatory Rule Enabled' : 'Regulatory Rule Disabled',
            applicationId: 'SYSTEM-RULES',
            object: r.code,
            newValue: updated ? 'Active' : 'Inactive',
            outcome: `Rule ${r.code} state changed`,
          });
          return { ...r, isActive: updated };
        }
        return r;
      })
    );
  };

  const updateRule = (ruleId: string, updates: Partial<RegulatoryRule>) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          return { ...r, ...updates };
        }
        return r;
      })
    );
    showToast(`Rule updated successfully`, 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast(`All notifications marked as read`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        register,
        switchRole,
        applications,
        selectedAppId,
        setSelectedAppId,
        getApplication,
        addApplication,
        updateApplication,
        addDocument,
        replaceDocument,
        removeDocument,
        triggerValidation,
        triggerAnomalyScan,
        triggerExternalVerification,
        updateFindingStatus,
        updateAnomalyStatus,
        resolveDeficiency,
        addOfficerObservation,
        rules,
        addRule,
        toggleRule,
        updateRule,
        auditLogs,
        addAuditLog,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        toasts,
        showToast,
        removeToast,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
