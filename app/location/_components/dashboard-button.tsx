import { Nullable } from "@/utils/types";

interface DashboardButtonProps {
  selectedCode: Nullable<string>;
}

export default function DashboardButton(props: DashboardButtonProps) {
  const { selectedCode } = props;

  return (
    <button
      disabled={!selectedCode}
      onClick={() => {
        if (selectedCode) {
          window.location.href = `/dashboard?location=${selectedCode}`;
        }
      }}
      className="w-full py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {selectedCode ? "Continue to Dashboard" : "Select a location to continue"}
    </button>
  );
}
