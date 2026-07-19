import { NextRequest, NextResponse } from "next/server";
import { resolveBackend } from "@/utils/api-route-guard";

export async function GET(request: NextRequest) {
  const resolved = resolveBackend(request);
  if (resolved instanceof NextResponse) return resolved;

  try {
    const response = await fetch(`${resolved.address}/api/organization`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: resolved.authToken,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.message || "Failed to fetch organization",
        },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("Location GET error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
