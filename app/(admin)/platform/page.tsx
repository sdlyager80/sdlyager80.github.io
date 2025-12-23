import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { BloomCard } from "@/components/shared/bloom-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockTenants } from "@/data/mock/domains";
import { mockServices } from "@/data/mock/services";
import {
  Building2,
  Shield,
  Activity,
  Users,
  CheckCircle,
  Clock,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils/format";

export default function PlatformDashboardPage() {
  const totalDomains = mockTenants.length;
  const totalActiveServices = mockServices.filter(s => s.status === "active").length;
  const totalUsers = mockTenants.reduce((sum, t) => sum + (t.activeUsers || 0), 0);
  const avgConfigCompletion = 78; // Mock percentage

  const recentActivity = [
    {
      id: "1",
      tenant: "Bloom Insurance Corp",
      action: "Enabled Policy Management service",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      type: "service" as const,
    },
    {
      id: "2",
      tenant: "ACME Insurance",
      action: "Updated Customer Management configuration",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      type: "config" as const,
    },
    {
      id: "3",
      tenant: "Shield Life Insurance",
      action: "Added 15 new users",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      type: "users" as const,
    },
    {
      id: "4",
      tenant: "Bloom Insurance Corp",
      action: "Deployed Compliance Tracking updates",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      type: "deployment" as const,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Platform Dashboard"
        description="Overview of all customer domains and platform health"
        actions={
          <Button asChild className="bg-bloom-cyan hover:bg-bloom-cyan/90">
            <Link href="/domains">
              <Building2 className="mr-2 h-4 w-4" />
              Manage Domains
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Domains"
          value={totalDomains}
          description="Active customer domains"
          icon={Building2}
          iconBgColor="bg-bloom-cyan/10"
          trend={{ value: 12.5, label: "from last month" }}
        />
        <StatsCard
          title="Active Services"
          value={totalActiveServices}
          description="Platform-wide services"
          icon={Shield}
          iconBgColor="bg-bloom-green/10"
        />
        <StatsCard
          title="Total Users"
          value={totalUsers}
          description="Across all domains"
          icon={Users}
          iconBgColor="bg-bloom-blue/10"
          trend={{ value: 8.3, label: "from last month" }}
        />
        <StatsCard
          title="Config Completion"
          value={`${avgConfigCompletion}%`}
          description="Average across domains"
          icon={CheckCircle}
          iconBgColor="bg-bloom-green/10"
          trend={{ value: 5.2, label: "from last week" }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <BloomCard title="Domain Overview">
            <div className="space-y-3">
              {mockTenants.map((tenant) => {
                const configuredServices = tenant.services.length;
                const totalAvailable = mockServices.length;
                const completionPercent = Math.round(
                  (configuredServices / totalAvailable) * 100
                );

                return (
                  <div
                    key={tenant.id}
                    className="p-4 border rounded-lg hover:border-bloom-cyan transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-heading font-bold text-bloom-blue mb-1">
                          {tenant.name}
                        </h4>
                        <p className="text-xs text-muted-foreground font-mono">
                          {tenant.domain}
                        </p>
                      </div>
                      <Badge className="bg-bloom-green/10 text-bloom-green">
                        {completionPercent}% Complete
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Services</p>
                        <p className="font-semibold">
                          {configuredServices}/{totalAvailable}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Users</p>
                        <p className="font-semibold">{tenant.activeUsers}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs mb-1">Last Active</p>
                        <p className="font-semibold text-xs">
                          {formatRelativeTime(tenant.lastActivity || new Date())}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full hover:border-bloom-cyan hover:text-bloom-cyan"
                      >
                        <Link href={`/domains/${tenant.id}`}>
                          View Details
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </BloomCard>

          <BloomCard title="Platform Health">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-bloom-green rounded-full" />
                  <span className="text-sm font-medium">All Systems Operational</span>
                </div>
                <Badge className="bg-bloom-green/10 text-bloom-green">Healthy</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-1">Uptime</p>
                  <p className="text-lg font-bold text-bloom-blue">99.98%</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-1">Avg Response Time</p>
                  <p className="text-lg font-bold text-bloom-blue">145ms</p>
                </div>
              </div>
            </div>
          </BloomCard>
        </div>

        <div className="space-y-6">
          <BloomCard title="Recent Activity">
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex items-start gap-2">
                    <Activity className="h-4 w-4 text-bloom-cyan mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.tenant}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {activity.action}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeTime(activity.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BloomCard>

          <BloomCard title="Quick Stats">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Week</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>New Configurations</span>
                  <span className="font-semibold">23</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Service Activations</span>
                  <span className="font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>User Logins</span>
                  <span className="font-semibold">1,847</span>
                </div>
              </div>
            </div>
          </BloomCard>
        </div>
      </div>
    </div>
  );
}
