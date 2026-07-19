"use client";

import { useEffect, useState } from "react";
import { apiClient, getAuthToken } from "@/utils/api-client";
import LocationForm from "./_components/LocationForm";
import PageWrapper from "@/components/page-wrapper";
import Center from "@/components/center";
import DashboardButton from "./_components/dashboard-button";
import { Nullable } from "@/utils/types";

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
      return { ...node, children: [...(node.children || []), newNode] };
    }
    return {
      ...node,
      children: insertNode(node.children || [], parentCode, newNode),
    };
  });
}

export default function LocationPage() {
  const [plants, setPlants] = useState<LocationNode[]>([]);
  const [isLoadingInit, setIsLoadingInit] = useState(true);
  const [selectedCode, setSelectedCode] = useState<Nullable<string>>(null);

  // Create-plant form state
  const [showCreatePlant, setShowCreatePlant] = useState(false);

  // Add-child form state
  const [addingChild, setAddingChild] = useState<AddingChild | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // On mount: guard auth, then load existing locations
  useEffect(() => {
    const authToken = getAuthToken();
    if (!authToken) {
      window.location.href = "/login";
      return;
    }

    apiClient("/api/organization/locations", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.locations?.length > 0) {
          // Normalize data to ensure all nodes have children arrays
          const normalizeNode = (
            node: Partial<LocationNode> & {
              code: string;
              name: string;
              kind: LocationKind;
            },
          ): LocationNode => ({
            code: node.code,
            name: node.name,
            kind: node.kind,
            children: Array.isArray(node.children)
              ? node.children.map(normalizeNode)
              : [],
          });
          const normalizedLocations = data.locations.map(normalizeNode);
          setPlants(normalizedLocations);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingInit(false));
  }, []);

  const handleCreatePlant = async (data: { code: string; name: string }) => {
    setIsSubmitting(true);

    try {
      const response = await apiClient("/api/organization/locations", {
        method: "POST",
        body: JSON.stringify({
          code: data.code,
          name: data.name,
        }),
      });
      const result = await response.json();

      if (result.success) {
        setPlants((prev) => [
          ...prev,
          {
            code: data.code,
            name: data.name,
            kind: "PLANT",
            children: [],
          },
        ]);
        setShowCreatePlant(false);
      } else {
        throw new Error(result.error || "Failed to create plant");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddChild = async (data: { code: string; name: string }) => {
    if (!addingChild) return;
    setIsSubmitting(true);

    try {
      const response = await apiClient("/api/organization/locations/add", {
        method: "POST",
        body: JSON.stringify({
          code: data.code,
          name: data.name,
          kind: addingChild.kind,
          parent_code: addingChild.parentCode,
          root_code: addingChild.rootCode,
        }),
      });
      const result = await response.json();

      if (result.success) {
        const newNode: LocationNode = {
          code: data.code,
          name: data.name,
          kind: addingChild.kind,
          children: [],
        };
        setPlants((prev) => insertNode(prev, addingChild.parentCode, newNode));
        setAddingChild(null);
      } else {
        throw new Error(result.error || "Failed to add location");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  function startAddingChild(
    parentCode: string,
    rootCode: string,
    kind: LocationKind,
  ) {
    setAddingChild({ parentCode, rootCode, kind });
  }

  function renderNode(node: LocationNode, rootCode: string, depth = 0) {
    const childKind = childKindOf[node.kind];
    const isAddingHere = addingChild?.parentCode === node.code;
    const isSelected = selectedCode === node.code;

    return (
      <div
        className={depth > 0 ? "ml-4 border-l border-gray-200 pl-4" : ""}
        key={node.code}
      >
        <div
          className={`flex items-center gap-3 py-2.5 px-3 cursor-pointer transition-all rounded-md
            ${isSelected ? "bg-gray-900 text-white" : "hover:bg-gray-50"}`}
          onClick={() => setSelectedCode(node.code)}
        >
          <span
            className={`font-mono text-xs font-semibold tracking-wide ${
              isSelected ? "text-white" : "text-gray-900"
            }`}
          >
            {node.code}
          </span>
          <span
            className={`text-sm flex-1 ${
              isSelected ? "text-gray-100" : "text-gray-600"
            }`}
          >
            {node.name}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded font-medium ${
              isSelected
                ? "bg-white/20 text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {kindLabel[node.kind]}
          </span>

          {/* Add child button */}
          {childKind && !isAddingHere && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startAddingChild(node.code, rootCode, childKind);
              }}
              className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                isSelected
                  ? "text-white hover:bg-white/20"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              + {kindLabel[childKind]}
            </button>
          )}
        </div>

        {/* Inline form for adding child */}
        {isAddingHere && childKind && (
          <div
            className={depth > 0 ? "ml-4 border-l border-gray-200 pl-4" : ""}
          >
            <div className="ml-4 my-2">
              <LocationForm
                type="child"
                parentCode={node.code}
                childKind={childKind}
                onSubmit={handleAddChild}
                onCancel={() => setAddingChild(null)}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        )}

        {node.children?.map((child) => renderNode(child, rootCode, depth + 1))}
      </div>
    );
  }

  if (isLoadingInit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500 text-sm">Loading...</p>
      </div>
    );
  }

  const hasLocations = plants.length > 0;

  return (
    <PageWrapper title="Location" subtitle="Create or select your location">
      <Center>
        <div className="w-full max-w-3xl space-y-6">
          <header className="flex flex-row justify-between">
            <div>
              <h1>Selecione uma localização para gerenciar</h1>
            </div>
            {/* Enter Dashboard */}
            {hasLocations && !showCreatePlant && (
              <DashboardButton selectedCode={selectedCode} />
            )}
          </header>

          <div className="border border-gray-200 rounded-lg p-5 space-y-1">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Locations
            </h3>
            {hasLocations &&
              plants.map((plant) => renderNode(plant, plant.code))}
            {/* Create plant form */}
            {showCreatePlant ? (
              <LocationForm
                type="plant"
                onSubmit={handleCreatePlant}
                onCancel={() => setShowCreatePlant(false)}
                isSubmitting={isSubmitting}
              />
            ) : (
              <button
                onClick={() => {
                  setShowCreatePlant(true);
                  setAddingChild(null);
                }}
                className="w-full py-3 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                + Add {!hasLocations ? "Plant" : "Another Plant"}
              </button>
            )}
          </div>
        </div>
      </Center>
    </PageWrapper>
  );
}
