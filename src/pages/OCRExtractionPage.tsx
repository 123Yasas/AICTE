import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import {
  ScanText,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Save,
  Search,
  Eye,
  Sparkles,
  RefreshCw,
  Edit2,
  Layers,
} from 'lucide-react';

interface OCRExtractionPageProps {
  setActiveTab: (tab: string) => void;
}

export const OCRExtractionPage: React.FC<OCRExtractionPageProps> = ({ setActiveTab }) => {
  const { applications, selectedAppId, setSelectedAppId, showToast, addAuditLog, currentUser } = useApp();

  const app = applications.find((a) => a.id === selectedAppId) || applications[0];
  const [selectedDocId, setSelectedDocId] = useState<string>(app?.documents[0]?.id || '');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedFields, setEditedFields] = useState<Record<string, string>>({});

  const activeDoc = app?.documents.find((d) => d.id === selectedDocId) || app?.documents[0];

  React.useEffect(() => {
    if (activeDoc) {
      setEditedFields({ ...activeDoc.extractedFields });
    }
  }, [selectedDocId, app]);

  const handleSaveCorrections = () => {
    if (!activeDoc) return;
    activeDoc.extractedFields = { ...editedFields };
    setIsEditing(false);
    showToast(`Corrections saved for ${activeDoc.name}`, 'success');

    addAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: 'OCR Field Correction by User',
      applicationId: app.id,
      object: activeDoc.name,
      newValue: JSON.stringify(editedFields),
      outcome: 'User verified and amended OCR metadata fields',
    });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">AI OCR & Structured Extraction Workspace</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Side-by-side comparison of document scan with AI-parsed statutory attributes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Application:</label>
          <select
            value={app.id}
            onChange={(e) => {
              setSelectedAppId(e.target.value);
              const target = applications.find((a) => a.id === e.target.value);
              if (target && target.documents.length > 0) {
                setSelectedDocId(target.documents[0].id);
              }
            }}
            className="px-3 py-1.5 text-xs bg-white border border-sky-200 rounded-xl font-bold text-[#0284C7]"
          >
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} - {a.institutionName.slice(0, 20)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Selector Pills */}
      <div className="bg-white p-2.5 rounded-2xl border border-sky-100 shadow-xs flex items-center gap-2 overflow-x-auto text-xs">
        <span className="font-bold text-slate-400 px-2 uppercase text-[10px]">Select Document:</span>
        {app.documents.map((doc) => (
          <button
            key={doc.id}
            onClick={() => {
              setSelectedDocId(doc.id);
              setIsEditing(false);
            }}
            className={`px-3 py-1.5 rounded-xl font-medium shrink-0 flex items-center gap-1.5 transition-all ${
              selectedDocId === doc.id
                ? 'bg-[#0284C7] text-white font-bold shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{doc.name}</span>
          </button>
        ))}
      </div>

      {activeDoc ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Original Document Visual Simulation */}
          <div className="lg:col-span-6 bg-white rounded-[22px] border border-sky-100 shadow-xs p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100 text-xs">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0284C7]" />
                <span className="font-bold text-slate-800">{activeDoc.name}</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                Page 1 of {activeDoc.pageCount}
              </span>
            </div>

            {/* Document Mock Viewer with Bounding Box Highlights */}
            <div className="mt-4 flex-1 min-h-[420px] bg-slate-50 rounded-2xl border border-slate-200 p-6 font-serif relative overflow-hidden select-none">
              {/* Stamp watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 border-4 border-sky-300/40 text-sky-400/40 text-3xl font-extrabold px-6 py-2 rounded-xl pointer-events-none uppercase tracking-widest">
                VERIFIED COPY
              </div>

              {/* Document Header */}
              <div className="text-center pb-4 border-b-2 border-slate-300">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  GOVERNMENT OF INDIA / COMPETENT STATUTORY AUTHORITY
                </div>
                <div className="text-base font-extrabold text-slate-900 mt-1">
                  {activeDoc.category.toUpperCase()}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Ref No: DFS/APH/2026/899120 • Date of Issue: 2025-11-20</div>
              </div>

              {/* Body Text with highlighted extracted boxes */}
              <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-700">
                <p>
                  THIS IS TO CERTIFY THAT THE PREMISES OF{' '}
                  <mark className="bg-sky-200/80 px-1 py-0.5 rounded font-bold text-[#0284C7]">
                    {activeDoc.extractedFields['Institution Name'] || app.institutionName}
                  </mark>{' '}
                  LOCATED AT CAMPUS PREMISES HAVE BEEN DULY INSPECTED AND VALIDATED FOR OCCUPANCY AND COMPLIANCE WITH REGULATORY NORMS.
                </p>

                <p>
                  CERTIFICATE NUMBER:{' '}
                  <mark className="bg-emerald-200/80 px-1 py-0.5 rounded font-mono font-bold text-emerald-900">
                    {activeDoc.extractedFields['NOC Certificate No'] || activeDoc.extractedFields['Reg Number'] || 'FS-GBN-2025-9921'}
                  </mark>
                </p>

                <p>
                  THIS APPROVAL REMAINS IN FULL FORCE AND VALID UNTIL:{' '}
                  <mark className="bg-amber-200/80 px-1 py-0.5 rounded font-bold text-amber-900">
                    {activeDoc.extractedFields['Expiry Date'] || '2027-11-19'}
                  </mark>{' '}
                  SUBJECT TO ANNUAL COMPLIANCE VERIFICATION.
                </p>
              </div>

              {/* Digital Seal Footer */}
              <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end text-[10px] text-slate-500">
                <div>
                  <div className="h-10 w-24 border border-dashed border-slate-400 flex items-center justify-center font-mono text-[9px] text-slate-400">
                    [QR SEAL]
                  </div>
                  <span className="block mt-1">Digital Signature Key Verified</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-800">COMPETENT STATUTORY AUTHORITY</div>
                  <div>DIRECTOR OF APPROVALS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Extracted Structured Fields */}
          <div className="lg:col-span-6 bg-white rounded-[22px] border border-sky-100 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div>
                  <h3 className="text-sm font-bold text-[#183153]">Extracted Regulatory Fields</h3>
                  <p className="text-xs text-slate-400">Confidence: {activeDoc.ocrConfidence}%</p>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 text-[#0284C7] text-xs font-semibold hover:bg-sky-100 flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Fields'}</span>
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {Object.entries(editedFields).map(([key, val]) => (
                  <div key={key} className="p-3 rounded-xl bg-[#F4F9FF] border border-sky-100 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{key}</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={val}
                        onChange={(e) => setEditedFields({ ...editedFields, [key]: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-sky-200 bg-white text-xs font-semibold text-slate-800"
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{val}</span>
                        <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          Matched 98%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isEditing && (
              <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleSaveCorrections}
                  className="px-4 py-2 bg-[#0284C7] text-white text-xs font-bold rounded-xl hover:bg-[#0369A1] flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Corrections & Update Audit</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 bg-white rounded-2xl text-center text-slate-400 text-xs">
          No documents uploaded yet for OCR extraction.
        </div>
      )}
    </div>
  );
};
