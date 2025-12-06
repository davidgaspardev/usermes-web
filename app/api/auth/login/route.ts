import { NextRequest, NextResponse } from 'next/server';
import { getBackendAddress, isValidConfigToken } from '@/utils/config-map';

export async function POST(request: NextRequest) {
  try {
    // Get x-config from headers
    const configToken = request.headers.get('x-config');

    if (!configToken) {
      return NextResponse.json(
        { success: false, error: 'Configuration token is required' },
        { status: 400 }
      );
    }

    // Validate config token exists in server-side map
    if (!isValidConfigToken(configToken)) {
      console.warn(`Invalid config token attempted: ${configToken.substring(0, 10)}...`);
      return NextResponse.json(
        { success: false, error: 'Invalid configuration' },
        { status: 401 }
      );
    }

    // Get backend address from server-side map (never exposed to client)
    const backendAddress = getBackendAddress(configToken);

    if (!backendAddress) {
      return NextResponse.json(
        { success: false, error: 'Configuration not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Call backend login endpoint
    // x-config header allows backend to identify tenant/company from the token
    const response = await fetch(`${backendAddress}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-config': configToken, // Pass x-config to backend
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errorData.message || 'Login failed' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      token: data.token,
      message: data.message || 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
