import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Domain, Tenant } from "@/lib/types/domain";
import {
  getDomains,
  getTenants,
  getTenantById,
  grantServiceAccess,
  revokeServiceAccess,
  createTenant,
  updateTenantSettings,
} from "@/lib/api/domains";

/**
 * Hook to fetch all domains
 */
export function useDomains() {
  return useQuery({
    queryKey: ["domains"],
    queryFn: getDomains,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch all tenants
 */
export function useTenants() {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: getTenants,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single tenant by ID
 */
export function useTenant(id: string) {
  return useQuery({
    queryKey: ["tenants", id],
    queryFn: () => getTenantById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to grant service access to a tenant
 */
export function useGrantServiceAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, serviceId }: { tenantId: string; serviceId: string }) =>
      grantServiceAccess(tenantId, serviceId),
    onSuccess: (_, variables) => {
      // Invalidate tenant queries to refetch with updated services
      queryClient.invalidateQueries({ queryKey: ["tenants", variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
}

/**
 * Hook to revoke service access from a tenant
 */
export function useRevokeServiceAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, serviceId }: { tenantId: string; serviceId: string }) =>
      revokeServiceAccess(tenantId, serviceId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenants", variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
}

/**
 * Hook to create a new tenant
 */
export function useCreateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });
}

/**
 * Hook to update tenant settings
 */
export function useUpdateTenantSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, settings }: { tenantId: string; settings: Tenant["settings"] }) =>
      updateTenantSettings(tenantId, settings),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tenants", variables.tenantId] });
    },
  });
}
