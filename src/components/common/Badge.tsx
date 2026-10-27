import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = true,
}) => {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    error: 'bg-rose-50 text-rose-700 border-rose-200/80',
    info: 'bg-sky-50 text-sky-700 border-sky-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200/80',
    teal: 'bg-teal-50 text-teal-700 border-teal-200/80',
  };

  const dotColors = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
    purple: 'bg-purple-500',
    teal: 'bg-teal-500',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} transition-all duration-150 ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]} shrink-0`} />}
      <span>{children}</span>
    </span>
  );
};

export const getStatusBadgeVariant = (status: string): BadgeProps['variant'] => {
  const s = status.toLowerCase();
  if (s.includes('pass') || s.includes('verified') || s.includes('compliant') || s.includes('resolved') || s.includes('complete') || s.includes('accepted')) {
    return 'success';
  }
  if (s.includes('attention') || s.includes('gap') || s.includes('correction') || s.includes('insufficient') || s.includes('moderate')) {
    return 'warning';
  }
  if (s.includes('fail') || s.includes('expired') || s.includes('mismatch') || s.includes('open') || s.includes('error') || s.includes('high-priority')) {
    return 'error';
  }
  if (s.includes('pending') || s.includes('review') || s.includes('scrutiny') || s.includes('queue')) {
    return 'info';
  }
  if (s.includes('division') || s.includes('approval') || s.includes('new')) {
    return 'purple';
  }
  return 'neutral';
};
