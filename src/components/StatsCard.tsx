// ============================================================================
// STATS CARD COMPONENT - viitinhcortes
// ============================================================================

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendIcon?: LucideIcon;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-amber-400',
  iconBgColor = 'bg-amber-500/20',
  trend,
  trendIcon: TrendIcon,
}: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        
        {TrendIcon && (
          <TrendIcon className={`w-5 h-5 ${getTrendColor()}`} />
        )}
      </div>

      <h3 className="text-gray-400 text-sm font-medium mb-1">
        {title}
      </h3>

      <p className="text-3xl font-bold text-white mb-1">
        {value}
      </p>

      {subtitle && (
        <p className="text-xs text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}
