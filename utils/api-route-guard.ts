import { NextRequest, NextResponse } from "next/server";
import { getBackendAddress, isValidConfigToken } from "@/utils/config-map";

interface ResolvedBackend {
  address: string;
  authToken: string;
}

/**
 * Validates the x-config and Authorization headers on an incoming API route
 * request and resolves the backend address for the config token. Returns a
 * NextResponse error to short-circuit the caller, or the resolved backend
 * info on success.
 */
export function resolveBackend(
  request: NextRequest,
): ResolvedBackend | NextResponse {
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

  const authToken = request.headers.get("authorization");
  if (!authToken) {
    return NextResponse.json(
      { success: false, error: "Authorization token is required" },
      { status: 401 },
    );
  }

  return { address: backendAddress, authToken };
}
