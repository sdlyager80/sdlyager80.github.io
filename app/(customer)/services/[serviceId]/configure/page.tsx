"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TableConfigurator } from "@/components/configuration/table-configurator";
import { FilterBuilder } from "@/components/configuration/filter-builder";
import { ComponentSettings } from "@/components/configuration/component-settings";
import { ConfigPreview } from "@/components/configuration/config-preview";
import { mockServices } from "@/data/mock/services";
import { ServiceTable, ComponentConfig, TableFilter } from "@/lib/types/service";
import { ArrowLeft, Save, RotateCcw, Rocket } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function ServiceConfigurePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const service = mockServices.find((s) => s.id === params.serviceId);

  const [tables, setTables] = useState<ServiceTable[]>(service?.tables || []);
  const [filters, setFilters] = useState<TableFilter[]>([]);
  const [config, setConfig] = useState<ComponentConfig>({
    theme: {
      primaryColor: "#00ADEE",
      secondaryColor: "#1B75BB",
    },
    layout: "grid",
    displayOptions: {
      inlineEdit: false,
      bulkActions: true,
      itemsPerPage: 25,
    },
  });

  if (!service) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-heading font-bold text-bloom-blue mb-2">
          Service Not Found
        </h1>
        <Button asChild>
          <Link href="/services">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Link>
        </Button>
      </div>
    );
  }

  const handleReset = () => {
    setTables(service.tables || []);
    setFilters([]);
    setConfig({
      theme: {
        primaryColor: "#00ADEE",
        secondaryColor: "#1B75BB",
      },
      layout: "grid",
      displayOptions: {
        inlineEdit: false,
        bulkActions: true,
        itemsPerPage: 25,
      },
    });
    toast({
      title: "Configuration Reset",
      description: "All changes have been reset to defaults.",
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your configuration has been saved as a draft.",
    });
  };

  const handlePublish = () => {
    toast({
      title: "Configuration Published",
      description: `${service.name} configuration has been published successfully.`,
    });
    setTimeout(() => {
      router.push(`/services/${service.id}`);
    }, 1500);
  };

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`/services/${service.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Service Details
          </Link>
        </Button>
        <PageHeader
          title={`Configure ${service.name}`}
          description="Set up data sources, component settings, and preview your configuration"
        />
      </div>

      <Tabs defaultValue="data-sources" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-3 bg-white border">
          <TabsTrigger
            value="data-sources"
            className="data-[state=active]:bg-bloom-cyan/10 data-[state=active]:text-bloom-cyan data-[state=active]:border-b-2 data-[state=active]:border-bloom-cyan"
          >
            Data Sources
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-bloom-cyan/10 data-[state=active]:text-bloom-cyan data-[state=active]:border-b-2 data-[state=active]:border-bloom-cyan"
          >
            Component Settings
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="data-[state=active]:bg-bloom-cyan/10 data-[state=active]:text-bloom-cyan data-[state=active]:border-b-2 data-[state=active]:border-bloom-cyan"
          >
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data-sources" className="space-y-6">
          <div className="bg-white rounded-lg border-l-4 border-l-bloom-cyan p-6">
            <h3 className="text-lg font-heading font-bold text-bloom-blue mb-4">
              Configure Data Tables
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Select the ServiceNow tables you want to display and configure which fields should be visible.
            </p>
            <TableConfigurator tables={tables} onTablesChange={setTables} />
          </div>

          <div className="bg-white rounded-lg border-l-4 border-l-bloom-cyan p-6">
            <h3 className="text-lg font-heading font-bold text-bloom-blue mb-4">
              Filter Conditions
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Define filter rules to control which records are displayed.
            </p>
            <FilterBuilder filters={filters} onFiltersChange={setFilters} />
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <ComponentSettings config={config} onConfigChange={setConfig} />
        </TabsContent>

        <TabsContent value="preview">
          <ConfigPreview tables={tables} config={config} />
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-0 bg-white border-t mt-8 -mx-4 px-4 py-4 flex items-center justify-between gap-4 shadow-lg">
        <Button
          variant="outline"
          onClick={handleReset}
          className="hover:border-bloom-red hover:text-bloom-red"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset to Defaults
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button
            onClick={handlePublish}
            className="bg-bloom-cyan hover:bg-bloom-cyan/90"
          >
            <Rocket className="mr-2 h-4 w-4" />
            Publish Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
