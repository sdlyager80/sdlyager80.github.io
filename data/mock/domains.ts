import { Domain, Tenant } from "@/lib/types/domain";

export const mockTenants: Tenant[] = [
  {
    id: "tenant-bloom-001",
    name: "Bloom Insurance Corp",
    domain: "bloom-insurance.servicenow.com",
    services: ["svc-001", "svc-002", "svc-003", "svc-004", "svc-006", "svc-007"],
    settings: {
      theme: {
        primaryColor: "#00ADEE",
        logo: "/logos/bloom.png",
      },
      features: ["advanced-analytics", "custom-workflows", "api-access"],
      notifications: {
        email: true,
        slack: true,
      },
    },
    activeUsers: 142,
    lastActivity: new Date("2025-12-21T10:30:00"),
  },
  {
    id: "tenant-acme-001",
    name: "ACME Insurance",
    domain: "acme-insurance.servicenow.com",
    services: ["svc-001", "svc-002", "svc-006"],
    settings: {
      features: ["basic-analytics"],
      notifications: {
        email: true,
      },
    },
    activeUsers: 58,
    lastActivity: new Date("2025-12-20T15:45:00"),
  },
  {
    id: "tenant-shield-001",
    name: "Shield Life Insurance",
    domain: "shield-life.servicenow.com",
    services: ["svc-001", "svc-002", "svc-003", "svc-007", "svc-008"],
    settings: {
      theme: {
        primaryColor: "#1B75BB",
      },
      features: ["advanced-analytics", "compliance-tracking"],
      notifications: {
        email: true,
        slack: false,
      },
    },
    activeUsers: 95,
    lastActivity: new Date("2025-12-21T09:15:00"),
  },
  {
    id: "tenant-guardian-001",
    name: "Guardian Health",
    domain: "guardian-health.servicenow.com",
    services: ["svc-001", "svc-006"],
    settings: {
      features: ["basic-analytics"],
      notifications: {
        email: true,
      },
    },
    activeUsers: 23,
    lastActivity: new Date("2025-12-19T14:20:00"),
  },
];

export const mockDomains: Domain[] = [
  {
    id: "dom-001",
    name: "Insurance Providers",
    description: "Primary insurance service providers",
    tenants: mockTenants,
    createdAt: new Date("2024-06-15"),
    updatedAt: new Date("2025-12-21"),
  },
];
