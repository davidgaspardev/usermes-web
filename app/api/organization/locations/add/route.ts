import { NextRequest, NextResponse } from 'next/server';
import { getBackendAddress, isValidConfigToken } from '@/utils/config-map';

export async function POST(request: NextRequest) {
  const configToken = request.headers.get('x-config');

  if (!configToken) {
    return NextResponse.json(
      { success: false, error: 'Configuration token is required' },
      { status: 400 }
    );
  }

  if (!isValidConfigToken(configToken)) {
    return NextResponse.json(
      { success: false, error: 'Invalid configuration' },
      { status: 401 }
    );
  }

  const backendAddress = getBackendAddress(configToken);
  if (!backendAddress) {
    return NextResponse.json(
      { success: false, error: 'Configuration not found' },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(`${backendAddress}/v1/api/organization/locations/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || 'Failed to add location' },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error('Add location error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
