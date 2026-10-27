export * from './verification';

export type UserRole = 'institution' | 'officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institutionId?: string;
  institutionName?: string;
  designation: string;
  avatar: string;
}

export type ApplicationCategory =
  | 'Extension of Approval (EoA)'
  | 'Approval-related Change'
  | 'New Technical Institution'
  | 'Introduction of New Course / Division'
  | 'Closure of Program / Course'
  | 'Institution Information Update';

export type ValidationStatus =
  | 'Preliminary Checks Complete'
  | 'Attention Required'
  | 'Manual Review Required'
  | 'Verification Pending'
  | 'Additional Evidence Required'
  | 'Under Officer Review'
  | 'Deficiencies Found'
  | 'Correction Submitted'
  | 'Recommended for Approval';

export type VerificationStatus =
  | 'Verified'
  | 'Mismatch Detected'
  | 'Expired'
  | 'Verification Pending'
  | 'Source Unavailable'
  | 'Manual Review Required'
  | 'Not Yet Checked';

export type ComplianceStatus =
  | 'Meets Configured Rules'
  | 'Potential Gap Identified'
  | 'Insufficient Evidence'
  | 'Verification Pending'
  | 'Manual Review Required';

export interface DocumentItem {
  id: string;
  name: string;
  category: string;
  fileType: 'pdf' | 'png' | 'jpg' | 'jpeg';
  fileSize: string;
  uploadDate: string;
  ocrStatus: 'Completed' | 'Processing' | 'Needs Review' | 'Failed';
  ocrConfidence: number;
  extractedFields: Record<string, string>;
  verificationStatus: VerificationStatus;
  verificationMethod?: string;
  verificationSource?: string;
  verificationTimestamp?: string;
  expiryDate?: string;
  isMandatory: boolean;
  pageCount: number;
  anomaliesCount: number;
  fileHash: string;
  hasReplacement?: boolean;
  replacementDate?: string;
  originalName?: string;
}

export interface ValidationFinding {
  id: string;
  documentId: string;
  documentName: string;
  fieldOrPage: string;
  extractedValue: string;
  comparisonValue: string;
  ruleApplied: string;
  ruleId: string;
  explanation: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Passed' | 'Attention Required' | 'Failed Rule Check' | 'Manual Review Required';
  recommendedAction: string;
  officerReviewStatus?: 'Pending' | 'Confirmed' | 'Dismissed' | 'Under Investigation';
  officerComment?: string;
}

export interface AnomalyFinding {
  id: string;
  documentId: string;
  documentName: string;
  category:
    | 'Duplicate Document Upload'
    | 'Repeated Document Hash'
    | 'Suspicious Metadata'
    | 'Unusual Modification History'
    | 'Conflicting Dates'
    | 'Mismatched Identifiers'
    | 'Potentially Altered Region'
    | 'Cross-Document Font Mismatch';
  reason: string;
  evidence: string;
  detectionMethod:
    | 'File Hashing (SHA-256)'
    | 'PDF Metadata Inspection'
    | 'OpenCV Image Analysis'
    | 'OCR Comparison'
    | 'Cross-Document Comparison';
  confidence: number;
  severity: 'Low concern' | 'Needs Attention' | 'High-Priority Review';
  affectedRegion?: {
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  officerReviewStatus: 'Pending' | 'Confirmed' | 'Dismissed' | 'Forwarded for Scrutiny';
  officerNotes?: string;
}

export interface ComplianceCheckItem {
  id: string;
  ruleId: string;
  category: string;
  requirementDescription: string;
  requiredEvidence: string;
  submittedEvidence: string;
  outcome:
    | 'Meets Configured Rule'
    | 'Potential Gap Identified'
    | 'Insufficient Evidence'
    | 'Verification Pending'
    | 'Not Applicable'
    | 'Manual Review Required';
  evidenceDocId?: string;
  reviewerComment?: string;
  recommendedAction: string;
}

export interface InfrastructureAsset {
  id: string;
  title: string;
  category: 'Classroom' | 'Computer Lab' | 'Mechanical Workshop' | 'Physics & Chemistry Lab' | 'Central Library' | 'Seminar Hall' | 'Floor Plan';
  imageUrl: string;
  uploadDate: string;
  aiCategoryDetected: string;
  aiConfidence: number;
  aiObservations: string[];
  applicableRule: string;
  potentialDiscrepancies: string[];
  qualityScore: 'High' | 'Moderate' | 'Poor';
  status: 'Accepted' | 'Request Additional' | 'Flagged for Review' | 'Recommend Physical Inspection';
  reviewerComment?: string;
}

export interface DeficiencyItem {
  id: string;
  applicationId: string;
  category: string;
  description: string;
  evidence: string;
  applicableRule: string;
  requiredCorrection: string;
  responsibleParty: string;
  dateIdentified: string;
  dueDate: string;
  status:
    | 'Open'
    | 'Correction Submitted'
    | 'Under Review'
    | 'Resolved'
    | 'Not Resolved'
    | 'Escalated'
    | 'Closed by Authorized Reviewer';
  reviewerComments?: string;
  replacementDocId?: string;
}

export interface Application {
  id: string;
  institutionId: string;
  institutionName: string;
  category: ApplicationCategory;
  academicYear: string;
  submissionDate: string;
  status: ValidationStatus;
  validationStatus: 'Passed' | 'Attention Required' | 'Failed Rule Check' | 'Manual Review Required';
  verificationStatus: VerificationStatus;
  complianceStatus: ComplianceStatus;
  assignedOfficer: string;
  officerNotes?: string;
  address: string;
  state: string;
  district: string;
  contactEmail: string;
  contactPhone: string;
  approvedProgrammes: string[];
  totalIntake: number;
  facultyCount: number;
  landAreaAcres: number;
  builtUpAreaSqMeters: number;
  documents: DocumentItem[];
  findings: ValidationFinding[];
  anomalies: AnomalyFinding[];
  complianceChecks: ComplianceCheckItem[];
  infrastructureAssets: InfrastructureAsset[];
  deficiencies: DeficiencyItem[];
  lastModified: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  applicationId: string;
  object: string;
  previousValue?: string;
  newValue?: string;
  evidenceReference?: string;
  outcome: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  category: 'Document' | 'Validation' | 'Anomaly' | 'Deficiency' | 'Officer' | 'System';
  severity: 'Info' | 'Warning' | 'Error' | 'Success';
  applicationId?: string;
  link?: string;
}

export interface RegulatoryRule {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  validationLogic: string;
  requiredEvidence: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  sourceHandbook: string;
  version: string;
  effectiveDate: string;
  isActive: boolean;
}
