import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DOCUMENT_CATEGORIES } from '../../data/simpleMockData';
import { DocumentCategory } from '../../types/verification';
import {
  UploadCloud,
  X,
  FileText,
  Calendar,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const UploadDocumentModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, addDocument } = useApp();

  const [category, setCategory] = useState<DocumentCategory>('Scholarship Application');
  const [title, setTitle] = useState<string>('Post-Matric Technical Scholarship Application 2026-27');
  const [deadlineDate, setDeadlineDate] = useState<string>('2026-10-31');
  const [fileName, setFileName] = useState<string>('Scholarship_Application_Signed.pdf');
  const [feeAmount, setFeeAmount] = useState<number>(5000);
  const [simulateDefects, setSimulateDefects] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  if (!isUploadModalOpen) return null;

  const handleCategoryChange = (cat: DocumentCategory) => {
    setCategory(cat);
    const catMeta = DOCUMENT_CATEGORIES.find((c) => c.id === cat);
    if (catMeta) {
      setFeeAmount(catMeta.defaultFee);
    }

    switch (cat) {
      case 'Scholarship Application':
        setTitle('Merit-cum-Means Technical Scholarship Scheme 2026-27');
        setFileName('Scholarship_Beneficiary_Affidavit.pdf');
        break;
      case 'Research & Project Grant':
        setTitle('AI & Clean Energy Research Grant Proposal');
        setFileName('AICTE_RPS_Project_Grant.pdf');
        break;
      case 'Semester Examination Center Request':
        setTitle('End-Semester Polytechnic & Engineering Exam Center Sanction');
        setFileName('Exam_Center_Sanction_Request.pdf');
        break;
      case 'Institutional Accreditation & EoA':
        setTitle('Annual Extension of Approval (EoA) & NBA Tier-1 Compliance');
        setFileName('EoA_Accreditation_Renewal_2026.pdf');
        break;
      case 'Fire & Campus Safety Clearance':
        setTitle('State Municipal Fire Service NOC & Campus Audit');
        setFileName('Fire_Safety_Clearance_NOC.pdf');
        break;
      case 'Faculty Cadre & Ratio Approval':
        setTitle('Faculty Cadre Ratio (1:15) & 7th CPC Payroll Verification');
        setFileName('Faculty_Cadre_Audit_2026.pdf');
        break;
      case 'Infrastructure & Land Deed':
        setTitle('Permanent Campus Land Title & Structural Stability Deed');
        setFileName('Land_Title_Deed_Certificate.pdf');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDocument({
      title,
      documentType: category,
      deadlineDate,
      fileName,
      paymentAmount: feeAmount,
      simulateDefects,
      notes,
    });
    setIsUploadModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 bg-linear-to-r from-[#0284C7] to-[#29B6F6] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Upload Document to AICTE</h2>
              <p className="text-xs text-sky-100">
                AI Agent will immediately verify QR, Sign, Seal, and Certification format
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-left">
          {/* Document Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Document Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-2xl bg-slate-50/50">
              {DOCUMENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-white border-[#0284C7] ring-1 ring-[#0284C7] shadow-xs'
                      : 'bg-white/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p
                    className={`text-xs font-bold line-clamp-1 ${
                      category === cat.id ? 'text-[#0284C7]' : 'text-slate-800'
                    }`}
                  >
                    {cat.label}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {cat.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Document Title / Reference *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30 text-slate-800 font-medium"
              placeholder="e.g. Post-Matric Technical Scholarship Application 2026-27"
            />
          </div>

          {/* Submission / Expiry Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Publish / Expiry Deadline *</span>
              </label>
              <input
                type="date"
                required
                value={deadlineDate}
                onChange={(e) => setDeadlineDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30 text-slate-800 font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Urgent deadlines will be automatically prioritized in AICTE queue
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>File Name Attachment</span>
              </label>
              <input
                type="text"
                required
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30 text-slate-800 font-medium font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Accepts PDF, scanned certificate, or image
              </span>
            </div>
          </div>

          {/* Statutory Fee & Non-Payment Expiry Rule */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-left">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <span>Regulatory Fee: ₹{feeAmount.toLocaleString()}</span>
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                Due by {deadlineDate}
              </span>
            </div>
            <p className="text-[11px] text-amber-800 mt-1">
              <strong>Mandatory Rule:</strong> If payment is not completed on or before the expiry date, this application will be automatically rejected and a termination message will be sent to the college.
            </p>
          </div>

          {/* Test Preset: Clean Document vs Simulated Missing Sign/Seal */}
          <div className="p-3.5 rounded-2xl bg-[#F4F9FF] border border-sky-200">
            <span className="text-xs font-bold text-[#183153] block mb-2">
              🧪 AI Verification Test Scenario:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSimulateDefects(false)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  !simulateDefects
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Valid Document</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  All QR codes, seals & signatures present
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSimulateDefects(true)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  simulateDefects
                    ? 'bg-rose-50 border-rose-400 text-rose-800 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Missing Sign / Seal</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Tests AI detecting missing items & denoting them!
                </p>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Internal College Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7]/30 text-slate-800"
              placeholder="e.g. Expedited submission for state scholarship quota release..."
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit & Run AI Agent</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
