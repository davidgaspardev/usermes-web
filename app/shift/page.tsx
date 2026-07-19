import { useEffect } from "react";

export default function ShiftPage() {
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
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
