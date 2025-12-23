"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { BloomCard } from "@/components/shared/bloom-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockServices } from "@/data/mock/services";
import { Settings, ArrowLeft, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils/format";

export default function ServiceDetailPage() {
  const params = useParams();
  const service = mockServices.find((s) => s.id === params.serviceId);

  if (!service) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-heading font-bold text-bloom-blue mb-2">
          Service Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          The service you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild>
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>
      </div>
    );
  }

  const statusConfig = {
    active: "bg-bloom-green/10 text-bloom-green",
    inactive: "bg-gray-100 text-gray-600",
    maintenance: "bg-bloom-yellow/20 text-amber-700",
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>
        <PageHeader
          title={service.name}
          description={service.description}
          actions={
            <Button
              asChild
              className="bg-bloom-cyan hover:bg-bloom-cyan/90"
            >
              <Link href={`/services/${service.id}/configure`}>
                <Settings className="mr-2 h-4 w-4" />
                Configure Service
              </Link>
            </Button>
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <BloomCard title="Service Information">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
              <Badge className={statusConfig[service.status]}>
                {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Category</p>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-bloom-cyan" />
                <p className="text-sm">{service.category}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Last Modified</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-bloom-cyan" />
                <p className="text-sm">{formatRelativeTime(service.lastModified)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Service ID</p>
              <p className="text-sm font-mono">{service.id}</p>
            </div>
          </div>
        </BloomCard>

        <BloomCard title="Configuration Status" className="lg:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Data Tables Configured</span>
              <span className="text-sm text-muted-foreground">
                {service.tables?.length || 0} table{service.tables?.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Components Configured</span>
              <span className="text-sm text-muted-foreground">
                {service.components?.length || 0} component{service.components?.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="pt-4 border-t">
              <Button
                asChild
                className="w-full bg-bloom-cyan hover:bg-bloom-cyan/90"
              >
                <Link href={`/services/${service.id}/configure`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Open Configuration Editor
                </Link>
              </Button>
            </div>
          </div>
        </BloomCard>
      </div>

      {service.tables && service.tables.length > 0 && (
        <BloomCard title="Configured Tables">
          <div className="space-y-3">
            {service.tables.map((table) => (
              <div
                key={table.id}
                className="p-4 border rounded-lg hover:border-bloom-cyan transition-colors"
              >
                <h4 className="font-semibold text-sm mb-1">{table.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">
                  {table.tableName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {table.fields.length} field{table.fields.length !== 1 ? 's' : ''} configured
                </p>
              </div>
            ))}
          </div>
        </BloomCard>
      )}
    </div>
  );
}
