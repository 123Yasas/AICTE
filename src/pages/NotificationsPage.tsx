import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import {
  BellRing,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  Check,
  Filter,
} from 'lucide-react';

interface NotificationsPageProps {
  setActiveTab: (tab: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ setActiveTab }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedAppId,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (categoryFilter === 'all') return true;
    return n.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  const handleOpenNotif = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.applicationId) {
      setSelectedAppId(notif.applicationId);
      setActiveTab('application-detail');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#183153] tracking-tight">Notifications & Alerts Centre</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Role-aware regulatory alerts, deficiency warnings, and validation notifications
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-4 py-2 rounded-xl bg-white border border-sky-200 text-xs font-bold text-[#0284C7] hover:bg-sky-50 flex items-center gap-1.5 cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-3 rounded-2xl border border-sky-100 shadow-xs flex items-center gap-2 text-xs overflow-x-auto">
        <span className="font-bold text-slate-400 uppercase text-[10px] px-2">Filter Category:</span>
        {['all', 'Validation', 'Deficiency', 'Anomaly', 'Document'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-colors ${
              categoryFilter === cat
                ? 'bg-[#0284C7] text-white font-bold'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((n) => (
          <div
            key={n.id}
            onClick={() => handleOpenNotif(n)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              !n.isRead
                ? 'bg-white border-[#29B6F6] shadow-sm'
                : 'bg-white/80 border-sky-100/80 hover:border-sky-200'
            }`}
          >
            <div className="mt-1">
              {n.severity === 'Success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {n.severity === 'Warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {n.severity === 'Error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
              {n.severity === 'Info' && <ExternalLink className="w-5 h-5 text-sky-500" />}
            </div>

            <div className="flex-1 text-xs space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 text-sm">{n.title}</span>
                <span className="text-[11px] text-slate-400">{n.timestamp}</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-normal">{n.message}</p>
              {n.applicationId && (
                <span className="inline-block font-mono font-bold text-[10px] text-[#0284C7] bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  Application: {n.applicationId}
                </span>
              )}
            </div>

            {!n.isRead && (
              <span className="h-2.5 w-2.5 rounded-full bg-[#0284C7] shrink-0 mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
