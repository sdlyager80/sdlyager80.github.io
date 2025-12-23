import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { BloomCard } from "@/components/shared/bloom-card";
import { Button } from "@/components/ui/button";
import { Plus, Shield, Wrench, Activity, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <PageHeader
        title="Welcome back, John"
        description="Overview of your ServiceNow configuration portal"
        actions={
          <Button asChild className="bg-bloom-cyan hover:bg-bloom-cyan/90">
            <Link href="/services">
              <Plus className="mr-2 h-4 w-4" />
              View Services
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Services"
          value={8}
          description="Active subscriptions"
          icon={Shield}
          iconBgColor="bg-bloom-cyan/10"
          trend={{ value: 12.5, label: "from last month" }}
        />
        <StatsCard
          title="Configured"
          value={6}
          description="Ready for use"
          icon={CheckCircle}
          iconBgColor="bg-bloom-green/10"
          trend={{ value: 8.3, label: "from last month" }}
        />
        <StatsCard
          title="Pending Setup"
          value={2}
          description="Needs configuration"
          icon={Wrench}
          iconBgColor="bg-bloom-yellow/10"
        />
        <StatsCard
          title="Recent Changes"
          value={23}
          description="Last 30 days"
          icon={Activity}
          iconBgColor="bg-bloom-blue/10"
          trend={{ value: -3.1, label: "from last week" }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <BloomCard title="Quick Actions">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-between hover:border-bloom-cyan"
                asChild
              >
                <Link href="/services">
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-bloom-cyan" />
                    <span>View All Services</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between hover:border-bloom-cyan"
                asChild
              >
                <Link href="/services">
                  <div className="flex items-center">
                    <Wrench className="mr-2 h-4 w-4 text-bloom-cyan" />
                    <span>Configure Service</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </BloomCard>

          <BloomCard title="Pending Tasks">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-bloom-yellow rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">Configure Agent Portal</p>
                  <p className="text-xs text-muted-foreground">2 fields remaining</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-bloom-yellow rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium">Review Compliance Settings</p>
                  <p className="text-xs text-muted-foreground">Due in 3 days</p>
                </div>
              </div>
            </div>
          </BloomCard>
        </div>
      </div>
    </div>
  );
}
