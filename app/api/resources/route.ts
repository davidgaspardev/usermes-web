import { NextRequest, NextResponse } from 'next/server';
import { getBackendAddress, isValidConfigToken } from '@/utils/config-map';

export async function GET(request: NextRequest) {
  try {
    // Get x-config from headers
    const configToken = request.headers.get('x-config');
    const authToken = request.headers.get('authorization');

    if (!configToken) {
      return NextResponse.json(
        { error: 'Configuration token is required' },
        { status: 400 }
      );
    }

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authorization token is required' },
        { status: 401 }
      );
    }

    // Validate config token
    if (!isValidConfigToken(configToken)) {
      return NextResponse.json(
        { error: 'Invalid configuration' },
        { status: 401 }
      );
    }

    // Get backend address
    const backendAddress = getBackendAddress(configToken);
    if (!backendAddress) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    // Get query params for pagination
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';

    // Forward request to backend
    const response = await fetch(`${backendAddress}/api/resources?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Resources GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get headers
    const configToken = request.headers.get('x-config');
    const authToken = request.headers.get('authorization');

    if (!configToken || !authToken) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    // Validate config token
    if (!isValidConfigToken(configToken)) {
      return NextResponse.json(
        { error: 'Invalid configuration' },
        { status: 401 }
      );
    }

    // Get backend address
    const backendAddress = getBackendAddress(configToken);
    if (!backendAddress) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    // Get request body
    const body = await request.json();

    // Forward request to backend
    const response = await fetch(`${backendAddress}/api/resources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Resources POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
