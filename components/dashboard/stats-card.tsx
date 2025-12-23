import { LucideIcon } from "lucide-react";
import { BloomCard } from "@/components/shared/bloom-card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconBgColor = "bg-bloom-cyan/10",
  trend,
}: StatsCardProps) {
  return (
    <BloomCard>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-heading font-bold text-bloom-blue mb-1">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs mt-2 font-semibold flex items-center gap-1",
                trend.value >= 0 ? "text-bloom-green" : "text-bloom-red"
              )}
            >
              <span>
                {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="font-normal text-muted-foreground">
                {trend.label}
              </span>
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            iconBgColor
          )}
        >
          <Icon className="w-6 h-6 text-bloom-cyan" />
        </div>
      </div>
    </BloomCard>
  );
}
