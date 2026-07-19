import { NextRequest, NextResponse } from "next/server";
import { resolveBackend } from "@/utils/api-route-guard";

export async function POST(request: NextRequest) {
  const resolved = resolveBackend(request);
  if (resolved instanceof NextResponse) return resolved;

  try {
    const body = await request.json();

    const response = await fetch(
      `${resolved.address}/v1/api/organization/locations/add`,
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
        { success: false, error: data.message || "Failed to add location" },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("Add location error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
