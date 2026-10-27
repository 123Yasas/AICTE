import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  color?: 'blue' | 'sky' | 'emerald' | 'amber' | 'rose' | 'purple';
  onClick?: () => void;
  subtext?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  trendDirection = 'up',
  color = 'blue',
  onClick,
  subtext,
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50/70',
      text: 'text-[#0284C7]',
      border: 'border-blue-100',
      badge: 'bg-blue-100 text-blue-700',
    },
    sky: {
      bg: 'bg-sky-50/70',
      text: 'text-[#29B6F6]',
      border: 'border-sky-100',
      badge: 'bg-sky-100 text-sky-700',
    },
    emerald: {
      bg: 'bg-emerald-50/70',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      badge: 'bg-emerald-100 text-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50/70',
      text: 'text-amber-600',
      border: 'border-amber-100',
      badge: 'bg-amber-100 text-amber-700',
    },
    rose: {
      bg: 'bg-rose-50/70',
      text: 'text-rose-600',
      border: 'border-rose-100',
      badge: 'bg-rose-100 text-rose-700',
    },
    purple: {
      bg: 'bg-purple-50/70',
      text: 'text-purple-600',
      border: 'border-purple-100',
      badge: 'bg-purple-100 text-purple-700',
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[20px] p-5 border border-sky-100/80 shadow-xs hover:shadow-md transition-all duration-200 group text-left ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
        <div
          className={`h-10 w-10 rounded-2xl ${scheme.bg} flex items-center justify-center ${scheme.text} group-hover:scale-110 transition-transform`}
        >
          <Icon className="w-5 h-5 stroke-[2.2]" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-[#183153] tracking-tight">{value}</span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
              trendDirection === 'up'
                ? 'text-emerald-700 bg-emerald-50'
                : trendDirection === 'down'
                ? 'text-rose-700 bg-rose-50'
                : 'text-slate-600 bg-slate-100'
            }`}
          >
            {trendDirection === 'up' && <TrendingUp className="w-3 h-3" />}
            {trendDirection === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>

      {subtext && (
        <p className="mt-1.5 text-xs text-slate-400 font-medium line-clamp-1">{subtext}</p>
      )}
    </div>
  );
};
