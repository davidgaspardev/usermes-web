import { NextRequest, NextResponse } from 'next/server';
import { getBackendAddress, isValidConfigToken } from '@/utils/config-map';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const configToken = request.headers.get('x-config');
    const authToken = request.headers.get('authorization');

    if (!configToken || !authToken) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    if (!isValidConfigToken(configToken)) {
      return NextResponse.json(
        { error: 'Invalid configuration' },
        { status: 401 }
      );
    }

    const backendAddress = getBackendAddress(configToken);
    if (!backendAddress) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    const response = await fetch(`${backendAddress}/api/resources/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Resource GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const configToken = request.headers.get('x-config');
    const authToken = request.headers.get('authorization');

    if (!configToken || !authToken) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    if (!isValidConfigToken(configToken)) {
      return NextResponse.json(
        { error: 'Invalid configuration' },
        { status: 401 }
      );
    }

    const backendAddress = getBackendAddress(configToken);
    if (!backendAddress) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    const response = await fetch(`${backendAddress}/api/resources/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Resource PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const configToken = request.headers.get('x-config');
    const authToken = request.headers.get('authorization');

    if (!configToken || !authToken) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    if (!isValidConfigToken(configToken)) {
      return NextResponse.json(
        { error: 'Invalid configuration' },
        { status: 401 }
      );
    }

    const backendAddress = getBackendAddress(configToken);
    if (!backendAddress) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }

    const response = await fetch(`${backendAddress}/api/resources/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Resource DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
