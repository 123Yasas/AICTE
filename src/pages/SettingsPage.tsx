import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Shield,
  Bell,
  HardDrive,
  RefreshCw,
  Server,
} from 'lucide-react';

interface SettingsPageProps {
  setActiveTab: (tab: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ setActiveTab }) => {
  const { showToast, applications, rules } = useApp();

  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [anomalyAutoScan, setAnomalyAutoScan] = useState<boolean>(true);
  const [ocrEngineMode, setOcrEngineMode] = useState<string>('hybrid');
  const [retentionDays, setRetentionDays] = useState<number>(365);

  const handleSaveSettings = () => {
    showToast('Platform security and scrutiny preferences saved', 'success');
  };

  const handleResetData = () => {
    localStorage.clear();
    showToast('Demo data reset to initial benchmark state. Reloading...', 'info');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">System & Security Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure automated OCR extraction thresholds, retention policies, and verification gateways
        </p>
      </div>

      <div className="bg-white p-6 rounded-[22px] border border-sky-100 shadow-xs space-y-6 text-xs">
        <div>
          <h3 className="font-bold text-sm text-[#183153] mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#0284C7]" />
            <span>AICTE Validation Engine & External Adapters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F4F9FF] border border-sky-100 space-y-2">
              <span className="font-bold text-slate-800 block">OCR Text Parsing Engine</span>
              <p className="text-[11px] text-slate-500">
                PyMuPDF + PaddleOCR layout parsing model with confidence evaluation
              </p>
              <select
                value={ocrEngineMode}
                onChange={(e) => setOcrEngineMode(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-xs font-semibold"
              >
                <option value="hybrid">Hybrid PyMuPDF + Computer Vision (Recommended)</option>
                <option value="strict">Strict Dual Pass Matching</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-[#F4F9FF] border border-sky-100 space-y-2">
              <span className="font-bold text-slate-800 block">Digital Record Retention</span>
              <p className="text-[11px] text-slate-500">
                Statutory audit trail retention policy under AICTE Legal Cell
              </p>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-sky-200 bg-white text-xs font-semibold"
              >
                <option value={365}>1 Year (Standard EoA Cycle)</option>
                <option value={1095}>3 Years (NBA / Accreditation Cycle)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-bold text-sm text-[#183153] mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0284C7]" />
            <span>Automated Event Alerts</span>
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={anomalyAutoScan}
                onChange={(e) => setAnomalyAutoScan(e.target.checked)}
                className="h-4 w-4 rounded text-[#0284C7]"
              />
              <div>
                <span className="font-bold text-slate-800 block">Automatic Forensics on File Upload</span>
                <span className="text-[11px] text-slate-500">
                  Compute SHA-256 hashes and inspect PDF metadata immediately upon upload
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 rounded text-[#0284C7]"
              />
              <div>
                <span className="font-bold text-slate-800 block">Deficiency Notification Dispatch</span>
                <span className="text-[11px] text-slate-500">
                  Notify institutional nodal officers immediately upon officer adverse finding confirmation
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-bold text-sm text-[#183153] mb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" />
            <span>Platform Health & Benchmark Status</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-800">API Status</span>
              <span className="text-sm font-bold text-emerald-700 block mt-0.5">Healthy (100%)</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-800">Rule Engine</span>
              <span className="text-sm font-bold text-emerald-700 block mt-0.5">v2.4 Active</span>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
              <span className="text-[10px] uppercase font-bold text-[#0284C7]">Active Database</span>
              <span className="text-sm font-bold text-[#0284C7] block mt-0.5">{applications.length} Records</span>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-100">
              <span className="text-[10px] uppercase font-bold text-[#0284C7]">Configured Rules</span>
              <span className="text-sm font-bold text-[#0284C7] block mt-0.5">{rules.length} Rules</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl text-rose-600 border border-rose-200 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
          >
            Reset Demo Database
          </button>

          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-5 py-2.5 rounded-xl bg-[#0284C7] text-white font-bold text-xs hover:bg-[#0369A1] transition-colors shadow-xs cursor-pointer"
          >
            Save Security Configurations
          </button>
        </div>
      </div>
    </div>
  );
};
