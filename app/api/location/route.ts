import { NextRequest, NextResponse } from 'next/server';
import { getBackendAddress, isValidConfigToken } from '@/utils/config-map';

export async function GET(request: NextRequest) {
    try {
        const authToken = request.headers.get('authorization');
        const configToken = request.headers.get('x-config');

        if (!configToken) {
            return NextResponse.json(
                { sucess: false, error: 'Configuration token is required'},
                { status: 400}
            );
        }

        if (!authToken) {
            return NextResponse.json(
                { error: 'Authorization token is required' },
                { status: 401 }
            );
        }

        if (!isValidConfigToken(configToken)) {
            console.warn(`Invalid config token attempted: ${configToken.substring(0, 10)}...`);
            return NextResponse.json(
                { sucess: false, error: 'Invalid configuration' },
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

        const response = await fetch(`${backendAddress}/api/organization`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authToken,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return NextResponse.json(
                { sucess: false, error: errorData.error },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch(err) {
        console.error('Location GET error:', err);
        return NextResponse.json(
            { sucess: false, error: 'An unexpected error occurred' },
            { status: 500 }
        )
    }
}