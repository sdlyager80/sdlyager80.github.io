import { Service } from "@/lib/types/service";
import { BloomCard } from "@/components/shared/bloom-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils/format";
import { Settings, ExternalLink, Shield, Clipboard, FileText, CreditCard, ShieldCheck, Briefcase, Users, FileCheck, LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: Service;
}

const statusConfig = {
  active: {
    className: "bg-bloom-green/10 text-bloom-green",
    label: "Active",
  },
  inactive: {
    className: "bg-gray-100 text-gray-600",
    label: "Inactive",
  },
  maintenance: {
    className: "bg-bloom-yellow/20 text-amber-700",
    label: "Maintenance",
  },
};

const iconMap: Record<string, LucideIcon> = {
  users: Users,
  shield: Shield,
  clipboard: Clipboard,
  "file-check": FileCheck,
  briefcase: Briefcase,
  "file-text": FileText,
  "credit-card": CreditCard,
  "shield-check": ShieldCheck,
};

export function ServiceCard({ service }: ServiceCardProps) {
  const config = statusConfig[service.status];
  const IconComponent = iconMap[service.icon || "file-text"] || FileText;

  return (
    <BloomCard
      className="hover:shadow-lg transition-all cursor-pointer group"
      headerAction={
        <Badge className={cn("text-xs", config.className)}>
          {config.label}
        </Badge>
      }
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-bloom-cyan/10 flex items-center justify-center flex-shrink-0">
            <IconComponent className="w-6 h-6 text-bloom-cyan" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-heading font-bold text-bloom-blue mb-1 truncate">
              {service.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {service.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">Category:</span>
            <span>{service.category}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">Updated:</span>
            <span>{formatRelativeTime(service.lastModified)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 hover:border-bloom-cyan hover:text-bloom-cyan"
            asChild
          >
            <Link href={`/services/${service.id}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-bloom-cyan hover:bg-bloom-cyan/90 text-white"
            asChild
          >
            <Link href={`/services/${service.id}/configure`}>
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Link>
          </Button>
        </div>
      </div>
    </BloomCard>
  );
}
