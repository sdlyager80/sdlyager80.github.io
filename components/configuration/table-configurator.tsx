"use client";

import { useState } from "react";
import { BloomCard } from "@/components/shared/bloom-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ServiceTable } from "@/lib/types/service";
import { Plus, X, GripVertical } from "lucide-react";

interface TableConfiguratorProps {
  tables?: ServiceTable[];
  onTablesChange?: (tables: ServiceTable[]) => void;
}

// Mock available tables for selection
const availableTables = [
  { id: "tbl-cust", name: "Customers", tableName: "x_bloom_customers" },
  { id: "tbl-policy", name: "Policies", tableName: "x_bloom_policies" },
  { id: "tbl-claims", name: "Claims", tableName: "x_bloom_claims" },
  { id: "tbl-agents", name: "Agents", tableName: "x_bloom_agents" },
];

export function TableConfigurator({ tables = [], onTablesChange }: TableConfiguratorProps) {
  const [selectedTables, setSelectedTables] = useState<ServiceTable[]>(tables);

  const addTable = (tableId: string) => {
    const table = availableTables.find((t) => t.id === tableId);
    if (!table) return;

    const newTable: ServiceTable = {
      id: table.id,
      name: table.name,
      tableName: table.tableName,
      fields: [
        {
          id: `${table.id}-fld-1`,
          name: "name",
          type: "string",
          label: "Name",
          required: true,
          visible: true,
          order: 1,
        },
        {
          id: `${table.id}-fld-2`,
          name: "created_at",
          type: "date",
          label: "Created Date",
          required: false,
          visible: true,
          order: 2,
        },
      ],
      filters: [],
    };

    const updated = [...selectedTables, newTable];
    setSelectedTables(updated);
    onTablesChange?.(updated);
  };

  const removeTable = (tableId: string) => {
    const updated = selectedTables.filter((t) => t.id !== tableId);
    setSelectedTables(updated);
    onTablesChange?.(updated);
  };

  const toggleFieldVisibility = (tableId: string, fieldId: string) => {
    const updated = selectedTables.map((table) => {
      if (table.id === tableId) {
        return {
          ...table,
          fields: table.fields.map((field) =>
            field.id === fieldId ? { ...field, visible: !field.visible } : field
          ),
        };
      }
      return table;
    });
    setSelectedTables(updated);
    onTablesChange?.(updated);
  };

  const availableToAdd = availableTables.filter(
    (t) => !selectedTables.some((st) => st.id === t.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Select onValueChange={addTable}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a table to add..." />
          </SelectTrigger>
          <SelectContent>
            {availableToAdd.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">
                All available tables added
              </div>
            ) : (
              availableToAdd.map((table) => (
                <SelectItem key={table.id} value={table.id}>
                  {table.name} ({table.tableName})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <Button className="bg-bloom-cyan hover:bg-bloom-cyan/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Table
        </Button>
      </div>

      {selectedTables.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No tables configured</p>
          <p className="text-sm text-muted-foreground">
            Select a table above to get started
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {selectedTables.map((table) => (
            <BloomCard key={table.id} className="relative">
              <div className="absolute top-4 right-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-bloom-red hover:text-bloom-red hover:bg-bloom-red/10"
                  onClick={() => removeTable(table.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-heading font-bold text-bloom-blue">
                    {table.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground font-mono ml-7">
                  {table.tableName}
                </p>
              </div>

              <div className="space-y-3 ml-7">
                <Label className="text-sm font-semibold">Visible Fields</Label>
                <div className="space-y-2">
                  {table.fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-muted/50"
                    >
                      <input
                        type="checkbox"
                        checked={field.visible}
                        onChange={() => toggleFieldVisibility(table.id, field.id)}
                        className="w-4 h-4 text-bloom-cyan rounded border-gray-300 focus:ring-bloom-cyan"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{field.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {field.name} ({field.type})
                        </p>
                      </div>
                      {field.required && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </BloomCard>
          ))}
        </div>
      )}
    </div>
  );
}
