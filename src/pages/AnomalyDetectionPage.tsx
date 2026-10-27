import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import {
  AlertOctagon,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  Check,
  X,
  Send,
  Layers,
} from 'lucide-react';

interface AnomalyDetectionPageProps {
  setActiveTab: (tab: string) => void;
}

export const AnomalyDetectionPage: React.FC<AnomalyDetectionPageProps> = ({ setActiveTab }) => {
  const { applications, triggerAnomalyScan, updateAnomalyStatus, currentUser } = useApp();

  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string>('ANOM-003-1');
  const [officerNote, setOfficerNote] = useState<string>('');

  const allAnomalies = applications.flatMap((a) =>
    a.anomalies.map((anom) => ({
      ...anom,
      applicationId: a.id,
      institutionName: a.institutionName,
    }))
  );

  const activeAnomaly = allAnomalies.find((a) => a.id === selectedAnomalyId) || allAnomalies[0];

  const handleUpdate = (status: 'Confirmed' | 'Dismissed' | 'Forwarded for Scrutiny') => {
    if (!activeAnomaly) return;
    updateAnomalyStatus(activeAnomaly.applicationId, activeAnomaly.id, status, officerNote || undefined);
    setOfficerNote('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">Document Anomaly & Forensic Scanner</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deep forensic analysis for duplicate hashes, metadata divergence, and altered image regions
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Notice: Findings indicate potential anomalies requiring official officer verification.</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Anomaly Feed List */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-[#183153]">Detected Anomalies ({allAnomalies.length})</h3>

          {allAnomalies.map((anom) => (
            <div
              key={anom.id}
              onClick={() => setSelectedAnomalyId(anom.id)}
              className={`p-4 rounded-[20px] border transition-all cursor-pointer text-xs space-y-2 ${
                activeAnomaly?.id === anom.id
                  ? 'bg-white border-[#0284C7] shadow-md ring-2 ring-sky-100'
                  : 'bg-white border-sky-100 hover:border-sky-200 shadow-xs'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-slate-500">{anom.id}</span>
                <Badge
                  variant={
                    anom.severity === 'High-Priority Review'
                      ? 'error'
                      : anom.severity === 'Needs Attention'
                      ? 'warning'
                      : 'info'
                  }
                  size="sm"
                >
                  {anom.severity}
                </Badge>
              </div>

              <div className="font-bold text-slate-800 text-sm">{anom.category}</div>
              <div className="text-slate-500">{anom.institutionName} ({anom.applicationId})</div>

              <div className="p-2 rounded-lg bg-rose-50/60 text-rose-800 font-medium text-[11px]">
                {anom.reason}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Method: {anom.detectionMethod}</span>
                <span>Officer: {anom.officerReviewStatus}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Forensic Inspection Workspace with Simulated Heatmap Overlay */}
        <div className="lg:col-span-7 bg-white p-6 rounded-[22px] border border-sky-100 shadow-xs flex flex-col justify-between">
          {activeAnomaly ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div>
                  <h3 className="text-base font-bold text-[#183153]">{activeAnomaly.category}</h3>
                  <p className="text-xs text-slate-500">{activeAnomaly.documentName}</p>
                </div>
                <Badge variant="error" size="md">
                  Confidence: {activeAnomaly.confidence}%
                </Badge>
              </div>

              {/* Forensic Document Preview with Bounding Box Hotspot */}
              <div className="p-5 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] relative overflow-hidden min-h-[220px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700 text-[10px] text-slate-400">
                  <span>FORENSIC SCANNER • PYMUPDF & OPENCV ARTIFACT ANALYZER</span>
                  <span className="text-rose-400 animate-pulse">FLAGGED REGION ACTIVE</span>
                </div>

                <div className="mt-4 space-y-2 text-slate-300">
                  <div>Document File: <span className="text-white">{activeAnomaly.documentName}</span></div>
                  <div>Inspection Technique: <span className="text-sky-300">{activeAnomaly.detectionMethod}</span></div>
                  <div>Evidence Hash: <span className="text-amber-300">SHA256: {activeAnomaly.evidence}</span></div>
                </div>

                {/* Visual Bounding Box Hotspot Overlay */}
                <div className="mt-4 p-3 rounded-xl border border-rose-500/80 bg-rose-500/10 text-rose-300">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-rose-400">
                    <AlertOctagon className="w-4 h-4" />
                    <span>Potential Anomaly Detected — Verification Required</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed">
                    {activeAnomaly.reason}
                  </p>
                </div>
              </div>

              {/* Officer Decision Box */}
              {currentUser.role !== 'institution' && (
                <div className="p-4 rounded-2xl bg-[#F4F9FF] border border-sky-100 space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs">Authorized Scrutiny Decision</h4>
                  <textarea
                    placeholder="Enter official observation or clarification remarks..."
                    value={officerNote}
                    onChange={(e) => setOfficerNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-sky-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40"
                    rows={2}
                  />

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleUpdate('Confirmed')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Confirm Discrepancy</span>
                    </button>
                    <button
                      onClick={() => handleUpdate('Dismissed')}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Dismiss as False Positive</span>
                    </button>
                    <button
                      onClick={() => handleUpdate('Forwarded for Scrutiny')}
                      className="px-3 py-1.5 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Forward for Higher Scrutiny</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select an anomaly item to view forensic evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
