import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SimpleDocument } from '../../types/verification';
import { ReuploadModal } from './ReuploadModal';
import {
  X,
  Calendar,
  Sparkles,
  QrCode,
  Stamp,
  CheckCircle2,
  AlertTriangle,
  Wand2,
  ShieldCheck,
  ArrowRight,
  UploadCloud,
  Clock,
  RotateCcw,
  CreditCard,
  Ban,
  Building,
  Building2,
  ShieldAlert,
} from 'lucide-react';


interface DocumentDetailDrawerProps {
  document: SimpleDocument | null;
  onClose: () => void;
}

export const DocumentDetailDrawer: React.FC<DocumentDetailDrawerProps> = ({
  document,
  onClose,
}) => {
  const {
    currentUser,
    approveDocument,
    requestCorrection,
    runAiVerification,
    payFee,
    simulateExpirePayment,
    simulateForgeryRejection,
  } = useApp();


  const [isReuploadOpen, setIsReuploadOpen] = useState(false);
  const [officerNotesInput, setOfficerNotesInput] = useState('');
  const [showNotesForm, setShowNotesForm] = useState(false);

  if (!document) return null;

  const report = document.aiVerification;
  const isApproved = document.status === 'Approved';
  const hasMissing = report.missingItems.length > 0 || report.qrStatus !== 'Verified';

  const getPriorityBadge = (priority: SimpleDocument['priority'], days: number) => {
    if (days <= 3) {
      return (
        <span className="bg-rose-100 text-rose-800 border border-rose-300 font-extrabold text-[11px] px-2.5 py-1 rounded-full inline-flex items-center gap-1 animate-pulse">
          <Clock className="w-3 h-3" /> Due in {days} days (Critical Urgency!)
        </span>
      );
    }
    if (days <= 7) {
      return (
        <span className="bg-amber-100 text-amber-800 border border-amber-300 font-bold text-[11px] px-2.5 py-1 rounded-full inline-flex items-center gap-1">
          <Clock className="w-3 h-3" /> Due in {days} days (High Priority)
        </span>
      );
    }
    return (
      <span className="bg-sky-100 text-[#0369A1] font-medium text-[11px] px-2.5 py-1 rounded-full inline-flex items-center gap-1">
        <Clock className="w-3 h-3" /> Due in {days} days
      </span>
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
        <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col border-l border-sky-100">
          {/* Top Bar */}
          <div className="p-5 border-b border-sky-100 bg-[#F4F9FF] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0284C7] bg-sky-100/80 px-2 py-0.5 rounded-md">
                {document.documentType}
              </span>
              <h2 className="text-base font-extrabold text-[#183153] mt-1 line-clamp-1">
                {document.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ref ID: <span className="font-mono font-bold text-slate-700">{document.id}</span> • {document.fileName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
            {/* Status & Urgency Card */}
            <div className="p-4 rounded-2xl border border-sky-200/80 bg-white shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Approval & Verification Status</span>
                {isApproved ? (
                  <span className="bg-emerald-100 text-emerald-800 font-extrabold text-xs px-3 py-1 rounded-xl inline-flex items-center gap-1.5 border border-emerald-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Approved by AICTE
                  </span>
                ) : document.status === 'Rejected - Payment Expired' ? (
                  <span className="bg-rose-600 text-white font-extrabold text-xs px-3 py-1 rounded-xl inline-flex items-center gap-1.5 shadow-xs">
                    <Ban className="w-4 h-4" />
                    Rejected (Payment Expired)
                  </span>
                ) : document.status === 'Action Required' ? (
                  <span className="bg-amber-100 text-amber-800 font-extrabold text-xs px-3 py-1 rounded-xl inline-flex items-center gap-1.5 border border-amber-300">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Action Required (Missing Items)
                  </span>
                ) : (
                  <span className="bg-sky-100 text-[#0284C7] font-bold text-xs px-3 py-1 rounded-xl inline-flex items-center gap-1.5 border border-sky-300">
                    <Clock className="w-4 h-4 text-[#0284C7]" />
                    Under Officer Review
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">Submission / Expiry Deadline</span>
                {getPriorityBadge(document.priority, document.daysRemaining)}
              </div>
            </div>

            {/* Regulatory Fee & Payment Status */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#0284C7]" />
                  <span className="font-bold text-slate-800">
                    Statutory Fee: ₹{document.paymentAmount?.toLocaleString() || '15,000'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Due on or before: <strong className="text-slate-700">{document.paymentDueDate || document.deadlineDate}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {document.paymentStatus === 'Paid' ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-300 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Paid (Txn: {document.paymentTransactionId || 'TXN-AICTE-109283'})
                  </span>
                ) : document.paymentStatus === 'Overdue & Rejected' ? (
                  <span className="bg-rose-100 text-rose-800 text-[11px] font-black px-2.5 py-1 rounded-lg border border-rose-300 inline-flex items-center gap-1">
                    <Ban className="w-3.5 h-3.5 text-rose-600" />
                    Lapsed & Overdue
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-amber-300">
                      Payment Pending
                    </span>
                    {currentUser.role === 'college' && (
                      <button
                        onClick={() => payFee(document.id)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Pay Online
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

                {/* Formal Rejection Notice to College if Expired Payment */}
            {document.status === 'Rejected - Payment Expired' && document.paymentRejectionNotice && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-xs text-amber-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold uppercase text-amber-900 flex items-center gap-1.5">
                    <Ban className="w-4 h-4 text-amber-600" />
                    Formal Termination Notice Dispatched to College (Non-Payment)
                  </span>
                  <span className="font-mono font-bold text-[10px] bg-white px-2 py-0.5 rounded border border-amber-300">
                    {document.paymentRejectionNotice.noticeId}
                  </span>
                </div>
                <p className="bg-white/90 p-3 rounded-xl border border-amber-200 leading-relaxed font-medium text-slate-800">
                  {document.paymentRejectionNotice.message}
                </p>
                <div className="text-[11px] text-amber-800 flex items-center justify-between pt-1">
                  <span>Dispatched: {document.paymentRejectionNotice.noticeDate}</span>
                  <span className="font-bold">Unpaid Fee: ₹{(document.paymentRejectionNotice.unpaidAmount || 15000).toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Formal Forgery / Tampering Rejection Notice to College */}
            {document.status === 'Rejected - Suspected Forgery / Anomaly' && document.forgeryRejectionNotice && (
              <div className="p-4 rounded-2xl bg-red-100 border-2 border-red-500 text-xs text-red-950 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold uppercase text-red-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    Critical Fraud / Alteration Termination Notice (APH Clause 1.8)
                  </span>
                  <span className="font-mono font-bold text-[10px] bg-white px-2 py-0.5 rounded border border-red-300">
                    {document.forgeryRejectionNotice.noticeId}
                  </span>
                </div>
                <p className="bg-white/90 p-3 rounded-xl border border-red-300 leading-relaxed font-medium text-slate-800">
                  {document.forgeryRejectionNotice.message}
                </p>
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-[11px] text-red-800">
                  <strong>Forensic Evidence:</strong> {document.forgeryRejectionNotice.evidence}
                </div>
                <div className="text-[11px] text-red-800 flex items-center justify-between pt-1">
                  <span>Dispatched: {document.forgeryRejectionNotice.noticeDate}</span>
                  <span className="font-bold text-red-700">Sent to Institutional Mailbox</span>
                </div>
              </div>
            )}

            {/* Issuing Authority Live Verification (PS 26261 Requirement) */}
            {report.issuingAuthorityCheck && (
              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Issuing Authority Live Verification Engine
                    </span>
                  </div>
                  <div>
                    {report.issuingAuthorityCheck.status === 'Verified by Issuing Authority' && (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified by Issuing Authority
                      </span>
                    )}
                    {report.issuingAuthorityCheck.status === 'Mismatch Detected' && (
                      <span className="bg-red-100 text-red-800 border border-red-300 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-600" /> Mismatch Detected
                      </span>
                    )}
                    {report.issuingAuthorityCheck.status === 'Expired at Source' && (
                      <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> Expired at Source
                      </span>
                    )}
                    {report.issuingAuthorityCheck.status === 'Manual Review Required' && (
                      <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" /> Manual Review Required
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-blue-100 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Authorized Source:</span>
                    <span className="font-semibold text-slate-800">{report.issuingAuthorityCheck.authorityName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reference / Certificate ID:</span>
                    <span className="font-mono font-bold text-blue-700">{report.issuingAuthorityCheck.referenceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Timestamp:</span>
                    <span className="font-mono text-slate-600">{report.issuingAuthorityCheck.verificationTimestamp}</span>
                  </div>
                  {report.issuingAuthorityCheck.sourceUrl && (
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-400">Endpoint:</span>
                      <span className="font-mono text-blue-600 truncate max-w-[280px]">
                        {report.issuingAuthorityCheck.sourceUrl}
                      </span>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                    <strong>Authority Response:</strong> {report.issuingAuthorityCheck.details}
                  </p>
                </div>
              </div>
            )}

            {/* Anomaly & Document Tampering Forensics (PS 26261 Requirement) */}
            {report.anomalyReport && (
              <div className={`p-4 rounded-2xl border space-y-3 ${
                report.anomalyReport.hasAnomaly
                  ? 'border-red-300 bg-red-50/70'
                  : 'border-slate-200 bg-slate-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={`w-4 h-4 ${report.anomalyReport.hasAnomaly ? 'text-red-600' : 'text-slate-600'}`} />
                    <span className="text-xs font-bold text-slate-800">
                      Anomaly & Document Tampering Forensics
                    </span>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    report.anomalyReport.hasAnomaly
                      ? 'bg-red-200 text-red-900 border border-red-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {report.anomalyReport.hasAnomaly ? 'Alteration Flags Detected' : 'Tamper-Free Verified'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Pixel Manipulation:</span>
                    <span className={`font-bold ${report.anomalyReport.pixelTamperingDetected ? 'text-red-600' : 'text-emerald-600'}`}>
                      {report.anomalyReport.pixelTamperingDetected ? '⚠️ Tampering Detected' : '✓ Clean Glyphs'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">National Duplicate Check:</span>
                    <span className={`font-bold ${report.anomalyReport.duplicateDocumentDetected ? 'text-red-600' : 'text-emerald-600'}`}>
                      {report.anomalyReport.duplicateDocumentDetected ? '⚠️ Duplicate Hash' : '✓ Unique Registry Hash'}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 col-span-2">
                    <span className="text-[10px] text-slate-500 block">PDF Metadata & Creation Tool:</span>
                    <span className="font-semibold text-slate-800">
                      {report.anomalyReport.metadataDiscrepancy.softwareUsed || 'Clean Standard Generator'}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {report.anomalyReport.metadataDiscrepancy.details}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700">
                  <strong>Preliminary Forensic Finding:</strong> {report.anomalyReport.preliminaryEvidence}
                </div>
              </div>
            )}

            {/* AICTE Central Record Cross-Check (PS 26261 Requirement) */}
            {report.centralRecordComparison && (
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-bold text-slate-800">
                      AICTE Central Institutional Database Cross-Check
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    PID: {report.centralRecordComparison.matchedPermanentInstituteId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Sanctioned vs Applied Intake:</span>
                    <span className="font-bold text-slate-800">
                      {report.centralRecordComparison.intakeComparison.centralApprovedIntake} Seats Approved
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">
                      ✓ {report.centralRecordComparison.intakeComparison.intakeStatus}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Faculty Cadre Ratio:</span>
                    <span className="font-bold text-slate-800">
                      Reported {report.centralRecordComparison.facultyCadreRatio.currentReportedRatio}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">
                      ✓ Mandated {report.centralRecordComparison.facultyCadreRatio.aphMandatedRatio} Compliant
                    </span>
                  </div>
                </div>
              </div>
            )}


            {/* What is Wrong / Action Required Notice (if any) */}
            {hasMissing && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-bold text-rose-900">
                      What is Wrong / Missing (Denoted to College)
                    </span>
                  </div>
                  {currentUser.role === 'college' && (
                    <button
                      onClick={() => setIsReuploadOpen(true)}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Fix & Re-upload</span>
                    </button>
                  )}
                </div>

                <div className="mt-2.5 space-y-2">
                  {report.missingItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white rounded-xl border border-rose-200 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-900">{item.title}</span>
                        <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded-sm">
                          {item.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        <strong>Missing at:</strong> {item.location}
                      </p>
                      <p className="text-[11px] text-rose-700 mt-0.5 font-medium">
                        → {item.instruction}
                      </p>
                    </div>
                  ))}

                  {report.qrStatus !== 'Verified' && (
                    <div className="p-3 bg-white rounded-xl border border-rose-200 text-xs">
                      <span className="font-bold text-rose-900">QR Code Issue:</span>
                      <p className="text-[11px] text-slate-600 mt-0.5">{report.qrDetails}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Agent Verification Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
                  <span>AI Agent Autonomous Verification Checks</span>
                </h3>
                <button
                  onClick={() => runAiVerification(document.id)}
                  className="text-xs font-bold text-[#0284C7] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-run Agent</span>
                </button>
              </div>

              {/* 4 Key Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. QR Code */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-[#0284C7]" />
                      <span>QR Code Verification</span>
                    </span>
                    {report.qrStatus === 'Verified' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                        {report.qrStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                    {report.qrDetails}
                  </p>
                </div>

                {/* 2. Signature & Seal */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Stamp className="w-4 h-4 text-[#0284C7]" />
                      <span>Institutional Seal & Sign</span>
                    </span>
                    {report.sealStatus === 'Verified' && report.signatureStatus === 'Verified' ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                        Verified
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                        Missing Items
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 leading-snug">
                    {report.sealDetails} • {report.signatureDetails}
                  </p>
                </div>

                {/* 3. Certification Center Standard Template */}
                <div className="p-4 rounded-2xl border border-sky-200 bg-linear-to-b from-sky-50/60 to-white sm:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
                      <span>Certification Center Standard Template Verification</span>
                    </span>
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0284C7] border border-sky-200">
                      {report.templateConformity}% Standard Match
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Cross-verified against: <strong className="text-slate-700">{report.templateStandard}</strong>
                  </p>

                  {/* Format Rules Checklist */}
                  <div className="space-y-2 pt-2 border-t border-sky-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Format Rules & Structural Compliance Checklist:
                    </span>
                    {(report.formatChecklist || [
                      {
                        id: 'fmt-1',
                        ruleName: 'Official Institution Letterhead & AICTE Header',
                        expectedFormat: 'Official Crest & Registered Institute Header',
                        actualStatus: 'Compliant' as const,
                        details: 'Letterhead geometry, emblem dimensions, and approval references validated.',
                      },
                      {
                        id: 'fmt-2',
                        ruleName: 'Mandatory Statutory Clauses & Appendix Schema',
                        expectedFormat: 'APH 2026-27 Certified Annexure Sequence',
                        actualStatus: 'Compliant' as const,
                        details: 'All required statutory clauses and declarations are present in the certified sequence.',
                      },
                      {
                        id: 'fmt-3',
                        ruleName: 'Date & Timestamp Notation',
                        expectedFormat: 'ISO-8601 Standard (YYYY-MM-DD)',
                        actualStatus: 'Auto-Corrected' as const,
                        details: `AI Auto-Correction engine standardized local date notation to ISO-8601 format: ${document.deadlineDate}.`,
                      },
                      {
                        id: 'fmt-4',
                        ruleName: 'Institutional Code Prefix Standard',
                        expectedFormat: 'AICTE-1-INST-[CODE] Central Taxonomy',
                        actualStatus: 'Auto-Corrected' as const,
                        details: 'AI auto-aligned local college code prefix with national database nomenclature.',
                      },
                      {
                        id: 'fmt-5',
                        ruleName: 'QR Code Payload & Checksum Format',
                        expectedFormat: 'SHA-256 Encrypted National Registry Link',
                        actualStatus: report.qrStatus === 'Verified' ? ('Compliant' as const) : ('Non-Compliant' as const),
                        details: report.qrDetails,
                      },
                      {
                        id: 'fmt-6',
                        ruleName: 'Official Seal & Signature Placement',
                        expectedFormat: 'Physical Circular Rubber Stamp + Authorized Signature',
                        actualStatus: (report.sealStatus === 'Verified' && report.signatureStatus === 'Verified') ? ('Compliant' as const) : ('Non-Compliant' as const),
                        details: `${report.sealDetails} • ${report.signatureDetails}`,
                      },
                    ]).map((rule) => (
                      <div
                        key={rule.id}
                        className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{rule.ruleName}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            <strong className="text-slate-600">Standard:</strong> {rule.expectedFormat}
                          </p>
                          <p className="text-[11px] text-slate-600 mt-0.5">{rule.details}</p>
                        </div>
                        <div className="shrink-0">
                          {rule.actualStatus === 'Compliant' && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Format Correct
                            </span>
                          )}
                          {rule.actualStatus === 'Auto-Corrected' && (
                            <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <Wand2 className="w-3 h-3 text-purple-600" />
                              Auto-Corrected
                            </span>
                          )}
                          {rule.actualStatus === 'Non-Compliant' && (
                            <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              Format Error / Missing
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Auto-Fixes Section */}
              {report.autoFixes.length > 0 && (
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-[#0284C7]" />
                    <span className="text-xs font-bold text-[#0284C7]">
                      Auto-Corrected by AI Engine ({report.autoFixes.length} text items)
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-2">
                    {report.autoFixes.map((fix) => (
                      <div
                        key={fix.id}
                        className="p-2.5 bg-white rounded-xl border border-sky-100 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{fix.field}</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                            Auto-Fixed
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 font-mono text-[11px]">
                          <span className="text-rose-500 line-through">{fix.originalValue}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                          <span className="text-emerald-600 font-bold">{fix.correctedValue}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">{fix.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Officer Review Records */}
            {document.officerReview && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Officer Decision Record
                </span>
                <p className="text-xs font-bold text-slate-800">
                  Decision by: {document.officerReview.officerName} ({document.officerReview.decisionDate})
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>Remarks:</strong> {document.officerReview.remarks}
                </p>
              </div>
            )}
          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-sky-100 bg-[#F8FAFC] flex flex-col gap-2.5">
            {/* Regulatory Demonstration Shortcuts */}
            {document.status !== 'Rejected - Suspected Forgery / Anomaly' && document.status !== 'Rejected - Payment Expired' && (
              <div className="w-full flex items-center justify-between text-xs py-1 border-b border-slate-200">
                <span className="text-[11px] font-semibold text-slate-500">Test Regulatory Scenarios:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      simulateForgeryRejection(document.id);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-bold text-[11px] border border-red-200 transition cursor-pointer inline-flex items-center gap-1"
                    title="Simulate immediate rejection under APH Clause 1.8 with notice to college"
                  >
                    <ShieldAlert className="w-3 h-3 text-red-600" /> Test Forgery Rejection
                  </button>
                  <button
                    onClick={() => {
                      simulateExpirePayment(document.id);
                      onClose();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold text-[11px] border border-amber-200 transition cursor-pointer inline-flex items-center gap-1"
                    title="Simulate non-payment expiry termination"
                  >
                    <Ban className="w-3 h-3 text-amber-600" /> Test Payment Expiry
                  </button>
                </div>
              </div>
            )}

            {currentUser.role === 'college' ? (
              <div className="w-full flex items-center justify-between">

                {document.status === 'Action Required' ? (
                  <button
                    onClick={() => setIsReuploadOpen(true)}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Re-upload Corrected File (Resolve Deficiencies)</span>
                  </button>
                ) : (
                  <div className="text-xs text-slate-500">
                    No pending action required from college.
                  </div>
                )}
              </div>
            ) : (
              // AICTE Officer Controls
              <div className="w-full space-y-2">
                {!showNotesForm ? (
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      onClick={() => setShowNotesForm(true)}
                      className="px-3.5 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer"
                    >
                      Request Correction
                    </button>
                    {!isApproved && (
                      <button
                        onClick={() => {
                          approveDocument(document.id);
                          onClose();
                        }}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>One-Click Approve</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      rows={2}
                      value={officerNotesInput}
                      onChange={(e) => setOfficerNotesInput(e.target.value)}
                      placeholder="Specify deficiency notes to send to the college..."
                      className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setShowNotesForm(false)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          requestCorrection(document.id, officerNotesInput || 'Please address missing seal/signatures.');
                          setShowNotesForm(false);
                          onClose();
                        }}
                        className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                      >
                        Send Deficiency Notice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isReuploadOpen && (
        <ReuploadModal
          document={document}
          onClose={() => setIsReuploadOpen(false)}
        />
      )}
    </>
  );
};
