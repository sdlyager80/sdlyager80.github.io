"use client";

import { useState } from "react";
import { BloomCard } from "@/components/shared/bloom-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableFilter } from "@/lib/types/service";
import { Plus, X } from "lucide-react";

interface FilterBuilderProps {
  filters?: TableFilter[];
  onFiltersChange?: (filters: TableFilter[]) => void;
}

const operators = [
  { value: "equals", label: "Equals" },
  { value: "contains", label: "Contains" },
  { value: "starts_with", label: "Starts With" },
  { value: "ends_with", label: "Ends With" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
];

const fields = [
  { value: "name", label: "Name" },
  { value: "status", label: "Status" },
  { value: "created_at", label: "Created Date" },
  { value: "updated_at", label: "Updated Date" },
  { value: "amount", label: "Amount" },
];

export function FilterBuilder({ filters = [], onFiltersChange }: FilterBuilderProps) {
  const [filterList, setFilterList] = useState<TableFilter[]>(filters);

  const addFilter = () => {
    const newFilter: TableFilter = {
      id: `filter-${Date.now()}`,
      field: "",
      operator: "equals",
      value: "",
    };
    const updated = [...filterList, newFilter];
    setFilterList(updated);
    onFiltersChange?.(updated);
  };

  const removeFilter = (id: string) => {
    const updated = filterList.filter((f) => f.id !== id);
    setFilterList(updated);
    onFiltersChange?.(updated);
  };

  const updateFilter = (id: string, updates: Partial<TableFilter>) => {
    const updated = filterList.map((f) =>
      f.id === id ? { ...f, ...updates } : f
    );
    setFilterList(updated);
    onFiltersChange?.(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Filter Conditions</Label>
        <Button
          onClick={addFilter}
          size="sm"
          className="bg-bloom-cyan hover:bg-bloom-cyan/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Condition
        </Button>
      </div>

      {filterList.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground text-sm">No filters configured</p>
          <p className="text-xs text-muted-foreground mt-1">
            Click &quot;Add Condition&quot; to create a filter
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filterList.map((filter, index) => (
            <div key={filter.id}>
              {index > 0 && (
                <div className="flex items-center justify-center my-2">
                  <span className="px-3 py-1 bg-bloom-cyan/10 text-bloom-cyan text-xs font-semibold rounded-full">
                    AND
                  </span>
                </div>
              )}
              <BloomCard className="relative">
                <div className="absolute top-3 right-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-bloom-red hover:text-bloom-red hover:bg-bloom-red/10"
                    onClick={() => removeFilter(filter.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-3 pr-10">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Field</Label>
                    <Select
                      value={filter.field}
                      onValueChange={(value) =>
                        updateFilter(filter.id, { field: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {fields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Operator</Label>
                    <Select
                      value={filter.operator}
                      onValueChange={(value: string) =>
                        updateFilter(filter.id, { operator: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {operators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Value</Label>
                    <Input
                      value={filter.value as string}
                      onChange={(e) =>
                        updateFilter(filter.id, { value: e.target.value })
                      }
                      placeholder="Enter value"
                    />
                  </div>
                </div>
              </BloomCard>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
