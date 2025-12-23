import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { apiConfig } from '@/lib/config/api';

/**
 * ServiceNow API Client
 *
 * Configured axios instance for making requests to ServiceNow REST API.
 * Includes authentication, error handling, and retry logic.
 */

class ServiceNowClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: apiConfig.baseUrl,
      timeout: apiConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors() {
    // Request interceptor - add authentication
    this.client.interceptors.request.use(
      async (config) => {
        // Add auth token if available
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        } else {
          // Use Basic Auth if no token (for initial requests)
          const credentials = this.getBasicAuthCredentials();
          if (credentials) {
            config.headers.Authorization = `Basic ${credentials}`;
          }
        }

        // Add common ServiceNow query parameters
        if (!config.params) {
          config.params = {};
        }

        // Request JSON response format
        config.params.sysparm_display_value = 'true';
        config.params.sysparm_exclude_reference_link = 'true';

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        // Handle authentication errors
        if (error.response?.status === 401) {
          // Try to refresh token or redirect to login
          await this.handleAuthError();
          return Promise.reject(error);
        }

        // Handle rate limiting
        if (error.response?.status === 429) {
          console.warn('Rate limit exceeded. Retrying after delay...');
          await this.delay(2000);
          return this.client.request(error.config!);
        }

        // Log error for debugging
        this.logError(error);

        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Get Basic Auth credentials (Base64 encoded)
   */
  private getBasicAuthCredentials(): string | null {
    // Note: In production, credentials should come from secure server-side storage
    // This is for demonstration purposes only
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sn_auth');
      if (stored) return stored;
    }
    return null;
  }

  /**
   * Handle authentication errors
   */
  private async handleAuthError() {
    this.authToken = null;
    if (typeof window !== 'undefined') {
      // Redirect to login or show auth modal
      console.error('Authentication failed. Please log in again.');
      // window.location.href = '/login';
    }
  }

  /**
   * Log API errors
   */
  private logError(error: AxiosError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  }

  /**
   * Format error for consistent error handling
   */
  private formatError(error: AxiosError): Error {
    const message = error.response?.data
      ? (error.response.data as any).error?.message || 'API request failed'
      : error.message;

    const formattedError = new Error(message);
    (formattedError as any).status = error.response?.status;
    (formattedError as any).code = (error.response?.data as any)?.error?.code;

    return formattedError;
  }

  /**
   * Delay helper for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string) {
    this.authToken = token;
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(endpoint, config);
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.post<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.put<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig) {
    const response = await this.client.patch<T>(endpoint, data, config);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(endpoint, config);
    return response.data;
  }
}

// Export singleton instance
export const serviceNowClient = new ServiceNowClient();
