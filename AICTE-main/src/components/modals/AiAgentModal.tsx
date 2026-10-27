import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Stamp,
  FileCheck2,
  Wand2,
  Clock,
  X,
  RotateCcw,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export const AiAgentModal: React.FC = () => {
  const {
    isAiAgentModalOpen,
    setIsAiAgentModalOpen,
    aiAgentDoc,
    approveDocument,
    currentUser,
  } = useApp();

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  const steps = [
    {
      id: 'ocr',
      title: 'OCR & Document Structure Extraction',
      description: 'Ingesting document text, structural headers, and metadata fields.',
      icon: FileCheck2,
    },
    {
      id: 'qr',
      title: 'QR Code Cryptographic Authentication',
      description: 'Decoding QR payload and cross-verifying checksum with AICTE Central Database.',
      icon: QrCode,
    },
    {
      id: 'seal',
      title: 'Digital Signature & Institutional Seal Detection',
      description: 'Scanning pages for physical circular rubber stamps and authorized digital signatures.',
      icon: Stamp,
    },
    {
      id: 'template',
      title: 'Certification Center Standard Template Match',
      description: 'Cross-verifying layout, mandatory clauses, and margins against the National APH Schema.',
      icon: ShieldCheck,
    },
    {
      id: 'autofix',
      title: 'AI Auto-Correction Engine',
      description: 'Automatically repairing fixable textual discrepancies and date format notations.',
      icon: Wand2,
    },
    {
      id: 'missing',
      title: 'Missing Elements & Deficiency Denotation',
      description: 'Identifying missing signatures, missing seals, or unattached mandatory schedules.',
      icon: AlertTriangle,
    },
    {
      id: 'priority',
      title: 'Expiry Urgency & Scrutiny Prioritization',
      description: 'Evaluating submission deadline and setting priority ranking in the queue.',
      icon: Clock,
    },
  ];

  useEffect(() => {
    if (!isAiAgentModalOpen) {
      setActiveStepIndex(0);
      setIsScanning(true);
      return;
    }

    setIsScanning(true);
    setActiveStepIndex(0);

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          setIsScanning(false);
          clearInterval(interval);
          return prev;
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isAiAgentModalOpen]);

  if (!isAiAgentModalOpen || !aiAgentDoc) return null;

  const report = aiAgentDoc.aiVerification;
  const hasMissing = report.missingItems.length > 0 || report.qrStatus !== 'Verified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-linear-to-r from-[#0284C7] to-[#0369A1] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-sky-200 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                  AICTE Autonomous Agent
                </span>
                <span className="text-xs text-sky-200 font-medium">v4.2 Verification Core</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5 line-clamp-1">
                {aiAgentDoc.title}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsAiAgentModalOpen(false)}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Progress Banner */}
          <div className="p-3.5 rounded-2xl bg-[#F4F9FF] border border-sky-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isScanning ? (
                <div className="h-3 w-3 rounded-full bg-sky-500 animate-ping" />
              ) : hasMissing ? (
                <div className="h-3 w-3 rounded-full bg-rose-500" />
              ) : (
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
              )}
              <span className="text-xs font-bold text-[#183153]">
                {isScanning
                  ? `Agent Processing: Step ${activeStepIndex + 1} of ${steps.length}...`
                  : hasMissing
                  ? 'Verification Complete: Action Required (Missing Items Found)'
                  : 'Verification Complete: 100% Certified Compliance'}
              </span>
            </div>
            <span className="text-xs font-black text-[#0284C7]">
              {Math.min(100, Math.round(((activeStepIndex + 1) / steps.length) * 100))}%
            </span>
          </div>

          {/* Stepper Grid */}
          <div className="space-y-2.5">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isPast = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              const isUpcoming = idx > activeStepIndex;

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    isCurrent
                      ? 'bg-sky-50/70 border-sky-300 ring-1 ring-sky-200'
                      : isPast
                      ? 'bg-white border-slate-200'
                      : 'bg-slate-50/60 border-slate-100 opacity-60'
                  }`}
                >
                  <div
                    className={`mt-0.5 p-2 rounded-xl shrink-0 ${
                      isCurrent
                        ? 'bg-[#0284C7] text-white shadow-xs'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <StepIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-[#0284C7]' : 'text-slate-800'
                        }`}
                      >
                        {step.title}
                      </h4>
                      {isPast && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Checked
                        </span>
                      )}
                      {isCurrent && isScanning && (
                        <span className="text-[11px] font-semibold text-sky-600 animate-pulse">
                          Inspecting...
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verification Findings (Shown when done or progress reaches auto-fix/missing) */}
          {activeStepIndex >= 4 && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                AI Agent Inspection Findings
              </h3>

              {/* QR, Sign, Seal, Template Score Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">QR Code</span>
                  <div className="flex items-center gap-1 mt-1 text-xs font-black">
                    {report.qrStatus === 'Verified' ? (
                      <span className="text-emerald-700">✅ Valid Hash</span>
                    ) : (
                      <span className="text-rose-600">❌ {report.qrStatus}</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">College Seal</span>
                  <div className="flex items-center gap-1 mt-1 text-xs font-black">
                    {report.sealStatus === 'Verified' ? (
                      <span className="text-emerald-700">✅ Detected</span>
                    ) : (
                      <span className="text-rose-600">❌ Missing Seal</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Signature</span>
                  <div className="flex items-center gap-1 mt-1 text-xs font-black">
                    {report.signatureStatus === 'Verified' ? (
                      <span className="text-emerald-700">✅ Authenticated</span>
                    ) : (
                      <span className="text-rose-600">❌ Missing Sign</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Template Match</span>
                </div>
              </div>

              {/* Certification Center Template Cross-Verification Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
                    <span className="text-xs font-bold text-slate-800">
                      Certification Center Cross-Verification
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#0284C7] bg-sky-100/80 px-2 py-0.5 rounded-md">
                    {report.templateConformity}% Format Alignment
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Schema: <strong className="text-slate-700">{report.templateStandard}</strong>
                </p>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-600">Letterhead Format:</span>
                    <span className="font-bold text-emerald-600">✅ Compliant</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-600">Mandatory Clauses:</span>
                    <span className="font-bold text-emerald-600">✅ Verified</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-600">Date Standard:</span>
                    <span className="font-bold text-purple-600">⚡ Auto-Fixed</span>
                  </div>
                </div>
              </div>

              {/* Auto-Corrected Items */}
              {report.autoFixes.length > 0 && (
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4 text-[#0284C7]" />
                    <span className="text-xs font-bold text-[#0284C7]">
                      Auto-Corrected by AI ({report.autoFixes.length} text items standardized)
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
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-sky-100 text-[#0369A1]">
                            Auto-Repaired
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

              {/* Missing Items (Action Required) */}
              {report.missingItems.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-bold text-rose-700">
                      Something is Missing! Denoted for College Action ({report.missingItems.length} items)
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-2">
                    {report.missingItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 bg-white rounded-xl border border-rose-200 text-xs text-left"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-900">{item.title}</span>
                          <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded-sm">
                            {item.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          <strong className="text-slate-800">Location:</strong> {item.location}
                        </p>
                        <p className="text-[11px] text-rose-700 mt-1 font-medium">
                          → {item.instruction}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              setActiveStepIndex(0);
              setIsScanning(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-scan with AI Agent</span>
          </button>

          <div className="flex items-center gap-2">
            {currentUser.role === 'aicte' && !hasMissing && aiAgentDoc.status !== 'Approved' && (
              <button
                onClick={() => {
                  approveDocument(aiAgentDoc.id);
                  setIsAiAgentModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                One-Click Approve Document
              </button>
            )}
            <button
              onClick={() => setIsAiAgentModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
