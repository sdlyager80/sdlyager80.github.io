# ServiceNow API Integration Guide

## Overview

This application is designed to work with both **mock data** (for development/demo) and **real ServiceNow API** (for production). The integration layer automatically switches between the two based on environment configuration.

## Quick Start

### Using Mock Data (Default)

The application is pre-configured to use mock data. No additional setup required!

```bash
npm run dev
```

### Switching to Real ServiceNow API

1. **Configure Environment Variables**

   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. **Update `.env.local`**

   ```env
   # Switch to real API
   NEXT_PUBLIC_USE_MOCK_DATA=false

   # Your ServiceNow instance
   NEXT_PUBLIC_SERVICENOW_INSTANCE=your-instance.service-now.com
   NEXT_PUBLIC_API_BASE_URL=https://your-instance.service-now.com/api

   # Authentication credentials
   SERVICENOW_USERNAME=your_api_user
   SERVICENOW_PASSWORD=your_password
   SERVICENOW_CLIENT_ID=your_client_id
   SERVICENOW_CLIENT_SECRET=your_client_secret
   ```

3. **Restart the Development Server**

   ```bash
   npm run dev
   ```

## Architecture

### Directory Structure

```
lib/
├── api/
│   ├── servicenow-client.ts    # Axios client with auth & error handling
│   ├── services.ts              # Service-related API functions
│   └── domains.ts               # Domain/tenant API functions
├── config/
│   └── api.ts                   # API configuration & endpoints
└── hooks/
    ├── use-services.ts          # React Query hooks for services
    └── use-domains.ts           # React Query hooks for domains
```

### Data Flow

```
Component
    ↓
React Query Hook (use-services.ts)
    ↓
API Service Layer (services.ts)
    ↓
    ├─→ Mock Data (if NEXT_PUBLIC_USE_MOCK_DATA=true)
    └─→ ServiceNow Client → Real API (if NEXT_PUBLIC_USE_MOCK_DATA=false)
```

## ServiceNow Table Structure

The application expects the following custom tables in ServiceNow:

### 1. Services Table (`cmdb_ci_service`)
Standard ServiceNow CMDB Service table with additional fields:

| Field | Type | Description |
|-------|------|-------------|
| sys_id | String | Unique identifier |
| name | String | Service name |
| short_description | String | Service description |
| category | String | Service category |
| operational_status | Choice | Service status (1=Active, 2=Inactive) |
| company | Reference | Tenant reference |
| sys_updated_on | Date/Time | Last modified timestamp |

### 2. Configurations Table (`x_bloom_config`)
Custom table for storing service configurations:

| Field | Type | Description |
|-------|------|-------------|
| sys_id | String | Unique identifier |
| service | Reference | Reference to service |
| tables | JSON | Configured tables and fields |
| config | JSON | Component configuration (theme, layout, etc.) |
| sys_created_on | Date/Time | Creation timestamp |

### 3. Tenants Table (`x_bloom_tenant`)
Custom table for multi-tenant management:

| Field | Type | Description |
|-------|------|-------------|
| sys_id | String | Unique identifier |
| name | String | Tenant name |
| domain_url | String | Tenant domain |
| services | JSON | Array of service IDs |
| settings | JSON | Tenant settings (features, theme, etc.) |
| active_users | Integer | Number of active users |
| last_activity | Date/Time | Last activity timestamp |

### 4. Domains Table (`x_bloom_domain`)
Custom table for domain grouping:

| Field | Type | Description |
|-------|------|-------------|
| sys_id | String | Unique identifier |
| name | String | Domain name |
| description | String | Domain description |
| sys_created_on | Date/Time | Creation timestamp |
| sys_updated_on | Date/Time | Last modified timestamp |

## API Endpoints

### Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/now/table/cmdb_ci_service` | Get all services |
| GET | `/api/now/table/cmdb_ci_service/{id}` | Get service by ID |
| POST | `/api/now/table/cmdb_ci_service` | Create new service |
| PATCH | `/api/now/table/cmdb_ci_service/{id}` | Update service |
| DELETE | `/api/now/table/cmdb_ci_service/{id}` | Delete service |

### Configurations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/now/table/x_bloom_config?sysparm_query=service={serviceId}` | Get service configuration |
| POST | `/api/now/table/x_bloom_config` | Save configuration |

### Tenants

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/now/table/x_bloom_tenant` | Get all tenants |
| GET | `/api/now/table/x_bloom_tenant/{id}` | Get tenant by ID |
| POST | `/api/now/table/x_bloom_tenant` | Create tenant |
| PATCH | `/api/now/table/x_bloom_tenant/{id}` | Update tenant |

## Authentication

### OAuth 2.0 (Recommended for Production)

1. **Create OAuth Application in ServiceNow**
   - Navigate to System OAuth → Application Registry
   - Create new OAuth API endpoint
   - Note Client ID and Client Secret

2. **Configure Environment**
   ```env
   SERVICENOW_CLIENT_ID=your_client_id
   SERVICENOW_CLIENT_SECRET=your_client_secret
   ```

3. **Obtain Access Token**
   The client automatically handles token acquisition and refresh.

### Basic Authentication (Development Only)

```env
SERVICENOW_USERNAME=your_username
SERVICENOW_PASSWORD=your_password
```

**⚠️ Warning**: Basic auth should only be used in development. Use OAuth for production.

## Usage Examples

### Fetching Services

```typescript
import { useServices } from '@/lib/hooks/use-services';

function ServicesPage() {
  const { data: services, isLoading, error } = useServices();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {services?.map(service => (
        <div key={service.id}>{service.name}</div>
      ))}
    </div>
  );
}
```

### Creating a Service

```typescript
import { useCreateService } from '@/lib/hooks/use-services';

function CreateServiceForm() {
  const createService = useCreateService();

  const handleSubmit = (data) => {
    createService.mutate({
      name: data.name,
      description: data.description,
      category: data.category,
      tenantId: data.tenantId,
    });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Granting Service Access (Admin)

```typescript
import { useGrantServiceAccess } from '@/lib/hooks/use-domains';

function ServiceCatalog() {
  const grantAccess = useGrantServiceAccess();

  const handleGrantAccess = (serviceId: string) => {
    grantAccess.mutate({
      tenantId: 'tenant-123',
      serviceId: serviceId,
    });
  };

  return <button onClick={() => handleGrantAccess('svc-001')}>Grant Access</button>;
}
```

## Error Handling

The API client includes comprehensive error handling:

```typescript
// Automatic retry for failed requests
// Rate limiting handling (429 errors)
// Authentication error handling (401 errors)
// Network error handling

// Errors are formatted consistently:
{
  message: "Error description",
  status: 404,
  code: "SERVICE_NOT_FOUND"
}
```

## Testing API Integration

### 1. Test with Mock Data First

```env
NEXT_PUBLIC_USE_MOCK_DATA=true
```

Verify all features work correctly with mock data.

### 2. Test ServiceNow Connection

Create a test script:

```typescript
import { serviceNowClient } from '@/lib/api/servicenow-client';

async function testConnection() {
  try {
    const response = await serviceNowClient.get('/now/table/cmdb_ci_service', {
      params: { sysparm_limit: 1 }
    });
    console.log('✅ Connection successful:', response);
  } catch (error) {
    console.error('❌ Connection failed:', error);
  }
}
```

### 3. Gradual Migration

1. Start with read-only operations (GET requests)
2. Test data transformation
3. Enable write operations (POST, PATCH, DELETE)
4. Monitor and adjust

## Performance Optimization

### Caching Strategy

React Query automatically caches API responses:

```typescript
// Services cached for 5 minutes
useServices() // staleTime: 5 * 60 * 1000

// Domains cached for 10 minutes
useDomains() // staleTime: 10 * 60 * 1000
```

### Request Batching

For bulk operations, use Promise.all:

```typescript
const serviceIds = ['svc-001', 'svc-002', 'svc-003'];
const services = await Promise.all(
  serviceIds.map(id => getServiceById(id))
);
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check credentials in `.env.local`
   - Verify OAuth token is valid
   - Check ServiceNow user permissions

2. **CORS Errors**
   - Configure CORS in ServiceNow
   - Use Next.js API routes as proxy (see `next.config.js`)

3. **Rate Limiting (429)**
   - Client automatically retries after delay
   - Consider implementing request queue

4. **Data Format Mismatches**
   - Check transformation functions in `services.ts` and `domains.ts`
   - Verify ServiceNow table structure matches expected format

## Production Checklist

- [ ] Move credentials to secure environment variables (not in `.env.local`)
- [ ] Enable OAuth authentication
- [ ] Configure proper CORS settings
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Enable API request logging
- [ ] Configure rate limiting
- [ ] Test all CRUD operations
- [ ] Verify data transformations
- [ ] Set appropriate cache TTLs
- [ ] Enable HTTPS only
- [ ] Review and minimize API permissions

## Support

For issues with ServiceNow integration, refer to:
- [ServiceNow REST API Documentation](https://docs.servicenow.com/bundle/tokyo-application-development/page/integrate/inbound-rest/concept/c_RESTAPI.html)
- [ServiceNow OAuth Setup](https://docs.servicenow.com/bundle/tokyo-platform-administration/page/administer/security/task/t_SettingUpOAuth.html)
