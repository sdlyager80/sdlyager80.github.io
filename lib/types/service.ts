export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "inactive" | "maintenance";
  lastModified: Date;
  tenantId: string;
  icon?: string;
  tables?: ServiceTable[];
  components?: ServiceComponent[];
}

export interface ServiceTable {
  id: string;
  name: string;
  tableName: string;
  description?: string;
  fields: TableField[];
  filters?: TableFilter[];
}

export interface TableField {
  id: string;
  name: string;
  type: "string" | "number" | "date" | "boolean" | "reference";
  label: string;
  required: boolean;
  visible: boolean;
  order: number;
}

export interface TableFilter {
  id: string;
  field: string;
  operator: "equals" | "contains" | "greater_than" | "less_than" | "starts_with" | "ends_with";
  value: string | number | boolean | Date;
}

export interface ServiceComponent {
  id: string;
  name: string;
  type: "form" | "table" | "chart" | "custom";
  dataSource?: string; // Table ID
  config: ComponentConfig;
}

export interface ComponentConfig {
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
  layout?: "grid" | "list" | "compact";
  displayOptions?: {
    inlineEdit?: boolean;
    bulkActions?: boolean;
    itemsPerPage?: number;
  };
  fields?: string[]; // Field IDs to display
}
