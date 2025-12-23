"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { BloomCard } from "@/components/shared/bloom-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockTenants } from "@/data/mock/domains";
import { mockServices } from "@/data/mock/services";
import {
  ArrowLeft,
  Eye,
  RefreshCw,
  Plus,
  Users,
  Activity,
  Shield,
  CheckCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils/format";
import { useToast } from "@/hooks/use-toast";

export default function DomainDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const tenant = mockTenants.find((t) => t.id === params.domainId);

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-heading font-bold text-bloom-blue mb-2">
          Domain Not Found
        </h1>
        <Button asChild>
          <Link href="/domains">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Domains
          </Link>
        </Button>
      </div>
    );
  }

  const handleViewAsCustomer = () => {
    toast({
      title: "Switching View",
      description: `Viewing portal as ${tenant.name}...`,
    });
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  const grantService = (_serviceId: string) => {
    toast({
      title: "Service Access Granted",
      description: "Service has been enabled for this domain.",
    });
  };

  const revokeService = (_serviceId: string) => {
    toast({
      title: "Service Access Revoked",
      description: "Service has been disabled for this domain.",
    });
  };

  const activeServices = mockServices.filter((s) =>
    tenant.services.includes(s.id)
  );
  const availableServices = mockServices.filter(
    (s) => !tenant.services.includes(s.id)
  );

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/domains">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Domains
          </Link>
        </Button>
        <PageHeader
          title={tenant.name}
          description={tenant.domain}
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleViewAsCustomer}
              >
                <Eye className="mr-2 h-4 w-4" />
                View as Customer
              </Button>
              <Button className="bg-bloom-cyan hover:bg-bloom-cyan/90">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync Data
              </Button>
            </div>
          }
        />
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <BloomCard>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-bloom-cyan/10 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-bloom-cyan" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-bloom-blue">
                {tenant.services.length}
              </p>
              <p className="text-xs text-muted-foreground">Active Services</p>
            </div>
          </div>
        </BloomCard>

        <BloomCard>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-bloom-green/10 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-bloom-green" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-bloom-blue">
                {tenant.activeUsers}
              </p>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
          </div>
        </BloomCard>

        <BloomCard>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-bloom-blue/10 rounded-lg flex items-center justify-center">
              <Activity className="h-6 w-6 text-bloom-blue" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-bloom-blue">
                {tenant.settings.features.length}
              </p>
              <p className="text-xs text-muted-foreground">Features</p>
            </div>
          </div>
        </BloomCard>

        <BloomCard>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-bloom-yellow/10 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-bloom-blue line-clamp-1">
                {formatRelativeTime(tenant.lastActivity || new Date())}
              </p>
              <p className="text-xs text-muted-foreground">Last Activity</p>
            </div>
          </div>
        </BloomCard>
      </div>

      <Tabs defaultValue="active-services" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger
            value="active-services"
            className="data-[state=active]:bg-bloom-cyan/10 data-[state=active]:text-bloom-cyan"
          >
            Active Services ({activeServices.length})
          </TabsTrigger>
          <TabsTrigger
            value="service-catalog"
            className="data-[state=active]:bg-bloom-cyan/10 data-[state=active]:text-bloom-cyan"
          >
            Service Catalog ({availableServices.length})
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-bloom-cyan/10 data-[state=active]:text-bloom-cyan"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active-services">
          <BloomCard title="Active Services">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeServices.map((service) => (
                <div
                  key={service.id}
                  className="p-4 border rounded-lg hover:border-bloom-cyan transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-heading font-bold text-bloom-blue mb-1">
                        {service.name}
                      </h4>
                      <Badge className="bg-bloom-green/10 text-bloom-green text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 hover:border-bloom-cyan hover:text-bloom-cyan"
                      asChild
                    >
                      <Link href={`/services/${service.id}`}>
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-bloom-red hover:border-bloom-red hover:bg-bloom-red/10"
                      onClick={() => revokeService(service.id)}
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </BloomCard>
        </TabsContent>

        <TabsContent value="service-catalog">
          <BloomCard title="Available Services">
            <p className="text-sm text-muted-foreground mb-6">
              Grant access to additional services for this domain
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableServices.map((service) => (
                <div
                  key={service.id}
                  className="p-4 border rounded-lg hover:border-bloom-cyan transition-colors"
                >
                  <div className="mb-3">
                    <h4 className="font-heading font-bold text-bloom-blue mb-1">
                      {service.name}
                    </h4>
                    <Badge variant="secondary" className="text-xs">
                      {service.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                    {service.description}
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-bloom-cyan hover:bg-bloom-cyan/90"
                    onClick={() => grantService(service.id)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Grant Access
                  </Button>
                </div>
              ))}
            </div>
          </BloomCard>
        </TabsContent>

        <TabsContent value="analytics">
          <BloomCard title="Domain Analytics">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="p-6 bg-muted rounded-lg">
                <h4 className="font-semibold mb-4">User Activity (7 days)</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Total Logins</span>
                    <span className="font-bold">487</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg. Session Duration</span>
                    <span className="font-bold">18 min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Configuration Changes</span>
                    <span className="font-bold">12</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-muted rounded-lg">
                <h4 className="font-semibold mb-4">Features Enabled</h4>
                <div className="space-y-2">
                  {tenant.settings.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-bloom-green" />
                      <span className="text-sm capitalize">
                        {feature.replace(/-/g, " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </BloomCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
