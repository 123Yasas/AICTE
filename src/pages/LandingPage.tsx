import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  FileCheck2,
  ScanText,
  AlertTriangle,
  ClipboardList,
  Building2,
  FileSpreadsheet,
  History,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
  setActiveTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch, setActiveTab }) => {
  const { applications, switchRole } = useApp();

  const totalApps = applications.length;
  const totalDocs = applications.reduce((acc, a) => acc + a.documents.length, 0);
  const totalChecks = applications.reduce((acc, a) => acc + a.complianceChecks.length + a.findings.length, 0);
  const pendingReview = applications.filter((a) => a.status.includes('Review') || a.status.includes('Attention')).length;

  const features = [
    {
      icon: FileCheck2,
      title: 'AI Document Validation',
      desc: 'Automated multi-stage completeness, validity, and regulatory consistency verification against AICTE APH handbook norms.',
      color: 'from-blue-500/10 to-sky-500/20 text-[#0284C7]',
      link: 'validation-results',
    },
    {
      icon: ScanText,
      title: 'OCR Data Extraction',
      desc: 'Deep text and structured metadata parsing from affidavits, title deeds, university NOCs, and statutory certificates.',
      color: 'from-sky-500/10 to-teal-500/20 text-[#29B6F6]',
      link: 'ocr-extraction',
    },
    {
      icon: ShieldCheck,
      title: 'Document Authenticity Verification',
      desc: 'Seamless integration with authorized state fire services, university registries, and QR/DSC signature gateways.',
      color: 'from-teal-500/10 to-emerald-500/20 text-teal-600',
      link: 'document-auth',
    },
    {
      icon: AlertTriangle,
      title: 'Anomaly & Tampering Detection',
      desc: 'Forensic PDF metadata inspection, duplicate hash discovery, and visual font-divergence hotspot detection.',
      color: 'from-amber-500/10 to-orange-500/20 text-amber-600',
      link: 'anomaly-detection',
    },
    {
      icon: ClipboardList,
      title: 'Regulatory Compliance Engine',
      desc: 'Version-controlled rules covering cadre ratio (1:15), land zoning, built-up areas, and NBA/NAAC accreditation thresholds.',
      color: 'from-indigo-500/10 to-purple-500/20 text-indigo-600',
      link: 'compliance-checker',
    },
    {
      icon: Building2,
      title: 'Infrastructure Evidence Review',
      desc: 'Computer vision assisted analysis of smart classrooms, high-density computer laboratories, libraries, and workshops.',
      color: 'from-emerald-500/10 to-teal-500/20 text-emerald-600',
      link: 'infrastructure-review',
    },
    {
      icon: FileSpreadsheet,
      title: 'Smart Deficiency Tracking',
      desc: 'Structured deficiency lifecycle with replacement document upload, audit trails, and instant automated revalidation.',
      color: 'from-purple-500/10 to-pink-500/20 text-purple-600',
      link: 'deficiency-management',
    },
    {
      icon: History,
      title: 'Audit Trail & Transparency',
      desc: 'Immutable timeline recording all uploads, OCR extractions, rule executions, officer observations, and resolutions.',
      color: 'from-slate-500/10 to-sky-500/20 text-slate-700',
      link: 'audit-trail',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Submit Application',
      desc: 'Institution inputs academic details, intake, faculty, and coordinates.',
    },
    {
      step: '02',
      title: 'Upload Documents',
      desc: 'Upload PDFs and scans of NOCs, Land Deeds, and Fire Certificates.',
    },
    {
      step: '03',
      title: 'Extract Information',
      desc: 'Intelligent OCR extracts entity names, dates, and certificate numbers.',
    },
    {
      step: '04',
      title: 'Validate & Verify',
      desc: 'Rules engine executes APH checks & queries authorized repositories.',
    },
    {
      step: '05',
      title: 'Generate Findings',
      desc: 'Transparent findings categorized by severity without automated rejection.',
    },
    {
      step: '06',
      title: 'Official Review',
      desc: 'Competent AICTE scrutiny officers review evidence and make determinations.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F9FF] text-[#183153] pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-linear-to-tr from-[#64B5F6]/25 to-[#29B6F6]/15 blur-3xl -z-10 rounded-full" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200/20 blur-3xl -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* National Crest Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200/80 shadow-xs mb-6 text-xs font-semibold text-[#0284C7] animate-in fade-in slide-in-from-top-2">
              <Sparkles className="w-3.5 h-3.5 text-[#29B6F6]" />
              <span>All India Council for Technical Education • Statutory Scrutiny Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#183153] tracking-tight leading-[1.15]">
              Smarter Validation.{' '}
              <span className="bg-linear-to-r from-[#0284C7] via-[#29B6F6] to-[#64B5F6] bg-clip-text text-transparent">
                Trusted Verification.
              </span>{' '}
              Transparent Compliance.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              An AI-assisted regulatory decision-support platform that helps technical institutions and regulatory officials validate applications, authenticate statutory documents, identify discrepancies, and streamline compliance review under the AICTE Approval Process Handbook (APH).
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onLaunch}
                className="px-6 py-3 rounded-2xl bg-linear-to-r from-[#29B6F6] to-[#0284C7] text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/35 hover:-translate-y-0.5 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Launch Scrutiny Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveTab('login')}
                className="px-5 py-3 rounded-2xl bg-white text-[#0284C7] hover:bg-sky-50 font-bold text-xs sm:text-sm border border-sky-200 shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Portal Login Page</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('features-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-2xl bg-white text-slate-700 hover:text-[#0284C7] font-semibold text-xs sm:text-sm border border-slate-200/80 shadow-xs hover:border-sky-200 hover:bg-sky-50/50 transition-all cursor-pointer"
              >
                Explore Features
              </button>
            </div>

            {/* Regulatory Disclaimer Banner */}
            <div className="mt-8 p-3.5 rounded-2xl bg-white/90 border border-sky-100/90 shadow-xs max-w-2xl mx-auto flex items-start gap-3 text-left">
              <div className="p-1 rounded-lg bg-amber-50 text-amber-600 mt-0.5">
                <Lock className="w-4 h-4" />
              </div>
              <p className="text-xs text-slate-600 leading-snug">
                <strong className="text-slate-800">Regulatory Safeguard:</strong> This platform is an AI-assisted decision-support system. It never automatically declares documents fraudulent or rejects an institution. All adverse findings remain subject to review by authorized AICTE scrutiny officials.
              </p>
            </div>
          </div>

          {/* Interactive Hero Illustration / Live Verification Mockup */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="relative rounded-3xl bg-white p-4 sm:p-6 shadow-2xl shadow-sky-900/10 border border-sky-100">
              {/* Scan Beam Indicator */}
              <div className="flex items-center justify-between pb-4 border-b border-sky-100 text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-bold text-[#183153]">SmartVerify Live Document Inspection Engine</span>
                </div>
                <span className="font-mono text-slate-400 text-[11px]">APH-2026-ACTIVE</span>
              </div>

              {/* Grid of sample scanned documents */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#F4F9FF] border border-sky-100 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Fire Safety NOC</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-bold text-[#183153]">Greenfield Institute of Tech</div>
                  <div className="mt-1 text-[11px] text-slate-500">FS-GBN-2025-9921 • Expiry: Nov 2027</div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>State Fire Dept QR Hash Matched</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-700 uppercase">Expired Certificate</span>
                    <span className="text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Needs Attention
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-bold text-[#183153]">Sunrise College of Engg</div>
                  <div className="mt-1 text-[11px] text-slate-500">FSNOC-BNG-2023-118 • Lapsed 30-Sep-2026</div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-700 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Deficiency Notice Dispatched</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200/70 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#0284C7] uppercase">University NOC Check</span>
                    <span className="text-[10px] font-semibold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                      Manual Review
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-bold text-[#183153]">Blue Horizon Tech Institute</div>
                  <div className="mt-1 text-[11px] text-slate-500">NOC: SPPU/AFF/ENGG/2026/894</div>
                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-sky-700 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Entity Title Variance: Scrutiny Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demonstration Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="p-8 rounded-3xl bg-white border border-sky-100 shadow-md">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-bold text-[#183153]">Platform Scrutiny Operations Metric</h3>
              <p className="text-xs text-slate-500">Derived in real-time from active prototype demonstration dataset</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-[#0284C7] border border-sky-100">
              Demo Dataset Statistics
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-[#F4F9FF] border border-sky-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0284C7]">{totalApps}</div>
              <div className="mt-1 text-xs font-semibold text-slate-600">Applications Processed</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4F9FF] border border-sky-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#29B6F6]">{totalDocs}</div>
              <div className="mt-1 text-xs font-semibold text-slate-600">Documents Analysed</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4F9FF] border border-sky-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">{totalChecks}</div>
              <div className="mt-1 text-xs font-semibold text-slate-600">Verification Checks Completed</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#F4F9FF] border border-sky-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">{pendingReview}</div>
              <div className="mt-1 text-xs font-semibold text-slate-600">Applications Awaiting Review</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-extrabold text-[#183153] tracking-tight">
            Intelligent Regulatory Features
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Engineered to streamline technical education regulation with high-confidence AI models and human-in-the-loop governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(feat.link)}
                className="p-6 rounded-[22px] bg-white border border-sky-100/90 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group text-left"
              >
                <div>
                  <div
                    className={`h-12 w-12 rounded-2xl bg-linear-to-tr ${feat.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="font-bold text-base text-[#183153] group-hover:text-[#0284C7] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[#0284C7] group-hover:gap-2 transition-all">
                  <span>Explore module</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works 6-step horizontal workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">Streamlined Journey</span>
          <h2 className="text-3xl font-extrabold text-[#183153] tracking-tight mt-1">
            How SmartVerify AI Operates
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            End-to-end transparent regulatory verification workflow from submission to official determination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {workflowSteps.map((ws, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white border border-sky-100 shadow-xs flex flex-col justify-between text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold text-sky-400">{ws.step}</span>
                <span className="h-2 w-2 rounded-full bg-sky-200" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#183153]">{ws.title}</h4>
                <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{ws.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Role Switcher Showcase Card */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 rounded-3xl bg-linear-to-r from-sky-500 to-[#0284C7] text-white shadow-xl shadow-sky-500/20">
          <h3 className="text-2xl font-extrabold">Experience Full Role-Based Scrutiny</h3>
          <p className="mt-2 text-xs sm:text-sm text-sky-100 max-w-xl mx-auto">
            Switch between College Principal, AICTE Reviewing Officer, and System Administrator in 1-click to test end-to-end workflows.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                switchRole('institution');
                onLaunch();
              }}
              className="px-4 py-2.5 rounded-xl bg-white text-[#0284C7] text-xs font-bold hover:bg-sky-50 transition-colors cursor-pointer"
            >
              🏛️ Launch as College User
            </button>
            <button
              onClick={() => {
                switchRole('officer');
                onLaunch();
              }}
              className="px-4 py-2.5 rounded-xl bg-sky-900/40 text-white border border-white/20 text-xs font-bold hover:bg-sky-900/60 transition-colors cursor-pointer"
            >
              ⚖️ Launch as AICTE Officer
            </button>
            <button
              onClick={() => {
                switchRole('admin');
                onLaunch();
              }}
              className="px-4 py-2.5 rounded-xl bg-sky-900/40 text-white border border-white/20 text-xs font-bold hover:bg-sky-900/60 transition-colors cursor-pointer"
            >
              ⚙️ Launch as Administrator
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
