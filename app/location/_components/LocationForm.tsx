"use client";

import { useState } from "react";

type LocationKind = "PLANT" | "AREA" | "LINE" | "SECTION";

interface LocationFormProps {
  type: "plant" | "child";
  parentCode?: string;
  parentKind?: LocationKind;
  childKind?: LocationKind;
  onSubmit: (data: { code: string; name: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const kindLabels: Record<LocationKind, string> = {
  PLANT: "Plant",
  AREA: "Area",
  LINE: "Line",
  SECTION: "Section",
};

export default function LocationForm({
  type,
  parentCode,
  childKind,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: LocationFormProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    try {
      await onSubmit({ code: code.toUpperCase(), name });
      // Reset form on success
      setCode("");
      setName("");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Operation failed");
    }
  };

  const isPlantForm = type === "plant";
  const formTitle = isPlantForm ? "New Plant" : `Add ${childKind ? kindLabels[childKind] : "Location"}`;

  return (
    <div className="border border-gray-200 rounded-lg p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">
          {formTitle}
        </h3>
        {!isPlantForm && parentCode && (
          <p className="text-xs text-gray-500 mt-1">
            Parent:{" "}
            <span className="font-mono font-semibold text-gray-900">
              {parentCode}
            </span>
          </p>
        )}
      </div>

      {localError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {localError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className={isPlantForm ? "grid grid-cols-3 gap-4" : "flex gap-2"}>
          <div className={isPlantForm ? "" : "w-32"}>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Code
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={isPlantForm ? "e.g. SP01" : "Code"}
              required
              autoFocus
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          <div className={isPlantForm ? "col-span-2" : "flex-1 min-w-[200px]"}>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isPlantForm ? "e.g. São Paulo Plant" : "Name"}
              required
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 font-medium transition-colors"
          >
            {isSubmitting
              ? isPlantForm
                ? "Creating..."
                : "Adding..."
              : isPlantForm
                ? "Create Plant"
                : "Add"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
