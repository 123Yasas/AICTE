import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import {
  AlertTriangle,
  CheckCircle2,
  Upload,
  RefreshCw,
  Clock,
  FileText,
  Calendar,
  Check,
  X,
  FileDown,
} from 'lucide-react';

interface DeficiencyManagementPageProps {
  setActiveTab: (tab: string) => void;
}

export const DeficiencyManagementPage: React.FC<DeficiencyManagementPageProps> = ({ setActiveTab }) => {
  const { applications, resolveDeficiency, replaceDocument, currentUser, showToast } = useApp();

  const [activeModalDefId, setActiveModalDefId] = useState<string | null>(null);
  const [replacementName, setReplacementName] = useState<string>('');
  const [resolveNote, setResolveNote] = useState<string>('');

  const allDeficiencies = applications.flatMap((a) =>
    a.deficiencies.map((def) => ({
      ...def,
      applicationId: a.id,
      institutionName: a.institutionName,
      docId: a.documents[0]?.id || 'DOC-GENERIC',
    }))
  );

  const handleUploadReplacement = (appId: string, defId: string, docId: string) => {
    if (!replacementName) {
      showToast('Please enter a file name for the replacement document', 'warning');
      return;
    }
    replaceDocument(
      appId,
      docId,
      { name: replacementName.endsWith('.pdf') ? replacementName : `${replacementName}.pdf` },
      defId
    );
    setActiveModalDefId(null);
    setReplacementName('');
  };

  const handleCloseDeficiency = (appId: string, defId: string) => {
    resolveDeficiency(appId, defId, resolveNote || 'Closed following review of replacement upload.');
    setResolveNote('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">Smart Deficiency Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Deficiency resolution lifecycle, replacement uploads, and automated revalidation
          </p>
        </div>

        <button
          onClick={() => setActiveTab('reports')}
          className="px-4 py-2 rounded-xl bg-white border border-sky-200 text-xs font-bold text-[#0284C7] hover:bg-sky-50 flex items-center gap-1.5 cursor-pointer"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span>Export Deficiency Report</span>
        </button>
      </div>

      <div className="space-y-4">
        {allDeficiencies.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-sky-100 text-center text-xs text-slate-500">
            Zero active regulatory deficiencies found in platform database.
          </div>
        ) : (
          allDeficiencies.map((def) => (
            <div
              key={def.id}
              className="bg-white p-6 rounded-[22px] border border-sky-100 shadow-xs flex flex-col lg:flex-row lg:items-start justify-between gap-6"
            >
              <div className="flex-1 text-xs space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    {def.id}
                  </span>
                  <span className="font-bold text-slate-800">{def.institutionName}</span>
                  <span className="text-slate-400">({def.applicationId})</span>
                  <Badge variant={getStatusBadgeVariant(def.status)} size="sm">
                    {def.status}
                  </Badge>
                </div>

                <h3 className="font-bold text-slate-800 text-sm">{def.category}</h3>
                <p className="text-slate-600 leading-relaxed font-normal">{def.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-950">
                  <div>
                    <span className="text-amber-800 uppercase font-bold text-[9px] block">Mandatory Correction</span>
                    <span>{def.requiredCorrection}</span>
                  </div>
                  <div>
                    <span className="text-amber-800 uppercase font-bold text-[9px] block">Compliance Timeline</span>
                    <span>Identified: {def.dateIdentified} • Due: <strong>{def.dueDate}</strong></span>
                  </div>
                </div>

                {def.reviewerComments && (
                  <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl">
                    Officer Observation: <em>"{def.reviewerComments}"</em>
                  </div>
                )}
              </div>

              {/* Action Column */}
              <div className="flex flex-col gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 w-full sm:w-auto">
                {/* College Action: Upload Replacement */}
                {def.status !== 'Resolved' && (
                  <button
                    onClick={() => setActiveModalDefId(def.id)}
                    className="px-4 py-2 rounded-xl bg-linear-to-r from-[#29B6F6] to-[#0284C7] text-white text-xs font-bold hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Replacement Document</span>
                  </button>
                )}

                {/* Officer Action: Close / Resolve */}
                {currentUser.role !== 'institution' && def.status !== 'Resolved' && (
                  <button
                    onClick={() => handleCloseDeficiency(def.applicationId, def.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark as Resolved</span>
                  </button>
                )}

                {def.status === 'Resolved' && (
                  <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Deficiency Cleared</span>
                  </div>
                )}
              </div>

              {/* Replacement Modal */}
              {activeModalDefId === def.id && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-sky-100 text-left animate-in fade-in zoom-in-95">
                    <h3 className="text-base font-bold text-[#183153]">Upload Rectification Document</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Resolving <strong className="text-[#0284C7]">{def.id}</strong>: {def.category}
                    </p>

                    <div className="mt-4">
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Replacement PDF Document
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Renewed_NOC_Endorsement_2027.pdf"
                        value={replacementName}
                        onChange={(e) => setReplacementName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-sky-200"
                      />
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                      <button
                        onClick={() => setActiveModalDefId(null)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUploadReplacement(def.applicationId, def.id, def.docId)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0284C7] text-white hover:bg-[#0369A1]"
                      >
                        Upload & Revalidate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
