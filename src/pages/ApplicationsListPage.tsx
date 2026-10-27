import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge, getStatusBadgeVariant } from '../components/common/Badge';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Eye,
  FileDown,
  Sparkles,
  ArrowUpDown,
  Building,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

interface ApplicationsListPageProps {
  setActiveTab: (tab: string) => void;
}

export const ApplicationsListPage: React.FC<ApplicationsListPageProps> = ({ setActiveTab }) => {
  const {
    applications,
    setSelectedAppId,
    searchQuery,
    setSearchQuery,
    triggerValidation,
    showToast,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'id'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      searchQuery === '' ||
      app.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || app.category.toLowerCase().includes(categoryFilter.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'passed' && (app.validationStatus === 'Passed' || app.status === 'Recommended for Approval')) ||
      (statusFilter === 'attention' && app.status.includes('Attention')) ||
      (statusFilter === 'review' && app.status.includes('Review')) ||
      (statusFilter === 'deficiencies' && app.status.includes('Deficiencies'));

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc'
        ? new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
        : new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime();
    }
    if (sortBy === 'name') {
      return sortOrder === 'desc'
        ? b.institutionName.localeCompare(a.institutionName)
        : a.institutionName.localeCompare(b.institutionName);
    }
    return sortOrder === 'desc' ? b.id.localeCompare(a.id) : a.id.localeCompare(b.id);
  });

  const handleOpen = (id: string) => {
    setSelectedAppId(id);
    setActiveTab('application-detail');
  };

  const handleDownload = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAppId(id);
    setActiveTab('reports');
  };

  const handleRunValidation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerValidation(id);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">Applications Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of all technical education institutions applying for AICTE approval
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create-application')}
          className="px-4 py-2.5 rounded-xl bg-linear-to-r from-[#29B6F6] to-[#0284C7] text-white text-xs font-bold shadow-md shadow-sky-500/20 hover:shadow-lg transition-all flex items-center gap-2 self-start cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Application</span>
        </button>
      </div>

      {/* Filter and Search Ribbon */}
      <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, college name, state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#F4F9FF] border border-sky-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#29B6F6]/40 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#F4F9FF] border border-sky-200/70 rounded-xl text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Extension">Extension of Approval (EoA)</option>
            <option value="Approval-related">Approval Changes</option>
            <option value="New Technical">New Institution</option>
            <option value="Introduction">New Course / Division</option>
            <option value="Closure">Program Closure</option>
          </select>

          {/* Status dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#F4F9FF] border border-sky-200/70 rounded-xl text-slate-700 font-medium focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="passed">Preliminary Passed</option>
            <option value="attention">Attention Required</option>
            <option value="review">Manual Review</option>
            <option value="deficiencies">Deficiencies Found</option>
          </select>

          {/* Sort toggle */}
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 text-xs bg-[#F4F9FF] border border-sky-200/70 rounded-xl text-slate-700 font-medium flex items-center gap-1.5 hover:bg-sky-50 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>Sort: {sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>
      </div>

      {/* Applications Cards Grid & Table */}
      <div className="grid grid-cols-1 gap-4">
        {sortedApps.map((app) => (
          <div
            key={app.id}
            onClick={() => handleOpen(app.id)}
            className="bg-white rounded-[20px] p-5 border border-sky-100 shadow-xs hover:shadow-md hover:border-sky-300 transition-all duration-200 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
          >
            {/* Left metadata */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-xs text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100">
                  {app.id}
                </span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {app.category}
                </span>
                <span className="text-xs text-slate-400">AY {app.academicYear}</span>
              </div>

              <h3 className="text-base font-bold text-[#183153] mt-2 group-hover:text-[#0284C7] transition-colors truncate">
                {app.institutionName}
              </h3>

              <div className="mt-1 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {app.district}, {app.state}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Submitted: {app.submissionDate}
                </span>
                <span>• {app.totalIntake} Approved Intake</span>
                <span>• {app.facultyCount} Faculty</span>
                <span>• {app.documents.length} Uploaded Files</span>
              </div>

              {app.officerNotes && (
                <p className="mt-2 text-xs text-slate-600 bg-[#F4F9FF] p-2 rounded-xl border border-sky-100/80 line-clamp-1">
                  <strong className="text-slate-800">Scrutiny Note:</strong> {app.officerNotes}
                </p>
              )}
            </div>

            {/* Middle: Badges */}
            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <Badge variant={getStatusBadgeVariant(app.status)} size="md">
                {app.status}
              </Badge>
              <Badge variant={getStatusBadgeVariant(app.verificationStatus)} size="md">
                {app.verificationStatus}
              </Badge>
              {app.anomalies.length > 0 && (
                <Badge variant="error" size="sm">
                  {app.anomalies.length} Anomaly Flag
                </Badge>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
              <button
                onClick={(e) => handleRunValidation(app.id, e)}
                className="px-3 py-1.5 rounded-xl bg-sky-50 text-[#0284C7] text-xs font-semibold hover:bg-sky-100 transition-colors flex items-center gap-1"
                title="Trigger Rule-based Validation"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Revalidate</span>
              </button>
              <button
                onClick={(e) => handleDownload(app.id, e)}
                className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:text-[#0284C7] hover:bg-sky-50 transition-colors"
                title="Generate PDF Scrutiny Report"
              >
                <FileDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleOpen(app.id)}
                className="px-3.5 py-1.5 rounded-xl bg-[#0284C7] text-white text-xs font-bold hover:bg-[#0369A1] transition-colors flex items-center gap-1 shadow-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Review Hub</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
