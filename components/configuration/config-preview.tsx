"use client";

import { BloomCard } from "@/components/shared/bloom-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceTable, ComponentConfig } from "@/lib/types/service";
import { RefreshCw, Eye } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ConfigPreviewProps {
  tables?: ServiceTable[];
  config?: ComponentConfig;
}

// Mock data for preview
const sampleData = [
  { id: 1, name: "John Doe", status: "Active", created_at: "2025-01-15", amount: "$1,250" },
  { id: 2, name: "Jane Smith", status: "Pending", created_at: "2025-01-18", amount: "$2,400" },
  { id: 3, name: "Bob Johnson", status: "Active", created_at: "2025-01-20", amount: "$890" },
  { id: 4, name: "Alice Williams", status: "Active", created_at: "2025-01-21", amount: "$3,150" },
];

export function ConfigPreview({ tables = [], config }: ConfigPreviewProps) {
  const primaryColor = config?.theme?.primaryColor || "#00ADEE";
  const layout = config?.layout || "grid";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-bloom-cyan" />
          <h3 className="font-heading font-bold text-bloom-blue">Live Preview</h3>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Preview
        </Button>
      </div>

      {tables.length === 0 ? (
        <BloomCard>
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-2">No tables configured</p>
            <p className="text-sm text-muted-foreground">
              Add tables in the Data Sources tab to see a preview
            </p>
          </div>
        </BloomCard>
      ) : (
        <div className="space-y-6">
          {tables.map((table) => (
            <BloomCard key={table.id} title={table.name}>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Table: {table.tableName}</span>
                  <span>•</span>
                  <span>{table.fields.filter(f => f.visible).length} visible fields</span>
                  <span>•</span>
                  <span>Layout: {layout}</span>
                </div>

                {layout === "grid" || layout === "list" ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow style={{ backgroundColor: `${primaryColor}15` }}>
                          {table.fields
                            .filter((f) => f.visible)
                            .map((field) => (
                              <TableHead key={field.id} className="font-semibold">
                                {field.label}
                                {field.required && (
                                  <span className="text-bloom-red ml-1">*</span>
                                )}
                              </TableHead>
                            ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleData.map((row) => (
                          <TableRow key={row.id} className="hover:bg-muted/50">
                            {table.fields
                              .filter((f) => f.visible)
                              .map((field) => (
                                <TableCell key={field.id}>
                                  {field.name === "status" ? (
                                    <Badge
                                      className={
                                        row.status === "Active"
                                          ? "bg-bloom-green/10 text-bloom-green"
                                          : "bg-bloom-yellow/20 text-amber-700"
                                      }
                                    >
                                      {row[field.name as keyof typeof row]}
                                    </Badge>
                                  ) : (
                                    row[field.name as keyof typeof row] || "-"
                                  )}
                                </TableCell>
                              ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {sampleData.map((row) => (
                      <div
                        key={row.id}
                        className="p-4 border rounded-lg hover:border-bloom-cyan transition-colors"
                        style={{ borderLeftWidth: "4px", borderLeftColor: primaryColor }}
                      >
                        <div className="grid grid-cols-2 gap-2">
                          {table.fields
                            .filter((f) => f.visible)
                            .map((field) => (
                              <div key={field.id}>
                                <p className="text-xs text-muted-foreground">
                                  {field.label}
                                </p>
                                <p className="text-sm font-medium">
                                  {row[field.name as keyof typeof row] || "-"}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t text-sm text-muted-foreground">
                  <span>Showing {sampleData.length} of {sampleData.length} records</span>
                  <span>Items per page: {config?.displayOptions?.itemsPerPage || 25}</span>
                </div>
              </div>
            </BloomCard>
          ))}
        </div>
      )}
    </div>
  );
}
