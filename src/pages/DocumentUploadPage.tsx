import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import {
  UploadCloud,
  FileText,
  Trash2,
  RefreshCw,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Eye,
  File,
} from 'lucide-react';

interface DocumentUploadPageProps {
  setActiveTab: (tab: string) => void;
}

export const DocumentUploadPage: React.FC<DocumentUploadPageProps> = ({ setActiveTab }) => {
  const {
    applications,
    selectedAppId,
    setSelectedAppId,
    addDocument,
    removeDocument,
    showToast,
  } = useApp();

  const [category, setCategory] = useState<string>('Occupancy Certificate');
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<string>('2.4 MB');
  const [isMandatory, setIsMandatory] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const app = applications.find((a) => a.id === selectedAppId) || applications[0];

  const mandatoryChecklist = [
    { category: 'Trust / Society Registration', desc: 'Registered Trust Deed or Society Memorandum' },
    { category: 'Fire Safety NOC', desc: 'State Fire Service NOC valid for AY 2026-27' },
    { category: 'Land Ownership / Lease Deed', desc: 'Certified Khasra/Khatoni or Registered 30-year lease' },
    { category: 'Occupancy Certificate', desc: 'Local Municipal / Town Planning Building Occupancy' },
    { category: 'Affiliation & Approvals', desc: 'Affiliating University NOC / Order' },
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName) {
      showToast('Please specify a document name or drop a file', 'warning');
      return;
    }

    addDocument(app.id, {
      name: fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`,
      category,
      fileSize,
      isMandatory,
      pageCount: Math.floor(Math.random() * 8 + 3),
    });

    setFileName('');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">Document Upload & Management Centre</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload, inspect, and manage statutory verification files for{' '}
            <strong className="text-slate-700">{app?.institutionName}</strong> ({app?.id})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500">Active Application:</label>
          <select
            value={app.id}
            onChange={(e) => setSelectedAppId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-sky-200 rounded-xl font-bold text-[#0284C7]"
          >
            {applications.map((a) => (
              <option key={a.id} value={a.id}>
                {a.id} - {a.institutionName.slice(0, 22)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mandatory Checklist Cards */}
      <div className="bg-white p-5 rounded-[22px] border border-sky-100 shadow-xs">
        <h3 className="text-sm font-bold text-[#183153] mb-3">Mandatory APH Document Checklist</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {mandatoryChecklist.map((item, idx) => {
            const isUploaded = app.documents.some((d) => d.category.toLowerCase().includes(item.category.toLowerCase()));
            return (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                  isUploaded
                    ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-900'
                    : 'bg-amber-50/60 border-amber-200/80 text-amber-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px] truncate">{item.category}</span>
                    {isUploaded ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">{item.desc}</p>
                </div>
                <div className="mt-2 text-[10px] font-bold">
                  {isUploaded ? 'Uploaded & Stored' : 'Missing Submission'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Dropzone Form */}
      <div className="bg-white p-6 rounded-[22px] border border-sky-100 shadow-xs">
        <h3 className="text-sm font-bold text-[#183153] mb-4">Upload New Statutory Document</h3>

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setFileName(e.dataTransfer.files[0].name);
              }
            }}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              isDragging
                ? 'border-[#0284C7] bg-sky-50'
                : 'border-sky-200/80 hover:border-[#29B6F6] bg-[#F4F9FF]'
            }`}
          >
            <UploadCloud className="w-10 h-10 text-[#0284C7] mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">
              Drag & drop statutory PDF, JPG, or PNG here, or choose file
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Supports up to 25MB • Secure OCR hash indexing enabled</p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {[
                'Fire_Safety_NOC_2026_27.pdf',
                'Town_Planning_Occupancy_Cert.pdf',
                'Revenue_Record_7_12_Land.pdf',
                'AKTU_Affiliation_Extension.pdf',
              ].map((sample) => (
                <button
                  type="button"
                  key={sample}
                  onClick={() => setFileName(sample)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-sky-200 text-[11px] text-[#0284C7] hover:bg-sky-50 font-medium"
                >
                  + {sample}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Document Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-white"
              >
                <option value="Occupancy Certificate">Occupancy Certificate</option>
                <option value="Fire Safety NOC">Fire Safety NOC</option>
                <option value="Land Ownership / Lease Deed">Land Ownership / Lease Deed</option>
                <option value="Trust / Society Registration">Trust / Society Registration</option>
                <option value="Affiliation & Approvals">Affiliation & Approvals</option>
                <option value="NBA / NAAC Accreditation">NBA / NAAC Accreditation</option>
                <option value="Faculty Roster & Cadre List">Faculty Roster & Cadre List</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">File Name</label>
              <input
                type="text"
                placeholder="e.g. Municipal_Occupancy_Order.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sky-200"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#0284C7] text-white font-bold hover:bg-[#0369A1] transition-colors shadow-sm shadow-sky-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload & Initiate OCR</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Uploaded Documents Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#183153]">Currently Uploaded Documents ({app.documents.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {app.documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white p-5 rounded-[20px] border border-sky-100 shadow-xs flex flex-col justify-between text-left"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{doc.category}</span>
                  <Badge variant={getStatusBadgeVariant(doc.verificationStatus)} size="sm">
                    {doc.verificationStatus}
                  </Badge>
                </div>
                <h4 className="font-bold text-xs text-[#183153] flex items-center gap-1.5 truncate">
                  <File className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span className="truncate">{doc.name}</span>
                </h4>
                <div className="mt-2 text-[11px] text-slate-400 space-y-0.5">
                  <div>Size: {doc.fileSize} • Uploaded: {doc.uploadDate}</div>
                  <div>OCR Score: <strong className="text-emerald-600">{doc.ocrConfidence}%</strong></div>
                  <div className="font-mono text-[9px] truncate">SHA-256: {doc.fileHash.slice(0, 24)}...</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setSelectedAppId(app.id);
                    setActiveTab('ocr-extraction');
                  }}
                  className="text-[#0284C7] font-semibold hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect OCR</span>
                </button>
                <button
                  onClick={() => removeDocument(app.id, doc.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Remove Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
