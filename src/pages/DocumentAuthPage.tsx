import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import {
  ShieldCheck,
  QrCode,
  Key,
  Globe,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Lock,
} from 'lucide-react';

interface DocumentAuthPageProps {
  setActiveTab: (tab: string) => void;
}

export const DocumentAuthPage: React.FC<DocumentAuthPageProps> = ({ setActiveTab }) => {
  const {
    applications,
    selectedAppId,
    setSelectedAppId,
    triggerExternalVerification,
    showToast,
  } = useApp();

  const app = applications.find((a) => a.id === selectedAppId) || applications[0];

  const [selectedDocId, setSelectedDocId] = useState<string>(app?.documents[0]?.id || '');
  const [selectedMethod, setSelectedMethod] = useState<string>('State Fire Services Portal API');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [lastResponsePayload, setLastResponsePayload] = useState<any>(null);

  const activeDoc = app?.documents.find((d) => d.id === selectedDocId) || app?.documents[0];

  const handleVerify = () => {
    if (!activeDoc) return;
    setIsVerifying(true);
    setTimeout(() => {
      triggerExternalVerification(app.id, activeDoc.id, selectedMethod);
      setIsVerifying(false);
      setLastResponsePayload({
        status: 'SUCCESS_200',
        authority: selectedMethod,
        refNumber: activeDoc.extractedFields['NOC Certificate No'] || activeDoc.extractedFields['Reg Number'] || 'STATE-NOC-2026',
        timestamp: new Date().toISOString(),
        cryptographicProof: 'SHA256-RSA: 89ab34ef78cd9012ef34567890abcdef',
      });
    }, 900);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">Document Authentication Centre</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Query authorized state issuing portals, Digilocker repositories, and QR cryptographic seals
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

      {/* Mandatory Regulatory Notice Banner */}
      <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#0284C7] shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">DEMO VERIFICATION — NOT AN OFFICIAL CONFIRMATION</strong>
          External responses are simulated through authorized test adapters. Official statutory confirmation requires live API gateway responses from the competent state directorates.
        </div>
      </div>

      {/* Verification Workflow Steps Box */}
      <div className="bg-white p-6 rounded-[22px] border border-sky-100 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-[#183153]">7-Step Verification Workflow</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Step 1: Select Target Document</label>
            <select
              value={selectedDocId}
              onChange={(e) => setSelectedDocId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-sky-200 bg-white font-medium"
            >
              {app.documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Step 2: Verification Adapter / Method</label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-sky-200 bg-white font-medium"
            >
              <option value="QR Code Cryptographic Signature">QR Code Cryptographic Signature</option>
              <option value="State Fire Services Portal API">State Fire Services Portal API</option>
              <option value="University Affiliation ERP Gateway">University Affiliation ERP Gateway</option>
              <option value="State Revenue / Bhulekh Land Portal">State Revenue / Bhulekh Land Portal</option>
              <option value="DigiLocker / National Academic Depository">DigiLocker / NAD Gateway</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleVerify}
              disabled={isVerifying || !activeDoc}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0284C7] text-white font-bold hover:bg-[#0369A1] disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Querying Adapter...' : 'Execute Authentication Check'}</span>
            </button>
          </div>
        </div>

        {/* Selected Document Details & Verification Outcome */}
        {activeDoc && (
          <div className="p-5 rounded-2xl bg-[#F4F9FF] border border-sky-100 text-xs space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="font-bold text-slate-800 text-sm">{activeDoc.name}</span>
                <p className="text-slate-500 text-[11px]">{activeDoc.category} • Size: {activeDoc.fileSize}</p>
              </div>
              <Badge variant={getStatusBadgeVariant(activeDoc.verificationStatus)} size="md">
                {activeDoc.verificationStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-white border border-sky-100">
                <span className="text-slate-400 block font-bold uppercase text-[9px]">Issuing Authority</span>
                <span className="font-bold text-slate-800">
                  {activeDoc.extractedFields['Issuing Authority'] || 'State Competent Authority'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-sky-100">
                <span className="text-slate-400 block font-bold uppercase text-[9px]">Certificate Ref No</span>
                <span className="font-bold font-mono text-slate-800">
                  {activeDoc.extractedFields['NOC Certificate No'] || activeDoc.extractedFields['Reg Number'] || 'NOC-2026-99'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-sky-100">
                <span className="text-slate-400 block font-bold uppercase text-[9px]">Source Adapter</span>
                <span className="font-bold text-slate-800">{activeDoc.verificationSource || selectedMethod}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-sky-100">
                <span className="text-slate-400 block font-bold uppercase text-[9px]">Last Check Timestamp</span>
                <span className="font-mono text-slate-700">{activeDoc.verificationTimestamp || 'Not yet queried'}</span>
              </div>
            </div>

            {/* Gateway raw response payload */}
            {lastResponsePayload && (
              <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                <div className="text-[10px] text-slate-400 mb-1">// RESPONSE ADAPTER PAYLOAD (MOCK GATEWAY):</div>
                <pre>{JSON.stringify(lastResponsePayload, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
