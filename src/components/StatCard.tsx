import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  gradient?: 'primary' | 'blue' | 'achievement';
}

export const StatCard = ({ title, value, icon: Icon, trend, gradient = 'primary' }: StatCardProps) => {
  const gradientClass = {
    primary: 'gradient-primary',
    blue: 'gradient-blue',
    achievement: 'gradient-achievement',
  }[gradient];

  return (
    <Card className="p-6 shadow-card hover:shadow-golden transition-smooth border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-foreground mb-2">{value}</p>
          {trend && (
            <p className="text-xs text-muted-foreground">{trend}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${gradientClass}`}>
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
    </Card>
  );
};
