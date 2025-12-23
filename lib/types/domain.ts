export interface Domain {
  id: string;
  name: string;
  description?: string;
  tenants: Tenant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  services: string[]; // Service IDs
  settings: TenantSettings;
  activeUsers?: number;
  lastActivity?: Date;
}

export interface TenantSettings {
  theme?: {
    primaryColor?: string;
    logo?: string;
  };
  features: string[];
  notifications?: {
    email?: boolean;
    slack?: boolean;
  };
}
