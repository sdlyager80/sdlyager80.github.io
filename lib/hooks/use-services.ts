import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Service, ServiceTable, ComponentConfig } from "@/lib/types/service";
import {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  saveServiceConfiguration,
} from "@/lib/api/services";

/**
 * Hook to fetch all services
 */
export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a single service by ID
 */
export function useService(id: string) {
  return useQuery({
    queryKey: ["services", id],
    queryFn: () => getServiceById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to create a new service
 */
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      // Invalidate and refetch services
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

/**
 * Hook to update a service
 */
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Service> }) =>
      updateService(id, updates),
    onSuccess: (data) => {
      // Update the cache
      queryClient.setQueryData(["services", data.id], data);
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

/**
 * Hook to delete a service
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

/**
 * Hook to save service configuration
 */
export function useSaveConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceId,
      tables,
      config,
    }: {
      serviceId: string;
      tables: ServiceTable[];
      config: ComponentConfig;
    }) => saveServiceConfiguration(serviceId, tables, config),
    onSuccess: (_, variables) => {
      // Invalidate the service to refetch with new configuration
      queryClient.invalidateQueries({ queryKey: ["services", variables.serviceId] });
    },
  });
}
