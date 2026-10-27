import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import {
  FileDown,
  Printer,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  Lock,
} from 'lucide-react';

interface ReportsPageProps {
  setActiveTab: (tab: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ setActiveTab }) => {
  const { applications, selectedAppId, setSelectedAppId, rules, showToast } = useApp();

  const [reportType, setReportType] = useState<'comprehensive' | 'deficiencies' | 'verification'>('comprehensive');
  const app = applications.find((a) => a.id === selectedAppId) || applications[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Application ID', 'Institution Name', 'Category', 'Status', 'Verification Status', 'Total Intake', 'Faculty Count', 'Documents Count', 'Deficiencies'];
    const rows = applications.map((a) => [
      a.id,
      `"${a.institutionName}"`,
      `"${a.category}"`,
      a.status,
      a.verificationStatus,
      a.totalIntake,
      a.facultyCount,
      a.documents.length,
      a.deficiencies.length,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICTE_SmartVerify_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported applications dataset to CSV', 'success');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Action Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">Reports & Scrutiny Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official AICTE validation summary sheets and statutory compliance dossiers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={app.id}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-sky-200 rounded-xl font-bold text-[#0284C7]"
          >
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} - {a.institutionName.slice(0, 20)}...
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Official AICTE Printable Dossier Sheet */}
      <div className="bg-white rounded-[22px] border border-sky-100 shadow-lg p-8 sm:p-12 max-w-4xl mx-auto space-y-6 text-slate-800">
        {/* Official Header */}
        <div className="text-center pb-6 border-b-2 border-slate-300">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ShieldCheck className="w-7 h-7 text-[#0284C7]" />
            <h2 className="text-xl font-black tracking-tight text-[#183153]">
              ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
            </h2>
          </div>
          <div className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
            SmartVerify AI • Statutory Application Validation Dossier
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Generated on: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • Rule Engine: APH 2026-27 (v2.4)
          </div>
        </div>

        {/* Institution Info Summary Box */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Application ID</span>
            <span className="font-mono font-bold text-[#0284C7]">{app.id}</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Institution Name</span>
            <span className="font-bold text-slate-800">{app.institutionName}</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Category</span>
            <span className="font-semibold text-slate-700">{app.category}</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Overall Status</span>
            <span className="font-bold text-emerald-700">{app.status}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-4 text-xs text-center">
          <div className="p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Approved Intake</span>
            <span className="text-lg font-bold text-slate-800">{app.totalIntake} Students</span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Faculty Cadre</span>
            <span className="text-lg font-bold text-slate-800">{app.facultyCount} Qualified</span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Land Extent</span>
            <span className="text-lg font-bold text-slate-800">{app.landAreaAcres} Acres</span>
          </div>
        </div>

        {/* Supporting Documents Section */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 border-b pb-1 text-sm">1. Supporting Documents & Verification Log</h4>
          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="p-2.5">Category</th>
                <th className="p-2.5">Document Name</th>
                <th className="p-2.5">OCR Score</th>
                <th className="p-2.5">Verification Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-[11px]">
              {app.documents.map((d) => (
                <tr key={d.id}>
                  <td className="p-2.5 font-medium">{d.category}</td>
                  <td className="p-2.5 font-bold text-slate-800">{d.name}</td>
                  <td className="p-2.5">{d.ocrConfidence}%</td>
                  <td className="p-2.5 font-bold text-emerald-700">{d.verificationStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Adverse Findings & Anomalies */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-900 border-b pb-1 text-sm">2. AI Validation Findings & Discrepancies</h4>
          {app.findings.length === 0 ? (
            <p className="text-slate-500 text-xs italic">All automated rule checks passed successfully.</p>
          ) : (
            app.findings.map((f) => (
              <div key={f.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>{f.ruleApplied}</span>
                  <span className="text-rose-600">{f.severity}</span>
                </div>
                <p className="text-slate-600 text-[11px]">{f.explanation}</p>
                <div className="text-[10px] text-slate-500">Action: {f.recommendedAction}</div>
              </div>
            ))
          )}
        </div>

        {/* Official Officer Remarks */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 border-b pb-1 text-sm">3. Reviewing Officer Determination</h4>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 leading-relaxed text-slate-700">
            {app.officerNotes || 'No adverse remarks recorded by assigned regional scrutiny officer.'}
          </div>
        </div>

        {/* Regulatory Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-[10px] text-amber-900 leading-snug">
          <strong className="block text-[11px] font-bold mb-0.5">Statutory Regulatory Safeguard:</strong>
          This document represents an AI-assisted decision-support summary. In strict adherence to AICTE guidelines, AI findings do not constitute final statutory approval or rejection. Final administrative determinations are made by the competent AICTE Executive Council and Scrutiny Committees.
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-600">
          <div>
            <div className="font-bold text-slate-800">PREPARED BY:</div>
            <div>AICTE SmartVerify AI Core Engine v2.4</div>
          </div>
          <div className="text-right">
            <div className="font-bold text-slate-800">OFFICIAL REVIEWING OFFICER:</div>
            <div>{app.assignedOfficer}</div>
            <div className="text-[10px] text-slate-400">Digitally Authenticated</div>
          </div>
        </div>
      </div>
    </div>
  );
};
