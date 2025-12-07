/**
 * API Client utility
 * Automatically includes x-config header from localStorage in all requests
 */

const CONFIG_STORAGE_KEY = 'usermes_config_token';
const AUTH_STORAGE_KEY = 'authToken';

/**
 * Saves config token to localStorage
 */
export function saveConfigToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONFIG_STORAGE_KEY, token);
  }
}

/**
 * Gets config token from localStorage
 */
export function getConfigToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(CONFIG_STORAGE_KEY);
  }
  return null;
}

/**
 * Removes config token from localStorage
 */
export function clearConfigToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
  }
}

/**
 * Saves auth token to localStorage
 */
export function saveAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, token);
  }
}

/**
 * Gets auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_STORAGE_KEY);
  }
  return null;
}

/**
 * Removes auth token from localStorage
 */
export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

/**
 * API client that automatically includes x-config and Authorization headers
 */
export async function apiClient(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const configToken = getConfigToken();
  const authToken = getAuthToken();

  if (!configToken) {
    throw new Error('Configuration token not found. Please access via config URL.');
  }

  const headers = new Headers(options.headers);
  headers.set('x-config', configToken);
  
  // Add Authorization header if auth token exists
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }
  
  // Ensure Content-Type is set for JSON requests
  if (options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Typed API client for JSON requests/responses
 */
export async function apiClientJson<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await apiClient(url, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `Request failed with status ${response.status}`);
  }
  
  return response.json();
}
