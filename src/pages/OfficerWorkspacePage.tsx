import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import {
  Scale,
  FileText,
  CheckCircle2,
  AlertOctagon,
  ZoomIn,
  ZoomOut,
  ShieldCheck,
} from 'lucide-react';

interface OfficerWorkspacePageProps {
  setActiveTab: (tab: string) => void;
}

export const OfficerWorkspacePage: React.FC<OfficerWorkspacePageProps> = ({ setActiveTab }) => {
  const {
    applications,
    selectedAppId,
    setSelectedAppId,
    addOfficerObservation,
    updateFindingStatus,
    showToast,
  } = useApp();

  const app = applications.find((a) => a.id === selectedAppId) || applications[0];

  const [selectedDocId, setSelectedDocId] = useState<string>(app?.documents[0]?.id || '');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeRightTab, setActiveRightTab] = useState<'decision' | 'findings' | 'anomalies' | 'compliance'>('decision');
  const [officialRemark, setOfficialRemark] = useState<string>(app?.officerNotes || '');
  const [recommendation, setRecommendation] = useState<string>('Recommend for Approval');

  const activeDoc = app?.documents.find((d) => d.id === selectedDocId) || app?.documents[0];

  const handleSaveObservation = () => {
    if (!officialRemark) {
      showToast('Please enter an observation remark before saving', 'warning');
      return;
    }
    addOfficerObservation(app.id, officialRemark, recommendation);
  };

  return (
    <div className="space-y-4 text-left">
      <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#0284C7]" />
            <h1 className="text-xl font-extrabold text-[#183153] tracking-tight">AICTE Scrutiny & Officer Desk</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluating: <strong className="text-slate-800">{app?.institutionName}</strong> ({app?.id}) • {app?.category}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={app.id}
            onChange={(e) => {
              setSelectedAppId(e.target.value);
              const target = applications.find((a) => a.id === e.target.value);
              if (target && target.documents.length > 0) {
                setSelectedDocId(target.documents[0].id);
              }
            }}
            className="px-3 py-1.5 text-xs bg-[#F4F9FF] border border-sky-200 rounded-xl font-bold text-[#0284C7]"
          >
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} - {a.institutionName.slice(0, 20)}...
              </option>
            ))}
          </select>

          <Badge variant={getStatusBadgeVariant(app.status)} size="md">
            {app.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-210px)] min-h-[600px]">
        {/* LEFT PANEL */}
        <div className="lg:col-span-6 bg-white rounded-[22px] border border-sky-100 shadow-xs flex flex-col overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 overflow-x-auto">
              {app.documents.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setSelectedDocId(d.id);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedDocId === d.id
                      ? 'bg-[#0284C7] text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {d.name.slice(0, 18)}...
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 15, 70))}
                className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100"
              >
                <ZoomOut className="w-3.5 h-3.5 text-slate-600" />
              </button>
              <span className="text-[11px] font-mono text-slate-500 px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 15, 150))}
                className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100"
              >
                <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-6 bg-slate-100 flex items-start justify-center">
            {activeDoc ? (
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-slate-300 p-8 min-h-[460px] text-xs font-serif leading-relaxed space-y-4 select-none relative transition-transform"
              >
                <div className="text-center pb-3 border-b-2 border-slate-200">
                  <div className="font-sans text-[10px] uppercase font-bold text-slate-500">
                    AICTE STATUTORY RECORD INSPECTION
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 mt-1 uppercase">
                    {activeDoc.category}
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Hash: {activeDoc.fileHash.slice(0, 32)}...
                  </div>
                </div>

                <p className="text-slate-800">
                  Official certified extract submitted by <strong className="text-slate-900">{app.institutionName}</strong>,
                  pertaining to {app.category} for the academic session {app.academicYear}.
                </p>

                <div className="p-3 rounded-lg bg-sky-50/80 border border-sky-200 text-sky-950 font-sans text-[11px] space-y-1">
                  <span className="font-bold block uppercase text-[10px] text-sky-700">Verified Parameters</span>
                  {Object.entries(activeDoc.extractedFields).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-slate-500">{k}:</span>
                      <span className="font-bold text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>

                <p className="text-slate-600 text-[11px]">
                  Scrutinized in accordance with AICTE Approval Process Handbook (APH 2026-27).
                </p>

                <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-sans">
                  <span>Page {currentPage} of {activeDoc.pageCount}</span>
                  <span className="text-emerald-700 font-bold">DIGITALLY INDEXED</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 m-auto">No document selected</div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-6 bg-white rounded-[22px] border border-sky-100 shadow-xs flex flex-col overflow-hidden">
          <div className="p-2.5 border-b border-sky-100 flex items-center gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveRightTab('decision')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeRightTab === 'decision' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Official Decision
            </button>
            <button
              onClick={() => setActiveRightTab('findings')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeRightTab === 'findings' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Validation ({app.findings.length})
            </button>
            <button
              onClick={() => setActiveRightTab('anomalies')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeRightTab === 'anomalies' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Anomalies ({app.anomalies.length})
            </button>
            <button
              onClick={() => setActiveRightTab('compliance')}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                activeRightTab === 'compliance' ? 'bg-[#0284C7] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Compliance ({app.complianceChecks.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {activeRightTab === 'decision' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-[11px] leading-relaxed">
                  <strong>Statutory Authority:</strong> AI determinations are advisory. Final approvals, rejections, and inspection directives remain strictly with the designated Regional Scrutiny Officer and Executive Council.
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Scrutiny Recommendation</label>
                  <select
                    value={recommendation}
                    onChange={(e) => setRecommendation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-white font-semibold text-[#0284C7]"
                  >
                    <option value="Recommend for Approval">Recommend for Approval</option>
                    <option value="Recommend Physical Inspection (SAC / EVC)">Recommend Physical Inspection (SAC / EVC)</option>
                    <option value="Issue Deficiency Rectification Notice">Issue Deficiency Rectification Notice</option>
                    <option value="Forward to Standing Appeals Committee (SAC)">Forward to Standing Appeals Committee (SAC)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Official Scrutiny Remarks & Findings</label>
                  <textarea
                    rows={5}
                    value={officialRemark}
                    onChange={(e) => setOfficialRemark(e.target.value)}
                    placeholder="Record comprehensive institutional observations, verification source results, and rationale for recommendation..."
                    className="w-full p-3 rounded-xl border border-sky-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveObservation}
                    className="px-5 py-2.5 rounded-xl bg-[#0284C7] text-white font-bold hover:bg-[#0369A1] transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Record Official Determination & Sign</span>
                  </button>
                </div>
              </div>
            )}

            {activeRightTab === 'findings' && (
              <div className="space-y-3">
                {app.findings.map((f) => (
                  <div key={f.id} className="p-3.5 rounded-xl border border-sky-100 bg-[#F4F9FF] space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">{f.ruleApplied}</span>
                      <Badge variant={getStatusBadgeVariant(f.status)} size="sm">{f.status}</Badge>
                    </div>
                    <p className="text-slate-600 text-[11px]">{f.explanation}</p>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => updateFindingStatus(app.id, f.id, 'Confirmed')}
                        className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-[10px]"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => updateFindingStatus(app.id, f.id, 'Dismissed')}
                        className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold text-[10px]"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeRightTab === 'anomalies' && (
              <div className="space-y-3">
                {app.anomalies.map((anom) => (
                  <div key={anom.id} className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/40 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-rose-800">{anom.category}</span>
                      <Badge variant="error" size="sm">{anom.severity}</Badge>
                    </div>
                    <p className="text-slate-700 text-[11px]">{anom.reason}</p>
                    <div className="text-[10px] text-slate-500">Method: {anom.detectionMethod} ({anom.confidence}%)</div>
                  </div>
                ))}
              </div>
            )}

            {activeRightTab === 'compliance' && (
              <div className="space-y-2">
                {app.complianceChecks.map((check) => (
                  <div key={check.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-800 block">{check.category}</span>
                      <span className="text-[10px] text-slate-500">{check.requirementDescription}</span>
                    </div>
                    <Badge variant={getStatusBadgeVariant(check.outcome)} size="sm">{check.outcome}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
