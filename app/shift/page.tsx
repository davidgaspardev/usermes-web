"use client";

import { useEffect } from "react";
import { getAuthToken } from "@/utils/api-client";

export default function ShiftPage() {
  useEffect(() => {
    const authToken = getAuthToken();
    if (!authToken) {
      window.location.href = "/login";
      return;
    }
  }, []);

  return (
    <div>
      <h1>Shift Page</h1>

      <div className="overflow-x-auto min-h-9">
        <div>
        </div>
      </div>
    </div>
  );
}
