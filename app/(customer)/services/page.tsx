"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceCard } from "@/components/services/service-card";
import { ServiceTree } from "@/components/services/service-tree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockServices } from "@/data/mock/services";
import { Service } from "@/lib/types/service";
import { Plus, Search } from "lucide-react";

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredServices = mockServices.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || service.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockServices.length,
    active: mockServices.filter(s => s.status === "active").length,
    inactive: mockServices.filter(s => s.status === "inactive").length,
    maintenance: mockServices.filter(s => s.status === "maintenance").length,
  };

  return (
    <div>
      <PageHeader
        title="Services"
        description={`Manage and configure your ServiceNow services (${stats.active} active, ${stats.total} total)`}
        actions={
          <Button className="bg-bloom-cyan hover:bg-bloom-cyan/90">
            <Plus className="mr-2 h-4 w-4" />
            Request Service
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ServiceTree
            services={mockServices}
            onSelectService={setSelectedService}
            selectedServiceId={selectedService?.id}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed">
              <p className="text-muted-foreground mb-2">No services found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
