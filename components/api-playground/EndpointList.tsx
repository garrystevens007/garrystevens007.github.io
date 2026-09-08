"use client";

import { useEffect, useMemo, useState } from "react";
import type { Endpoint } from "@/lib/data";
import { EndpointItem } from "./EndpointItem";

type EndpointListProps = {
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint | null;
  onSelectEndpoint: (endpoint: Endpoint) => void;
  /** Gamified playground only — shows the difficulty chip on each row. */
  showDifficulty?: boolean;
  /** Endpoint ids that were unlocked as Easter eggs, for the ✨ Secret chip. */
  secretEndpointIds?: string[];
};

export function EndpointList({
  endpoints,
  selectedEndpoint,
  onSelectEndpoint,
  showDifficulty = false,
  secretEndpointIds = [],
}: EndpointListProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // 300ms debounce per agentsmd/UI_COMPONENTS.md's "Performance Optimization"
  // notes — inconsequential at 14 endpoints, but matches the spec.
  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedQuery(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const filteredEndpoints = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return endpoints;
    return endpoints.filter(
      (ep) => ep.path.toLowerCase().includes(q) || ep.description.toLowerCase().includes(q) || ep.category.includes(q)
    );
  }, [endpoints, debouncedQuery]);

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search endpoints..."
        aria-label="Search endpoints"
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-pink-500"
      />

      <div className="max-h-[600px] space-y-3 overflow-y-auto pr-1">
        {filteredEndpoints.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">No endpoints match &quot;{debouncedQuery}&quot;.</p>
        ) : (
          filteredEndpoints.map((endpoint) => (
            <EndpointItem
              key={endpoint.id}
              endpoint={endpoint}
              isSelected={selectedEndpoint?.id === endpoint.id}
              onSelect={() => onSelectEndpoint(endpoint)}
              showDifficulty={showDifficulty}
              isSecret={secretEndpointIds.includes(endpoint.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
