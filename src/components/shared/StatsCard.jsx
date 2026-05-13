import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function StatsCard({ title, value, icon: Icon, trend, trendLabel, variant = 'default', onClick }) {
  const variants = {
    default: 'border-l-4 border-l-primary',
    success: 'border-l-4 border-l-success',
    warning: 'border-l-4 border-l-warning',
    danger: 'border-l-4 border-l-destructive',
    info: 'border-l-4 border-l-info',
  };

  return (
    <Card
      className={cn(
        'p-5 hover:shadow-md transition-all duration-200 cursor-default',
        variants[variant],
        onClick && 'cursor-pointer hover:scale-[1.02]'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trendLabel && (
            <p className={cn(
              'text-xs font-medium',
              trend > 0 ? 'text-success' : trend < 0 ? 'text-destructive' : 'text-muted-foreground'
            )}>
              {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'} {trendLabel}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-primary/5">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
}
