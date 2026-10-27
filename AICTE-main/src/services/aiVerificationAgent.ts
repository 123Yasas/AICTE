import {
  DocumentCategory,
  SimpleDocument,
  AiVerificationReport,
  AutoFixItem,
  MissingItem,
  CheckResult,
  FormatRuleCheck,
  IssuingAuthorityCheck,
  AnomalyReport,
  CentralRecordComparison,
} from '../types/verification';
import { calculateDaysRemaining, determinePriority } from '../data/simpleMockData';

export interface AgentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'warning' | 'failed';
  details?: string;
  durationMs: number;
}

export const AGENT_STEPS: AgentStep[] = [
  {
    id: 'step-ocr',
    name: 'Document Ingestion & OCR',
    description: 'Scanning document text, structural layout, and extracting metadata fields',
    status: 'pending',
    durationMs: 600,
  },
  {
    id: 'step-qr',
    name: 'QR Code & Digital Signature Check',
    description: 'Decoding QR payload and matching cryptographic checksum with National Registry',
    status: 'pending',
    durationMs: 700,
  },
  {
    id: 'step-authority',
    name: 'Issuing Authority Live Cross-Verification',
    description: 'Querying official issuing portal API (DigiLocker, State Fire Authority, University API, NBA)',
    status: 'pending',
    durationMs: 800,
  },
  {
    id: 'step-forensics',
    name: 'Anomaly & Document Tampering Forensics',
    description: 'Detecting pixel manipulation, duplicated document hashes, and metadata discrepancies',
    status: 'pending',
    durationMs: 800,
  },
  {
    id: 'step-central-records',
    name: 'AICTE Central Institutional Record Cross-Check',
    description: 'Comparing intake, past EoA status, and faculty cadre ratios against central database',
    status: 'pending',
    durationMs: 600,
  },
  {
    id: 'step-autofix',
    name: 'AI Auto-Correction Engine',
    description: 'Automatically repairing fixable textual discrepancies and date format standards',
    status: 'pending',
    durationMs: 500,
  },
  {
    id: 'step-priority',
    name: 'Urgency Ranking & Scrutiny Filing',
    description: 'Computing regulatory deadline urgency score and logging audit trail',
    status: 'pending',
    durationMs: 400,
  },
];

export function runAgentAnalysis(
  category: DocumentCategory,
  title: string,
  deadlineDate: string,
  simulateDefects: boolean = false,
  simulateForgery: boolean = false
): { report: AiVerificationReport; priority: SimpleDocument['priority']; daysRemaining: number } {
  const daysRemaining = calculateDaysRemaining(deadlineDate);
  const priority = determinePriority(daysRemaining);

  const autoFixes: AutoFixItem[] = [
    {
      id: `fix-${Date.now()}-1`,
      field: 'Regulatory Date Formatting',
      originalValue: deadlineDate.split('-').reverse().join('/'),
      correctedValue: deadlineDate,
      explanation: 'AI standardized timestamp notation to ISO-8601 specification required by central DB.',
    },
    {
      id: `fix-${Date.now()}-2`,
      field: 'Institutional Entity Identifier',
      originalValue: 'INST-4029-REG',
      correctedValue: 'AICTE-1-INST-4029',
      explanation: 'Normalized institutional prefix to match AICTE Central Portal schema.',
    },
  ];

  let qrStatus: CheckResult = 'Verified';
  let qrDetails = 'Cryptographic QR Code verified against Central Verification Registry.';
  let sealStatus: CheckResult = 'Verified';
  let sealDetails = 'Official Institutional Circular Rubber Stamp detected and verified.';
  let signatureStatus: CheckResult = 'Verified';
  let signatureDetails = 'Principal & Authorized Signatory digital signature verified.';
  let templateConformity = 96;
  const missingItems: MissingItem[] = [];

  // 1. Issuing Authority Live Verification by Category
  let issuingAuthorityCheck: IssuingAuthorityCheck;
  switch (category) {
    case 'Fire & Campus Safety Clearance':
      issuingAuthorityCheck = {
        authorityName: 'State Fire & Emergency Services Portal',
        authorityType: 'Government Portal',
        status: simulateForgery ? 'Mismatch Detected' : 'Verified by Issuing Authority',
        referenceNumber: 'FIRE-NOC-DL-2026-9021',
        verificationTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        sourceUrl: 'https://firesafety.gov.in/api/v2/verify/FIRE-NOC-DL-2026-9021',
        details: simulateForgery
          ? 'Source API response: Certificate Number registered under another commercial complex (Reg ID: COM-8819), NOT this educational institution.'
          : 'Live API response: Valid Category-A Educational Fire Safety NOC issued on 2025-04-12, valid through 2027-04-11.',
        matchedRecord: {
          recordHolder: 'Apex Institute of Engineering & Technology',
          issueDate: '2025-04-12',
          expiryDate: '2027-04-11',
          validityScore: '99.4% Match',
        },
      };
      break;
    case 'Institutional Accreditation & EoA':
      issuingAuthorityCheck = {
        authorityName: 'National Board of Accreditation (NBA) Registry API',
        authorityType: 'National Registry',
        status: simulateDefects ? 'Manual Review Required' : 'Verified by Issuing Authority',
        referenceNumber: 'NBA-TIER1-ENG-2026',
        verificationTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        sourceUrl: 'https://nbaind.org/api/accreditation/verify/NBA-TIER1-ENG-2026',
        details: simulateDefects
          ? 'External NBA database pinged: Extension status is under Tier-1 scrutiny committee review.'
          : 'Verified at source: CSE, ECE & Mechanical departments Tier-1 Accredited with score 682/1000.',
        matchedRecord: {
          recordHolder: 'Apex Institute of Engineering & Technology',
          issueDate: '2024-06-01',
          expiryDate: '2027-06-30',
          validityScore: '100% Match',
        },
      };
      break;
    case 'Infrastructure & Land Deed':
      issuingAuthorityCheck = {
        authorityName: 'DigiLocker / National Land Records Modernization Programme (NLRMP)',
        authorityType: 'Digital Repository',
        status: 'Verified by Issuing Authority',
        referenceNumber: 'DL-DEED-REG-48910',
        verificationTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        sourceUrl: 'https://digilocker.gov.in/api/v1/landrecords/DL-DEED-REG-48910',
        details: 'Title Deed cryptographically cross-verified against State Revenue & Land Survey Sub-Registrar repository.',
        matchedRecord: {
          recordHolder: 'Apex Educational Trust (Registered 1998)',
          issueDate: '1998-11-20',
          expiryDate: 'Perpetual Freehold (12.4 Acres)',
          validityScore: 'Authentic Digital Seal',
        },
      };
      break;
    case 'Faculty Cadre & Ratio Approval':
      issuingAuthorityCheck = {
        authorityName: 'AICTE Central Faculty Portal & Aadhaar UIDAI Vault',
        authorityType: 'API',
        status: 'Verified by Issuing Authority',
        referenceNumber: 'AICTE-FAC-RATIO-9912',
        verificationTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        sourceUrl: 'https://faculty.aicte-india.org/api/scrutiny/cadre-check',
        details: 'All 84 faculty records cross-matched against Aadhaar-seeded central registry. Zero ghost faculty detected.',
        matchedRecord: {
          recordHolder: 'Apex Institute of Engineering & Technology (Faculty Register)',
          issueDate: '2026-01-15',
          validityScore: '1:15 Approved Cadre Ratio',
        },
      };
      break;
    case 'Semester Examination Center Request':
      issuingAuthorityCheck = {
        authorityName: 'Affiliating State Technical University Controller of Examinations',
        authorityType: 'API',
        status: 'Verified by Issuing Authority',
        referenceNumber: 'UNIV-COE-EXAM-2026-33',
        verificationTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        sourceUrl: 'https://university-portal.ac.in/api/exam-centers/verify',
        details: 'CCTV surveillance server link and safe locker room compliance certified by University Examination Observer.',
      };
      break;
    default:
      issuingAuthorityCheck = {
        authorityName: 'National Scholarship Portal (NSP) / PFMS Central Gateway',
        authorityType: 'Government Portal',
        status: 'Verified by Issuing Authority',
        referenceNumber: 'NSP-INST-GATEWAY-7731',
        verificationTimestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        sourceUrl: 'https://scholarships.gov.in/api/v3/institution/verify',
        details: 'Institutional nodal officer credentials and DBT bank mandate confirmed by Public Financial Management System (PFMS).',
      };
  }

  // 2. Anomaly & Document Forgery Forensics
  let anomalyReport: AnomalyReport;
  if (simulateForgery) {
    qrStatus = 'Invalid';
    qrDetails = 'Embedded QR code payload points to counterfeit domain (not aicte-india.org).';
    signatureStatus = 'Invalid';
    signatureDetails = 'Digital signature certificate revoked / forged self-signed certificate.';
    templateConformity = 45;

    anomalyReport = {
      hasAnomaly: true,
      severity: 'Critical Fraud',
      pixelTamperingDetected: true,
      fontInconsistencyDetected: true,
      duplicateDocumentDetected: true,
      duplicateWithInstituteId: 'AICTE-1-33910811 (Kalinga Institute)',
      metadataDiscrepancy: {
        softwareUsed: 'Adobe Photoshop CC 24.1 (Windows) / Modified ImageMagick Script',
        createdDateVsStatedDateMismatch: true,
        details: 'PDF Creator metadata shows created on 2026-10-18 using Adobe Photoshop. Face of certificate falsely states issued on 2022-03-10 by Municipal Authority.',
      },
      identifierMismatch: {
        panAadhaarMatch: false,
        aictePidMatch: false,
        details: 'Permanent Institute ID in document text (AICTE-1-9982) does not match applicant login PID (AICTE-1-4029).',
      },
      preliminaryEvidence: 'CRITICAL FORGERY DETECTED: Pixel cloning and Gaussian noise inconsistency detected around official signature block. Duplicate document hash matches an identical certificate submitted by a different institution in the Central Registry.',
      recommendedAction: 'Immediate Rejection',
    };
  } else {
    anomalyReport = {
      hasAnomaly: false,
      severity: 'None',
      pixelTamperingDetected: false,
      fontInconsistencyDetected: false,
      duplicateDocumentDetected: false,
      metadataDiscrepancy: {
        softwareUsed: 'AICTE Approved Digital PDF Generator / LibreOffice 24.2',
        createdDateVsStatedDateMismatch: false,
        details: 'Document creation timestamps and revision counters correlate exactly with official application timeline.',
      },
      identifierMismatch: {
        panAadhaarMatch: true,
        aictePidMatch: true,
        details: 'Permanent Institute ID (AICTE-1-4029) matches institutional registry and GSTIN/PAN records.',
      },
      preliminaryEvidence: 'Zero evidence of pixel manipulation, font splicing, or metadata tampering. Document structure confirmed authentic.',
      recommendedAction: 'Cleared',
    };
  }

  // 3. Central AICTE Institutional Record Cross-Check
  const centralRecordComparison: CentralRecordComparison = {
    matchedPermanentInstituteId: 'AICTE-1-40291823',
    previousYearApprovalStatus: 'EoA Granted (No Deficiency)',
    intakeComparison: {
      centralApprovedIntake: 300,
      applicationAppliedIntake: 300,
      intakeStatus: 'Within Sanctioned Quota',
    },
    facultyCadreRatio: {
      currentReportedRatio: '1:15',
      aphMandatedRatio: '1:15',
      status: 'Compliant',
    },
    pastDeficiencyNotes: 'Institution maintained 100% compliance in Academic Year 2025-26 with zero punitive notices.',
  };

  if (simulateDefects && !simulateForgery) {
    if (category === 'Scholarship Application') {
      signatureStatus = 'Missing';
      signatureDetails = 'Declaration signature missing on Page 4.';
      sealStatus = 'Missing';
      sealDetails = 'Institutional Stamp missing on Annexure C.';
      templateConformity = 82;
      missingItems.push(
        {
          id: `miss-${Date.now()}-1`,
          title: 'Authorized Dean / Principal Signature',
          location: 'Page 4, Section 5: "Institutional Head Undertaking"',
          severity: 'Critical',
          instruction: 'The head of the institution must sign the declaration before submission.',
        },
        {
          id: `miss-${Date.now()}-2`,
          title: 'Official College Notary Stamp',
          location: 'Page 3, Bottom Right (Annexure C)',
          severity: 'High',
          instruction: 'Institutional circular rubber stamp must be visibly imprinted over the date line.',
        }
      );
    } else if (category === 'Institutional Accreditation & EoA') {
      qrStatus = 'Invalid';
      qrDetails = 'QR Code checksum mismatch: links to outdated 2024 portal instead of 2026 national registry.';
      signatureStatus = 'Missing';
      signatureDetails = 'Affiliating University Registrar Counter-Signature missing on page 8.';
      templateConformity = 79;
      missingItems.push(
        {
          id: `miss-${Date.now()}-3`,
          title: 'Valid 2026 Digital QR Code',
          location: 'Page 1, Top Header',
          severity: 'Critical',
          instruction: 'Regenerate the application PDF with the live 2026 AICTE registry QR code.',
        },
        {
          id: `miss-${Date.now()}-4`,
          title: 'Affiliating University Endorsement Signature',
          location: 'Page 8 (Clause 4.2 - University NOC)',
          severity: 'Critical',
          instruction: 'Affiliating University Registrar must countersign before EoA can be granted.',
        }
      );
    } else {
      sealStatus = 'Missing';
      sealDetails = 'Institutional Rubber Stamp missing on submission endorsement page.';
      templateConformity = 85;
      missingItems.push({
        id: `miss-${Date.now()}-5`,
        title: 'Institutional Stamp / Notary Seal',
        location: 'Final Endorsement Page',
        severity: 'High',
        instruction: 'Affix the official college seal and re-upload the document.',
      });
    }
  }

  const hasErrors = missingItems.length > 0 || qrStatus !== 'Verified' || simulateForgery;
  const overallScore = simulateForgery ? 38 : hasErrors ? templateConformity - 15 : templateConformity;

  let summary: string;
  if (simulateForgery) {
    summary = 'CRITICAL ALERT: Suspected Document Forgery & Metadata Tampering Detected. Flagged for immediate regulatory termination and Show-Cause notice under AICTE APH Chapter 1 Clause 1.8.';
  } else if (hasErrors) {
    summary = `Action required: ${missingItems.length} missing item(s) detected. Minor text formatting was auto-corrected by AI.`;
  } else {
    summary = `Verification complete: All QR codes, signatures, seals, issuing authority APIs, and AICTE central records validated (${overallScore}% conformity).`;
  }

  const formatChecklist: FormatRuleCheck[] = [
    {
      id: 'fmt-1',
      ruleName: 'Official Institution & AICTE Letterhead Layout',
      expectedFormat: 'Official Crest, Affiliation Number, and Registered Institution Header (Clause 1.2)',
      actualStatus: 'Compliant',
      details: 'Letterhead geometry, emblem dimensions, and AICTE approval reference format validated against national schema.',
    },
    {
      id: 'fmt-2',
      ruleName: 'Mandatory Statutory Clauses & Appendix Schema',
      expectedFormat: `National Certification Standard Schema v2026 for ${category}`,
      actualStatus: 'Compliant',
      details: 'All required legal declarations, indemnities, and procedural annexures are present in the correct order.',
    },
    {
      id: 'fmt-3',
      ruleName: 'Date & Timestamp Standard Format',
      expectedFormat: 'ISO-8601 Central Standard (YYYY-MM-DD)',
      actualStatus: 'Auto-Corrected',
      details: `AI Auto-Correction engine standardized local date notation to ISO-8601 format: ${deadlineDate}.`,
    },
    {
      id: 'fmt-4',
      ruleName: 'Institutional Code Prefix Standard',
      expectedFormat: 'AICTE-1-INST-[CODE] Central Taxonomy',
      actualStatus: 'Auto-Corrected',
      details: 'AI auto-aligned local college code prefix with national database nomenclature.',
    },
    {
      id: 'fmt-5',
      ruleName: 'Cryptographic QR Code Format & Checksum',
      expectedFormat: 'Encrypted SHA-256 payload pointing to current 2026 Central Verification Registry',
      actualStatus: qrStatus === 'Verified' ? 'Compliant' : 'Non-Compliant',
      details: qrDetails,
    },
    {
      id: 'fmt-6',
      ruleName: 'Official Seal & Authorized Signatory Block',
      expectedFormat: 'Physical Circular Rubber Stamp + Authorized Signatory Signature on Declarations',
      actualStatus: (sealStatus === 'Verified' && signatureStatus === 'Verified') ? 'Compliant' : 'Non-Compliant',
      details: `${sealDetails} • ${signatureDetails}`,
    },
  ];

  const report: AiVerificationReport = {
    qrStatus,
    qrDetails,
    sealStatus,
    sealDetails,
    signatureStatus,
    signatureDetails,
    templateConformity: overallScore,
    templateStandard: `National Certification Standard Schema v2026 for ${category}`,
    formatChecklist,
    autoFixes,
    missingItems,
    overallScore,
    summary,
    analyzedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
    issuingAuthorityCheck,
    anomalyReport,
    centralRecordComparison,
  };

  return { report, priority, daysRemaining };
}

