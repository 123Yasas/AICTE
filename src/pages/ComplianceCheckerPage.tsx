import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  BookOpen,
  Filter,
  FileText,
} from 'lucide-react';

interface ComplianceCheckerPageProps {
  setActiveTab: (tab: string) => void;
}

export const ComplianceCheckerPage: React.FC<ComplianceCheckerPageProps> = ({ setActiveTab }) => {
  const { applications, selectedAppId, setSelectedAppId, rules } = useApp();

  const app = applications.find((a) => a.id === selectedAppId) || applications[0];
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const complianceItems = app?.complianceChecks || [];

  const passedCount = complianceItems.filter((c) => c.outcome === 'Meets Configured Rule').length;
  const gapCount = complianceItems.filter((c) => c.outcome === 'Potential Gap Identified').length;
  const pendingCount = complianceItems.filter((c) => c.outcome === 'Verification Pending' || c.outcome === 'Insufficient Evidence').length;

  const filteredItems = complianceItems.filter((c) => {
    if (categoryFilter === 'all') return true;
    return c.category.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">Regulatory Compliance Checker</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Validation matrix based on AICTE Approval Process Handbook (APH 2026-27)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Target Application:</label>
          <select
            value={app.id}
            onChange={(e) => setSelectedAppId(e.target.value)}
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

      {/* Compliance Score Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-bold">Active APH Rules</span>
            <span className="text-2xl font-extrabold text-[#183153]">{rules.length} Configured</span>
          </div>
          <BookOpen className="w-8 h-8 text-[#0284C7] opacity-80" />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-bold">Passed Checks</span>
            <span className="text-2xl font-extrabold text-emerald-600">{passedCount} Met</span>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-500 opacity-80" />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-bold">Identified Gaps</span>
            <span className="text-2xl font-extrabold text-amber-600">{gapCount} Gaps</span>
          </div>
          <AlertTriangle className="w-8 h-8 text-amber-500 opacity-80" />
        </div>
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-bold">Pending Review</span>
            <span className="text-2xl font-extrabold text-sky-600">{pendingCount} Items</span>
          </div>
          <Clock className="w-8 h-8 text-sky-500 opacity-80" />
        </div>
      </div>

      {/* Compliance Matrix Table */}
      <div className="bg-white rounded-[22px] border border-sky-100 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-sky-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="font-bold text-[#183153] text-sm">Regulatory Requirements & Evidence Checklist</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Filter Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-sky-200 bg-[#F4F9FF]"
            >
              <option value="all">All Categories</option>
              <option value="Safety">Safety & Statutory</option>
              <option value="Faculty">Faculty Norms</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Accreditation">Accreditation</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-600 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4 font-bold">Rule ID</th>
                <th className="py-3 px-4 font-bold">Regulatory Requirement</th>
                <th className="py-3 px-4 font-bold">Mandatory Evidence</th>
                <th className="py-3 px-4 font-bold">Submitted Evidence</th>
                <th className="py-3 px-4 font-bold">Validation Outcome</th>
                <th className="py-3 px-4 font-bold">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-sky-50/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-[#0284C7] whitespace-nowrap">
                    {item.ruleId}
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-bold text-slate-800">{item.category}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{item.requirementDescription}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {item.requiredEvidence}
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-medium text-[11px]">
                    {item.submittedEvidence}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <Badge variant={getStatusBadgeVariant(item.outcome)} size="sm">
                      {item.outcome}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px]">
                    {item.recommendedAction}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
