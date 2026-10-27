import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SimpleDocument } from '../../types/verification';
import {
  UploadCloud,
  X,
  CheckCircle2,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

interface ReuploadModalProps {
  document: SimpleDocument | null;
  onClose: () => void;
}

export const ReuploadModal: React.FC<ReuploadModalProps> = ({ document, onClose }) => {
  const { reuploadDocument } = useApp();
  const [fileName, setFileName] = useState<string>(() => {
    return document ? document.fileName.replace('.pdf', '_Sealed_Signed.pdf') : 'Corrected_Sealed_Document.pdf';
  });

  if (!document) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    reuploadDocument(document.id, fileName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-sky-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-linear-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <UploadCloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Re-upload Corrected File</h2>
              <p className="text-xs text-emerald-100">
                Fix missing signatures and stamp for: {document.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {/* Missing items reminder */}
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
            <p className="text-xs font-bold text-rose-800 mb-1.5">
              Items previously denoted as missing by AI:
            </p>
            <ul className="space-y-1 text-xs text-rose-700 list-disc list-inside">
              {document.aiVerification.missingItems.map((m) => (
                <li key={m.id}>
                  <strong>{m.title}:</strong> {m.instruction}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Corrected File Name Attachment
            </label>
            <div className="relative">
              <FileCheck2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
              <input
                type="text"
                required
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-slate-800 font-mono font-medium"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              File containing newly affixed principal seal, signatures, and valid QR checksum.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              The AI Agent will automatically re-scan the file to verify the affixed items!
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit Corrected File & Run AI</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
