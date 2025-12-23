import { Domain, Tenant } from '@/lib/types/domain';
import { serviceNowClient } from './servicenow-client';
import { apiConfig, getApiEndpoint } from '@/lib/config/api';
import { mockDomains, mockTenants } from '@/data/mock/domains';

/**
 * Domain API
 *
 * Handles all domain and tenant-related API calls to ServiceNow.
 */

interface ServiceNowResponse<T> {
  result: T;
}

interface ServiceNowTenant {
  sys_id: string;
  name: string;
  domain_url: string;
  services: string;
  settings: string;
  active_users: string;
  last_activity: string;
}

/**
 * Transform ServiceNow tenant data to our Tenant type
 */
const transformServiceNowTenant = (snTenant: ServiceNowTenant): Tenant => {
  return {
    id: snTenant.sys_id,
    name: snTenant.name,
    domain: snTenant.domain_url,
    services: JSON.parse(snTenant.services || '[]'),
    settings: JSON.parse(snTenant.settings || '{}'),
    activeUsers: parseInt(snTenant.active_users || '0'),
    lastActivity: new Date(snTenant.last_activity),
  };
};

/**
 * Get all tenants
 */
export const getTenants = async (): Promise<Tenant[]> => {
  if (apiConfig.useMockData) {
    return Promise.resolve(mockTenants);
  }

  try {
    const endpoint = getApiEndpoint(apiConfig.endpoints.tenants);
    const response = await serviceNowClient.get<ServiceNowResponse<ServiceNowTenant[]>>(endpoint, {
      params: {
        sysparm_limit: 100,
        sysparm_query: 'active=true^ORDERBYname',
      },
    });

    return response.result.map(transformServiceNowTenant);
  } catch (error) {
    console.error('Failed to fetch tenants:', error);
    throw error;
  }
};

/**
 * Get a single tenant by ID
 */
export const getTenantById = async (tenantId: string): Promise<Tenant | null> => {
  if (apiConfig.useMockData) {
    const tenant = mockTenants.find(t => t.id === tenantId);
    return Promise.resolve(tenant || null);
  }

  try {
    const endpoint = getApiEndpoint(`${apiConfig.endpoints.tenants}/${tenantId}`);
    const response = await serviceNowClient.get<ServiceNowResponse<any>>(endpoint);

    return transformServiceNowTenant(response.result);
  } catch (error) {
    console.error(`Failed to fetch tenant ${tenantId}:`, error);
    return null;
  }
};

/**
 * Get all domains
 */
export const getDomains = async (): Promise<Domain[]> => {
  if (apiConfig.useMockData) {
    return Promise.resolve(mockDomains);
  }

  try {
    const endpoint = getApiEndpoint(apiConfig.endpoints.domains);
    const response = await serviceNowClient.get<ServiceNowResponse<any[]>>(endpoint);

    // Transform domains and attach tenants
    const domains = await Promise.all(
      response.result.map(async (snDomain: any) => {
        const tenants = await getTenants();
        return {
          id: snDomain.sys_id,
          name: snDomain.name,
          description: snDomain.description,
          tenants,
          createdAt: new Date(snDomain.sys_created_on),
          updatedAt: new Date(snDomain.sys_updated_on),
        };
      })
    );

    return domains;
  } catch (error) {
    console.error('Failed to fetch domains:', error);
    throw error;
  }
};

/**
 * Grant service access to a tenant
 */
export const grantServiceAccess = async (
  tenantId: string,
  serviceId: string
): Promise<void> => {
  if (apiConfig.useMockData) {
    console.log(`Mock: Granting service ${serviceId} to tenant ${tenantId}`);
    return Promise.resolve();
  }

  try {
    const tenant = await getTenantById(tenantId);
    if (!tenant) throw new Error('Tenant not found');

    const updatedServices = [...tenant.services, serviceId];

    const endpoint = getApiEndpoint(`${apiConfig.endpoints.tenants}/${tenantId}`);
    await serviceNowClient.patch(endpoint, {
      services: JSON.stringify(updatedServices),
    });
  } catch (error) {
    console.error('Failed to grant service access:', error);
    throw error;
  }
};

/**
 * Revoke service access from a tenant
 */
export const revokeServiceAccess = async (
  tenantId: string,
  serviceId: string
): Promise<void> => {
  if (apiConfig.useMockData) {
    console.log(`Mock: Revoking service ${serviceId} from tenant ${tenantId}`);
    return Promise.resolve();
  }

  try {
    const tenant = await getTenantById(tenantId);
    if (!tenant) throw new Error('Tenant not found');

    const updatedServices = tenant.services.filter(id => id !== serviceId);

    const endpoint = getApiEndpoint(`${apiConfig.endpoints.tenants}/${tenantId}`);
    await serviceNowClient.patch(endpoint, {
      services: JSON.stringify(updatedServices),
    });
  } catch (error) {
    console.error('Failed to revoke service access:', error);
    throw error;
  }
};

/**
 * Create a new tenant
 */
export const createTenant = async (tenantData: Partial<Tenant>): Promise<Tenant> => {
  if (apiConfig.useMockData) {
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      name: tenantData.name || '',
      domain: tenantData.domain || '',
      services: tenantData.services || [],
      settings: tenantData.settings || { features: [] },
      activeUsers: 0,
      lastActivity: new Date(),
    };
    return Promise.resolve(newTenant);
  }

  try {
    const endpoint = getApiEndpoint(apiConfig.endpoints.tenants);
    const response = await serviceNowClient.post<ServiceNowResponse<any>>(endpoint, {
      name: tenantData.name,
      domain_url: tenantData.domain,
      services: JSON.stringify(tenantData.services || []),
      settings: JSON.stringify(tenantData.settings || {}),
    });

    return transformServiceNowTenant(response.result);
  } catch (error) {
    console.error('Failed to create tenant:', error);
    throw error;
  }
};

/**
 * Update tenant settings
 */
export const updateTenantSettings = async (
  tenantId: string,
  settings: Tenant['settings']
): Promise<void> => {
  if (apiConfig.useMockData) {
    console.log(`Mock: Updating settings for tenant ${tenantId}`);
    return Promise.resolve();
  }

  try {
    const endpoint = getApiEndpoint(`${apiConfig.endpoints.tenants}/${tenantId}`);
    await serviceNowClient.patch(endpoint, {
      settings: JSON.stringify(settings),
    });
  } catch (error) {
    console.error('Failed to update tenant settings:', error);
    throw error;
  }
};
