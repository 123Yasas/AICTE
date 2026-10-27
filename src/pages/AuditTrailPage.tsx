import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  User,
  Clock,
  Sparkles,
  FileText,
  Lock,
} from 'lucide-react';

interface AuditTrailPageProps {
  setActiveTab: (tab: string) => void;
}

export const AuditTrailPage: React.FC<AuditTrailPageProps> = ({ setActiveTab }) => {
  const { auditLogs } = useApp();
  const [filterAction, setFilterAction] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchTerm === '' ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.object.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterAction === 'all' || log.action.toLowerCase().includes(filterAction.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">Audit Trail & Transparency</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed chronological log of all application events, OCR extractions, and decisions
          </p>
        </div>

        <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100 text-xs text-[#0284C7] font-semibold flex items-center gap-2">
          <Lock className="w-4 h-4" />
          <span>Immutable Ledger Active • {auditLogs.length} Events Logged</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by actor, action, application ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F4F9FF] border border-sky-200 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-semibold">Event Type:</span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#F4F9FF] border border-sky-200 text-xs"
          >
            <option value="all">All Events</option>
            <option value="Upload">Uploads & Replacements</option>
            <option value="Rule">Rule Validations</option>
            <option value="Officer">Officer Decisions</option>
            <option value="External">External Authentications</option>
          </select>
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white p-6 rounded-[22px] border border-sky-100 shadow-xs space-y-6">
        <div className="relative border-l-2 border-sky-200 ml-4 space-y-6">
          {filteredLogs.map((log) => (
            <div key={log.id} className="relative pl-6">
              {/* Dot icon */}
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-2 border-[#0284C7] flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-[#0284C7]" />
              </div>

              <div className="p-4 rounded-xl bg-[#F4F9FF] border border-sky-100/90 text-xs space-y-1.5 hover:border-sky-300 transition-colors">
                <div className="flex justify-between items-center flex-wrap gap-1 text-[11px]">
                  <span className="font-mono text-slate-400">{log.timestamp}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0284C7] bg-white px-2 py-0.5 rounded border border-sky-100">
                      {log.applicationId}
                    </span>
                    <Badge variant={log.actorRole === 'system' ? 'purple' : log.actorRole === 'officer' ? 'teal' : 'neutral'} size="sm">
                      {log.actor} ({log.actorRole})
                    </Badge>
                  </div>
                </div>

                <h4 className="font-bold text-slate-800 text-sm">{log.action}</h4>
                <div className="text-slate-600 font-medium">Target Object: <strong>{log.object}</strong></div>

                {log.previousValue && (
                  <div className="text-[11px] text-slate-500">
                    <span className="text-slate-400">Previous:</span> {log.previousValue} → <span className="text-slate-400">New:</span> {log.newValue}
                  </div>
                )}

                <div className="text-[11px] text-slate-700 font-normal pt-1 border-t border-slate-200/60">
                  Result: {log.outcome}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
