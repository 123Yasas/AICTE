export type DocumentCategory =
  | 'Scholarship Application'
  | 'Research & Project Grant'
  | 'Semester Examination Center Request'
  | 'Institutional Accreditation & EoA'
  | 'Fire & Campus Safety Clearance'
  | 'Faculty Cadre & Ratio Approval'
  | 'Infrastructure & Land Deed';

export type VerificationPriority = 'Critical' | 'High' | 'Medium' | 'Standard';

export type DocumentStatus =
  | 'Approved'
  | 'Action Required'
  | 'AI Verifying'
  | 'Under Officer Review'
  | 'Rejected - Payment Expired'
  | 'Rejected - Suspected Forgery / Anomaly';

export type PaymentStatus = 'Paid' | 'Pending Payment' | 'Overdue & Rejected';

export type CheckResult = 'Verified' | 'Missing' | 'Invalid';

// Issuing Authority Live Verification (PS 26261 Requirement)
export type IssuingAuthorityStatus =
  | 'Verified by Issuing Authority'
  | 'Mismatch Detected'
  | 'Expired at Source'
  | 'Source Unavailable'
  | 'Manual Review Required';

export interface IssuingAuthorityCheck {
  authorityName: string; // e.g. "DigiLocker / NAD", "State Fire & Emergency Services", "Affiliating University (AKTU/Anna Univ)", "NBA / NAAC Portal"
  authorityType: 'API' | 'Digital Repository' | 'Government Portal' | 'National Registry';
  status: IssuingAuthorityStatus;
  referenceNumber: string;
  verificationTimestamp: string;
  sourceUrl?: string;
  details: string;
  matchedRecord?: {
    recordHolder: string;
    issueDate: string;
    expiryDate?: string;
    validityScore?: string;
  };
}

// Anomaly & Document Tampering Forensics (PS 26261 Requirement)
export type AnomalySeverity = 'Critical Fraud' | 'Suspicious Alteration' | 'Metadata Discrepancy' | 'None';

export interface AnomalyReport {
  hasAnomaly: boolean;
  severity: AnomalySeverity;
  pixelTamperingDetected: boolean;
  fontInconsistencyDetected: boolean;
  duplicateDocumentDetected: boolean;
  duplicateWithInstituteId?: string;
  metadataDiscrepancy: {
    softwareUsed?: string; // e.g. "Adobe Photoshop CC 2024" or "Clean Scanner/PDF Export"
    createdDateVsStatedDateMismatch: boolean;
    details: string;
  };
  identifierMismatch?: {
    panAadhaarMatch: boolean;
    aictePidMatch: boolean;
    details: string;
  };
  preliminaryEvidence: string;
  recommendedAction: 'Immediate Rejection' | 'Officer Manual Review' | 'Cleared';
}

// Cross-checking against existing AICTE Central Records (PS 26261 Requirement)
export interface CentralRecordComparison {
  matchedPermanentInstituteId: string;
  previousYearApprovalStatus: 'EoA Granted (No Deficiency)' | 'EoA Granted (Minor Observations)' | 'Under Scrutiny';
  intakeComparison: {
    centralApprovedIntake: number;
    applicationAppliedIntake: number;
    intakeStatus: 'Within Sanctioned Quota' | 'Excess Intake Requested (Additional NOC Required)' | 'Reduced Intake';
  };
  facultyCadreRatio: {
    currentReportedRatio: string;
    aphMandatedRatio: string; // "1:15"
    status: 'Compliant' | 'Marginal Deficit' | 'Non-Compliant';
  };
  pastDeficiencyNotes: string;
}

// Formal Institutional Email Message System
export interface InstitutionalEmailMessage {
  id: string;
  toEmail: string;
  toInstitutionName: string;
  from: string; // e.g. "scrutiny-bureau@aicte-india.org"
  subject: string;
  category: 'OTP' | 'Payment Expired Rejection' | 'Forgery / Tampering Rejection' | 'Deficiency Notice' | 'Approval Notice';
  date: string;
  read: boolean;
  documentId?: string;
  documentTitle?: string;
  bodyHtml: string;
  regulatoryCitation?: string;
}

export interface AutoFixItem {
  id: string;
  field: string;
  originalValue: string;
  correctedValue: string;
  explanation: string;
}

export interface MissingItem {
  id: string;
  title: string;
  location: string;
  severity: 'Critical' | 'High';
  instruction: string;
}

export interface FormatRuleCheck {
  id: string;
  ruleName: string;
  expectedFormat: string;
  actualStatus: 'Compliant' | 'Auto-Corrected' | 'Non-Compliant';
  details: string;
}

export interface AiVerificationReport {
  qrStatus: CheckResult;
  qrDetails: string;
  sealStatus: CheckResult;
  sealDetails: string;
  signatureStatus: CheckResult;
  signatureDetails: string;
  templateConformity: number; // percentage, e.g. 96
  templateStandard: string;
  formatChecklist?: FormatRuleCheck[];
  autoFixes: AutoFixItem[];
  missingItems: MissingItem[];
  overallScore: number;
  summary: string;
  analyzedAt: string;

  // PS 26261 Enhancements
  issuingAuthorityCheck?: IssuingAuthorityCheck;
  anomalyReport?: AnomalyReport;
  centralRecordComparison?: CentralRecordComparison;
}

export interface OfficerReviewRecord {
  officerName: string;
  decisionDate: string;
  decision: 'Approved' | 'Correction Requested';
  remarks: string;
}

export interface SimpleDocument {
  id: string;
  title: string;
  documentType: DocumentCategory;
  collegeId: string;
  collegeName: string;
  uploadDate: string;
  deadlineDate: string;
  daysRemaining: number;
  priority: VerificationPriority;
  fileSize: string;
  fileName: string;
  fileUrl?: string;
  status: DocumentStatus;
  paymentAmount: number;
  paymentStatus: PaymentStatus;
  paymentDueDate: string;
  paymentTransactionId?: string;
  paymentRejectionNotice?: {
    noticeDate: string;
    noticeId: string;
    unpaidAmount: number;
    message: string;
  };
  forgeryRejectionNotice?: {
    noticeDate: string;
    noticeId: string;
    reason: string;
    evidence: string;
    message: string;
  };
  aiVerification: AiVerificationReport;
  officerReview?: OfficerReviewRecord;
  notes?: string;
}

export interface SimpleUser {
  id: string;
  name: string;
  email: string;
  role: 'college' | 'aicte';
  institutionId?: string;
  institutionName?: string;
  designation: string;
  avatar: string;
}

