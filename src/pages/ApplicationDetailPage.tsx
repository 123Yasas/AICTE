import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import {
  Building2,
  FileText,
  ScanText,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  ClipboardCheck,
  Building,
  AlertTriangle,
  History,
  Scale,
  Sparkles,
  FileDown,
  Upload,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Plus,
} from 'lucide-react';

interface ApplicationDetailPageProps {
  setActiveTab: (tab: string) => void;
}

export const ApplicationDetailPage: React.FC<ApplicationDetailPageProps> = ({ setActiveTab }) => {
  const {
    applications,
    selectedAppId,
    setSelectedAppId,
    triggerValidation,
    triggerAnomalyScan,
    triggerExternalVerification,
    replaceDocument,
    auditLogs,
    currentUser,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'documents' | 'ocr' | 'validation' | 'anomalies' | 'verification' | 'compliance' | 'infrastructure' | 'deficiencies' | 'audit'
  >('overview');

  const [replaceModalDocId, setReplaceModalDocId] = useState<string | null>(null);
  const [replacementFileName, setReplacementFileName] = useState<string>('');

  const app = applications.find((a) => a.id === selectedAppId) || applications[0];

  if (!app) {
    return (
      <div className="p-8 text-center text-slate-500">
        Application not found. Please select an application from the registry.
      </div>
    );
  }

  const appAuditLogs = auditLogs.filter(
    (log) => log.applicationId === app.id || log.applicationId === 'SYSTEM-CONFIG'
  );

  const handleExecuteReplacement = (docId: string) => {
    if (!replacementFileName) return;
    replaceDocument(app.id, docId, {
      name: replacementFileName.endsWith('.pdf') ? replacementFileName : `${replacementFileName}.pdf`,
    });
    setReplaceModalDocId(null);
    setReplacementFileName('');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <button onClick={() => setActiveTab('applications')} className="hover:text-[#0284C7]">
            Applications
          </button>
          <span>/</span>
          <span className="font-mono font-bold text-slate-700">{app.id}</span>
          <span>/</span>
          <span className="text-[#0284C7] font-semibold truncate max-w-[200px]">{app.institutionName}</span>
        </div>

        {/* Quick select other application dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Switch Application:</label>
          <select
            value={app.id}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-sky-200 rounded-xl font-bold text-[#0284C7]"
          >
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} - {a.institutionName.slice(0, 24)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Application Header Card */}
      <div className="bg-white rounded-[22px] p-6 border border-sky-100 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-xs text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100">
              {app.id}
            </span>
            <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
              {app.category}
            </span>
            <span className="text-xs text-slate-400">Academic Year {app.academicYear}</span>
            <Badge variant={getStatusBadgeVariant(app.status)} size="sm">
              {app.status}
            </Badge>
          </div>

          <h1 className="text-2xl font-extrabold text-[#183153] mt-2 tracking-tight">
            {app.institutionName}
          </h1>

          <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
            <span>📍 {app.address}, {app.district}, {app.state}</span>
            <span>• Submitted: {app.submissionDate}</span>
            <span>• Reviewing Officer: <strong className="text-slate-700">{app.assignedOfficer}</strong></span>
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerValidation(app.id)}
            className="px-3.5 py-2 rounded-xl bg-sky-50 text-[#0284C7] text-xs font-bold hover:bg-sky-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Run Validation</span>
          </button>
          <button
            onClick={() => triggerAnomalyScan(app.id)}
            className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
            <span>Scan Anomalies</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>PDF Report</span>
          </button>
          <button
            onClick={() => setActiveTab('officer-workspace')}
            className="px-4 py-2 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-[#0369A1] transition-colors flex items-center gap-1.5 shadow-sm shadow-sky-500/20 cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Officer Desk</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Ribbon */}
      <div className="bg-white p-1.5 rounded-2xl border border-sky-100 shadow-xs flex items-center gap-1 overflow-x-auto text-xs font-medium">
        {[
          { id: 'overview', label: 'Overview', icon: Building2 },
          { id: 'documents', label: `Documents (${app.documents.length})`, icon: FileText },
          { id: 'ocr', label: 'OCR Workspace', icon: ScanText },
          { id: 'validation', label: `Validation (${app.findings.length})`, icon: CheckCircle2 },
          { id: 'anomalies', label: `Anomalies (${app.anomalies.length})`, icon: AlertOctagon },
          { id: 'verification', label: 'Authentication', icon: ShieldAlert },
          { id: 'compliance', label: `Compliance (${app.complianceChecks.length})`, icon: ClipboardCheck },
          { id: 'infrastructure', label: `Infrastructure (${app.infrastructureAssets.length})`, icon: Building },
          { id: 'deficiencies', label: `Deficiencies (${app.deficiencies.length})`, icon: AlertTriangle },
          { id: 'audit', label: 'Audit Trail', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as typeof activeSubTab)}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 shrink-0 transition-all ${
                isActive
                  ? 'bg-sky-500/10 text-[#0284C7] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-Tab 1: Overview */}
      {activeSubTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-[22px] border border-sky-100 shadow-xs">
              <h3 className="text-sm font-bold text-[#183153] mb-4">Institutional Profile & Academic Intake</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-[#F4F9FF] border border-sky-100">
                  <span className="text-slate-400 block">Permanent AICTE ID</span>
                  <span className="font-mono font-bold text-slate-800">{app.institutionId}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F4F9FF] border border-sky-100">
                  <span className="text-slate-400 block">Sanctioned Intake</span>
                  <span className="font-bold text-[#0284C7]">{app.totalIntake} Students</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F4F9FF] border border-sky-100">
                  <span className="text-slate-400 block">Faculty Strength</span>
                  <span className="font-bold text-emerald-700">{app.facultyCount} Qualified</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F4F9FF] border border-sky-100">
                  <span className="text-slate-400 block">Land Area</span>
                  <span className="font-bold text-slate-800">{app.landAreaAcres} Acres</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F4F9FF] border border-sky-100">
                  <span className="text-slate-400 block">Built-Up Area</span>
                  <span className="font-bold text-slate-800">{app.builtUpAreaSqMeters.toLocaleString()} sqm</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F4F9FF] border border-sky-100">
                  <span className="text-slate-400 block">Cadre Ratio</span>
                  <span className="font-bold text-slate-800">1:{Math.round(app.totalIntake / app.facultyCount)} Ratio</span>
                </div>
              </div>

              <div className="mt-5">
                <span className="text-xs font-bold text-slate-700 block mb-2">Approved Programmes</span>
                <div className="flex flex-wrap gap-2">
                  {app.approvedProgrammes.map((prog, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-sky-50 border border-sky-100 text-xs font-semibold text-[#0284C7]"
                    >
                      {prog}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrutiny notes */}
            <div className="bg-white p-6 rounded-[22px] border border-sky-100 shadow-xs">
              <h3 className="text-sm font-bold text-[#183153] mb-2">AICTE Reviewing Officer Observations</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-[#F4F9FF] p-4 rounded-xl border border-sky-100">
                {app.officerNotes || 'No official scrutiny remarks filed yet.'}
              </p>
            </div>
          </div>

          {/* Right column status summary */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-[22px] border border-sky-100 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#183153]">Compliance Status Summary</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-600">Rule Validation</span>
                  <Badge variant={getStatusBadgeVariant(app.validationStatus)} size="sm">
                    {app.validationStatus}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-600">Source Authentication</span>
                  <Badge variant={getStatusBadgeVariant(app.verificationStatus)} size="sm">
                    {app.verificationStatus}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-600">Compliance Norms</span>
                  <Badge variant={getStatusBadgeVariant(app.complianceStatus)} size="sm">
                    {app.complianceStatus}
                  </Badge>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => setActiveSubTab('documents')}
                  className="w-full py-2 bg-sky-50 text-[#0284C7] rounded-xl text-xs font-bold hover:bg-sky-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Inspect Supporting Documents</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Documents */}
      {activeSubTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#183153]">Uploaded Documents Checklist ({app.documents.length})</h3>
            <button
              onClick={() => setActiveTab('document-upload')}
              className="px-3 py-1.5 rounded-xl bg-[#0284C7] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Upload More</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {app.documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-[20px] border border-sky-100 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">{doc.category}</span>
                    <Badge variant={getStatusBadgeVariant(doc.verificationStatus)} size="sm">
                      {doc.verificationStatus}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-sm text-[#183153] flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0284C7]" />
                    <span>{doc.name}</span>
                  </h4>
                  <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-3">
                    <span>Size: {doc.fileSize}</span>
                    <span>Pages: {doc.pageCount}</span>
                    <span>OCR: {doc.ocrConfidence}%</span>
                    {doc.expiryDate && <span>Expiry: {doc.expiryDate}</span>}
                  </div>

                  {doc.hasReplacement && (
                    <div className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      Replacement Document Uploaded on {doc.replacementDate}
                    </div>
                  )}

                  {/* Extracted sample fields preview */}
                  <div className="mt-3 p-3 rounded-xl bg-[#F4F9FF] border border-sky-100/80 text-[11px] space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Extracted Metadata</span>
                    {Object.entries(doc.extractedFields).slice(0, 3).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-slate-500">{k}:</span>
                        <span className="font-bold text-slate-800 truncate max-w-[180px]">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => {
                      triggerExternalVerification(app.id, doc.id, 'State Authorized Portal API');
                    }}
                    className="text-[#0284C7] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-verify</span>
                  </button>
                  <button
                    onClick={() => setReplaceModalDocId(doc.id)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                  >
                    Replace Document
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Replacement Modal */}
          {replaceModalDocId && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-sky-100 text-left animate-in fade-in zoom-in-95">
                <h3 className="text-base font-bold text-[#183153]">Upload Replacement Document</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload certified replacement copy to resolve discrepancy or expired certificate.
                </p>
                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">New File Name / Reference</label>
                  <input
                    type="text"
                    placeholder="e.g. Renewed_Fire_Safety_NOC_2027.pdf"
                    value={replacementFileName}
                    onChange={(e) => setReplacementFileName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-sky-200"
                  />
                </div>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    onClick={() => setReplaceModalDocId(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleExecuteReplacement(replaceModalDocId)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0284C7] text-white hover:bg-[#0369A1]"
                  >
                    Confirm Replacement
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 3: OCR Workspace */}
      {activeSubTab === 'ocr' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-[22px] border border-sky-100 shadow-xs">
            <h3 className="text-sm font-bold text-[#183153] mb-1">Optical Character Recognition & Semantic Parser</h3>
            <p className="text-xs text-slate-400 mb-4">
              Extracted key-value pairs compared with application form submissions.
            </p>

            <div className="space-y-4">
              {app.documents.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl border border-sky-100 bg-[#F4F9FF]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xs text-slate-800">{doc.name}</span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      OCR Confidence: {doc.ocrConfidence}%
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {Object.entries(doc.extractedFields).map(([field, val]) => (
                      <div key={field} className="p-2.5 rounded-lg bg-white border border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">{field}</span>
                        <span className="font-semibold text-slate-800">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Validation Results */}
      {activeSubTab === 'validation' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#183153]">Intelligent Validation Engine Findings ({app.findings.length})</h3>
            <button
              onClick={() => triggerValidation(app.id)}
              className="px-3 py-1.5 rounded-xl bg-sky-50 text-[#0284C7] text-xs font-bold hover:bg-sky-100 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-run Rule Checks</span>
            </button>
          </div>

          {app.findings.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-sky-100 text-center text-xs text-slate-500">
              No negative findings or discrepancies detected.
            </div>
          ) : (
            <div className="space-y-3">
              {app.findings.map((finding) => (
                <div
                  key={finding.id}
                  className="bg-white p-5 rounded-2xl border border-sky-100 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4"
                >
                  <div className="flex-1 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-[#0284C7]">{finding.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-700">{finding.ruleApplied}</span>
                      <Badge variant={getStatusBadgeVariant(finding.status)} size="sm">
                        {finding.status}
                      </Badge>
                    </div>

                    <p className="mt-2 text-slate-700 font-medium leading-relaxed">{finding.explanation}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Extracted Value:</span>
                        <span className="font-bold text-slate-800">{finding.extractedValue}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Comparison Norm:</span>
                        <span className="font-bold text-slate-800">{finding.comparisonValue}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] text-[#0284C7] font-semibold">
                      Recommendation: {finding.recommendedAction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-Tab 5: Anomalies */}
      {activeSubTab === 'anomalies' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#183153]">Document Anomaly & Forensic Scan</h3>
          {app.anomalies.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-sky-100 text-center text-xs text-slate-500">
              No forensic anomalies or hash duplication detected.
            </div>
          ) : (
            app.anomalies.map((anom) => (
              <div key={anom.id} className="p-5 rounded-2xl bg-white border border-rose-100 shadow-xs text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-700">{anom.category}</span>
                  <Badge variant="error" size="sm">{anom.severity}</Badge>
                </div>
                <p className="text-slate-700 font-medium">{anom.reason}</p>
                <div className="p-2.5 rounded-xl bg-rose-50/50 text-[11px] text-rose-900">
                  <strong>Evidence:</strong> {anom.evidence}
                </div>
                <div className="text-[11px] text-slate-500">
                  Detection Method: {anom.detectionMethod} • AI Confidence: {anom.confidence}%
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sub-Tab 8: Infrastructure Assets */}
      {activeSubTab === 'infrastructure' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#183153]">Computer Vision Infrastructure Inspection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {app.infrastructureAssets.map((asset) => (
              <div key={asset.id} className="bg-white rounded-2xl border border-sky-100 overflow-hidden shadow-xs text-xs">
                <img src={asset.imageUrl} alt={asset.title} className="w-full h-44 object-cover" />
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800">{asset.title}</span>
                    <Badge variant="success" size="sm">{asset.status}</Badge>
                  </div>
                  <div className="text-[11px] text-[#0284C7] font-semibold">
                    Detected: {asset.aiCategoryDetected} ({asset.aiConfidence}%)
                  </div>
                  <ul className="list-disc pl-4 text-[11px] text-slate-600 space-y-0.5">
                    {asset.aiObservations.map((obs, i) => (
                      <li key={i}>{obs}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Tab 9: Deficiencies */}
      {activeSubTab === 'deficiencies' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[#183153]">Active Deficiencies & Rectification Notices</h3>
          {app.deficiencies.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-sky-100 text-center text-xs text-slate-500">
              Zero active regulatory deficiencies.
            </div>
          ) : (
            app.deficiencies.map((def) => (
              <div key={def.id} className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-amber-800">{def.id}</span>
                  <Badge variant={getStatusBadgeVariant(def.status)} size="sm">{def.status}</Badge>
                </div>
                <h4 className="font-bold text-slate-800 text-sm">{def.category}</h4>
                <p className="text-slate-600">{def.description}</p>
                <div className="p-3 rounded-xl bg-amber-50/70 text-amber-900 text-[11px]">
                  <strong>Required Rectification:</strong> {def.requiredCorrection} (Due: {def.dueDate})
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sub-Tab 10: Audit */}
      {activeSubTab === 'audit' && (
        <div className="bg-white p-5 rounded-[22px] border border-sky-100 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#183153]">Application Audit Log & Regulatory History</h3>
          <div className="space-y-3">
            {appAuditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-[#F4F9FF] border border-sky-100 text-xs">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span className="font-mono">{log.timestamp}</span>
                  <span className="font-semibold text-[#0284C7]">{log.actor}</span>
                </div>
                <div className="font-bold text-slate-800 mt-1">{log.action}</div>
                <p className="text-slate-600 text-[11px] mt-0.5">{log.outcome}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
