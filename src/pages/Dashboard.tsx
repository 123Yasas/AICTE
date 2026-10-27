import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/common/StatCard';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  AlertOctagon,
  Eye,
  FileDown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const {
    applications,
    setSelectedAppId,
    currentUser,
    searchQuery,
  } = useApp();

  const [tableFilter, setTableFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  const totalApps = applications.length;
  const validationCompleted = applications.filter(
    (a) => a.validationStatus === 'Passed' || a.status === 'Recommended for Approval'
  ).length;
  const requiringCorrection = applications.filter(
    (a) => a.status === 'Attention Required' || a.deficiencies.some((d) => d.status === 'Open')
  ).length;
  const verificationPending = applications.filter(
    (a) => a.verificationStatus === 'Verification Pending' || a.verificationStatus === 'Source Unavailable'
  ).length;
  const anomaliesFlagged = applications.filter((a) => a.anomalies.length > 0).length;
  const manualReview = applications.filter(
    (a) => a.status === 'Manual Review Required' || a.validationStatus === 'Manual Review Required'
  ).length;

  const statusCounts = applications.reduce((acc: Record<string, number>, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const statusDonutData = Object.keys(statusCounts).map((status) => ({
    name: status,
    value: statusCounts[status],
  }));

  const DONUT_COLORS = ['#29B6F6', '#22C55E', '#F59E0B', '#EF4444', '#A78BFA', '#0284C7', '#14B8A6'];

  const timelineData = [
    { date: '10 Oct', count: 1 },
    { date: '12 Oct', count: 2 },
    { date: '14 Oct', count: 3 },
    { date: '15 Oct', count: 4 },
    { date: '18 Oct', count: 6 },
    { date: '20 Oct', count: 7 },
    { date: '22 Oct', count: 9 },
    { date: '26 Oct', count: 10 },
  ];

  const verificationCounts = applications.reduce((acc: Record<string, number>, a) => {
    a.documents.forEach((d) => {
      acc[d.verificationStatus] = (acc[d.verificationStatus] || 0) + 1;
    });
    return acc;
  }, {});

  const verificationBarData = Object.keys(verificationCounts).map((status) => ({
    status: status.replace('Detected', '').trim(),
    count: verificationCounts[status],
  }));

  const defCategories = applications.flatMap((a) => a.deficiencies).reduce((acc: Record<string, number>, def) => {
    acc[def.category] = (acc[def.category] || 0) + 1;
    return acc;
  }, {});

  const deficiencyCategoryData = Object.keys(defCategories).map((cat) => ({
    category: cat.length > 18 ? cat.slice(0, 16) + '...' : cat,
    count: defCategories[cat],
  }));

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      searchQuery === '' ||
      app.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (tableFilter === 'all') return true;
    if (tableFilter === 'passed') return app.validationStatus === 'Passed';
    if (tableFilter === 'attention') return app.status === 'Attention Required' || app.deficiencies.length > 0;
    if (tableFilter === 'review') return app.status === 'Manual Review Required';
    return true;
  });

  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);
  const displayedApps = filteredApps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenApp = (appId: string) => {
    setSelectedAppId(appId);
    setActiveTab('application-detail');
  };

  return (
    <div className="space-y-6 text-left">
      <div className="bg-linear-to-r from-sky-500/10 via-[#29B6F6]/15 to-[#64B5F6]/10 p-6 rounded-[22px] border border-sky-200/70 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
              AICTE SmartVerify Active Session
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#183153] mt-1 tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentUser.designation} • Showing live regulatory data for AICTE Approvals (2026-27)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('create-application')}
            className="px-4 py-2 rounded-xl bg-white text-[#0284C7] border border-sky-200 text-xs font-bold shadow-xs hover:bg-sky-50 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>New Application</span>
          </button>
          <button
            onClick={() => setActiveTab('officer-workspace')}
            className="px-4 py-2 rounded-xl bg-[#0284C7] text-white text-xs font-bold shadow-sm shadow-sky-500/30 hover:bg-[#0369A1] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open Officer Desk</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          label="Total Applications"
          value={totalApps}
          icon={FileText}
          trend="+12%"
          trendDirection="up"
          color="blue"
          subtext="2026-27 Active cycle"
          onClick={() => setTableFilter('all')}
        />
        <StatCard
          label="Validation Completed"
          value={validationCompleted}
          icon={CheckCircle2}
          trend="+8%"
          trendDirection="up"
          color="emerald"
          subtext="Preliminary checks pass"
          onClick={() => setTableFilter('passed')}
        />
        <StatCard
          label="Needs Correction"
          value={requiringCorrection}
          icon={AlertTriangle}
          trend="Action required"
          trendDirection="down"
          color="amber"
          subtext="Deficiencies flagged"
          onClick={() => setTableFilter('attention')}
        />
        <StatCard
          label="Verification Pending"
          value={verificationPending}
          icon={Clock}
          trend="Awaiting API"
          trendDirection="neutral"
          color="sky"
          subtext="State/University queries"
        />
        <StatCard
          label="Anomalies Flagged"
          value={anomaliesFlagged}
          icon={AlertOctagon}
          trend="Forensic scan"
          trendDirection="down"
          color="rose"
          subtext="Needs verification"
          onClick={() => setActiveTab('anomaly-detection')}
        />
        <StatCard
          label="Manual Review"
          value={manualReview}
          icon={Eye}
          trend="Official scrutiny"
          trendDirection="neutral"
          color="purple"
          subtext="Discrepancy resolution"
          onClick={() => setTableFilter('review')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white p-5 rounded-[22px] border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#183153]">Application Status Breakdown</h3>
              <p className="text-xs text-slate-400">Distribution across evaluation phases</p>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
              {totalApps} Total
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusDonutData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
            {statusDonutData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                />
                <span className="truncate max-w-[120px]">{item.name}</span>
                <span className="font-bold text-slate-800">({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-5 rounded-[22px] border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#183153]">Application Intake Timeline</h3>
              <p className="text-xs text-slate-400">Submission velocity for current academic intake</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-100">
              Active Portal
            </span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#29B6F6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#29B6F6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '11px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#areaGradient)"
                  name="Applications"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center text-xs text-slate-400">
            Total verified records registered on AICTE national portal
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-[22px] border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#183153]">Document Verification Outcomes</h3>
              <p className="text-xs text-slate-400">Automated external database queries & QR seals</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={verificationBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="status" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" fill="#29B6F6" radius={[6, 6, 0, 0]} name="Documents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[22px] border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#183153]">Deficiencies by Regulatory Category</h3>
              <p className="text-xs text-slate-400">Specific rule non-compliances identified</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deficiencyCategoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis type="category" dataKey="category" stroke="#94A3B8" fontSize={10} tickLine={false} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[0, 6, 6, 0]} name="Deficiencies" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[22px] border border-sky-100 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-sky-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#183153]">Recent Applications</h3>
            <p className="text-xs text-slate-400">All applications pending or evaluated by SmartVerify AI</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex bg-[#F4F9FF] p-1 rounded-xl border border-sky-100 text-xs">
              <button
                onClick={() => setTableFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  tableFilter === 'all' ? 'bg-white text-[#0284C7] shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                All ({applications.length})
              </button>
              <button
                onClick={() => setTableFilter('passed')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  tableFilter === 'passed' ? 'bg-white text-[#0284C7] shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Passed
              </button>
              <button
                onClick={() => setTableFilter('attention')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  tableFilter === 'attention' ? 'bg-white text-[#0284C7] shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Attention
              </button>
              <button
                onClick={() => setTableFilter('review')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  tableFilter === 'review' ? 'bg-white text-[#0284C7] shadow-xs font-bold' : 'text-slate-600'
                }`}
              >
                Officer Review
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] text-slate-600 border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4 font-bold">App ID</th>
                <th className="py-3.5 px-4 font-bold">Institution Name</th>
                <th className="py-3.5 px-4 font-bold">Category</th>
                <th className="py-3.5 px-4 font-bold">Date</th>
                <th className="py-3.5 px-4 font-bold">Docs</th>
                <th className="py-3.5 px-4 font-bold">Validation</th>
                <th className="py-3.5 px-4 font-bold">Verification</th>
                <th className="py-3.5 px-4 font-bold">Officer</th>
                <th className="py-3.5 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedApps.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => handleOpenApp(app.id)}
                  className="hover:bg-sky-50/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#0284C7]">
                    {app.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#183153] group-hover:text-[#0284C7] transition-colors">
                      {app.institutionName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {app.district}, {app.state}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {app.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {app.submissionDate}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-semibold">
                    {app.documents.length} files
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={getStatusBadgeVariant(app.status)} size="sm">
                      {app.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant={getStatusBadgeVariant(app.verificationStatus)} size="sm">
                      {app.verificationStatus}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                    {app.assignedOfficer}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenApp(app.id);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 text-[#0284C7] font-semibold text-xs hover:bg-sky-100 transition-colors mr-2 inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAppId(app.id);
                        setActiveTab('reports');
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors inline-block"
                      title="Download Validation Report"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-sky-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredApps.length)} of {filteredApps.length} applications
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 rounded-lg bg-white border border-slate-200 disabled:opacity-50 text-slate-700 hover:bg-slate-100"
            >
              Previous
            </button>
            <span className="font-semibold text-slate-700">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 rounded-lg bg-white border border-slate-200 disabled:opacity-50 text-slate-700 hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
