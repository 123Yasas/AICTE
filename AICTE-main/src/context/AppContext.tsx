import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SimpleDocument,
  SimpleUser,
  DocumentCategory,
  PaymentStatus,
  InstitutionalEmailMessage,
} from '../types/verification';
import {
  SIMPLE_USERS,
  INITIAL_SIMPLE_DOCUMENTS,
  INITIAL_INSTITUTIONAL_EMAILS,
  DOCUMENT_CATEGORIES,
  calculateDaysRemaining,
  determinePriority,
} from '../data/simpleMockData';
import { runAgentAnalysis } from '../services/aiVerificationAgent';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface OtpSession {
  email: string;
  role: 'college' | 'aicte';
  otpCode: string;
  sentAt: number;
}

interface SimpleAppContextType {
  currentUser: SimpleUser;
  isAuthenticated: boolean;
  login: (role: 'college' | 'aicte') => void;
  logout: () => void;
  switchRole: (role: 'college' | 'aicte') => void;

  // OTP Authentication via Email
  otpSession: OtpSession | null;
  sendEmailOtp: (email: string, role: 'college' | 'aicte') => string;
  verifyOtp: (enteredOtp: string) => boolean;
  clearOtpSession: () => void;

  // Institutional Mailbox & Notification Center (PS 26261 Requirement)
  institutionalEmails: InstitutionalEmailMessage[];
  unreadEmailCount: number;
  isMailboxOpen: boolean;
  setIsMailboxOpen: (open: boolean) => void;
  sendInstitutionalEmail: (msg: Omit<InstitutionalEmailMessage, 'id' | 'date' | 'read'>) => void;
  markEmailAsRead: (emailId: string) => void;
  markAllEmailsAsRead: () => void;

  documents: SimpleDocument[];
  selectedDoc: SimpleDocument | null;
  setSelectedDoc: (doc: SimpleDocument | null) => void;

  addDocument: (data: {
    title: string;
    documentType: DocumentCategory;
    deadlineDate: string;
    fileName: string;
    fileSize?: string;
    paymentAmount?: number;
    simulateDefects?: boolean;
    simulateForgery?: boolean;
    notes?: string;
  }) => SimpleDocument;

  reuploadDocument: (docId: string, newFileName: string) => void;
  approveDocument: (docId: string, remarks?: string) => void;
  requestCorrection: (docId: string, remarks: string) => void;
  runAiVerification: (docId: string) => Promise<void>;

  // Payment & Expiry Rejection
  payFee: (docId: string) => void;
  checkAndRejectOverduePayments: () => number;
  simulateExpirePayment: (docId: string) => void;

  // Forgery & Anomaly Rejection (PS 26261 Requirement)
  simulateForgeryRejection: (docId: string) => void;

  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;
  isAiAgentModalOpen: boolean;
  setIsAiAgentModalOpen: (open: boolean) => void;
  aiAgentDoc: SimpleDocument | null;
  setAiAgentDoc: (doc: SimpleDocument | null) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;
}

const SimpleAppContext = createContext<SimpleAppContextType | undefined>(undefined);


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<SimpleUser>(() => {
    const saved = localStorage.getItem('aicte_simple_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        /* ignore */
      }
    }
    return SIMPLE_USERS[0]; // Default: College
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('aicte_simple_auth') === 'true'; // false initially if unverified
  });

  const [documents, setDocuments] = useState<SimpleDocument[]>(() => {
    const saved = localStorage.getItem('aicte_simple_docs_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((d: any) => ({
          ...d,
          paymentAmount: d.paymentAmount ?? 15000,
          paymentStatus: d.paymentStatus ?? 'Pending Payment',
          paymentDueDate: d.paymentDueDate ?? d.deadlineDate,
        }));
      } catch (e) {
        /* ignore */
      }
    }
    return INITIAL_SIMPLE_DOCUMENTS;
  });

  const [institutionalEmails, setInstitutionalEmails] = useState<InstitutionalEmailMessage[]>(() => {
    const saved = localStorage.getItem('aicte_simple_emails_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        /* ignore */
      }
    }
    return INITIAL_INSTITUTIONAL_EMAILS;
  });

  const [isMailboxOpen, setIsMailboxOpen] = useState<boolean>(false);
  const [selectedDoc, setSelectedDoc] = useState<SimpleDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isAiAgentModalOpen, setIsAiAgentModalOpen] = useState<boolean>(false);
  const [aiAgentDoc, setAiAgentDoc] = useState<SimpleDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastState[]>([]);
  const [otpSession, setOtpSession] = useState<OtpSession | null>(null);

  useEffect(() => {
    localStorage.setItem('aicte_simple_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aicte_simple_auth', isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('aicte_simple_docs_v4', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('aicte_simple_emails_v2', JSON.stringify(institutionalEmails));
  }, [institutionalEmails]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 5500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Institutional Email Messaging System
  const sendInstitutionalEmail = (msg: Omit<InstitutionalEmailMessage, 'id' | 'date' | 'read'>) => {
    const newEmail: InstitutionalEmailMessage = {
      ...msg,
      id: `EML-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: false,
    };

    setInstitutionalEmails((prev) => [newEmail, ...prev]);

    // Notify if sent to current user
    if (newEmail.toEmail.toLowerCase() === currentUser.email.toLowerCase()) {
      showToast(`📨 Official AICTE Communication dispatched to ${newEmail.toEmail}: "${newEmail.subject}"`, 'info');
    }
  };

  const markEmailAsRead = (emailId: string) => {
    setInstitutionalEmails((prev) =>
      prev.map((e) => (e.id === emailId ? { ...e, read: true } : e))
    );
  };

  const markAllEmailsAsRead = () => {
    setInstitutionalEmails((prev) => prev.map((e) => ({ ...e, read: true })));
  };

  const unreadEmailCount = institutionalEmails.filter(
    (e) => !e.read && (currentUser.role === 'aicte' || e.toEmail.toLowerCase() === currentUser.email.toLowerCase())
  ).length;

  // OTP Email Verification
  const sendEmailOtp = (email: string, role: 'college' | 'aicte'): string => {
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const session: OtpSession = {
      email: email.trim(),
      role,
      otpCode: generatedOtp,
      sentAt: Date.now(),
    };
    setOtpSession(session);

    // Also dispatch official OTP email into institutional inbox
    sendInstitutionalEmail({
      toEmail: email.trim(),
      toInstitutionName: role === 'college' ? 'Apex Institute of Engineering & Technology' : 'AICTE Scrutiny Desk',
      from: 'auth-gateway@aicte-india.org',
      subject: `🔐 Institutional Security Verification Code (2FA OTP) — ${generatedOtp}`,
      category: 'OTP',
      regulatoryCitation: 'NIC Standard for Multi-Factor Regulatory Authentication',
      bodyHtml: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
          <h3 style="color: #1d4ed8; margin-top: 0;">AICTE SMARTVERIFY — SECURE ACCESS GATEWAY</h3>
          <p>Dear Institutional Nodal Officer / Scrutiny Official,</p>
          <p>Your one-time authentication passcode for signing into the AICTE SmartVerify Portal is:</p>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px 20px; font-size: 24px; font-weight: 700; color: #166534; letter-spacing: 4px; display: inline-block; border-radius: 8px; margin: 10px 0;">
            ${generatedOtp}
          </div>
          <p>This code is valid for 5 minutes. Do not disclose this institutional code to unauthorized third parties.</p>
          <p style="margin-top: 20px; font-size: 12px; color: #64748b;">All India Council for Technical Education (AICTE), Nelson Mandela Marg, New Delhi.</p>
        </div>
      `,
    });

    showToast(
      `📧 Security Code sent to ${email}: ${generatedOtp} (Valid for 5 mins)`,
      'info'
    );
    return generatedOtp;
  };

  const verifyOtp = (enteredOtp: string): boolean => {
    if (!otpSession) {
      showToast('No active OTP session. Please request a verification code.', 'error');
      return false;
    }

    if (enteredOtp.trim() === otpSession.otpCode.trim()) {
      const targetUser = SIMPLE_USERS.find((u) => u.role === otpSession.role) || SIMPLE_USERS[0];
      const loggedUser: SimpleUser = {
        ...targetUser,
        email: otpSession.email || targetUser.email,
      };

      setCurrentUser(loggedUser);
      setIsAuthenticated(true);
      setOtpSession(null);
      showToast(`Two-factor verification successful! Welcome, ${loggedUser.name}.`, 'success');
      return true;
    } else {
      showToast('Invalid verification code. Please check your email or resend.', 'error');
      return false;
    }
  };

  const clearOtpSession = () => {
    setOtpSession(null);
  };

  const login = (role: 'college' | 'aicte') => {
    const targetUser = SIMPLE_USERS.find((u) => u.role === role) || SIMPLE_USERS[0];
    setCurrentUser(targetUser);
    setIsAuthenticated(true);
    showToast(
      role === 'college'
        ? `Logged in as College (${targetUser.institutionName})`
        : `Logged in as AICTE Official (${targetUser.name})`,
      'success'
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    setOtpSession(null);
    showToast('Signed out of AICTE SmartVerify', 'info');
  };

  const switchRole = (role: 'college' | 'aicte') => {
    const targetUser = SIMPLE_USERS.find((u) => u.role === role) || SIMPLE_USERS[0];
    setCurrentUser(targetUser);
    setIsAuthenticated(true);
    showToast(
      role === 'college'
        ? 'Switched to College Portal'
        : 'Switched to AICTE Scrutiny Desk',
      'info'
    );
  };

  const addDocument = (data: {
    title: string;
    documentType: DocumentCategory;
    deadlineDate: string;
    fileName: string;
    fileSize?: string;
    paymentAmount?: number;
    simulateDefects?: boolean;
    simulateForgery?: boolean;
    notes?: string;
  }): SimpleDocument => {
    const nextNum = (documents.length + 1).toString().padStart(3, '0');
    const newId = `DOC-2026-${nextNum}`;

    const isForgery = data.simulateForgery ?? false;
    const analysis = runAgentAnalysis(
      data.documentType,
      data.title,
      data.deadlineDate,
      data.simulateDefects ?? false,
      isForgery
    );

    const categoryMeta = DOCUMENT_CATEGORIES.find((c) => c.id === data.documentType);
    const feeAmount = data.paymentAmount || categoryMeta?.defaultFee || 15000;

    let status: SimpleDocument['status'];
    let forgeryNotice = undefined;

    if (isForgery) {
      status = 'Rejected - Suspected Forgery / Anomaly';
      const noticeId = `REJ-FRAUD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const noticeDate = new Date().toISOString().replace('T', ' ').slice(0, 16);
      forgeryNotice = {
        noticeId,
        noticeDate,
        reason: 'Autonomous Anomaly Engine detected pixel manipulation, signature tampering, and metadata discrepancy.',
        evidence: analysis.report.anomalyReport?.preliminaryEvidence || 'Pixel tampering and metadata inconsistencies detected.',
        message: `OFFICIAL NOTICE TO COLLEGE: Application ${newId} (${data.title}) has been REJECTED IMMEDIATELY. Pursuant to AICTE Approval Process Handbook (APH 2026-27) Chapter 1 Clause 1.8, upload of altered, fabricated, or duplicate records leads to immediate termination and issuance of regulatory show-cause notice.`,
      };

      // Dispatch rejection email directly to college inbox
      sendInstitutionalEmail({
        toEmail: currentUser.email,
        toInstitutionName: currentUser.institutionName || 'Apex Institute of Engineering & Technology',
        from: 'scrutiny-bureau@aicte-india.org',
        subject: `⚠️ TERMINATION NOTICE: Application ${newId} Rejected (Suspected Forgery / Tampering)`,
        category: 'Forgery / Tampering Rejection',
        documentId: newId,
        documentTitle: data.title,
        regulatoryCitation: 'AICTE Approval Process Handbook (APH 2026-27) Chapter 1 Clause 1.8',
        bodyHtml: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
            <h3 style="color: #b91c1c; margin-top: 0;">ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</h3>
            <p><strong>Ref No:</strong> ${noticeId}</p>
            <p><strong>To:</strong> The Principal / Institutional Head, ${currentUser.institutionName || 'Apex Institute'}</p>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;" />
            <p><strong>Subject:</strong> Immediate Rejection and Show-Cause Notice under APH Chapter 1 Clause 1.8</p>
            <p>During automated forensic verification of application <strong>${newId} (${data.title})</strong>, critical document alterations were detected:</p>
            <p style="background: #fef2f2; border: 1px solid #fecaca; padding: 10px; border-radius: 6px; color: #991b1b;">
              ${forgeryNotice.evidence}
            </p>
            <p>Pursuant to <strong>AICTE APH Chapter 1 Clause 1.8</strong>, processing of this application is <strong>TERMINATED IMMEDIATELY</strong>. A formal Show-Cause Notice has been filed.</p>
          </div>
        `,
      });
    } else {
      const hasMissing = analysis.report.missingItems.length > 0 || analysis.report.qrStatus !== 'Verified';
      status = hasMissing ? 'Action Required' : 'Under Officer Review';
    }

    const newDoc: SimpleDocument = {
      id: newId,
      title: data.title,
      documentType: data.documentType,
      collegeId: currentUser.institutionId || 'INST-4029',
      collegeName: currentUser.institutionName || 'Apex Institute of Engineering & Technology',
      uploadDate: new Date().toISOString().slice(0, 10),
      deadlineDate: data.deadlineDate,
      daysRemaining: analysis.daysRemaining,
      priority: analysis.priority,
      fileSize: data.fileSize || '3.2 MB',
      fileName: data.fileName,
      status,
      paymentAmount: feeAmount,
      paymentStatus: 'Pending Payment',
      paymentDueDate: data.deadlineDate,
      aiVerification: analysis.report,
      forgeryRejectionNotice: forgeryNotice,
      notes: data.notes,
    };

    setDocuments((prev) => [newDoc, ...prev]);

    if (isForgery) {
      showToast(`🚨 CRITICAL FORGERY DETECTED: Application ${newId} REJECTED immediately! Termination Notice sent to your Institutional Mailbox.`, 'error');
    } else {
      const hasMissing = analysis.report.missingItems.length > 0;
      showToast(
        hasMissing
          ? `Document uploaded! AI detected missing items. Regulatory fee of ₹${feeAmount.toLocaleString()} is pending.`
          : `Document uploaded! All checks passed. Fee of ₹${feeAmount.toLocaleString()} pending payment before deadline.`,
        hasMissing ? 'warning' : 'success'
      );
    }

    setAiAgentDoc(newDoc);
    setIsAiAgentModalOpen(true);

    return newDoc;
  };

  const reuploadDocument = (docId: string, newFileName: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const analysis = runAgentAnalysis(doc.documentType, doc.title, doc.deadlineDate, false, false);

          const updatedDoc: SimpleDocument = {
            ...doc,
            fileName: newFileName,
            fileSize: '3.4 MB (Corrected & Sealed)',
            status: doc.paymentStatus === 'Paid' ? 'Approved' : 'Under Officer Review',
            aiVerification: {
              ...analysis.report,
              summary: 'College re-uploaded document with authorized signature and seal affixed. All checks verified!',
            },
            officerReview: {
              officerName: 'AICTE Auto-Clearance System',
              decisionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
              decision: 'Approved',
              remarks: 'Missing items resolved. Official verification stamp issued.',
            },
          };

          setAiAgentDoc(updatedDoc);
          setIsAiAgentModalOpen(true);
          return updatedDoc;
        }
        return doc;
      })
    );

    showToast(`Corrected document uploaded! AI verified the resolved items.`, 'success');
  };

  const approveDocument = (docId: string, remarks?: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            status: 'Approved',
            officerReview: {
              officerName: currentUser.name,
              decisionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
              decision: 'Approved',
              remarks: remarks || 'All QR checks, seals, and Certification Center norms validated. Approved.',
            },
          };
        }
        return doc;
      })
    );

    showToast(`Document ${docId} approved successfully by AICTE!`, 'success');
  };

  const requestCorrection = (docId: string, remarks: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            status: 'Action Required',
            officerReview: {
              officerName: currentUser.name,
              decisionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
              decision: 'Correction Requested',
              remarks: remarks || 'Please fix the highlighted deficiencies and re-upload before deadline.',
            },
          };
        }
        return doc;
      })
    );

    showToast(`Notice sent to College! Document marked as Action Required.`, 'warning');
  };

  const payFee = (docId: string) => {
    const txnId = `TXN-AICTE-${Math.floor(100000 + Math.random() * 900000)}`;
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const updated: SimpleDocument = {
            ...doc,
            paymentStatus: 'Paid',
            paymentTransactionId: txnId,
            status: doc.status === 'Rejected - Payment Expired' ? 'Under Officer Review' : doc.status,
          };
          return updated;
        }
        return doc;
      })
    );

    showToast(`Fee payment successful! Transaction Receipt: ${txnId}`, 'success');
  };

  // Check all documents: If payment not done within expiry date, reject and generate notice to college!
  const checkAndRejectOverduePayments = (): number => {
    let rejectedCount = 0;
    setDocuments((prev) =>
      prev.map((doc) => {
        const isOverdue = doc.daysRemaining <= 0;
        const isUnpaid = doc.paymentStatus === 'Pending Payment';

        if (isOverdue && isUnpaid && doc.status !== 'Rejected - Payment Expired') {
          rejectedCount++;
          const noticeId = `REJ-PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const noticeDate = new Date().toISOString().replace('T', ' ').slice(0, 16);
          const noticeMessage = `OFFICIAL NOTICE TO COLLEGE: Application ${doc.id} (${doc.title}) has been formally REJECTED. The statutory regulatory processing fee of ₹${(doc.paymentAmount || 15000).toLocaleString()} was not received on or before the mandatory deadline of ${doc.deadlineDate}. Under AICTE Approval Process Handbook (APH 2026-27) Chapter 1 Clause 1.7, this application is terminated. Fresh application submission required in the next academic cycle.`;

          // Dispatch email to college mailbox
          sendInstitutionalEmail({
            toEmail: currentUser.email,
            toInstitutionName: doc.collegeName,
            from: 'accounts-bureau@aicte-india.org',
            subject: `⚠️ TERMINATION NOTICE: Application ${doc.id} Rejected (Non-Payment of Regulatory Fee)`,
            category: 'Payment Expired Rejection',
            documentId: doc.id,
            documentTitle: doc.title,
            regulatoryCitation: 'AICTE Approval Process Handbook (APH 2026-27) Chapter 1 Clause 1.7',
            bodyHtml: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
                <h3 style="color: #c2410c; margin-top: 0;">ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</h3>
                <p><strong>Ref No:</strong> ${noticeId}</p>
                <p><strong>To:</strong> The Principal / Institutional Head, ${doc.collegeName}</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;" />
                <p><strong>Subject:</strong> Formal Rejection Notice — Non-Payment of Statutory Regulatory Fee</p>
                <p>We regret to inform you that application <strong>${doc.id} (${doc.title})</strong> has been rejected. The prescribed regulatory fee of <strong>₹${(doc.paymentAmount || 15000).toLocaleString()}</strong> was not remitted on or before the statutory deadline of <strong>${doc.deadlineDate}</strong>.</p>
                <p>Under <strong>AICTE APH Chapter 1 Clause 1.7</strong>, applications with pending fees past cutoff cannot be processed by the Scrutiny Desk and are automatically closed.</p>
              </div>
            `,
          });

          return {
            ...doc,
            status: 'Rejected - Payment Expired',
            paymentStatus: 'Overdue & Rejected',
            paymentRejectionNotice: {
              noticeId,
              noticeDate,
              unpaidAmount: doc.paymentAmount || 15000,
              message: noticeMessage,
            },
            officerReview: {
              officerName: 'AICTE Central Finance & Accounts Wing',
              decisionDate: noticeDate,
              decision: 'Correction Requested',
              remarks: 'Application automatically rejected due to non-payment within prescribed regulatory deadline.',
            },
          };
        }
        return doc;
      })
    );

    if (rejectedCount > 0) {
      showToast(
        `🚨 ${rejectedCount} application(s) automatically REJECTED due to non-payment within expiry date! Notices dispatched to colleges.`,
        'error'
      );
    } else {
      showToast('All documents checked: No unpaid documents have exceeded their expiry date.', 'info');
    }

    return rejectedCount;
  };

  const simulateExpirePayment = (docId: string) => {
    const noticeId = `REJ-PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const noticeDate = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const noticeMessage = `OFFICIAL NOTICE TO COLLEGE: Application ${doc.id} (${doc.title}) has been formally REJECTED. The statutory regulatory processing fee of ₹${(doc.paymentAmount || 15000).toLocaleString()} was not received on or before the mandatory deadline of ${doc.deadlineDate}. Under AICTE Approval Process Handbook (APH 2026-27) Chapter 1 Clause 1.7, this application is terminated. Fresh application submission required in the next academic cycle.`;

          sendInstitutionalEmail({
            toEmail: currentUser.email,
            toInstitutionName: doc.collegeName,
            from: 'accounts-bureau@aicte-india.org',
            subject: `⚠️ TERMINATION NOTICE: Application ${doc.id} Rejected (Non-Payment of Regulatory Fee)`,
            category: 'Payment Expired Rejection',
            documentId: doc.id,
            documentTitle: doc.title,
            regulatoryCitation: 'AICTE Approval Process Handbook (APH 2026-27) Chapter 1 Clause 1.7',
            bodyHtml: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
                <h3 style="color: #c2410c; margin-top: 0;">ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</h3>
                <p><strong>Ref No:</strong> ${noticeId}</p>
                <p><strong>To:</strong> The Principal / Institutional Head, ${doc.collegeName}</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;" />
                <p><strong>Subject:</strong> Formal Rejection Notice — Non-Payment of Statutory Regulatory Fee</p>
                <p>Application <strong>${doc.id}</strong> has been rejected due to non-payment of statutory fees (₹${(doc.paymentAmount || 15000).toLocaleString()}) before cutoff.</p>
              </div>
            `,
          });

          return {
            ...doc,
            daysRemaining: 0,
            status: 'Rejected - Payment Expired',
            paymentStatus: 'Overdue & Rejected',
            paymentRejectionNotice: {
              noticeId,
              noticeDate,
              unpaidAmount: doc.paymentAmount || 15000,
              message: noticeMessage,
            },
            officerReview: {
              officerName: 'AICTE Central Finance & Accounts Wing',
              decisionDate: noticeDate,
              decision: 'Correction Requested',
              remarks: 'Application automatically rejected due to non-payment within prescribed regulatory deadline.',
            },
          };
        }
        return doc;
      })
    );

    showToast(
      `Document ${docId} simulated as expired! Non-payment rejection notice sent to Institutional Mailbox.`,
      'error'
    );
  };

  // Immediate Forgery & Anomaly Rejection
  const simulateForgeryRejection = (docId: string) => {
    const noticeId = `REJ-FRAUD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const noticeDate = new Date().toISOString().replace('T', ' ').slice(0, 16);

    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const fraudEvidence = 'Pixel manipulation detected around signature block. Document hash matches identical record filed by another institution (PID: AICTE-1-33910811). External Issuing Authority API returned Mismatch Detected.';
          const noticeMessage = `OFFICIAL NOTICE TO COLLEGE: Application ${doc.id} (${doc.title}) has been immediately REJECTED. Under AICTE Approval Process Handbook (APH 2026-27) Chapter 1 Clause 1.8, submission of fabricated, altered, or manipulated statutory certificates leads to immediate file termination and issuance of regulatory show-cause notice.`;

          sendInstitutionalEmail({
            toEmail: currentUser.email,
            toInstitutionName: doc.collegeName,
            from: 'scrutiny-bureau@aicte-india.org',
            subject: `🚨 CRITICAL TERMINATION NOTICE: Application ${doc.id} Rejected (Document Forgery / Tampering)`,
            category: 'Forgery / Tampering Rejection',
            documentId: doc.id,
            documentTitle: doc.title,
            regulatoryCitation: 'AICTE Approval Process Handbook (APH 2026-27) Chapter 1 Clause 1.8',
            bodyHtml: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
                <h3 style="color: #b91c1c; margin-top: 0;">ALL INDIA COUNCIL FOR TECHNICAL EDUCATION</h3>
                <p><strong>Ref No:</strong> ${noticeId}</p>
                <p><strong>To:</strong> The Principal / Institutional Head, ${doc.collegeName}</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;" />
                <p><strong>Subject:</strong> Immediate Rejection and Show-Cause Notice under APH Chapter 1 Clause 1.8</p>
                <p>During forensic scrutiny of <strong>${doc.id} (${doc.title})</strong>, critical anomalies and digital alterations were identified:</p>
                <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 6px; color: #991b1b; margin: 10px 0;">
                  <strong>Forensic Findings:</strong> ${fraudEvidence}
                </div>
                <p>Pursuant to <strong>AICTE APH Chapter 1 Clause 1.8</strong>, processing of this application is <strong>TERMINATED IMMEDIATELY</strong>. A formal Show-Cause Notice has been generated for regulatory action.</p>
                <p style="margin-top: 20px;"><strong>AICTE Regulation & Vigilance Bureau</strong><br/>Nelson Mandela Marg, New Delhi</p>
              </div>
            `,
          });

          return {
            ...doc,
            status: 'Rejected - Suspected Forgery / Anomaly' as const,
            forgeryRejectionNotice: {
              noticeId,
              noticeDate,
              reason: 'Digital manipulation artifacts and duplicate certificate hash detected in National Repository.',
              evidence: fraudEvidence,
              message: noticeMessage,
            },
            aiVerification: {
              ...doc.aiVerification,
              qrStatus: 'Invalid',
              signatureStatus: 'Invalid',
              sealStatus: 'Invalid',
              templateConformity: 40,
              summary: 'CRITICAL ALERT: Suspected Document Forgery & Metadata Tampering Detected. Flagged for immediate regulatory termination under AICTE APH Chapter 1 Clause 1.8.',
              issuingAuthorityCheck: {
                authorityName: doc.aiVerification.issuingAuthorityCheck?.authorityName || 'State Regulatory Portal',
                authorityType: 'Government Portal',
                status: 'Mismatch Detected',
                referenceNumber: 'SOURCE-MISMATCH-9921',
                verificationTimestamp: noticeDate,
                details: 'Source API response: Certificate Number registered under another commercial complex, NOT this educational institution.',
              },
              anomalyReport: {
                hasAnomaly: true,
                severity: 'Critical Fraud',
                pixelTamperingDetected: true,
                fontInconsistencyDetected: true,
                duplicateDocumentDetected: true,
                duplicateWithInstituteId: 'AICTE-1-33910811 (Kalinga Institute)',
                metadataDiscrepancy: {
                  softwareUsed: 'Adobe Photoshop CC 2024',
                  createdDateVsStatedDateMismatch: true,
                  details: 'PDF Creator metadata shows created on 2026-10-18 using Adobe Photoshop.',
                },
                preliminaryEvidence: fraudEvidence,
                recommendedAction: 'Immediate Rejection',
              },
            },
            officerReview: {
              officerName: 'AICTE Vigilance & Legal Cell',
              decisionDate: noticeDate,
              decision: 'Correction Requested',
              remarks: 'Terminated due to suspected forgery. Show-cause notice dispatched under Clause 1.8.',
            },
          };
        }
        return doc;
      })
    );

    showToast(
      `🚨 Document ${docId} flagged for FORGERY & immediately REJECTED! Official notice sent to Institutional Mailbox.`,
      'error'
    );
  };

  const runAiVerification = async (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    setAiAgentDoc(doc);
    setIsAiAgentModalOpen(true);
  };

  return (
    <SimpleAppContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        login,
        logout,
        switchRole,
        otpSession,
        sendEmailOtp,
        verifyOtp,
        clearOtpSession,
        institutionalEmails,
        unreadEmailCount,
        isMailboxOpen,
        setIsMailboxOpen,
        sendInstitutionalEmail,
        markEmailAsRead,
        markAllEmailsAsRead,
        documents,
        selectedDoc,
        setSelectedDoc,
        addDocument,
        reuploadDocument,
        approveDocument,
        requestCorrection,
        runAiVerification,
        payFee,
        checkAndRejectOverduePayments,
        simulateExpirePayment,
        simulateForgeryRejection,
        isUploadModalOpen,
        setIsUploadModalOpen,
        isAiAgentModalOpen,
        setIsAiAgentModalOpen,
        aiAgentDoc,
        setAiAgentDoc,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </SimpleAppContext.Provider>
  );
};


export const useApp = () => {
  const context = useContext(SimpleAppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
