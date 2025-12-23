import { BloomCard } from "@/components/shared/bloom-card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils/format";
import { Clock, Settings, Shield, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: string;
  type: "service" | "configuration" | "deployment";
  title: string;
  description: string;
  timestamp: Date;
}

const mockActivities: Activity[] = [
  {
    id: "1",
    type: "configuration",
    title: "Updated Customer Table",
    description: "Modified field visibility settings in Customer Management",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
  },
  {
    id: "2",
    type: "service",
    title: "Activated Policy Management",
    description: "Service deployed to production environment",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "3",
    type: "deployment",
    title: "Configuration Deployed",
    description: "Claims processing updates pushed live",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "4",
    type: "configuration",
    title: "Filter Rules Updated",
    description: "Added new filter conditions to Underwriting Workflow",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
];

const typeConfig = {
  service: {
    color: "bg-bloom-cyan/10 text-bloom-cyan",
    icon: Shield,
    badgeVariant: "default" as const,
  },
  configuration: {
    color: "bg-bloom-blue/10 text-bloom-blue",
    icon: Settings,
    badgeVariant: "secondary" as const,
  },
  deployment: {
    color: "bg-bloom-green/10 text-bloom-green",
    icon: CheckCircle,
    badgeVariant: "outline" as const,
  },
};

export function RecentActivity() {
  return (
    <BloomCard title="Recent Activity">
      <div className="space-y-4">
        {mockActivities.map((activity) => {
          const config = typeConfig[activity.type];
          const IconComponent = config.icon;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  config.color
                )}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-semibold text-gray-900">
                    {activity.title}
                  </p>
                  <Badge variant={config.badgeVariant} className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {activity.description}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatRelativeTime(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </BloomCard>
  );
}
