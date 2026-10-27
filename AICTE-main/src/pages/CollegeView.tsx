import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SimpleDocument, DocumentCategory } from '../types/verification';
import { ReuploadModal } from '../components/modals/ReuploadModal';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  UploadCloud,
  Eye,
  QrCode,
  Stamp,
  Filter,
  Wand2,
  CreditCard,
  Ban,
  AlertCircle,
  Bell,
  ShieldAlert,
  Mail,
} from 'lucide-react';

export const CollegeView: React.FC = () => {
  const {
    currentUser,
    documents,
    setSelectedDoc,
    setIsUploadModalOpen,
    runAiVerification,
    searchQuery,
    payFee,
    simulateExpirePayment,
    simulateForgeryRejection,
    checkAndRejectOverduePayments,
    setIsMailboxOpen,
    unreadEmailCount,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'action' | 'approved' | 'review' | 'rejected' | 'forgery'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [reuploadTarget, setReuploadTarget] = useState<SimpleDocument | null>(null);

  // Filter documents belonging to the college
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (categoryFilter !== 'all' && doc.documentType !== categoryFilter) {
      return false;
    }

    if (activeFilter === 'action') return doc.status === 'Action Required';
    if (activeFilter === 'approved') return doc.status === 'Approved';
    if (activeFilter === 'review') return doc.status === 'Under Officer Review' || doc.status === 'AI Verifying';
    if (activeFilter === 'rejected') return doc.status === 'Rejected - Payment Expired';
    if (activeFilter === 'forgery') return doc.status === 'Rejected - Suspected Forgery / Anomaly';

    return true;
  });

  // Basic counters
  const totalCount = documents.length;
  const approvedCount = documents.filter((d) => d.status === 'Approved').length;
  const actionCount = documents.filter((d) => d.status === 'Action Required').length;
  const reviewCount = documents.filter(
    (d) => d.status === 'Under Officer Review' || d.status === 'AI Verifying'
  ).length;
  const rejectedCount = documents.filter((d) => d.status === 'Rejected - Payment Expired').length;
  const forgeryCount = documents.filter((d) => d.status === 'Rejected - Suspected Forgery / Anomaly').length;

  return (
    <div className="space-y-6 text-left">
      {/* College Welcome Banner */}
      <div className="bg-linear-to-r from-sky-500/10 via-[#0284C7]/10 to-blue-500/10 p-6 rounded-3xl border border-sky-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
              College Submissions Portal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#183153] mt-1 tracking-tight">
            {currentUser.institutionName || 'Apex Institute of Engineering & Technology'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institution Code: <span className="font-mono font-bold text-slate-700">{currentUser.institutionId || 'INST-4029'}</span> • {currentUser.name} ({currentUser.designation})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Institutional Mailbox Quick Link */}
          <button
            onClick={() => setIsMailboxOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-sky-700 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer relative"
            title="Open Institutional Regulatory Mailbox"
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" />
            <span>Regulatory Mailbox</span>
            {unreadEmailCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-white animate-pulse">
                {unreadEmailCount}
              </span>
            )}
          </button>

          <button
            onClick={() => checkAndRejectOverduePayments()}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Scan for any unpaid applications past deadline and reject them"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Check Deadlines & Auto-Reject</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-sky-200" />
            <span>+ Submit New Document</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
        <div
          onClick={() => setActiveFilter('all')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-white border-[#0284C7] shadow-sm ring-1 ring-[#0284C7]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Total Filed</span>
            <FileText className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="text-xl font-extrabold text-[#183153] mt-1.5">{totalCount}</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">All applications</span>
        </div>

        <div
          onClick={() => setActiveFilter('approved')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'approved'
              ? 'bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Approved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 mt-1.5">{approvedCount}</div>
          <span className="text-[10px] text-emerald-600/80 mt-0.5 block">Clearance issued</span>
        </div>

        <div
          onClick={() => setActiveFilter('action')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'action'
              ? 'bg-white border-amber-500 shadow-sm ring-1 ring-amber-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-700 uppercase">Action Needed</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-700 mt-1.5">{actionCount}</div>
          <span className="text-[10px] text-amber-600/80 mt-0.5 block">Fix missing items</span>
        </div>

        <div
          onClick={() => setActiveFilter('review')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'review'
              ? 'bg-white border-sky-500 shadow-sm ring-1 ring-sky-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#0284C7] uppercase">In Scrutiny</span>
            <Clock className="w-4 h-4 text-[#0284C7]" />
          </div>
          <div className="text-xl font-extrabold text-[#0284C7] mt-1.5">{reviewCount}</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">AI validated</span>
        </div>

        {/* Rejected for Non-Payment Card */}
        <div
          onClick={() => setActiveFilter('rejected')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'rejected'
              ? 'bg-amber-50 border-amber-500 shadow-sm ring-1 ring-amber-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-amber-800 uppercase">Rejected (Unpaid)</span>
            <Ban className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-black text-amber-800 mt-1.5">{rejectedCount}</div>
          <span className="text-[10px] text-amber-700 font-medium mt-0.5 block">Fee lapsed</span>
        </div>

        {/* Rejected for Forgery Card */}
        <div
          onClick={() => setActiveFilter('forgery')}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
            activeFilter === 'forgery'
              ? 'bg-red-50 border-red-500 shadow-sm ring-1 ring-red-500'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-red-800 uppercase">Rejected (Fraud)</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-xl font-black text-red-800 mt-1.5">{forgeryCount}</div>
          <span className="text-[10px] text-red-700 font-medium mt-0.5 block">Tampering detected</span>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-sky-100 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Submissions ({totalCount})
          </button>
          <button
            onClick={() => setActiveFilter('action')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'action'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Action Required ({actionCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('approved')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'approved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved ({approvedCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('review')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'review'
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Scrutiny ({reviewCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('rejected')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'rejected'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Rejected - Unpaid ({rejectedCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('forgery')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'forgery'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Rejected - Forgery / Fraud ({forgeryCount})</span>
          </button>
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30 text-xs"
          >
            <option value="all">All Document Categories</option>
            <option value="Scholarship Application">Scholarship Applications</option>
            <option value="Research & Project Grant">Research & Project Grants</option>
            <option value="Semester Examination Center Request">Exam Center Requests</option>
            <option value="Institutional Accreditation & EoA">Accreditation & EoA</option>
            <option value="Fire & Campus Safety Clearance">Fire & Safety Clearances</option>
            <option value="Faculty Cadre & Ratio Approval">Faculty Cadre Approvals</option>
            <option value="Infrastructure & Land Deed">Infrastructure & Land Deeds</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-4">
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-sky-100">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No documents found</h3>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your search query or filter selection.
            </p>
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const report = doc.aiVerification;
            const isApproved = doc.status === 'Approved';
            const isActionRequired = doc.status === 'Action Required';
            const isPaymentRejected = doc.status === 'Rejected - Payment Expired';
            const isForgeryRejected = doc.status === 'Rejected - Suspected Forgery / Anomaly';
            const isPaid = doc.paymentStatus === 'Paid';

            return (
              <div
                key={doc.id}
                className={`bg-white rounded-3xl p-5 border transition-all shadow-xs hover:shadow-md ${
                  isForgeryRejected
                    ? 'border-red-400 bg-red-50/25 ring-2 ring-red-300'
                    : isPaymentRejected
                    ? 'border-amber-400 bg-amber-50/20 ring-2 ring-amber-200'
                    : isActionRequired
                    ? 'border-amber-300 ring-1 ring-amber-100'
                    : isApproved
                    ? 'border-emerald-200'
                    : 'border-sky-100'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left: Document Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/70">
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
                      ) : isPaymentRejected ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md border border-amber-300 inline-flex items-center gap-1">
                          <Ban className="w-3 h-3 text-amber-600" />
                          Payment Expired (Unpaid: ₹{(doc.paymentAmount || 15000).toLocaleString()})
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-300 inline-flex items-center gap-1">
                          <CreditCard className="w-3 h-3 text-amber-600" />
                          Fee Due: ₹{(doc.paymentAmount || 15000).toLocaleString()}
                        </span>
                      )}

                      {/* Deadline Countdown */}
                      {doc.daysRemaining > 0 ? (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          doc.daysRemaining <= 3
                            ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          <Clock className="w-3 h-3" /> Due in {doc.daysRemaining} days (Deadline: {doc.deadlineDate})
                        </span>
                      ) : (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-300 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Deadline Lapsed on {doc.deadlineDate}
                        </span>
                      )}
                    </div>


                    <h3 className="text-base font-extrabold text-[#183153] leading-snug">
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-500">
                      File: <span className="font-mono text-slate-700">{doc.fileName}</span> ({doc.fileSize}) • Uploaded on {doc.uploadDate}
                    </p>

                    {/* OFFICIAL NOTICE TO COLLEGE: IF REJECTED DUE TO EXPIRED PAYMENT */}
                    {isPaymentRejected && doc.paymentRejectionNotice && (
                      <div className="mt-3 p-4 rounded-2xl bg-amber-100/80 border-2 border-amber-400 text-xs text-amber-950 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-900 font-black uppercase tracking-wide">
                            <Ban className="w-4 h-4 text-amber-600" />
                            <span>Official AICTE Termination Notice: Payment Not Received by Deadline</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-300">
                            {doc.paymentRejectionNotice.noticeId}
                          </span>
                        </div>
                        <p className="text-slate-800 leading-relaxed font-medium bg-white/70 p-2.5 rounded-xl border border-amber-200">
                          {doc.paymentRejectionNotice.message}
                        </p>
                        <div className="text-[11px] text-amber-800 flex items-center justify-between">
                          <span>Notice Dispatched to College Principal Inbox on: {doc.paymentRejectionNotice.noticeDate}</span>
                          <span className="font-bold">Unpaid Arrear: ₹{(doc.paymentRejectionNotice?.unpaidAmount || 50000).toLocaleString()}</span>
                        </div>
                      </div>
                    )}

                    {/* OFFICIAL NOTICE TO COLLEGE: IF REJECTED DUE TO FORGERY / TAMPERING */}
                    {isForgeryRejected && doc.forgeryRejectionNotice && (
                      <div className="mt-3 p-4 rounded-2xl bg-red-100/90 border-2 border-red-500 text-xs text-red-950 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-red-900 font-black uppercase tracking-wide">
                            <ShieldAlert className="w-4 h-4 text-red-600" />
                            <span>Official AICTE Termination & Show-Cause Notice: Suspected Forgery (APH Clause 1.8)</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-red-300">
                            {doc.forgeryRejectionNotice.noticeId}
                          </span>
                        </div>
                        <p className="text-slate-800 leading-relaxed font-medium bg-white/80 p-2.5 rounded-xl border border-red-200">
                          {doc.forgeryRejectionNotice.message}
                        </p>
                        <div className="text-[11px] text-red-800 flex items-center justify-between pt-1">
                          <span>Dispatched to College Principal Inbox on: {doc.forgeryRejectionNotice.noticeDate}</span>
                          <button
                            onClick={() => setIsMailboxOpen(true)}
                            className="font-bold underline text-red-700 hover:text-red-900 cursor-pointer"
                          >
                            View in Institutional Mailbox →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* AI Verification Chips */}
                    {!isPaymentRejected && !isForgeryRejected && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                            report.qrStatus === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>QR: {report.qrStatus}</span>
                        </span>

                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                            report.sealStatus === 'Verified' && report.signatureStatus === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <Stamp className="w-3.5 h-3.5" />
                          <span>
                            Seal & Sign: {report.sealStatus === 'Verified' && report.signatureStatus === 'Verified' ? 'Verified' : 'Missing Items'}
                          </span>
                        </span>

                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-sky-50 text-[#0284C7] border border-sky-200">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Template Match: {report.templateConformity}%</span>
                        </span>

                        {report.autoFixes.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                            <Wand2 className="w-3.5 h-3.5" />
                            <span>{report.autoFixes.length} Auto-Fixes Applied</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* What is Wrong / Missing (If Action Required) */}
                    {isActionRequired && report.missingItems.length > 0 && !isPaymentRejected && !isForgeryRejected && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Action Required — Please fix and re-upload before deadline:</span>
                        </div>
                        <ul className="mt-2 space-y-1.5 text-xs text-amber-950">
                          {report.missingItems.map((item) => (
                            <li key={item.id} className="bg-white/80 p-2 rounded-xl border border-amber-200 flex items-start justify-between gap-2">
                              <div>
                                <span className="font-bold text-amber-900">❌ Missing: {item.title}</span>
                                <p className="text-[11px] text-slate-600 mt-0.5">
                                  <strong>Location:</strong> {item.location} • {item.instruction}
                                </p>
                              </div>
                              <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md shrink-0">
                                {item.severity}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
                    <div>
                      {isApproved ? (
                        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 font-black text-xs inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Approved by AICTE</span>
                        </div>
                      ) : isForgeryRejected ? (
                        <div className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-black text-xs inline-flex items-center gap-1.5 shadow-xs">
                          <ShieldAlert className="w-4 h-4" />
                          <span>REJECTED (Fraud / Tampering)</span>
                        </div>
                      ) : isPaymentRejected ? (
                        <div className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white font-black text-xs inline-flex items-center gap-1.5 shadow-xs">
                          <Ban className="w-4 h-4" />
                          <span>REJECTED (Payment Expired)</span>
                        </div>
                      ) : isActionRequired ? (
                        <div className="px-3.5 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 font-black text-xs inline-flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Action Required</span>
                        </div>
                      ) : (
                        <div className="px-3.5 py-1.5 rounded-xl bg-sky-100 border border-sky-300 text-[#0284C7] font-black text-xs inline-flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#0284C7]" />
                          <span>Under Scrutiny</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {/* Online Payment Button (if unpaid) */}
                      {!isPaid && !isPaymentRejected && !isForgeryRejected && (
                        <button
                          onClick={() => payFee(doc.id)}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          title="Remit statutory regulatory fee online"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pay ₹{(doc.paymentAmount || 15000).toLocaleString()} Online</span>
                        </button>
                      )}

                      {/* Simulate Payment Expiry Button */}
                      {!isPaid && !isPaymentRejected && !isForgeryRejected && (
                        <button
                          onClick={() => simulateExpirePayment(doc.id)}
                          className="px-2.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold transition-colors cursor-pointer"
                          title="Simulate expiry deadline passing without payment"
                        >
                          Simulate Expiry Rejection
                        </button>
                      )}

                      {/* Simulate Forgery Rejection Button */}
                      {!isForgeryRejected && !isPaymentRejected && (
                        <button
                          onClick={() => simulateForgeryRejection(doc.id)}
                          className="px-2.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="Simulate immediate rejection for forgery under APH Clause 1.8 with notice"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                          <span>Test Forgery Reject</span>
                        </button>
                      )}

                      {isActionRequired && !isPaymentRejected && !isForgeryRejected && (
                        <button
                          onClick={() => setReuploadTarget(doc)}
                          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          <span>Re-upload File</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="px-3 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0284C7] text-xs font-bold border border-sky-200 transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Audit</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>


      {/* Reupload Modal */}
      {reuploadTarget && (
        <ReuploadModal
          document={reuploadTarget}
          onClose={() => setReuploadTarget(null)}
        />
      )}
    </div>
  );
};
