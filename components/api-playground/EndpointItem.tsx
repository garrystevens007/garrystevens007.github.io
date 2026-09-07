import type { Endpoint } from "@/lib/data";
import { MethodBadge } from "./MethodBadge";

type EndpointItemProps = {
  endpoint: Endpoint;
  isSelected: boolean;
  onSelect: () => void;
};

export function EndpointItem({ endpoint, isSelected, onSelect }: EndpointItemProps) {
  return (
    <div
      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
        isSelected ? "border-pink-500 bg-pink-50 shadow-md" : "border-gray-200 bg-white hover:border-pink-300 hover:shadow-sm"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <MethodBadge method={endpoint.method} />
            <code className="truncate text-sm font-mono text-gray-700">{endpoint.path}</code>
          </div>
          <p className="text-xs text-gray-600">{endpoint.description}</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="rounded bg-pink-100 px-2 py-1 text-xs font-semibold text-pink-600 transition hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
        >
          Use
        </button>
      </div>
    </div>
  );
}
