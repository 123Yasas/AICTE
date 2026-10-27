import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SimpleDocument } from '../types/verification';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Stamp,
  Sparkles,
  Eye,
  Filter,
  FileText,
  Building2,
  Wand2,
  Ban,
  CreditCard,
  AlertCircle,
  ShieldAlert,
  Building,
} from 'lucide-react';

export const AicteView: React.FC = () => {
  const {
    currentUser,
    documents,
    approveDocument,
    requestCorrection,
    setSelectedDoc,
    runAiVerification,
    searchQuery,
    checkAndRejectOverduePayments,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'expiring' | 'ready' | 'deficiencies' | 'rejected' | 'forgery' | 'all'>('expiring');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState<string>('');

  // Sort documents by deadline urgency (daysRemaining ascending) so expiring projects are prioritized!
  const sortedDocs = [...documents].sort((a, b) => {
    // Non-approved urgent docs come first
    if (a.status !== 'Approved' && b.status === 'Approved') return -1;
    if (a.status === 'Approved' && b.status !== 'Approved') return 1;
    return a.daysRemaining - b.daysRemaining;
  });

  const filteredDocs = sortedDocs.filter((doc) => {
    const matchesSearch =
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.collegeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (categoryFilter !== 'all' && doc.documentType !== categoryFilter) {
      return false;
    }

    if (activeTab === 'expiring') {
      return doc.daysRemaining <= 7 && doc.status !== 'Approved' && doc.status !== 'Rejected - Payment Expired' && doc.status !== 'Rejected - Suspected Forgery / Anomaly';
    }
    if (activeTab === 'ready') {
      return doc.status === 'Under Officer Review' || (doc.status !== 'Approved' && doc.aiVerification.missingItems.length === 0 && doc.status !== 'Rejected - Payment Expired' && doc.status !== 'Rejected - Suspected Forgery / Anomaly');
    }
    if (activeTab === 'deficiencies') {
      return doc.status === 'Action Required' || doc.aiVerification.missingItems.length > 0;
    }
    if (activeTab === 'rejected') {
      return doc.status === 'Rejected - Payment Expired';
    }
    if (activeTab === 'forgery') {
      return doc.status === 'Rejected - Suspected Forgery / Anomaly';
    }

    return true;
  });

  // Basic counters
  const totalCount = documents.length;
  const expiringCount = documents.filter(
    (d) => d.daysRemaining <= 7 && d.status !== 'Approved' && d.status !== 'Rejected - Payment Expired' && d.status !== 'Rejected - Suspected Forgery / Anomaly'
  ).length;
  const readyCount = documents.filter(
    (d) => d.status === 'Under Officer Review' || (d.status !== 'Approved' && d.aiVerification.missingItems.length === 0 && d.status !== 'Rejected - Payment Expired' && d.status !== 'Rejected - Suspected Forgery / Anomaly')
  ).length;
  const deficiencyCount = documents.filter(
    (d) => d.status === 'Action Required' || docHasDeficiencies(d)
  ).length;
  const rejectedCount = documents.filter((d) => d.status === 'Rejected - Payment Expired').length;
  const forgeryCount = documents.filter((d) => d.status === 'Rejected - Suspected Forgery / Anomaly').length;

  function docHasDeficiencies(d: SimpleDocument) {
    return d.aiVerification.missingItems.length > 0 && d.status !== 'Rejected - Payment Expired' && d.status !== 'Rejected - Suspected Forgery / Anomaly';
  }

  return (
    <div className="space-y-6 text-left">
      {/* Scrutiny Header */}
      <div className="bg-linear-to-r from-[#0284C7]/15 via-[#29B6F6]/15 to-sky-100/40 p-6 rounded-3xl border border-sky-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
              AICTE National Scrutiny Desk
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#183153] mt-1 tracking-tight">
            Automated Regulatory Verification Queue
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active Scrutiny Officer: <strong className="text-slate-800">{currentUser.name}</strong> • Prioritized by expiry deadline, issuing authority pings & tampering forensics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => checkAndRejectOverduePayments()}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            title="Scan for unpaid applications past deadline and reject them"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Auto-Reject Unpaid Overdue</span>
          </button>

          <span className="bg-white border border-sky-200 px-3 py-2 rounded-2xl text-xs font-bold text-[#0284C7] shadow-2xs">
            APH 2026-27 Active
          </span>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div
          onClick={() => setActiveTab('expiring')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'expiring'
              ? 'bg-rose-50/70 border-rose-500 ring-1 ring-rose-500 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-rose-700 uppercase">🚨 Expiring Soon</span>
            <Clock className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <div className="text-xl font-black text-rose-700 mt-1.5">{expiringCount}</div>
          <span className="text-[10px] text-rose-600/80 mt-0.5 block font-semibold">
            Due in ≤ 7 days
          </span>
        </div>

        <div
          onClick={() => setActiveTab('ready')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'ready'
              ? 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 uppercase">Ready for Sign-off</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 mt-1.5">{readyCount}</div>
          <span className="text-[10px] text-emerald-700/80 mt-0.5 block">
            AI checks & fee valid
          </span>
        </div>

        <div
          onClick={() => setActiveTab('deficiencies')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'deficiencies'
              ? 'bg-amber-50/70 border-amber-500 ring-1 ring-amber-500 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 uppercase">Deficiencies</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-700 mt-1.5">{deficiencyCount}</div>
          <span className="text-[10px] text-amber-700/80 mt-0.5 block">
            Missing seals or signs
          </span>
        </div>

        {/* Rejected Unpaid Count Card */}
        <div
          onClick={() => setActiveTab('rejected')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'rejected'
              ? 'bg-amber-100 border-amber-500 ring-1 ring-amber-500 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-amber-800 uppercase">Rejected (Unpaid)</span>
            <Ban className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-800 mt-1.5">{rejectedCount}</div>
          <span className="text-[10px] text-amber-700 font-semibold mt-0.5 block">
            Fee deadline lapsed
          </span>
        </div>

        {/* Rejected Forgery Count Card */}
        <div
          onClick={() => setActiveTab('forgery')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'forgery'
              ? 'bg-red-100 border-red-500 ring-1 ring-red-500 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-red-800 uppercase">Terminated (Fraud)</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl font-black text-red-800 mt-1.5">{forgeryCount}</div>
          <span className="text-[10px] text-red-700 font-semibold mt-0.5 block">
            Tampering / Anomaly
          </span>
        </div>

        <div
          onClick={() => setActiveTab('all')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-sky-50/70 border-[#0284C7] ring-1 ring-[#0284C7] shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase">Total Filed</span>
            <FileText className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="text-xl font-extrabold text-[#183153] mt-1.5">{totalCount}</div>
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Full national queue
          </span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-sky-100 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('expiring')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'expiring'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>🚨 Priority 1: Expiring Soon ({expiringCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('ready')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ready'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready for Sign-off ({readyCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('deficiencies')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'deficiencies'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Deficiencies ({deficiencyCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rejected'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Terminated (Unpaid) ({rejectedCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('forgery')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'forgery'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Terminated (Fraud) ({forgeryCount})</span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Submissions ({totalCount})
          </button>
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30 text-xs"
          >
            <option value="all">All Document Types</option>
            <option value="Scholarship Application">Scholarship Applications</option>
            <option value="Research & Project Grant">Research & Project Grants</option>
            <option value="Semester Examination Center Request">Exam Center Requests</option>
            <option value="Institutional Accreditation & EoA">Accreditation & EoA</option>
            <option value="Faculty Cadre & Ratio Approval">Faculty Cadre Approvals</option>
            <option value="Fire & Campus Safety Clearance">Fire Safety NOCs</option>
            <option value="Infrastructure & Land Deed">Infrastructure Deeds</option>
          </select>
        </div>
      </div>

      {/* Prioritized Review Queue Table & Cards */}
      <div className="space-y-4">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-sky-100">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">Queue is clean!</h3>
            <p className="text-xs text-slate-400 mt-1">
              No pending documents matching the selected criteria.
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const report = doc.aiVerification;
            const isApproved = doc.status === 'Approved';
            const isPaymentRejected = doc.status === 'Rejected - Payment Expired';
            const isForgeryRejected = doc.status === 'Rejected - Suspected Forgery / Anomaly';
            const isPaid = doc.paymentStatus === 'Paid';
            const isCritical = doc.daysRemaining <= 3 && !isPaymentRejected && !isForgeryRejected;
            const isHigh = doc.daysRemaining <= 7 && !isPaymentRejected && !isForgeryRejected;
            const hasMissing = report.missingItems.length > 0 || report.qrStatus !== 'Verified';

            return (
              <div
                key={doc.id}
                className={`bg-white rounded-3xl p-5 border transition-all shadow-xs hover:shadow-md ${
                  isForgeryRejected
                    ? 'border-red-400 bg-red-50/20 ring-2 ring-red-200'
                    : isPaymentRejected
                    ? 'border-amber-400 bg-amber-50/20 ring-2 ring-amber-200'
                    : isCritical && !isApproved
                    ? 'border-rose-400 ring-2 ring-rose-100'
                    : isHigh && !isApproved
                    ? 'border-amber-300 ring-1 ring-amber-100'
                    : isApproved
                    ? 'border-emerald-200 bg-white'
                    : 'border-sky-100'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left Column: Priority Tag & Document Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Priority Ranking Pill */}
                      {isForgeryRejected ? (
                        <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <ShieldAlert className="w-3 h-3" /> Terminated: Suspected Forgery (APH Clause 1.8)
                        </span>
                      ) : isPaymentRejected ? (
                        <span className="bg-amber-600 text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Ban className="w-3 h-3" /> Terminated: Non-Payment Expired
                        </span>
                      ) : isCritical && !isApproved ? (
                        <span className="bg-rose-600 text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                          🔥 Priority 1: Due in {doc.daysRemaining} days!
                        </span>
                      ) : isHigh && !isApproved ? (
                        <span className="bg-amber-500 text-white font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          ⚡ Priority 2: Due in {doc.daysRemaining} days
                        </span>
                      ) : isApproved ? (
                        <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Clearance Approved
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-700 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                          Standard Priority ({doc.daysRemaining} days left)
                        </span>
                      )}

                      <span className="text-[10px] font-bold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                        {doc.documentType}
                      </span>
                      <span className="text-xs font-mono text-slate-400 font-semibold">
                        {doc.id}
                      </span>

                      {/* Payment Status Pill */}
                      {isPaid ? (
                        <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Fee Paid: ₹{(doc.paymentAmount || 15000).toLocaleString()}
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-300 inline-flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-amber-600" />
                          Fee Due: ₹{(doc.paymentAmount || 15000).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-[#183153] leading-snug">
                        {doc.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{doc.collegeName}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400">File: {doc.fileName}</span>
                      </div>
                    </div>

                    {/* Official Rejection Notice if Expired Payment */}
                    {isPaymentRejected && doc.paymentRejectionNotice && (
                      <div className="p-3.5 rounded-2xl bg-amber-100 border border-amber-300 text-xs text-amber-950 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-amber-900 uppercase">
                            Formal Rejection Notice Dispatched to College Principal
                          </span>
                          <span className="font-mono font-bold text-[10px] bg-white px-2 py-0.5 rounded border border-amber-300">
                            {doc.paymentRejectionNotice.noticeId}
                          </span>
                        </div>
                        <p className="text-slate-800 leading-relaxed font-medium bg-white/70 p-2 rounded-xl">
                          {doc.paymentRejectionNotice.message}
                        </p>
                      </div>
                    )}

                    {/* Official Rejection Notice if Forgery Flagged */}
                    {isForgeryRejected && doc.forgeryRejectionNotice && (
                      <div className="p-3.5 rounded-2xl bg-red-100 border border-red-300 text-xs text-red-950 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-red-900 uppercase flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                            Show-Cause Notice Dispatched to College (APH Clause 1.8)
                          </span>
                          <span className="font-mono font-bold text-[10px] bg-white px-2 py-0.5 rounded border border-red-300">
                            {doc.forgeryRejectionNotice.noticeId}
                          </span>
                        </div>
                        <p className="text-slate-800 leading-relaxed font-medium bg-white/70 p-2 rounded-xl">
                          {doc.forgeryRejectionNotice.message}
                        </p>
                        <div className="text-[11px] text-red-800 font-medium">
                          <strong>Evidence:</strong> {doc.forgeryRejectionNotice.evidence}
                        </div>
                      </div>
                    )}

                    {/* AI Agent Automated Verification Summary Row */}
                    {!isPaymentRejected && !isForgeryRejected && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            report.qrStatus === 'Verified'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>QR: {report.qrStatus}</span>
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            report.sealStatus === 'Verified' && report.signatureStatus === 'Verified'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          <Stamp className="w-3.5 h-3.5" />
                          <span>
                            Seal & Sign: {report.sealStatus === 'Verified' && report.signatureStatus === 'Verified' ? 'Verified' : 'Deficiency'}
                          </span>
                        </span>

                        {report.issuingAuthorityCheck && (
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            report.issuingAuthorityCheck.status === 'Verified by Issuing Authority'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}>
                            <Building className="w-3.5 h-3.5" />
                            <span>Auth: {report.issuingAuthorityCheck.status}</span>
                          </span>
                        )}

                        {report.anomalyReport && (
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            report.anomalyReport.hasAnomaly
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}>
                            <ShieldAlert className="w-3.5 h-3.5" />
                            <span>{report.anomalyReport.hasAnomaly ? 'Alteration Flagged' : 'Tamper-Free'}</span>
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-[#0284C7] border border-sky-200">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Template Match: {report.templateConformity}%</span>
                        </span>

                        {report.autoFixes.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                            <Wand2 className="w-3.5 h-3.5" />
                            <span>{report.autoFixes.length} Auto-Fixes</span>
                          </span>
                        )}
                      </div>
                    )}


                    {/* Deficiencies / Missing Items Denotation (If Any) */}
                    {hasMissing && !isPaymentRejected && (
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mt-2">
                        <span className="font-bold text-amber-800 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          Deficiencies Detected by AI Agent:
                        </span>
                        <ul className="mt-1 space-y-0.5 pl-5 list-disc text-[11px]">
                          {report.missingItems.map((m) => (
                            <li key={m.id}>
                              <strong>{m.title}</strong> — {m.location} ({m.instruction})
                            </li>
                          ))}
                          {report.qrStatus !== 'Verified' && (
                            <li>
                              <strong>QR Checksum Mismatch:</strong> {report.qrDetails}
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                    <span className="text-[11px] font-mono text-slate-400">
                      Deadline: {doc.deadlineDate}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      {isApproved && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved</span>
                        </span>
                      )}

                      {isPaymentRejected && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Fee Unpaid</span>
                        </span>
                      )}

                      {isForgeryRejected && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-100 text-red-800 border border-red-300 text-xs font-bold">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Terminated (Fraud)</span>
                        </span>
                      )}

                      {!isApproved && !isPaymentRejected && !isForgeryRejected && (
                        <>
                          <button
                            onClick={() => approveDocument(doc.id)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                            title="Issue official AICTE Approval Stamp"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>1-Click Approve</span>
                          </button>

                          <button
                            onClick={() => setRejectingDocId(doc.id)}
                            className="px-3 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                            title="Send notice back to college to fix missing items"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Notice to College</span>
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0284C7] text-xs font-bold border border-sky-200 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Audit</span>
                      </button>

                      {!isPaymentRejected && !isForgeryRejected && (
                        <button
                          onClick={() => runAiVerification(doc.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-[#0284C7] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Re-run AI Agent Scan"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Inline Correction Form Modal */}
                    {rejectingDocId === doc.id && (
                      <div className="w-full sm:w-80 mt-2 p-3 bg-white rounded-2xl border border-rose-300 shadow-lg text-xs space-y-2 text-left">
                        <span className="font-bold text-rose-800 block">
                          Send Deficiency Notice to College:
                        </span>
                        <textarea
                          rows={2}
                          value={rejectionNotes}
                          onChange={(e) => setRejectionNotes(e.target.value)}
                          placeholder="e.g. Please affix Principal digital signature on page 4 and resubmit..."
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setRejectingDocId(null)}
                            className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 rounded-lg"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              requestCorrection(
                                doc.id,
                                rejectionNotes || 'Missing required seal/signature. Please re-upload.'
                              );
                              setRejectingDocId(null);
                              setRejectionNotes('');
                            }}
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold"
                          >
                            Send Notice
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
