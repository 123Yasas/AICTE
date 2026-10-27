import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  FilePlus2,
  UploadCloud,
  ScanText,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  ClipboardCheck,
  Building,
  AlertTriangle,
  Scale,
  BellRing,
  BarChart3,
  History,
  BookOpenCheck,
  Users,
  Settings,
  Sparkles,
  LucideIcon,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  badgeVariant?: 'error' | 'warning' | 'info';
  roles?: string[];
  highlight?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
}) => {
  const { currentUser, applications, notifications } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const openDeficiencies = applications.flatMap((a) => a.deficiencies).filter((d) => d.status === 'Open').length;
  const anomaliesCount = applications.flatMap((a) => a.anomalies).length;

  const navItems: NavGroup[] = [
    {
      group: 'Core Modules',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'applications', label: 'Applications', icon: FileText, badge: applications.length },
        { id: 'create-application', label: 'Create Application', icon: FilePlus2, roles: ['institution', 'admin'] },
      ],
    },
    {
      group: 'AI & Verification Hub',
      items: [
        { id: 'document-upload', label: 'Document Upload', icon: UploadCloud },
        { id: 'ocr-extraction', label: 'OCR Workspace', icon: ScanText },
        { id: 'validation-results', label: 'Intelligent Validation', icon: CheckCircle2 },
        {
          id: 'anomaly-detection',
          label: 'Anomaly Detection',
          icon: AlertOctagon,
          badge: anomaliesCount > 0 ? anomaliesCount : undefined,
          badgeVariant: 'error',
        },
        { id: 'document-auth', label: 'Document Authentication', icon: ShieldAlert },
        { id: 'compliance-checker', label: 'Compliance Checker', icon: ClipboardCheck },
        { id: 'infrastructure-review', label: 'Infrastructure Review', icon: Building },
        {
          id: 'deficiency-management',
          label: 'Deficiency Tracking',
          icon: AlertTriangle,
          badge: openDeficiencies > 0 ? openDeficiencies : undefined,
          badgeVariant: 'warning',
        },
      ],
    },
    {
      group: 'Scrutiny & Analytics',
      items: [
        {
          id: 'officer-workspace',
          label: 'Officer Workspace',
          icon: Scale,
          roles: ['officer', 'admin'],
          highlight: true,
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: BellRing,
          badge: unreadCount > 0 ? unreadCount : undefined,
          badgeVariant: 'info',
        },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'audit-trail', label: 'Audit Trail', icon: History },
      ],
    },
    {
      group: 'Administration',
      items: [
        { id: 'rule-config', label: 'Regulatory Rules', icon: BookOpenCheck, roles: ['admin', 'officer'] },
        { id: 'user-management', label: 'User Directory', icon: Users, roles: ['admin'] },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`bg-white border-r border-sky-100 transition-all duration-300 flex flex-col shrink-0 select-none z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 border-b border-sky-100/70 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {currentUser.role === 'institution' ? 'College Portal' : currentUser.role === 'officer' ? 'Scrutiny Desk' : 'System Console'}
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-sky-50 mx-auto transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <Sparkles className="w-4 h-4 text-sky-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        {navItems.map((group, groupIdx) => {
          const visibleItems = group.items.filter(
            (item) => !item.roles || item.roles.includes(currentUser.role)
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={groupIdx} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {group.group}
                </div>
              )}
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                      isActive
                        ? 'bg-sky-500/10 text-[#0284C7] font-bold shadow-xs'
                        : 'text-slate-600 hover:text-[#183153] hover:bg-slate-50'
                    } ${item.highlight ? 'border border-sky-200/60 bg-sky-50/40' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#0284C7]' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />

                    {!collapsed && (
                      <span className="truncate flex-1 text-left">{item.label}</span>
                    )}

                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          item.badgeVariant === 'error'
                            ? 'bg-rose-100 text-rose-700'
                            : item.badgeVariant === 'warning'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-sky-100 text-sky-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#29B6F6] rounded-r-full" />
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {!collapsed && (
        <div className="p-3 border-t border-sky-100/70 bg-sky-50/40">
          <div className="p-2.5 rounded-xl bg-white border border-sky-100 text-left">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
              <span>Handbook Version</span>
              <span className="text-[#0284C7]">APH 2026-27</span>
            </div>
            <div className="mt-1 text-[10px] text-slate-400 leading-tight">
              Rule Engine v2.4 Active
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
