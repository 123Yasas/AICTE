import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import {
  BookOpenCheck,
  Plus,
  Power,
  FileText,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface RuleConfigPageProps {
  setActiveTab: (tab: string) => void;
}

export const RuleConfigPage: React.FC<RuleConfigPageProps> = ({ setActiveTab }) => {
  const { rules, toggleRule, addRule, showToast } = useApp();

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newRule, setNewRule] = useState({
    code: 'APH-2026-SEC-11.2',
    title: '',
    category: 'Infrastructure & Safety',
    description: '',
    validationLogic: '',
    requiredEvidence: '',
    severity: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    sourceHandbook: 'AICTE Approval Process Handbook (APH 2026-27), Appendix 8',
    version: 'v2026.3.0',
    effectiveDate: '2026-01-01',
    isActive: true,
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule.title || !newRule.description) {
      showToast('Please specify a title and description for the new rule', 'warning');
      return;
    }
    addRule(newRule);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">Regulatory Rules Configuration</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure APH handbook validation parameters and version-controlled criteria
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-[#0369A1] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Regulatory Rule</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubmit} className="bg-white p-6 rounded-[22px] border border-sky-100 shadow-md space-y-4 text-xs animate-in fade-in zoom-in-95">
          <h3 className="font-bold text-sm text-[#183153]">Add New APH Compliance Rule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Rule Code</label>
              <input
                type="text"
                value={newRule.code}
                onChange={(e) => setNewRule({ ...newRule, code: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-sky-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Rule Title</label>
              <input
                type="text"
                placeholder="e.g. Ramp & Barrier-Free Access Norms"
                value={newRule.title}
                onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-sky-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Severity</label>
              <select
                value={newRule.severity}
                onChange={(e) => setNewRule({ ...newRule, severity: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-white"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Requirement Description</label>
            <textarea
              rows={2}
              placeholder="State the regulatory condition mandated by AICTE..."
              value={newRule.description}
              onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-sky-200"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#0284C7] text-white font-bold hover:bg-[#0369A1]"
            >
              Save Rule
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-6 rounded-[22px] border transition-all text-xs space-y-3 ${
              rule.isActive ? 'bg-white border-sky-100 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  {rule.code}
                </span>
                <span className="font-bold text-sm text-[#183153]">{rule.title}</span>
                <Badge
                  variant={
                    rule.severity === 'Critical' ? 'error' : rule.severity === 'High' ? 'warning' : 'info'
                  }
                  size="sm"
                >
                  {rule.severity} Severity
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">{rule.version}</span>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    rule.isActive
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{rule.isActive ? 'Active' : 'Disabled'}</span>
                </button>
              </div>
            </div>

            <p className="text-slate-600 font-normal leading-relaxed">{rule.description}</p>

            <div className="p-3 rounded-xl bg-[#F4F9FF] border border-sky-100 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[9px]">Validation Logic Expression</span>
                <code className="text-[#0284C7] font-mono">{rule.validationLogic}</code>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[9px]">Source Regulatory Document</span>
                <span className="text-slate-700">{rule.sourceHandbook}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
