import { Service, ServiceTable, ComponentConfig } from '@/lib/types/service';
import { serviceNowClient } from './servicenow-client';
import { apiConfig, getApiEndpoint } from '@/lib/config/api';
import { mockServices } from '@/data/mock/services';

/**
 * Service API
 *
 * Handles all service-related API calls to ServiceNow.
 * Automatically switches between mock data and real API based on configuration.
 */

/**
 * ServiceNow API Response structure
 */
interface ServiceNowResponse<T> {
  result: T;
}

/**
 * Transform ServiceNow service data to our Service type
 */
const transformServiceNowService = (snService: any): Service => {
  return {
    id: snService.sys_id,
    name: snService.name,
    description: snService.short_description || snService.description,
    category: snService.category || 'General',
    status: snService.operational_status === '1' ? 'active' : 'inactive',
    lastModified: new Date(snService.sys_updated_on),
    tenantId: snService.company?.value || '',
    icon: snService.icon || 'shield',
    tables: [], // Would be loaded separately
    components: [], // Would be loaded separately
  };
};

/**
 * Get all services
 */
export const getServices = async (): Promise<Service[]> => {
  if (apiConfig.useMockData) {
    // Return mock data
    return Promise.resolve(mockServices);
  }

  try {
    // Make real API call to ServiceNow
    const endpoint = getApiEndpoint(apiConfig.endpoints.services);
    const response = await serviceNowClient.get<ServiceNowResponse<any[]>>(endpoint, {
      params: {
        sysparm_limit: 100,
        sysparm_query: 'active=true^ORDERBYname',
      },
    });

    return response.result.map(transformServiceNowService);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    throw error;
  }
};

/**
 * Get a single service by ID
 */
export const getServiceById = async (serviceId: string): Promise<Service | null> => {
  if (apiConfig.useMockData) {
    const service = mockServices.find(s => s.id === serviceId);
    return Promise.resolve(service || null);
  }

  try {
    const endpoint = getApiEndpoint(`${apiConfig.endpoints.services}/${serviceId}`);
    const response = await serviceNowClient.get<ServiceNowResponse<any>>(endpoint);

    return transformServiceNowService(response.result);
  } catch (error) {
    console.error(`Failed to fetch service ${serviceId}:`, error);
    return null;
  }
};

/**
 * Create a new service
 */
export const createService = async (serviceData: Partial<Service>): Promise<Service> => {
  if (apiConfig.useMockData) {
    // Simulate creation
    const newService: Service = {
      id: `svc-${Date.now()}`,
      name: serviceData.name || '',
      description: serviceData.description || '',
      category: serviceData.category || 'General',
      status: 'inactive',
      lastModified: new Date(),
      tenantId: serviceData.tenantId || '',
    };
    return Promise.resolve(newService);
  }

  try {
    const endpoint = getApiEndpoint(apiConfig.endpoints.services);
    const response = await serviceNowClient.post<ServiceNowResponse<any>>(endpoint, {
      name: serviceData.name,
      short_description: serviceData.description,
      category: serviceData.category,
      company: serviceData.tenantId,
    });

    return transformServiceNowService(response.result);
  } catch (error) {
    console.error('Failed to create service:', error);
    throw error;
  }
};

/**
 * Update a service
 */
export const updateService = async (
  serviceId: string,
  updates: Partial<Service>
): Promise<Service> => {
  if (apiConfig.useMockData) {
    const service = mockServices.find(s => s.id === serviceId);
    if (!service) throw new Error('Service not found');

    return Promise.resolve({ ...service, ...updates });
  }

  try {
    const endpoint = getApiEndpoint(`${apiConfig.endpoints.services}/${serviceId}`);
    const response = await serviceNowClient.patch<ServiceNowResponse<any>>(endpoint, {
      name: updates.name,
      short_description: updates.description,
      category: updates.category,
      operational_status: updates.status === 'active' ? '1' : '2',
    });

    return transformServiceNowService(response.result);
  } catch (error) {
    console.error('Failed to update service:', error);
    throw error;
  }
};

/**
 * Delete a service
 */
export const deleteService = async (serviceId: string): Promise<void> => {
  if (apiConfig.useMockData) {
    return Promise.resolve();
  }

  try {
    const endpoint = getApiEndpoint(`${apiConfig.endpoints.services}/${serviceId}`);
    await serviceNowClient.delete(endpoint);
  } catch (error) {
    console.error('Failed to delete service:', error);
    throw error;
  }
};

/**
 * Get tables for a service
 */
export const getServiceTables = async (serviceId: string): Promise<ServiceTable[]> => {
  if (apiConfig.useMockData) {
    const service = mockServices.find(s => s.id === serviceId);
    return Promise.resolve(service?.tables || []);
  }

  try {
    // Implementation would fetch from ServiceNow configuration tables
    const endpoint = getApiEndpoint(apiConfig.endpoints.configurations);
    const response = await serviceNowClient.get<ServiceNowResponse<any[]>>(endpoint, {
      params: {
        sysparm_query: `service=${serviceId}`,
      },
    });

    // Transform and return tables
    return [];
  } catch (error) {
    console.error('Failed to fetch service tables:', error);
    return [];
  }
};

/**
 * Save service configuration
 */
export const saveServiceConfiguration = async (
  serviceId: string,
  tables: ServiceTable[],
  config: ComponentConfig
): Promise<void> => {
  if (apiConfig.useMockData) {
    console.log('Mock: Saving configuration for service', serviceId);
    return Promise.resolve();
  }

  try {
    const endpoint = getApiEndpoint(apiConfig.endpoints.configurations);
    await serviceNowClient.post(endpoint, {
      service: serviceId,
      tables: JSON.stringify(tables),
      config: JSON.stringify(config),
    });
  } catch (error) {
    console.error('Failed to save configuration:', error);
    throw error;
  }
};
