'use client';

import { cn } from '@/lib/utils';

interface BarChartProps {
  data: { label: string; value: number; color: string }[];
  maxValue?: number;
  height?: number;
  showValue?: boolean;
  className?: string;
}

export function BarChart({ 
  data, 
  maxValue, 
  height = 120, 
  showValue = true,
  className 
}: BarChartProps) {
  const computedMax = maxValue ?? Math.max(...data.map(d => d.value), 1);
  
  return (
    <div className={cn('space-y-2', className)} role="img" aria-label="Bar chart">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="w-24 text-sm text-slate-400 truncate" title={item.label}>
            {item.label}
          </span>
          <div className="flex-1 h-5 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${(item.value / computedMax) * 100}%`,
                backgroundColor: item.color,
              }}
            />
            {showValue && item.value > 0 && (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-200">
                {item.value}
              </span>
            )}
          </div>
          {showValue && (
            <span className="w-10 text-right font-mono text-slate-300 text-sm">
              {item.value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

interface StackedBarChartProps {
  data: { label: string; positive: number; neutral: number; negative: number }[];
  maxValue?: number;
  height?: number;
  className?: string;
}

export function StackedBarChart({ 
  data, 
  maxValue, 
  height = 160,
  className 
}: StackedBarChartProps) {
  const allValues = data.flatMap(d => [d.positive, d.neutral, d.negative]);
  const computedMax = maxValue ?? Math.max(...allValues, 1);
  const barWidth = 100 / data.length;
  
  return (
    <div className={cn('relative', className)} role="img" aria-label="Stacked bar chart">
      <div className="flex items-end justify-between h-[{height}px] gap-1" style={{ height: `${height}px` }}>
        {data.map((item, index) => (
          <div
            key={index}
            className="flex-1 flex flex-col items-center gap-1"
            style={{ width: `${barWidth}%` }}
          >
            <div className="w-full flex flex-col items-stretch h-full justify-end gap-0.5">
              {item.positive > 0 && (
                <div
                  className="bg-emerald-500 rounded-t-sm transition-all duration-300"
                  style={{ height: `${(item.positive / computedMax) * 100}%` }}
                />
              )}
              {item.neutral > 0 && (
                <div
                  className="bg-amber-500 transition-all duration-300"
                  style={{ height: `${(item.neutral / computedMax) * 100}%` }}
                />
              )}
              {item.negative > 0 && (
                <div
                  className="bg-red-500 rounded-b-sm transition-all duration-300"
                  style={{ height: `${(item.negative / computedMax) * 100}%` }}
                />
              )}
              {(item.positive + item.neutral + item.negative) === 0 && (
                <div className="h-1 bg-slate-700" />
              )}
            </div>
            <span className="text-xs text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 mt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
          <span className="text-slate-400">Positif</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-amber-500" />
          <span className="text-slate-400">Netral</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded bg-red-500" />
          <span className="text-slate-400">Negatif</span>
        </div>
      </div>
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; up: boolean };
  color?: string;
  className?: string;
}

export function KPICard({ label, value, icon, trend, color = 'text-slate-300', className }: KPICardProps) {
  return (
    <div className={cn(
      'bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 transition-colors hover:border-slate-600/50',
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700/50 flex items-center justify-center">
          {icon}
        </div>
        {trend && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trend.up ? 'text-emerald-400' : 'text-red-400'
          )}>
            {trend.up ? '↑' : '↓'}
            <span>{trend.value}</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-50 mb-1">
        {value}
      </div>
      <div className="text-sm text-slate-400">{label}</div>
    </div>
  );
}

type BadgeVariant = 
  | 'pending' 
  | 'reviewing' 
  | 'approved' 
  | 'rejected' 
  | 'urgent' 
  | 'high' 
  | 'normal' 
  | 'low'
  | 'valid'
  | 'hoaks'
  | 'misleading'
  | 'unconfirmed';

interface StatusBadgeProps {
  children: React.ReactNode;
  variant: BadgeVariant;
  className?: string;
}

const statusStyles: Record<BadgeVariant, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  reviewing: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
  urgent: 'bg-red-500/10 text-red-400 border-red-500/30',
  high: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  normal: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  low: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
  valid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  hoaks: 'bg-red-500/10 text-red-400 border-red-500/30',
  misleading: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  unconfirmed: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
};

export function StatusBadge({ children, variant, className }: StatusBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border font-medium',
      statusStyles[variant],
      className
    )}>
      {children}
    </span>
  );
}

interface PriorityBadgeProps {
  level: 'urgent' | 'high' | 'normal' | 'low';
  className?: string;
}

const priorityLabels: Record<string, string> = {
  urgent: 'Urgent',
  high: 'Tinggi',
  normal: 'Normal',
  low: 'Rendah',
};

export function PriorityBadge({ level, className }: PriorityBadgeProps) {
  return (
    <StatusBadge variant={level} className={className}>
      {priorityLabels[level]}
    </StatusBadge>
  );
}