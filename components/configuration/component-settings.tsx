"use client";

import { useState } from "react";
import { BloomCard } from "@/components/shared/bloom-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComponentConfig } from "@/lib/types/service";
import { Palette, Layout, Settings2 } from "lucide-react";

interface ComponentSettingsProps {
  config?: ComponentConfig;
  onConfigChange?: (config: ComponentConfig) => void;
}

export function ComponentSettings({ config, onConfigChange }: ComponentSettingsProps) {
  const [settings, setSettings] = useState<ComponentConfig>(
    config || {
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
    }
  );

  const updateSettings = (updates: Partial<ComponentConfig>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    onConfigChange?.(updated);
  };

  const updateTheme = (theme: Partial<ComponentConfig["theme"]>) => {
    updateSettings({
      theme: { ...settings.theme, ...theme },
    });
  };

  const updateDisplayOptions = (
    options: Partial<ComponentConfig["displayOptions"]>
  ) => {
    updateSettings({
      displayOptions: { ...settings.displayOptions, ...options },
    });
  };

  return (
    <div className="space-y-6">
      <BloomCard>
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-5 w-5 text-bloom-cyan" />
          <h3 className="font-heading font-bold text-bloom-blue">Theme Settings</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.theme?.primaryColor || "#00ADEE"}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                className="w-20 h-10 p-1"
              />
              <Input
                type="text"
                value={settings.theme?.primaryColor || "#00ADEE"}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                className="flex-1"
                placeholder="#00ADEE"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Default: #00ADEE (Bloom Cyan)
            </p>
          </div>

          <div className="space-y-2">
            <Label>Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={settings.theme?.secondaryColor || "#1B75BB"}
                onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                className="w-20 h-10 p-1"
              />
              <Input
                type="text"
                value={settings.theme?.secondaryColor || "#1B75BB"}
                onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                className="flex-1"
                placeholder="#1B75BB"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Default: #1B75BB (Bloom Blue)
            </p>
          </div>
        </div>
      </BloomCard>

      <BloomCard>
        <div className="flex items-center gap-2 mb-4">
          <Layout className="h-5 w-5 text-bloom-cyan" />
          <h3 className="font-heading font-bold text-bloom-blue">Layout Settings</h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Layout Type</Label>
            <Select
              value={settings.layout}
              onValueChange={(value: string) => updateSettings({ layout: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid View</SelectItem>
                <SelectItem value="list">List View</SelectItem>
                <SelectItem value="compact">Compact View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Items Per Page</Label>
            <Input
              type="number"
              value={settings.displayOptions?.itemsPerPage || 25}
              onChange={(e) =>
                updateDisplayOptions({ itemsPerPage: parseInt(e.target.value) })
              }
              min="10"
              max="100"
              step="5"
            />
          </div>
        </div>
      </BloomCard>

      <BloomCard>
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="h-5 w-5 text-bloom-cyan" />
          <h3 className="font-heading font-bold text-bloom-blue">Display Options</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Inline Editing</Label>
              <p className="text-xs text-muted-foreground">
                Allow users to edit records directly in the view
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.displayOptions?.inlineEdit || false}
                onChange={(e) =>
                  updateDisplayOptions({ inlineEdit: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-bloom-cyan rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bloom-cyan"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="font-medium">Bulk Actions</Label>
              <p className="text-xs text-muted-foreground">
                Enable multi-select and bulk operations
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.displayOptions?.bulkActions || false}
                onChange={(e) =>
                  updateDisplayOptions({ bulkActions: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-bloom-cyan rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bloom-cyan"></div>
            </label>
          </div>
        </div>
      </BloomCard>
    </div>
  );
}
