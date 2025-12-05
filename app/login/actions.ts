'use server';

import { getBackendDomain, isValidConfigToken } from '@/utils/config-map';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
  message?: string;
}

/**
 * Server action to handle login
 * ⚠️ SERVER-SIDE ONLY - Never exposes backend domains to client
 * 
 * Flow:
 * 1. Client calls this action with credentials + configToken (from URL param)
 * 2. Server uses configToken to lookup backend domain in env map
 * 3. Server forwards login request to the correct backend
 * 4. Server sends x-config header to backend (backend can identify the tenant/company)
 * 5. Returns sanitized response to client
 * 
 * The configToken acts as a key: client sends it, server translates it to backend domain
 */
export async function loginAction(
  credentials: LoginCredentials,
  configToken: string
): Promise<LoginResponse> {
  try {
    // Validate inputs
    if (!credentials.username || !credentials.password) {
      return {
        success: false,
        error: 'Username and password are required',
      };
    }

    if (!configToken) {
      return {
        success: false,
        error: 'Configuration token is required',
      };
    }

    // Validate config token exists in server-side map
    if (!isValidConfigToken(configToken)) {
      console.warn(`Invalid config token attempted: ${configToken.substring(0, 10)}...`);
      return {
        success: false,
        error: 'Invalid configuration',
      };
    }

    // Get backend domain from server-side config map (never exposed to client)
    const backendDomain = getBackendDomain(configToken);

    if (!backendDomain) {
      return {
        success: false,
        error: 'Configuration not found',
      };
    }

    // Call backend login endpoint
    // x-config header allows backend to identify tenant/company from the token
    const response = await fetch(`${backendDomain}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-config': configToken, // Backend can use this to identify tenant/company
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || 'Login failed',
      };
    }

    const data = await response.json();

    return {
      success: true,
      token: data.token,
      message: data.message || 'Login successful',
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
