import { NextRequest, NextResponse } from "next/server";
import { resolveBackend } from "@/utils/api-route-guard";

export async function GET(request: NextRequest) {
  const resolved = resolveBackend(request);
  if (resolved instanceof NextResponse) return resolved;

  try {
    const response = await fetch(
      `${resolved.address}/v1/api/organization/locations/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: resolved.authToken,
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

  try {
    const body = await request.json();

    const response = await fetch(
      `${resolved.address}/v1/api/organization/locations/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: resolved.authToken,
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
