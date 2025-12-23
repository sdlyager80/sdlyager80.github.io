"use client";

import { Service } from "@/lib/types/service";
import { BloomCard } from "@/components/shared/bloom-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronDown, Folder, FileText, CheckCircle, AlertCircle, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ServiceTreeProps {
  services: Service[];
  onSelectService?: (service: Service) => void;
  selectedServiceId?: string;
}

export function ServiceTree({ services, onSelectService, selectedServiceId }: ServiceTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["CRM", "Insurance", "Document Management", "Finance", "Compliance"])
  );

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const getStatusIcon = (status: Service["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-3 h-3 text-bloom-green" />;
      case "maintenance":
        return <AlertCircle className="w-3 h-3 text-bloom-yellow" />;
      case "inactive":
        return <Lock className="w-3 h-3 text-bloom-grey" />;
    }
  };

  return (
    <BloomCard title="Service Tree" className="h-fit sticky top-24">
      <div className="space-y-1">
        {Object.entries(servicesByCategory).map(([category, categoryServices]) => {
          const isExpanded = expandedCategories.has(category);
          const activeCount = categoryServices.filter(s => s.status === "active").length;

          return (
            <div key={category}>
              <Button
                variant="ghost"
                className="w-full justify-start text-left font-medium hover:bg-bloom-cyan/5"
                onClick={() => toggleCategory(category)}
              >
                {isExpanded ? (
                  <ChevronDown className="mr-2 h-4 w-4" />
                ) : (
                  <ChevronRight className="mr-2 h-4 w-4" />
                )}
                <Folder className="mr-2 h-4 w-4 text-bloom-cyan" />
                <span className="flex-1">{category}</span>
                <span className="text-xs text-muted-foreground">
                  {activeCount}/{categoryServices.length}
                </span>
              </Button>

              {isExpanded && (
                <div className="ml-6 space-y-1 mt-1">
                  {categoryServices.map((service) => (
                    <Button
                      key={service.id}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-left text-sm hover:bg-bloom-cyan/5 border-l-2 border-transparent hover:border-bloom-cyan",
                        selectedServiceId === service.id && "bg-bloom-cyan/10 border-bloom-cyan"
                      )}
                      onClick={() => onSelectService?.(service)}
                    >
                      <FileText className="mr-2 h-4 w-4 text-bloom-blue flex-shrink-0" />
                      <span className="flex-1 truncate">{service.name}</span>
                      {getStatusIcon(service.status)}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </BloomCard>
  );
}
