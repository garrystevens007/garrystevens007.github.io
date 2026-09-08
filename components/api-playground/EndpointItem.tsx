import { endpointDifficulty, difficultyBasePoints, type Endpoint } from "@/lib/data";
import { MethodBadge } from "./MethodBadge";

type EndpointItemProps = {
  endpoint: Endpoint;
  isSelected: boolean;
  onSelect: () => void;
  /** Gamified playground only (/dashboard/technical) — off on the classic one. */
  showDifficulty?: boolean;
  /** Marks an endpoint that was unlocked by an Easter-egg trigger. */
  isSecret?: boolean;
};

const DIFFICULTY_STYLES = {
  easy: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  hard: "bg-red-100 text-red-800",
} as const;

export function EndpointItem({
  endpoint,
  isSelected,
  onSelect,
  showDifficulty = false,
  isSecret = false,
}: EndpointItemProps) {
  const difficulty = endpointDifficulty(endpoint);

  return (
    <div
      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
        isSelected
          ? "border-pink-500 bg-pink-50 shadow-md"
          : isSecret
            ? "border-purple-300 bg-purple-50 hover:border-purple-400 hover:shadow-sm"
            : "border-gray-200 bg-white hover:border-pink-300 hover:shadow-sm"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <MethodBadge method={endpoint.method} />
            <code className="truncate text-sm font-mono text-gray-700">{endpoint.path}</code>
            {isSecret && (
              <span className="rounded-full bg-purple-200 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-800">
                ✨ Secret
              </span>
            )}
            {showDifficulty && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${DIFFICULTY_STYLES[difficulty]}`}
                title={`Base ${difficultyBasePoints[difficulty]} points`}
              >
                {difficulty}
              </span>
            )}
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
