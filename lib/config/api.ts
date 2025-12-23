/**
 * API Configuration
 *
 * Centralized configuration for API integration with ServiceNow.
 * Controls whether to use mock data or real API calls.
 */

export const apiConfig = {
  // Toggle between mock data and real API
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true',

  // ServiceNow instance configuration
  serviceNowInstance: process.env.NEXT_PUBLIC_SERVICENOW_INSTANCE || '',
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',

  // API settings
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000'),
  retryAttempts: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3'),

  // Feature flags
  enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  enableRealTimeSync: process.env.NEXT_PUBLIC_ENABLE_REAL_TIME_SYNC === 'true',

  // API endpoints
  endpoints: {
    services: '/now/table/cmdb_ci_service',
    tables: '/now/table/sys_db_object',
    fields: '/now/table/sys_dictionary',
    configurations: '/now/table/x_bloom_config',
    domains: '/now/table/x_bloom_domain',
    tenants: '/now/table/x_bloom_tenant',
  },
} as const;

/**
 * Check if the app is configured to use real API
 */
export const isUsingRealAPI = () => !apiConfig.useMockData;

/**
 * Get the full API endpoint URL
 */
export const getApiEndpoint = (endpoint: string) => {
  return `${apiConfig.baseUrl}${endpoint}`;
};
