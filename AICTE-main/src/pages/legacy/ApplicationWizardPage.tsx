import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ApplicationCategory, DocumentItem } from '../types';
import confetti from 'canvas-confetti';
import {
  Building2,
  FileText,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  File,
  X,
  Check,
} from 'lucide-react';

interface ApplicationWizardPageProps {
  setActiveTab: (tab: string) => void;
}

export const ApplicationWizardPage: React.FC<ApplicationWizardPageProps> = ({ setActiveTab }) => {
  const { addApplication, currentUser, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [createdAppId, setCreatedAppId] = useState<string>('');

  const [formData, setFormData] = useState({
    institutionName: currentUser.institutionName || 'Delhi Technological Institute of Science',
    institutionId: currentUser.institutionId || 'INST-2026-904',
    address: 'Plot 12, Institutional Area, Phase II',
    state: 'Delhi',
    district: 'South West Delhi',
    contactEmail: currentUser.email || 'director@dtis.ac.in',
    contactPhone: '+91 11 2890 3344',
    category: 'Extension of Approval (EoA)' as ApplicationCategory,
    academicYear: '2026-2027',
    totalIntake: 240,
    facultyCount: 18,
    landAreaAcres: 5.2,
    builtUpAreaSqMeters: 9600,
  });

  const [stagedDocs, setStagedDocs] = useState<Partial<DocumentItem>[]>([
    {
      id: 'STAGE-1',
      name: 'Society_Registered_Deed_2026.pdf',
      category: 'Trust / Society Registration',
      fileType: 'pdf',
      fileSize: '3.1 MB',
      uploadDate: new Date().toISOString().slice(0, 10),
      ocrStatus: 'Completed',
      ocrConfidence: 96.0,
      extractedFields: {
        'Society': 'Delhi Technological Educational Foundation',
        'Reg No': 'SOC-DEL-2008-89',
      },
      verificationStatus: 'Verified',
      isMandatory: true,
      pageCount: 12,
      anomaliesCount: 0,
      fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    },
    {
      id: 'STAGE-2',
      name: 'Fire_Safety_NOC_Current_2026.pdf',
      category: 'Fire Safety NOC',
      fileType: 'pdf',
      fileSize: '1.9 MB',
      uploadDate: new Date().toISOString().slice(0, 10),
      ocrStatus: 'Completed',
      ocrConfidence: 94.5,
      extractedFields: {
        'NOC Certificate': 'DFS/NOC/2026/884',
        'Expiry Date': '2027-10-31',
      },
      verificationStatus: 'Verified',
      expiryDate: '2027-10-31',
      isMandatory: true,
      pageCount: 3,
      anomaliesCount: 0,
      fileHash: '4a6b2c8901df456a78bc901234def56789abcde01234567890abcdef12345678',
    },
  ]);

  const [newDocCategory, setNewDocCategory] = useState<string>('Occupancy Certificate');
  const [newDocName, setNewDocName] = useState<string>('');

  const steps = [
    { num: 1, title: 'Institution Info' },
    { num: 2, title: 'Application Details' },
    { num: 3, title: 'Document Upload' },
    { num: 4, title: 'Preliminary Validation' },
    { num: 5, title: 'Review & Submit' },
  ];

  const handleAddSampleDoc = () => {
    if (!newDocName) return;
    const newDoc: Partial<DocumentItem> = {
      id: `STAGE-${Date.now().toString().slice(-4)}`,
      name: newDocName.endsWith('.pdf') ? newDocName : `${newDocName}.pdf`,
      category: newDocCategory,
      fileType: 'pdf',
      fileSize: '2.1 MB',
      uploadDate: new Date().toISOString().slice(0, 10),
      ocrStatus: 'Completed',
      ocrConfidence: 95.0,
      extractedFields: {
        'Extracted Title': newDocCategory,
      },
      verificationStatus: 'Not Yet Checked',
      isMandatory: true,
      pageCount: 4,
      anomaliesCount: 0,
      fileHash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
    };
    setStagedDocs([...stagedDocs, newDoc]);
    setNewDocName('');
    showToast(`Added ${newDoc.name} to upload staging`, 'success');
  };

  const handleSubmitApplication = () => {
    const newId = addApplication({
      institutionName: formData.institutionName,
      institutionId: formData.institutionId,
      category: formData.category,
      academicYear: formData.academicYear,
      address: formData.address,
      state: formData.state,
      district: formData.district,
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      approvedProgrammes: ['Computer Science & Engg', 'Artificial Intelligence & Data Science'],
      totalIntake: Number(formData.totalIntake),
      facultyCount: Number(formData.facultyCount),
      landAreaAcres: Number(formData.landAreaAcres),
      builtUpAreaSqMeters: Number(formData.builtUpAreaSqMeters),
      documents: stagedDocs as DocumentItem[],
      complianceChecks: [
        {
          id: `COMP-WIZ-1`,
          ruleId: 'RULE-APH-01',
          category: 'Safety & Statutory Permissions',
          requirementDescription: 'Valid Fire Safety NOC for 2026-27 session',
          requiredEvidence: 'Fire Safety Certificate',
          submittedEvidence: 'Fire_Safety_NOC_Current_2026.pdf (Valid until Oct 2027)',
          outcome: 'Meets Configured Rule',
          recommendedAction: 'Check passed.',
        },
      ],
    });

    setCreatedAppId(newId);
    setIsSubmitted(true);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      /* ignore */
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center bg-white rounded-3xl p-8 border border-sky-100 shadow-lg text-left">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-extrabold text-[#183153] text-center">
          Application Submitted Successfully!
        </h2>
        <p className="text-sm text-slate-500 text-center mt-1">
          Registered under AICTE SmartVerify Application ID: <strong className="text-[#0284C7] font-mono">{createdAppId}</strong>
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setActiveTab('applications')}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            View Applications List
          </button>
          <button
            onClick={() => setActiveTab('officer-workspace')}
            className="px-5 py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open in Scrutiny Workspace</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">Create Technical Approval Application</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Follow the 5-step wizard to file institutional details and upload statutory compliance documents
        </p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {steps.map((step) => {
            const isCurrent = currentStep === step.num;
            const isCompleted = currentStep > step.num;
            return (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`p-2.5 rounded-xl text-left transition-all ${
                  isCurrent
                    ? 'bg-sky-50 border border-sky-200 text-[#0284C7]'
                    : isCompleted
                    ? 'text-slate-700 hover:bg-slate-50'
                    : 'text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-[#0284C7] text-white'
                        : isCompleted
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3" /> : step.num}
                  </span>
                  <span className="text-xs font-bold truncate">{step.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[22px] border border-sky-100 shadow-xs">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#183153] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0284C7]" />
              <span>Step 1: Institutional Identity & Location</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Institution Legal Name</label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Permanent AICTE ID</label>
                <input
                  type="text"
                  value={formData.institutionId}
                  onChange={(e) => setFormData({ ...formData, institutionId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 text-slate-800 font-mono"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="font-semibold text-slate-700 block mb-1">Campus Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 text-slate-800"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#183153] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#0284C7]" />
              <span>Step 2: Category & Academic Norms</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Regulatory Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ApplicationCategory })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200 bg-white"
                >
                  <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
                  <option value="Approval-related Change">Approval-related Change</option>
                  <option value="New Technical Institution">New Technical Institution</option>
                  <option value="Introduction of New Course / Division">Introduction of New Course / Division</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Total Student Intake</label>
                <input
                  type="number"
                  value={formData.totalIntake}
                  onChange={(e) => setFormData({ ...formData, totalIntake: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Faculty Count</label>
                <input
                  type="number"
                  value={formData.facultyCount}
                  onChange={(e) => setFormData({ ...formData, facultyCount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Land Area (Acres)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.landAreaAcres}
                  onChange={(e) => setFormData({ ...formData, landAreaAcres: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-sky-200"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-[#183153] flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-[#0284C7]" />
              <span>Step 3: Upload Supporting Documents</span>
            </h3>
            <div className="p-4 rounded-2xl bg-[#F4F9FF] border border-sky-200/80">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                <div className="sm:col-span-5">
                  <label className="font-semibold text-slate-500 block mb-1">Category</label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sky-200 bg-white"
                  >
                    <option value="Occupancy Certificate">Occupancy Certificate</option>
                    <option value="Fire Safety NOC">Fire Safety NOC</option>
                    <option value="Land Ownership / Lease Deed">Land Ownership / Lease Deed</option>
                  </select>
                </div>
                <div className="sm:col-span-5">
                  <label className="font-semibold text-slate-500 block mb-1">File Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Municipal_Occupancy.pdf"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-sky-200 bg-white"
                  />
                </div>
                <div className="sm:col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={handleAddSampleDoc}
                    className="w-full py-2 px-3 bg-[#0284C7] text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-4 text-xs">
              {stagedDocs.map((doc) => (
                <div key={doc.id} className="p-3 rounded-xl border border-sky-100 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <File className="w-4 h-4 text-[#0284C7]" />
                    <span className="font-bold text-slate-800">{doc.name}</span>
                  </div>
                  <button onClick={() => setStagedDocs(stagedDocs.filter((d) => d.id !== doc.id))} className="text-slate-400 hover:text-rose-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#183153] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Step 4: Preliminary Validation Checks</span>
            </h3>
            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 font-medium">
              SmartVerify AI pre-checked mandatory documents and ratio rules.
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between">
              <span>Mandatory Documents</span>
              <span className="font-bold text-emerald-700">{stagedDocs.length} files attached (Pass)</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between">
              <span>Cadre & Ratio Check</span>
              <span className="font-bold text-emerald-700">1:{Math.round(formData.totalIntake / formData.facultyCount)} Ratio (Pass)</span>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-base font-bold text-[#183153] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#0284C7]" />
              <span>Step 5: Review & Official Submission</span>
            </h3>
            <div className="p-4 rounded-xl bg-[#F4F9FF] border border-sky-100 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Institution:</span>
                <span className="font-bold">{formData.institutionName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-bold text-[#0284C7]">{formData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Documents Staged:</span>
                <span className="font-bold">{stagedDocs.length} Files</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((s) => s - 1)}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 disabled:opacity-40"
          >
            Previous
          </button>
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((s) => s + 1)}
              className="px-5 py-2.5 rounded-xl bg-[#0284C7] text-white text-xs font-bold"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitApplication}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
