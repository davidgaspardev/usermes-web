"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiClient } from "@/utils/api-client";

type LocationKind = "PLANT" | "AREA" | "LINE" | "SECTION";

interface LocationNode {
  code: string;
  name: string;
  kind: LocationKind;
  children: LocationNode[];
}

const childKindOf: Record<LocationKind, LocationKind | null> = {
  PLANT: "AREA",
  AREA: "LINE",
  LINE: "SECTION",
  SECTION: null,
};

const kindLabel: Record<LocationKind, string> = {
  PLANT: "Plant",
  AREA: "Area",
  LINE: "Line",
  SECTION: "Section",
};

const kindIcon: Record<LocationKind, string> = {
  PLANT: "🏭",
  AREA: "🏗️",
  LINE: "⚙️",
  SECTION: "📍",
};

interface AddingChild {
  parentCode: string;
  rootCode: string;
  kind: LocationKind;
}

function insertNode(
  nodes: LocationNode[],
  parentCode: string,
  newNode: LocationNode,
): LocationNode[] {
  return nodes.map((node) => {
    if (node.code === parentCode) {
      return { ...node, children: [...node.children, newNode] };
    }
    return { ...node, children: insertNode(node.children, parentCode, newNode) };
  });
}

export default function OnboardingPage() {
  const [plants, setPlants] = useState<LocationNode[]>([]);
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  // Create-plant form state
  const [showCreatePlant, setShowCreatePlant] = useState(false);
  const [plantCode, setPlantCode] = useState("");
  const [plantName, setPlantName] = useState("");

  // Add-child form state
  const [addingChild, setAddingChild] = useState<AddingChild | null>(null);
  const [childCode, setChildCode] = useState("");
  const [childName, setChildName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // On mount: guard auth, then load existing locations
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      window.location.href = "/login";
      return;
    }

    apiClient("/api/organization/locations", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.locations?.length > 0) {
          setPlants(data.locations as LocationNode[]);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingInit(false));
  }, []);

  const handleCreatePlant = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiClient("/api/organization/locations", {
        method: "POST",
        body: JSON.stringify({ code: plantCode.toUpperCase(), name: plantName }),
      });
      const data = await response.json();

      if (data.success) {
        setPlants((prev) => [
          ...prev,
          { code: plantCode.toUpperCase(), name: plantName, kind: "PLANT", children: [] },
        ]);
        setPlantCode("");
        setPlantName("");
        setShowCreatePlant(false);
      } else {
        setError(data.error || "Failed to create plant");
      }
    } catch {
      setError("Failed to create plant. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingChild) return;
    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiClient("/api/organization/locations/add", {
        method: "POST",
        body: JSON.stringify({
          code: childCode.toUpperCase(),
          name: childName,
          kind: addingChild.kind,
          parent_code: addingChild.parentCode,
          root_code: addingChild.rootCode,
        }),
      });
      const data = await response.json();

      if (data.success) {
        const newNode: LocationNode = {
          code: childCode.toUpperCase(),
          name: childName,
          kind: addingChild.kind,
          children: [],
        };
        setPlants((prev) => insertNode(prev, addingChild.parentCode, newNode));
        setChildCode("");
        setChildName("");
        setAddingChild(null);
      } else {
        setError(data.error || "Failed to add location");
      }
    } catch {
      setError("Failed to add location. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  function startAddingChild(parentCode: string, rootCode: string, kind: LocationKind) {
    setAddingChild({ parentCode, rootCode, kind });
    setChildCode("");
    setChildName("");
    setError("");
  }

  function renderNode(node: LocationNode, rootCode: string, depth = 0) {
    const childKind = childKindOf[node.kind];
    const isAddingHere = addingChild?.parentCode === node.code;
    const isSelected = selectedCode === node.code;

    return (
      <div key={node.code}>
        <div
          className={`flex items-center gap-2 py-2 rounded-lg px-2 cursor-pointer transition-colors
            ${depth > 0 ? "ml-6 border-l-2 border-yellow-200 pl-4 rounded-l-none" : ""}
            ${isSelected ? "bg-yellow-100 border border-yellow-400" : "hover:bg-gray-50"}`}
          onClick={() => setSelectedCode(node.code)}
        >
          {/* Selection indicator */}
          <div
            className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
              ${isSelected ? "border-yellow-500 bg-yellow-500" : "border-gray-300"}`}
          >
            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>

          <span className="text-lg">{kindIcon[node.kind]}</span>
          <span className="font-mono text-sm font-bold text-gray-800">{node.code}</span>
          <span className="text-gray-400">—</span>
          <span className="text-sm text-gray-700 flex-1">{node.name}</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {kindLabel[node.kind]}
          </span>

          {/* Add child button — stops click propagation to avoid selecting the parent */}
          {childKind && !isAddingHere && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startAddingChild(node.code, rootCode, childKind);
              }}
              className="text-xs text-yellow-700 hover:text-yellow-900 font-medium underline underline-offset-2"
            >
              + {kindLabel[childKind]}
            </button>
          )}
        </div>

        {/* Inline form for adding child */}
        {isAddingHere && childKind && (
          <div className={depth > 0 ? "ml-6 pl-4 border-l-2 border-yellow-200" : ""}>
            <div className="ml-6 my-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-xs font-medium text-gray-600 mb-2">
                New {kindLabel[childKind]} inside{" "}
                <span className="font-mono font-semibold">{node.code}</span>
              </p>
              <form onSubmit={handleAddChild} className="flex flex-wrap gap-2">
                <input
                  value={childCode}
                  onChange={(e) => setChildCode(e.target.value)}
                  placeholder={`Code (e.g. ${childKind[0]}01)`}
                  required
                  className="w-28 px-3 py-1.5 text-sm rounded-lg border border-yellow-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Name"
                  required
                  className="flex-1 min-w-40 px-3 py-1.5 text-sm rounded-lg border border-yellow-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
                >
                  {isSubmitting ? "..." : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => setAddingChild(null)}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {node.children.map((child) => renderNode(child, rootCode, depth + 1))}
      </div>
    );
  }

  if (isLoadingInit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  const hasLocations = plants.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <Image src="/icons/usermes.svg" alt="Usermes" width={40} height={40} />
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">Usermes</h1>
      </div>

      <div className="w-full max-w-2xl space-y-4">
        {/* Banner */}
        <div className="bg-primary bg-[image:url('/assets/png/effect.png')] rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            {!hasLocations ? "Welcome! Set up your plant locations" : "Select your working location"}
          </h2>
          <p className="text-sm text-gray-700">
            {!hasLocations
              ? "Create at least one plant before accessing the dashboard. You can also organize it with areas, lines and sections."
              : "Choose the location you will work in. This scopes all data shown in the dashboard."}
          </p>

          {!hasLocations && (
            <div className="mt-4 flex items-center gap-1 text-xs text-gray-600 flex-wrap">
              <span>🏭 Plant</span>
              <span className="text-gray-400">→</span>
              <span>🏗️ Area</span>
              <span className="text-gray-400">→</span>
              <span>⚙️ Line</span>
              <span className="text-gray-400">→</span>
              <span>📍 Section</span>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Location tree (selectable) */}
        {hasLocations && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
              {selectedCode ? `Selected: ${selectedCode}` : "Click a location to select it"}
            </h3>
            {plants.map((plant) => renderNode(plant, plant.code))}
          </div>
        )}

        {/* Create plant form */}
        {showCreatePlant ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">New plant</h3>
            <form onSubmit={handleCreatePlant} className="space-y-3">
              <div className="flex gap-3">
                <div className="w-1/3">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Code</label>
                  <input
                    value={plantCode}
                    onChange={(e) => setPlantCode(e.target.value)}
                    placeholder="e.g. SP01"
                    required
                    autoFocus
                    className="w-full px-3 py-2 text-sm rounded-lg border border-yellow-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
                  <input
                    value={plantName}
                    onChange={(e) => setPlantName(e.target.value)}
                    placeholder="e.g. São Paulo Plant"
                    required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-yellow-300 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 font-medium"
                >
                  {isSubmitting ? "Creating..." : "Create Plant"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCreatePlant(false); setError(""); }}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button
            onClick={() => {
              setShowCreatePlant(true);
              setPlantCode("");
              setPlantName("");
              setAddingChild(null);
              setError("");
            }}
            className="w-full py-3 border-2 border-dashed border-yellow-400 rounded-2xl text-gray-500 hover:bg-yellow-50 transition-colors text-sm font-medium"
          >
            + Add {!hasLocations ? "your first" : "another"} plant
          </button>
        )}

        {/* Enter Dashboard */}
        {hasLocations && !showCreatePlant && (
          <button
            disabled={!selectedCode}
            onClick={() => {
              if (selectedCode) {
                window.location.href = `/dashboard?location=${selectedCode}`;
              }
            }}
            className="w-full py-3 bg-gray-800 text-white rounded-2xl font-semibold hover:bg-gray-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {selectedCode ? `Enter Dashboard — ${selectedCode}` : "Select a location to continue"}
          </button>
        )}
      </div>
    </div>
  );
}
