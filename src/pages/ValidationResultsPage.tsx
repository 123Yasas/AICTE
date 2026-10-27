import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Sparkles,
  Filter,
  Check,
  X,
  Eye,
  FileText,
} from 'lucide-react';

interface ValidationResultsPageProps {
  setActiveTab: (tab: string) => void;
}

export const ValidationResultsPage: React.FC<ValidationResultsPageProps> = ({ setActiveTab }) => {
  const {
    applications,
    selectedAppId,
    setSelectedAppId,
    triggerValidation,
    updateFindingStatus,
    currentUser,
  } = useApp();

  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [commentModalFindingId, setCommentModalFindingId] = useState<string | null>(null);
  const [officerNote, setOfficerNote] = useState<string>('');

  const app = applications.find((a) => a.id === selectedAppId) || applications[0];

  const allFindings = applications.flatMap((a) =>
    a.findings.map((f) => ({ ...f, applicationId: a.id, institutionName: a.institutionName }))
  );

  const displayedFindings = allFindings.filter((f) => {
    if (severityFilter === 'all') return true;
    return f.severity.toLowerCase() === severityFilter.toLowerCase();
  });

  const handleAction = (appId: string, findingId: string, status: 'Confirmed' | 'Dismissed' | 'Under Investigation') => {
    updateFindingStatus(appId, findingId, status, officerNote || undefined);
    setCommentModalFindingId(null);
    setOfficerNote('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">Intelligent Validation Engine</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rule-based completeness, expiry, and institutional consistency findings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerValidation(app.id)}
            className="px-3.5 py-2 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-[#0369A1] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Re-validate Active App</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-3 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-500">Filter Severity:</span>
          {['all', 'critical', 'high', 'medium', 'low'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg capitalize font-semibold transition-colors ${
                severityFilter === sev
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
        <span className="text-slate-400 font-medium">
          Showing {displayedFindings.length} findings across platform
        </span>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {displayedFindings.map((finding) => (
          <div
            key={finding.id}
            className="bg-white p-5 rounded-[22px] border border-sky-100 shadow-xs flex flex-col lg:flex-row lg:items-start justify-between gap-4"
          >
            <div className="flex-1 text-xs space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  {finding.id}
                </span>
                <span className="font-bold text-slate-800">{finding.institutionName}</span>
                <span className="text-slate-400">({finding.applicationId})</span>
                <Badge variant={getStatusBadgeVariant(finding.status)} size="sm">
                  {finding.status}
                </Badge>
                <Badge
                  variant={
                    finding.severity === 'Critical'
                      ? 'error'
                      : finding.severity === 'High'
                      ? 'warning'
                      : 'info'
                  }
                  size="sm"
                >
                  {finding.severity} Severity
                </Badge>
              </div>

              <div className="font-bold text-slate-800 text-sm">{finding.ruleApplied}</div>
              <p className="text-slate-600 leading-relaxed font-normal">{finding.explanation}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#F4F9FF] border border-sky-100 text-[11px]">
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Document & Field</span>
                  <span className="font-bold text-slate-800">{finding.documentName}</span>
                  <span className="block text-slate-500">{finding.fieldOrPage}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase font-bold text-[10px]">Extracted vs Configured Norm</span>
                  <span className="font-semibold text-rose-700">{finding.extractedValue}</span>
                  <span className="block text-slate-500">Expected: {finding.comparisonValue}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#0284C7] font-semibold">
                Recommended Action: {finding.recommendedAction}
              </div>

              {finding.officerReviewStatus && (
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg inline-block">
                  Officer Status: <strong className="text-slate-700">{finding.officerReviewStatus}</strong>
                  {finding.officerComment && <span> — "{finding.officerComment}"</span>}
                </div>
              )}
            </div>

            {/* Officer Action Buttons */}
            {currentUser.role !== 'institution' && (
              <div className="flex flex-row lg:flex-col gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                <button
                  onClick={() => handleAction(finding.applicationId, finding.id, 'Confirmed')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Confirm Discrepancy</span>
                </button>
                <button
                  onClick={() => handleAction(finding.applicationId, finding.id, 'Dismissed')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Dismiss Flag</span>
                </button>
                <button
                  onClick={() => handleAction(finding.applicationId, finding.id, 'Under Investigation')}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 text-[#0284C7] hover:bg-sky-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Investigate</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
