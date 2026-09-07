import type { HistoryItem } from "@/lib/data";
import { MethodBadge } from "./MethodBadge";

type RequestHistoryProps = {
  requests: HistoryItem[];
  onLoadRequest: (request: HistoryItem) => void;
  onClearHistory: () => void;
};

export function RequestHistory({ requests, onLoadRequest, onClearHistory }: RequestHistoryProps) {
  if (requests.length === 0) return null;

  return (
    <div className="mt-6 rounded bg-gray-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">Request History</h3>
        <button type="button" onClick={onClearHistory} className="text-xs text-gray-500 hover:text-red-600">
          Clear
        </button>
      </div>
      <div className="space-y-2">
        {requests.map((req) => (
          <button
            key={req.id}
            type="button"
            onClick={() => onLoadRequest(req)}
            className="w-full rounded border border-gray-200 bg-white px-3 py-2 text-left text-sm transition hover:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <MethodBadge method={req.method} />
                <code className="truncate text-gray-700">{req.endpoint}</code>
              </div>
              <span className="flex-shrink-0 text-xs text-gray-400">{req.statusCode}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
