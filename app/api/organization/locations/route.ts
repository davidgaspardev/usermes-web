import { NextRequest, NextResponse } from "next/server";
import { getBackendAddress, isValidConfigToken } from "@/utils/config-map";

function resolveBackend(
  request: NextRequest,
): { address: string } | NextResponse {
  const configToken = request.headers.get("x-config");

  if (!configToken) {
    return NextResponse.json(
      { success: false, error: "Configuration token is required" },
      { status: 400 },
    );
  }

  if (!isValidConfigToken(configToken)) {
    return NextResponse.json(
      { success: false, error: "Invalid configuration" },
      { status: 401 },
    );
  }

  const backendAddress = getBackendAddress(configToken);
  if (!backendAddress) {
    return NextResponse.json(
      { success: false, error: "Configuration not found" },
      { status: 404 },
    );
  }

  return { address: backendAddress };
}

export async function GET(request: NextRequest) {
  const resolved = resolveBackend(request);
  if (resolved instanceof NextResponse) return resolved;

  const authToken = request.headers.get("authorization");
  if (!authToken) {
    return NextResponse.json(
      { success: false, error: "Authorization token is required" },
      { status: 401 },
    );
  }

  try {
    const response = await fetch(
      `${resolved.address}/v1/api/organization/locations/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || "Failed to fetch locations" },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("Locations GET error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const resolved = resolveBackend(request);
  if (resolved instanceof NextResponse) return resolved;

  const authToken = request.headers.get("authorization");
  if (!authToken) {
    return NextResponse.json(
      { success: false, error: "Authorization token is required" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${resolved.address}/v1/api/organization/locations/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: data.message || "Failed to create location" },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("Locations POST error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
