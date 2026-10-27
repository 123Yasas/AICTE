import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import {
  Building,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Check,
  X,
  Sparkles,
  Search,
} from 'lucide-react';

interface InfrastructureReviewPageProps {
  setActiveTab: (tab: string) => void;
}

export const InfrastructureReviewPage: React.FC<InfrastructureReviewPageProps> = ({ setActiveTab }) => {
  const { applications, selectedAppId, setSelectedAppId, currentUser, showToast, addAuditLog } = useApp();

  const app = applications.find((a) => a.id === selectedAppId) || applications[0];

  const [selectedAssetId, setSelectedAssetId] = useState<string>(app?.infrastructureAssets[0]?.id || '');
  const [officerNote, setOfficerNote] = useState<string>('');

  const allAssets = applications.flatMap((a) =>
    a.infrastructureAssets.map((asset) => ({
      ...asset,
      applicationId: a.id,
      institutionName: a.institutionName,
    }))
  );

  const activeAsset = allAssets.find((a) => a.id === selectedAssetId) || allAssets[0];

  const handleAction = (status: 'Accepted' | 'Request Additional' | 'Flagged for Review' | 'Recommend Physical Inspection') => {
    if (!activeAsset) return;
    activeAsset.status = status;
    activeAsset.reviewerComment = officerNote || activeAsset.reviewerComment;
    showToast(`Infrastructure review updated: ${status}`, 'success');

    addAuditLog({
      actor: currentUser.name,
      actorRole: currentUser.role,
      action: `Infrastructure Decision: ${status}`,
      applicationId: activeAsset.applicationId,
      object: activeAsset.title,
      newValue: status,
      outcome: officerNote || `Officer updated asset status to ${status}`,
    });
    setOfficerNote('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">Infrastructure Evidence Review</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Computer vision assisted inspection of laboratories, workshops, libraries, and smart facilities
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
          <strong>AI Vision Observation:</strong> Distinguishes visual observations from physical ground verification.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Gallery of Uploaded Evidence */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold text-[#183153]">Institutional Visual Evidence ({allAssets.length})</h3>

          <div className="space-y-3">
            {allAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => setSelectedAssetId(asset.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                  activeAsset?.id === asset.id
                    ? 'bg-white border-[#0284C7] ring-2 ring-sky-100 shadow-md'
                    : 'bg-white border-sky-100 hover:border-sky-200 shadow-xs'
                }`}
              >
                <img
                  src={asset.imageUrl}
                  alt={asset.title}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-800 truncate">{asset.title}</span>
                    <Badge variant={asset.status === 'Accepted' ? 'success' : 'warning'} size="sm">
                      {asset.status}
                    </Badge>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5 truncate">{asset.institutionName}</div>
                  <div className="text-[#0284C7] font-semibold text-[11px] mt-1">
                    AI: {asset.aiCategoryDetected} ({asset.aiConfidence}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Computer Vision Inspection Workspace */}
        <div className="lg:col-span-7 bg-white p-6 rounded-[22px] border border-sky-100 shadow-xs flex flex-col justify-between">
          {activeAsset ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-sky-100">
                <div>
                  <h3 className="text-base font-bold text-[#183153]">{activeAsset.title}</h3>
                  <p className="text-xs text-slate-500">{activeAsset.institutionName} • Category: {activeAsset.category}</p>
                </div>
                <Badge variant="teal" size="md">
                  Quality: {activeAsset.qualityScore}
                </Badge>
              </div>

              {/* Large Image Preview with AI detection overlay tags */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={activeAsset.imageUrl}
                  alt={activeAsset.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-white font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>AI Classified: {activeAsset.aiCategoryDetected} ({activeAsset.aiConfidence}%)</span>
                </div>
              </div>

              {/* Computer Vision Key Findings */}
              <div className="p-4 rounded-xl bg-[#F4F9FF] border border-sky-100 space-y-2">
                <span className="font-bold text-slate-700 block">AI Detected Features & Visible Hardware</span>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                  {activeAsset.aiObservations.map((obs, i) => (
                    <li key={i}>{obs}</li>
                  ))}
                </ul>
              </div>

              {/* Discrepancies if any */}
              {activeAsset.potentialDiscrepancies.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                  <strong>Potential Concern:</strong> {activeAsset.potentialDiscrepancies.join(', ')}
                </div>
              )}

              {/* Reviewer Actions */}
              {currentUser.role !== 'institution' && (
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <span className="font-bold text-slate-700 block">Scrutiny Officer Determination</span>
                  <input
                    type="text"
                    placeholder="Enter observation or inspector guidance..."
                    value={officerNote}
                    onChange={(e) => setOfficerNote(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sky-200"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleAction('Accepted')}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept Evidence</span>
                    </button>
                    <button
                      onClick={() => handleAction('Request Additional')}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 flex items-center gap-1 cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Request Additional Evidence</span>
                    </button>
                    <button
                      onClick={() => handleAction('Recommend Physical Inspection')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] flex items-center gap-1 cursor-pointer"
                    >
                      <Building className="w-3.5 h-3.5" />
                      <span>Recommend Physical Inspection</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select an infrastructure photo to inspect AI detection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
